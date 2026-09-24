import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { logger } from "./logger.js";

/**
 * Creates rate limiting middleware for public submission endpoints.
 */
export const contactRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true, // Return standard `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: "Too many requests. Please wait a few minutes before submitting again.",
      retryAfterMinutes: Math.ceil(config.rateLimit.windowMs / 60000),
    });
  },
});
