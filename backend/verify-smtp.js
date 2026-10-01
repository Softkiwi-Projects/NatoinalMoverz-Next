/**
 * Standalone SMTP verification script.
 * Run this to quickly test your Google App Password without starting the full server.
 * Usage: node verify-smtp.js
 */

import "./src/forceIpv4.js";
import nodemailer from "nodemailer";
import { config, validateConfig } from "./src/config.js";

async function verifyCredentials() {
  console.log("\n=======================================================");
  console.log("  GOOGLE SMTP APP PASSWORD VERIFICATION TEST");
  console.log("=======================================================\n");

  const { isConfigured, missing } = validateConfig();

  if (!isConfigured) {
    console.error("❌ Configuration incomplete! Missing environment variables in backend/.env:");
    missing.forEach((v) => console.error(`   - ${v}`));
    console.log("\nPlease add your Gmail address and 16-character Google App Password to backend/.env");
    process.exit(1);
  }

  const port = config.smtp.port || 587;
  const isDirectSsl = port === 465 || config.smtp.secure === true;

  console.log("Configuration detected:");
  console.log(`  - SMTP Host:    ${config.smtp.host}`);
  console.log(`  - SMTP Port:    ${port} (${isDirectSsl ? "SSL" : "TLS/STARTTLS"})`);
  console.log(`  - User:         ${config.smtp.auth.user}`);
  console.log(`  - Password:     ${config.smtp.auth.pass ? "****** (16-character App Password set)" : "NOT SET"}`);
  console.log(`  - Target To:    ${config.mail.to}`);
  console.log("\nConnecting to Google SMTP servers (IPv4 strictly enforced)...");

  const transporter = nodemailer.createTransport({
    host: config.smtp.host || "smtp.gmail.com",
    port: port,
    family: 4,
    secure: isDirectSsl,
    requireTLS: !isDirectSsl,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
    tls: { rejectUnauthorized: false },
  });

  try {
    await transporter.verify();
    console.log("\n✅ SUCCESS: Connected and authenticated with Google SMTP!");
    console.log("Your Google App Password is valid and ready for production use.");
    console.log("=======================================================\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ FAILED to authenticate with Google SMTP:");
    console.error(`   ${error.message}\n`);
    console.log("Common reasons for this error:");
    console.log("  1. 2-Step Verification is not enabled on the Google Account.");
    console.log("  2. You used your normal Gmail password instead of an App Password.");
    console.log("  3. The 16-character App Password had a typo or was revoked.");
    console.log("  4. You recently changed your Google Account password (which invalidates App Passwords).\n");
    console.log("To generate a new App Password:");
    console.log("  1. Open: https://myaccount.google.com/apppasswords");
    console.log("  2. Create a new App Password named 'National Movers'");
    console.log("  3. Paste the 16 characters into backend/.env under SMTP_PASS\n");
    process.exit(1);
  }
}

verifyCredentials();
