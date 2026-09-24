import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory or fallback to parent directory if present
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function parseCorsOrigins(raw) {
  if (!raw || raw.trim() === "*") return "*";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000,https://nationalmovers.co.nz"),
  
  rateLimit: {
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15) * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 5,
  },

  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_SECURE !== undefined 
      ? process.env.SMTP_SECURE === "true" 
      : (parseInt(process.env.SMTP_PORT, 10) || 465) === 465,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""), // clean accidental spaces from 16-char app pass
    },
  },

  mail: {
    from: process.env.MAIL_FROM || process.env.SMTP_USER || "noreply@nationalmovers.co.nz",
    to: process.env.MAIL_TO || "hardikgujral1@gmail.com",
    subjectPrefix: process.env.MAIL_SUBJECT_PREFIX || "[Website Contact]",
  },
};

export function validateConfig() {
  const missing = [];
  if (!config.smtp.auth.user) missing.push("SMTP_USER");
  if (!config.smtp.auth.pass) missing.push("SMTP_PASS");

  return {
    isConfigured: missing.length === 0,
    missing,
  };
}
