import os from "os";
import dns from "dns";

// Render container networks do not have outbound IPv6 routing.
// Force IPv4 DNS resolution and filter network interfaces so Nodemailer only connects via IPv4.
dns.setDefaultResultOrder("ipv4first");
try {
  const origInterfaces = os.networkInterfaces;
  os.networkInterfaces = () => {
    const ifaces = origInterfaces();
    const ipv4Only = {};
    for (const [name, addrs] of Object.entries(ifaces)) {
      ipv4Only[name] = (addrs || []).filter((a) => a.family === "IPv4" || a.family === 4);
    }
    return ipv4Only;
  };
} catch {
  // Ignore in restricted environments
}

import nodemailer from "nodemailer";
import { config, validateConfig } from "./config.js";
import { logger } from "./logger.js";
import { escapeHtml, stripCrlf } from "./validator.js";

let transporter = null;

/**
 * Initializes and returns the Nodemailer SMTP transporter.
 * Uses port 587 with STARTTLS by default (most reliable on cloud hosts like Render).
 */
export function getTransporter() {
  if (!transporter) {
    const port = config.smtp.port || 587;
    const isDirectSsl = port === 465 || config.smtp.secure === true;

    transporter = nodemailer.createTransport({
      host: config.smtp.host || "smtp.gmail.com",
      port: port,
      secure: isDirectSsl, // false for 587 (STARTTLS), true for 465
      requireTLS: !isDirectSsl,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 25000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return transporter;
}

/**
 * Verifies the SMTP connection on startup.
 */
export async function verifySmtpConnection() {
  const { isConfigured, missing } = validateConfig();
  if (!isConfigured) {
    logger.warn(`SMTP credentials not fully configured in environment. Missing: ${missing.join(", ")}`);
    logger.warn("Emails will fail to send until SMTP_USER and SMTP_PASS are provided in .env");
    return false;
  }

  try {
    const client = getTransporter();
    await client.verify();
    logger.info(`[SMTP] Successfully connected and authenticated with ${config.smtp.host}:${config.smtp.port}`);
    return true;
  } catch (err) {
    logger.error(`[SMTP Connection Failed] Could not authenticate with ${config.smtp.host}: ${err.message}`);
    return false;
  }
}

/**
 * Formats a Date object into human-readable NZ time and UTC time.
 */
function formatSubmissionTime(date = new Date()) {
  try {
    const nzTime = new Intl.DateTimeFormat("en-NZ", {
      timeZone: "Pacific/Auckland",
      dateStyle: "full",
      timeStyle: "medium",
    }).format(date);
    return `${nzTime} (NZT)`;
  } catch {
    return date.toUTCString();
  }
}

/**
 * Sends a contact form notification email to the website owner.
 *
 * @param {Object} submission
 * @param {string} submission.name - Visitor's name
 * @param {string} submission.email - Visitor's email (used as replyTo)
 * @param {string|null} submission.phone - Visitor's phone
 * @param {string} submission.message - Visitor's message
 */
/**
 * Sends a contact form notification email to the website owner.
 *
 * @param {Object} submission
 * @param {string} submission.name - Visitor's name
 * @param {string} submission.email - Visitor's email (used as replyTo)
 * @param {string|null} submission.phone - Visitor's phone
 * @param {string} submission.message - Visitor's message
 * @param {string|null} [submission.moveType] - Optional move type
 * @param {string|null} [submission.date] - Optional pickup date
 * @param {string|null} [submission.pickup] - Optional pickup address
 * @param {string|null} [submission.dropoff] - Optional dropoff address
 */
export async function sendContactEmail({ name, email, phone, message, moveType, date, pickup, dropoff }) {
  const client = getTransporter();
  const submissionTime = formatSubmissionTime();
  const phoneDisplay = phone || "Not provided";
  const cleanPhone = phone ? phone.replace(/[^0-9+]/g, "") : "";

  // Sanitize fields for safe HTML rendering
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phoneDisplay);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const safeMoveType = moveType ? escapeHtml(moveType) : "";
  const safeDate = date ? escapeHtml(date) : "";
  const safePickup = pickup ? escapeHtml(pickup) : "";
  const safeDropoff = dropoff ? escapeHtml(dropoff) : "";

  const isQuote = Boolean(moveType || pickup || dropoff || date);
  const subject = `${config.mail.subjectPrefix} ${isQuote ? "🚚 New Quote Request" : "✨ New Message"} from ${safeName}`;

  // Plain-text email fallback
  const textBody = `
======================================================
NATIONAL MOVERS - NEW WEBSITE ENQUIRY
======================================================
A new enquiry has been submitted through the website.

CLIENT DOSSIER:
------------------------------------------------------
• Name:            ${name}
• Email:           ${email}
• Phone:           ${phoneDisplay}
• Submitted:       ${submissionTime}
${isQuote ? `
LOGISTICS & MOVE DETAILS:
------------------------------------------------------
• Move Type:       ${moveType || "Not specified"}
• Target Date:     ${date || "Not specified"}
• Pickup Address:  ${pickup || "Not specified"}
• Drop-off Address:${dropoff || "Not specified"}
` : ""}
------------------------------------------------------
MESSAGE:
------------------------------------------------------
${message}
------------------------------------------------------

* Replying directly to this email will respond to ${name} (${email}).
======================================================
`.trim();

  // Ultra-Aesthetic, Dark-Mode Optimized, Fully Responsive HTML Email Template
  const htmlBody = `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #070c12 !important;
    }
    @media only screen and (max-width: 600px) {
      .outer-wrap {
        padding: 12px 6px !important;
      }
      .main-card {
        border-radius: 12px !important;
      }
      .header-padding {
        padding: 24px 20px 20px !important;
      }
      .body-padding {
        padding: 16px 18px !important;
      }
      .hero-title {
        font-size: 22px !important;
      }
      .btn-stack {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin-bottom: 10px !important;
        text-align: center !important;
      }
      .btn-cell {
        display: block !important;
        width: 100% !important;
        padding: 0 0 10px !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      body, .email-bg {
        background-color: #05080c !important;
      }
      .main-card {
        background-color: #0c1522 !important;
        border-color: #1e2d3d !important;
      }
      .text-light {
        color: #ffffff !important;
      }
    }
  </style>
</head>
<body class="email-bg" style="margin: 0; padding: 0; background-color: #070c12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f8fafc; line-height: 1.5;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-bg outer-wrap" style="background-color: #070c12; padding: 32px 14px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table role="presentation" width="100%" class="main-card" style="max-width: 620px; background-color: #0c1522; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px #1e2e42; border: 1px solid #1e2e42;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Top Radiant Rainbow Gradient Ribbon -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #ffd332 0%, #f59e0b 25%, #38bdf8 50%, #a855f7 75%, #34d399 100%); line-height: 5px; font-size: 1px;">&nbsp;</td>
          </tr>

          <!-- Hero Brand Header -->
          <tr>
            <td class="header-padding" style="background: linear-gradient(180deg, #101c2d 0%, #0c1522 100%); padding: 32px 32px 24px; border-bottom: 1px solid #1a283a;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <!-- Brand Pill Badge -->
                    <div style="display: inline-block; background-color: rgba(255, 211, 50, 0.15); border: 1px solid rgba(255, 211, 50, 0.5); border-radius: 100px; padding: 4px 14px; margin-bottom: 12px;">
                      <span style="font-size: 11px; font-weight: 800; color: #ffd332; letter-spacing: 1.8px; text-transform: uppercase;">
                        🚚 NATIONAL MOVERS NZ
                      </span>
                    </div>

                    <!-- Main Headline -->
                    <h1 class="hero-title text-light" style="margin: 0; font-size: 25px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; line-height: 1.25;">
                      ${isQuote ? "New Quote Request Received" : "New Customer Enquiry"}
                    </h1>
                    <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8; font-weight: 500;">
                      Lead captured via website dispatch · <span style="color: #ffd332; font-weight: 700;">${submissionTime}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- High-Contrast Lead Quick-Bar -->
          <tr>
            <td class="body-padding" style="padding: 20px 32px 10px;">
              <div style="background-color: #132236; border: 1px solid #233954; border-left: 4px solid #ffd332; border-radius: 10px; padding: 14px 18px;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">
                  ⚡ Action Required: Customer enquiry from <strong style="color: #ffd332;">${safeName}</strong>
                </p>
                <p style="margin: 3px 0 0; font-size: 12px; color: #94a3b8;">
                  Reply directly to this email to contact the customer, or tap below to call.
                </p>
              </div>
            </td>
          </tr>

          <!-- Client Dossier - Stacked Full-Width High-Contrast Cards -->
          <tr>
            <td class="body-padding" style="padding: 14px 32px 10px;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 12px;">
                Customer Contact Dossier
              </div>

              <!-- Item 1: Client Name -->
              <div style="background-color: #121e2c; border: 1px solid #1e3147; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="36" valign="middle">
                      <div style="background-color: rgba(255, 211, 50, 0.18); border: 1px solid rgba(255, 211, 50, 0.4); width: 34px; height: 34px; border-radius: 8px; text-align: center; line-height: 34px; font-size: 16px;">
                        👤
                      </div>
                    </td>
                    <td style="padding-left: 12px;" valign="middle">
                      <div style="font-size: 10px; font-weight: 800; color: #ffd332; text-transform: uppercase; letter-spacing: 1.2px;">CLIENT NAME</div>
                      <div class="text-light" style="font-size: 16px; font-weight: 800; color: #ffffff; margin-top: 2px;">
                        ${safeName}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Item 2: Email Address -->
              <div style="background-color: #121e2c; border: 1px solid #1e3147; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="36" valign="middle">
                      <div style="background-color: rgba(56, 189, 248, 0.18); border: 1px solid rgba(56, 189, 248, 0.4); width: 34px; height: 34px; border-radius: 8px; text-align: center; line-height: 34px; font-size: 16px;">
                        ✉️
                      </div>
                    </td>
                    <td style="padding-left: 12px;" valign="middle">
                      <div style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.2px;">EMAIL ADDRESS</div>
                      <div style="font-size: 15px; font-weight: 700; margin-top: 2px; word-break: break-all;">
                        <a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: underline;">
                          ${safeEmail}
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Item 3: Phone Number -->
              <div style="background-color: #121e2c; border: 1px solid #1e3147; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="36" valign="middle">
                      <div style="background-color: rgba(52, 211, 153, 0.18); border: 1px solid rgba(52, 211, 153, 0.4); width: 34px; height: 34px; border-radius: 8px; text-align: center; line-height: 34px; font-size: 16px;">
                        📞
                      </div>
                    </td>
                    <td style="padding-left: 12px;" valign="middle">
                      <div style="font-size: 10px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 1.2px;">PHONE NUMBER</div>
                      <div style="font-size: 15px; font-weight: 700; margin-top: 2px;">
                        ${cleanPhone ? `
                          <a href="tel:${cleanPhone}" style="color: #34d399; text-decoration: none;">
                            ${safePhone}
                          </a>
                        ` : '<span style="color: #64748b; font-style: italic;">Not provided</span>'}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Item 4: Received Timestamp -->
              <div style="background-color: #121e2c; border: 1px solid #1e3147; border-radius: 12px; padding: 14px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="36" valign="middle">
                      <div style="background-color: rgba(192, 132, 252, 0.18); border: 1px solid rgba(192, 132, 252, 0.4); width: 34px; height: 34px; border-radius: 8px; text-align: center; line-height: 34px; font-size: 16px;">
                        🕒
                      </div>
                    </td>
                    <td style="padding-left: 12px;" valign="middle">
                      <div style="font-size: 10px; font-weight: 800; color: #c084fc; text-transform: uppercase; letter-spacing: 1.2px;">SUBMISSION TIMESTAMP</div>
                      <div style="font-size: 13px; font-weight: 600; color: #cbd5e1; margin-top: 2px;">
                        ${submissionTime}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          ${isQuote ? `
          <!-- Logistics & Moving Route Card -->
          <tr>
            <td class="body-padding" style="padding: 14px 32px 10px;">
              <div style="background-color: #101a27; border-radius: 14px; padding: 20px 20px; border: 1px solid #20334a;">
                <div style="font-size: 11px; font-weight: 800; color: #ffd332; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">
                  🗺️ Moving Logistics & Route Information
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  ${safePickup ? `
                  <tr>
                    <td width="28" valign="top">
                      <div style="background-color: #10b981; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 900;">A</div>
                    </td>
                    <td style="padding-left: 12px; padding-bottom: 14px;" valign="top">
                      <div style="font-size: 10px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 1px;">PICKUP LOCATION</div>
                      <div class="text-light" style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 2px;">${safePickup}</div>
                    </td>
                  </tr>
                  ` : ""}

                  ${safeDropoff ? `
                  <tr>
                    <td width="28" valign="top">
                      <div style="background-color: #8b5cf6; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 900;">B</div>
                    </td>
                    <td style="padding-left: 12px; padding-bottom: 14px;" valign="top">
                      <div style="font-size: 10px; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: 1px;">DROP-OFF LOCATION</div>
                      <div class="text-light" style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 2px;">${safeDropoff}</div>
                    </td>
                  </tr>
                  ` : ""}

                  <tr>
                    <td colspan="2" style="border-top: 1px solid #1a2a3d; padding-top: 12px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          ${safeMoveType ? `
                          <td style="padding-right: 10px;" valign="top">
                            <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">MOVE SIZE:</span><br>
                            <span style="display: inline-block; background-color: #ffd332; color: #09121a; font-weight: 900; font-size: 12px; padding: 4px 12px; border-radius: 6px; margin-top: 4px;">
                              ${safeMoveType}
                            </span>
                          </td>
                          ` : ""}
                          ${safeDate ? `
                          <td valign="top">
                            <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">TARGET DATE:</span><br>
                            <span style="display: inline-block; background-color: #1a2a3c; color: #38bdf8; font-weight: 800; font-size: 12px; padding: 4px 12px; border-radius: 6px; margin-top: 4px; border: 1px solid #2e4764;">
                              📅 ${safeDate}
                            </span>
                          </td>
                          ` : ""}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- Message / Notes Box -->
          <tr>
            <td class="body-padding" style="padding: 14px 32px 24px;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 10px;">
                Message / Notes Details
              </div>
              
              <div class="text-light" style="background-color: #121e2c; border: 1px solid #1e3147; border-left: 4px solid #ffd332; border-radius: 10px; padding: 18px 20px; font-size: 15px; color: #f1f5f9; line-height: 1.65; word-break: break-word;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Dual High-Impact Action Bar (Mobile Responsive Stacking) -->
          <tr>
            <td class="body-padding" style="background-color: #080e16; border-top: 1px solid #1a283a; padding: 26px 32px; text-align: center;">
              
              <table role="presentation" class="action-table" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <!-- Reply via Email Button -->
                  <td class="btn-cell" align="center" style="padding: 0 6px;">
                    <a href="mailto:${safeEmail}?subject=Re:%20National%20Movers%20Quote%20Request" class="btn-stack" style="display: inline-block; background-color: #ffd332; color: #080e16; font-weight: 900; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 50px; box-shadow: 0 4px 16px rgba(255, 211, 50, 0.4); letter-spacing: 0.3px;">
                      ✉️ Reply to ${safeName}
                    </a>
                  </td>

                  ${cleanPhone ? `
                  <!-- Direct Call Button -->
                  <td class="btn-cell" align="center" style="padding: 0 6px;">
                    <a href="tel:${cleanPhone}" class="btn-stack" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 26px; border-radius: 50px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35); letter-spacing: 0.3px;">
                      📞 Call Customer
                    </a>
                  </td>
                  ` : ""}
                </tr>
              </table>

              <p style="margin: 18px 0 0; font-size: 12px; color: #64748b; font-weight: 500;">
                Clicking <strong style="color: #ffd332;">Reply</strong> automatically populates <strong style="color: #38bdf8;">${safeEmail}</strong> in your mail app.
              </p>
            </td>
          </tr>

          <!-- Corporate Footer -->
          <tr>
            <td style="background-color: #05090e; padding: 22px 30px; text-align: center; color: #64748b; font-size: 11px; line-height: 1.6; border-top: 1px solid #141e2b;">
              <p style="margin: 0; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                National Movers New Zealand
              </p>
              <p style="margin: 4px 0 0; color: #475569;">
                36a Sixteenth Avenue, Tauranga · Phone: 0800 600 003 · info@nationalmovers.co.nz
              </p>
              <p style="margin: 8px 0 0; font-size: 10px; color: #334155;">
                Protected by rate limiting and spam honeypot filters.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`.trim();

  // Dispatch email with replyTo set to the visitor
  const mailOptions = {
    from: config.mail.from,
    to: config.mail.to,
    replyTo: `"${stripCrlf(name)}" <${stripCrlf(email)}>`,
    subject,
    text: textBody,
    html: htmlBody,
  };

  const info = await client.sendMail(mailOptions);
  logger.info(`Notification email sent to ${config.mail.to} (MessageId: ${info.messageId})`);
  return info;
}
