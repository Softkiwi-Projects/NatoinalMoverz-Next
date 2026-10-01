import dns from "dns";
// Resolve IPv4 before IPv6 to avoid connection timeouts in cloud/container environments (Render, AWS, Docker)
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { contactRateLimiter } from "./rateLimiter.js";
import { validateContactSubmission, isHoneypotTriggered } from "./validator.js";
import { sendContactEmail, verifySmtpConnection } from "./email.js";

const app = express();

// Trust reverse proxy if behind Nginx / CloudFront / Heroku / AWS ALB
app.set("trust proxy", 1);

// Security Headers
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (like curl, postman, server-to-server) without Origin header
    if (!origin) return callback(null, true);

    if (config.corsOrigins === "*") {
      return callback(null, true);
    }

    if (Array.isArray(config.corsOrigins)) {
      if (config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: Origin ${origin} not allowed by Access-Control-Allow-Origin.`));
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
};

app.use(cors(corsOptions));

// Body parsers with payload size limit
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms) - IP: ${req.ip}`);
  });
  next();
});

// Root Information Endpoint
app.get("/", (req, res) => {
  res.json({
    service: "National Movers Contact API",
    status: "healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/contact
 * Handles contact form submissions, validation, sanitization, spam filtering, and email delivery.
 */
app.post("/api/contact", contactRateLimiter, async (req, res) => {
  try {
    // 1. Anti-spam honeypot detection
    if (isHoneypotTriggered(req.body)) {
      logger.warn(`Spam bot trapped by honeypot field from IP: ${req.ip}`);
      // Return 200 OK so automated bots believe they succeeded without triggering SMTP
      return res.status(200).json({
        success: true,
        message: "Thank you for contacting us. Your message has been received.",
      });
    }

    // 2. Validate and sanitize incoming fields
    const { valid, errors, data } = validateContactSubmission(req.body);
    if (!valid) {
      logger.warn(`Validation failed for submission from IP: ${req.ip}`, { errors });
      return res.status(400).json({
        success: false,
        error: "Validation failed. Please correct the specified fields and try again.",
        details: errors,
      });
    }

    // 3. Dispatch notification email via Google SMTP
    await sendContactEmail(data);

    logger.info(`Successfully processed contact submission for ${data.email}`);
    return res.status(200).json({
      success: true,
      message: "Thank you for contacting us. Your message has been sent successfully.",
    });
  } catch (error) {
    logger.error(`Error processing contact submission: ${error.message}`, { stack: error.stack });
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while sending your message. Please try again later or reach out to us directly.",
    });
  }
});

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  if (err.message && err.message.includes("CORS policy")) {
    logger.warn(`CORS blocked: ${err.message}`);
    return res.status(403).json({
      success: false,
      error: err.message,
    });
  }

  // Handle malformed JSON body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON payload in request body.",
    });
  }

  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});

let serverInstance = null;

export function startServer(port = config.port) {
  serverInstance = app.listen(port, () => {
    logger.info(`====================================================`);
    logger.info(`Contact Form API running on http://localhost:${port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Allowed CORS: ${Array.isArray(config.corsOrigins) ? config.corsOrigins.join(", ") : config.corsOrigins}`);
    logger.info(`====================================================`);

    // Asynchronously verify SMTP connection
    verifySmtpConnection();
  });
  return serverInstance;
}

// Graceful Shutdown
function handleShutdown(signal) {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  if (serverInstance) {
    serverInstance.close(() => {
      logger.info("HTTP server closed. Exiting process.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }

  // Force close after 10s if connections refuse to terminate
  setTimeout(() => {
    logger.error("Forcing shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

// Auto-start if run directly
import { fileURLToPath } from "url";
import process from "process";

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) {
  startServer();
}

export default app;
