import "./forceIpv4.js";
import nodemailer from "nodemailer";
import { config, validateConfig } from "./config.js";
import { logger } from "./logger.js";
import { escapeHtml, stripCrlf } from "./validator.js";

let transporter = null;

/**
 * Initializes and returns the Nodemailer SMTP transporter.
 * Uses port 587 with STARTTLS by default (most reliable on cloud hosts like Render).
 * Forces IPv4 network connections.
 */
export function getTransporter() {
  if (!transporter) {
    const port = config.smtp.port || 587;
    const isDirectSsl = port === 465 || config.smtp.secure === true;

    transporter = nodemailer.createTransport({
      host: config.smtp.host || "smtp.gmail.com",
      port: port,
      family: 4,
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
export async function sendContactEmail({
  name,
  email,
  phone,
  message,
  moveType,
  category,
  bedrooms,
  officeSize,
  pianoType,
  items,
  heavyItems,
  date,
  pickup,
  dropoff,
  termsAccepted,
}) {
  const client = getTransporter();
  const submissionTime = formatSubmissionTime();
  const phoneDisplay = phone || "Not provided";
  const cleanPhone = phone ? phone.replace(/[^0-9+]/g, "") : "";

  const resolvedCategory = category || moveType || "";
  const resolvedDetails = officeSize
    ? `Office Size: ${officeSize}`
    : pianoType
      ? `Piano: ${pianoType}`
      : items
        ? `Items: ${items}`
        : bedrooms
          ? `${bedrooms}`
          : "";

  // Sanitize fields for safe HTML rendering
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phoneDisplay);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const safeCategory = resolvedCategory ? escapeHtml(resolvedCategory) : "";
  const safeDetails = resolvedDetails ? escapeHtml(resolvedDetails) : "";
  const safeHeavyItems = heavyItems ? escapeHtml(heavyItems) : "";
  const safeDate = date ? escapeHtml(date) : "";
  const safePickup = pickup ? escapeHtml(pickup) : "";
  const safeDropoff = dropoff ? escapeHtml(dropoff) : "";

  const isQuote = Boolean(resolvedCategory || pickup || dropoff || date || bedrooms || officeSize || items || heavyItems);
  const subject = `${config.mail.subjectPrefix} ${isQuote ? `Quote Request (${safeCategory || "Move"})` : "Website Enquiry"} - ${safeName}`;

  // Plain-text email fallback
  const textBody = `
======================================================
NATIONAL MOVERS - NEW WEBSITE ENQUIRY
======================================================
A new enquiry has been submitted through the website.

CLIENT DETAILS:
------------------------------------------------------
• Name:            ${name}
• Email:           ${email}
• Phone:           ${phoneDisplay}
• Submitted:       ${submissionTime}
${isQuote ? `
MOVE SPECIFICATIONS:
------------------------------------------------------
• Category:        ${resolvedCategory || "Not specified"}
${safeDetails ? `• Size / Details:  ${resolvedDetails}\n` : ""}${safeDate ? `• Target Date:     ${date}\n` : ""}• Pickup Location: ${pickup || "Not specified"}
• Drop-off:        ${dropoff || "Not specified"}
${heavyItems ? `• Heavy Items:     ${heavyItems}\n` : ""}${termsAccepted !== undefined ? `• Terms Accepted:  ${termsAccepted ? "Yes" : "No"}\n` : ""}
` : ""}
------------------------------------------------------
MESSAGE / NOTES:
------------------------------------------------------
${message}
------------------------------------------------------

* Replying directly to this email will respond to ${name} (${email}).
======================================================
`.trim();

  // Clean, Corporate, Highly-Readable Professional HTML Email Template
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
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td, th {
      border-collapse: collapse;
    }
    @media only screen and (max-width: 600px) {
      .outer-wrap {
        padding: 12px 8px !important;
      }
      .content-cell {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .stack-col {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 12px !important;
      }
      .btn-table {
        width: 100% !important;
      }
      .btn-table td {
        display: block !important;
        width: 100% !important;
        padding: 0 0 10px 0 !important;
      }
      .btn-block {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      body, .email-bg {
        background-color: #0b0f17 !important;
      }
      .main-card {
        background-color: #111827 !important;
        border-color: #1f2937 !important;
      }
      .card-inner, .spec-table {
        background-color: #172033 !important;
        border-color: #24324a !important;
      }
      .text-main {
        color: #f9fafb !important;
      }
      .text-muted {
        color: #94a3b8 !important;
      }
      .text-body {
        color: #e2e8f0 !important;
      }
      .badge-neutral {
        background-color: #1f2937 !important;
        border-color: #374151 !important;
        color: #cbd5e1 !important;
      }
      .btn-secondary {
        background-color: #1f2937 !important;
        color: #f3f4f6 !important;
        border-color: #374151 !important;
      }
      .footer-bg {
        background-color: #0c121d !important;
        border-color: #1f2937 !important;
      }
      .divider {
        border-color: #1f2937 !important;
      }
    }
  </style>
</head>
<body class="email-bg" style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b; line-height: 1.5;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-bg outer-wrap" style="background-color: #f4f6f8; padding: 36px 14px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table role="presentation" width="100%" class="main-card" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Subtle Corporate Top Accent Line (Navy with subtle brand gold accent) -->
          <tr>
            <td height="4" style="background-color: #0f172a; line-height: 4px; font-size: 1px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="72" height="4" style="background-color: #ffd332; line-height: 4px; font-size: 1px;">&nbsp;</td>
                  <td height="4" style="background-color: #0f172a; line-height: 4px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Header: Brand Identity & Badge -->
          <tr>
            <td class="content-cell" style="padding: 28px 32px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a; letter-spacing: 0.8px; text-transform: uppercase;">
                      NATIONAL MOVERS
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                      New Zealand Relocation Specialists
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span class="badge-neutral" style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${isQuote ? "Quote Request" : "Website Enquiry"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td class="divider" style="border-top: 1px solid #e2e8f0; font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Overview Callout Box -->
          <tr>
            <td class="content-cell" style="padding: 24px 32px 16px;">
              <div class="card-inner" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0f172a; border-radius: 4px; padding: 14px 16px;">
                <div class="text-main" style="font-size: 14px; font-weight: 700; color: #0f172a;">
                  New enquiry from ${safeName}
                </div>
                <div class="text-muted" style="font-size: 12px; color: #64748b; margin-top: 3px;">
                  Received via website contact dispatch on ${submissionTime}
                </div>
              </div>
            </td>
          </tr>

          <!-- Section: Customer Details -->
          <tr>
            <td class="content-cell" style="padding: 8px 32px 16px;">
              <div class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
                Customer Contact
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed;">
                <tr>
                  <td class="stack-col" width="50%" valign="top" style="padding-right: 12px; padding-bottom: 12px;">
                    <div class="text-muted" style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Full Name</div>
                    <div class="text-main" style="font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px;">
                      ${safeName}
                    </div>
                  </td>
                  <td class="stack-col" width="50%" valign="top" style="padding-left: 12px; padding-bottom: 12px;">
                    <div class="text-muted" style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Phone Number</div>
                    <div class="text-main" style="font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px;">
                      ${cleanPhone ? `
                        <a href="tel:${cleanPhone}" style="color: #0f172a; text-decoration: none;">
                          ${safePhone}
                        </a>
                      ` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="stack-col" width="50%" valign="top" style="padding-right: 12px; padding-bottom: 4px;">
                    <div class="text-muted" style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Email Address</div>
                    <div style="font-size: 14px; font-weight: 600; margin-top: 2px; word-break: break-all;">
                      <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: underline;">
                        ${safeEmail}
                      </a>
                    </div>
                  </td>
                  <td class="stack-col" width="50%" valign="top" style="padding-left: 12px; padding-bottom: 4px;">
                    <div class="text-muted" style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Timestamp</div>
                    <div class="text-main" style="font-size: 13px; font-weight: 500; color: #334155; margin-top: 2px;">
                      ${submissionTime}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${isQuote ? `
          <!-- Section: Move Specifications -->
          <tr>
            <td class="content-cell" style="padding: 12px 32px 16px;">
              <div class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
                Move Specifications
              </div>

              <div class="spec-table" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  ${safePickup ? `
                  <tr>
                    <td width="120" valign="top" style="padding-bottom: 10px;">
                      <span class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Pickup:</span>
                    </td>
                    <td valign="top" style="padding-bottom: 10px;">
                      <span class="text-main" style="font-size: 14px; font-weight: 600; color: #0f172a;">${safePickup}</span>
                    </td>
                  </tr>
                  ` : ""}

                  ${safeDropoff ? `
                  <tr>
                    <td width="120" valign="top" style="padding-bottom: 10px;">
                      <span class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Drop-off:</span>
                    </td>
                    <td valign="top" style="padding-bottom: 10px;">
                      <span class="text-main" style="font-size: 14px; font-weight: 600; color: #0f172a;">${safeDropoff}</span>
                    </td>
                  </tr>
                  ` : ""}

                  ${safeCategory ? `
                  <tr>
                    <td width="120" valign="top" style="padding-bottom: 10px;">
                      <span class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Category:</span>
                    </td>
                    <td valign="top" style="padding-bottom: 10px;">
                      <span class="text-main" style="font-size: 14px; font-weight: 600; color: #0f172a;">${safeCategory}</span>
                    </td>
                  </tr>
                  ` : ""}

                  ${safeDetails ? `
                  <tr>
                    <td width="120" valign="top" style="padding-bottom: 10px;">
                      <span class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Size / Rooms:</span>
                    </td>
                    <td valign="top" style="padding-bottom: 10px;">
                      <span class="text-main" style="font-size: 14px; font-weight: 600; color: #0f172a;">${safeDetails}</span>
                    </td>
                  </tr>
                  ` : ""}

                  ${safeDate ? `
                  <tr>
                    <td width="120" valign="top" style="padding-bottom: 10px;">
                      <span class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Target Date:</span>
                    </td>
                    <td valign="top" style="padding-bottom: 10px;">
                      <span class="text-main" style="font-size: 14px; font-weight: 600; color: #0f172a;">${safeDate}</span>
                    </td>
                  </tr>
                  ` : ""}

                  ${safeHeavyItems ? `
                  <tr>
                    <td width="120" valign="top">
                      <span class="text-muted" style="font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase;">Heavy Items:</span>
                    </td>
                    <td valign="top">
                      <span class="text-main" style="font-size: 13px; font-weight: 600; color: #92400e; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 4px; padding: 2px 8px; display: inline-block;">
                        ${safeHeavyItems}
                      </span>
                    </td>
                  </tr>
                  ` : ""}
                </table>
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- Section: Customer Message -->
          <tr>
            <td class="content-cell" style="padding: 12px 32px 24px;">
              <div class="text-muted" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                Customer Message
              </div>
              <div class="card-inner text-body" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px 18px; font-size: 14px; color: #334155; line-height: 1.6; word-break: break-word;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Action Bar (Buttons) -->
          <tr>
            <td class="content-cell footer-bg" style="background-color: #ffffff; border-top: 1px solid #e2e8f0; padding: 22px 32px;">
              <table role="presentation" class="btn-table" cellspacing="0" cellpadding="0" border="0" align="left">
                <tr>
                  <td style="padding-right: 12px;">
                    <a href="mailto:${safeEmail}?subject=Re:%20National%20Movers%20Quote%20Request" class="btn-block" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 600; font-size: 14px; text-decoration: none; padding: 11px 22px; border-radius: 6px;">
                      Reply to ${safeName}
                    </a>
                  </td>
                  ${cleanPhone ? `
                  <td>
                    <a href="tel:${cleanPhone}" class="btn-block btn-secondary" style="display: inline-block; background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-weight: 600; font-size: 14px; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
                      Call Customer
                    </a>
                  </td>
                  ` : ""}
                </tr>
              </table>
              <div style="clear: both;"></div>
              <div class="text-muted" style="font-size: 12px; color: #64748b; margin-top: 14px;">
                Clicking <strong>Reply</strong> will compose an email to <span style="color: #2563eb;">${safeEmail}</span>.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-bg" style="background-color: #f8fafc; padding: 22px 32px; text-align: center; color: #64748b; font-size: 12px; line-height: 1.6; border-top: 1px solid #e2e8f0;">
              <div style="font-weight: 700; color: #334155; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
                National Movers New Zealand
              </div>
              <div style="margin-top: 4px; color: #64748b; font-size: 12px;">
                23 Lisa Place, Brookfield, Tauranga · Phone: 0800 600 003 · info@nationalmovers.co.nz
              </div>
              <div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
                Dispatched automatically via website quote & contact engine.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`.trim();

  // Format From address with friendly sender name to prevent spam filters flagging as raw/unauthenticated
  const cleanSenderEmail = (config.mail.from || config.smtp.auth.user || "").trim();
  const fromAddress = cleanSenderEmail.includes("<")
    ? cleanSenderEmail
    : `"${config.mail.fromName || "National Movers"}" <${cleanSenderEmail}>`;

  // Dispatch email with replyTo set to the visitor
  const mailOptions = {
    from: fromAddress,
    to: config.mail.to,
    replyTo: `"${stripCrlf(name)}" <${stripCrlf(email)}>`,
    subject,
    text: textBody,
    html: htmlBody,
    headers: {
      "X-Mailer": "National Movers Dispatcher v1.0",
      "Auto-Submitted": "auto-generated",
      "X-Auto-Response-Suppress": "All",
    },
  };

  const info = await client.sendMail(mailOptions);
  logger.info(`Notification email sent to ${config.mail.to} (MessageId: ${info.messageId})`);
  return info;
}
