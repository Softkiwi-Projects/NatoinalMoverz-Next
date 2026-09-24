/**
 * Input sanitization and validation helper functions.
 */

// Email regex adhering to RFC 5322 standard basics
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Allowed characters in phone numbers (+, digits, spaces, parentheses, hyphens, periods)
const PHONE_REGEX = /^[0-9+\-()\s.]{6,30}$/;

/**
 * Escapes HTML characters to prevent XSS and HTML injection.
 */
export function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Removes CRLF characters (\r, \n) from headers to prevent SMTP header injection.
 */
export function stripCrlf(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[\r\n]/g, " ").trim();
}

/**
 * Checks if any honeypot anti-spam fields were populated by bots.
 */
export function isHoneypotTriggered(body) {
  if (!body || typeof body !== "object") return false;
  const honeypots = ["botcheck", "honeypot", "_gotcha", "website", "company_url"];
  for (const field of honeypots) {
    if (body[field]) {
      const val = String(body[field]).trim();
      if (val !== "" && val !== "false" && val !== "0") {
        return true;
      }
    }
  }
  return false;
}

/**
 * Validates and sanitizes incoming contact submission body.
 * Returns { valid: boolean, errors: Array<{ field, message }>, data: object }
 */
export function validateContactSubmission(body) {
  const errors = [];

  if (!body || typeof body !== "object") {
    return {
      valid: false,
      errors: [{ field: "root", message: "Request body must be a valid JSON object." }],
      data: null,
    };
  }

  // Extract and sanitize name
  const rawName = typeof body.name === "string" ? stripCrlf(body.name) : "";
  if (!rawName) {
    errors.push({ field: "name", message: "Name is required." });
  } else if (rawName.length < 2 || rawName.length > 100) {
    errors.push({ field: "name", message: "Name must be between 2 and 100 characters." });
  }

  // Extract and sanitize email
  const rawEmail = typeof body.email === "string" ? stripCrlf(body.email).toLowerCase() : "";
  if (!rawEmail) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (rawEmail.length > 254 || !EMAIL_REGEX.test(rawEmail)) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  // Extract and sanitize phone (optional)
  let rawPhone = "";
  if (body.phone !== undefined && body.phone !== null) {
    rawPhone = typeof body.phone === "string" ? stripCrlf(body.phone) : String(body.phone).trim();
    if (rawPhone.length > 0) {
      if (!PHONE_REGEX.test(rawPhone)) {
        errors.push({ field: "phone", message: "Please enter a valid phone number (digits, spaces, +, -, parentheses)." });
      } else if (rawPhone.length < 6 || rawPhone.length > 30) {
        errors.push({ field: "phone", message: "Phone number must be between 6 and 30 characters." });
      }
    }
  }

  // Extract and sanitize message
  let rawMessage = typeof body.message === "string" ? body.message.trim() : "";
  if (!rawMessage) {
    const details = [];
    if (body.moveType) details.push(`Move Type: ${body.moveType}`);
    if (body.date || body["Pickup date"]) details.push(`Pickup Date: ${body.date || body["Pickup date"]}`);
    if (body.pickup || body["Pickup address"]) details.push(`Pickup Address: ${body.pickup || body["Pickup address"]}`);
    if (body.dropoff || body["Drop-off address"]) details.push(`Drop-off Address: ${body.dropoff || body["Drop-off address"]}`);
    if (details.length > 0) {
      rawMessage = `Quote Request Details:\n${details.join("\n")}`;
    }
  }

  if (!rawMessage) {
    errors.push({ field: "message", message: "Message is required." });
  } else if (rawMessage.length < 5) {
    errors.push({ field: "message", message: "Message must be at least 5 characters long." });
  } else if (rawMessage.length > 5000) {
    errors.push({ field: "message", message: "Message must not exceed 5000 characters." });
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      name: rawName,
      email: rawEmail,
      phone: rawPhone || null,
      message: rawMessage,
      moveType: typeof body.moveType === "string" ? stripCrlf(body.moveType) : null,
      date: typeof (body.date || body["Pickup date"]) === "string" ? stripCrlf(body.date || body["Pickup date"]) : null,
      pickup: typeof (body.pickup || body["Pickup address"]) === "string" ? stripCrlf(body.pickup || body["Pickup address"]) : null,
      dropoff: typeof (body.dropoff || body["Drop-off address"]) === "string" ? stripCrlf(body.dropoff || body["Drop-off address"]) : null,
    },
  };
}
