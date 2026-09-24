/**
 * Lightweight, structured console logger with timestamps and log levels.
 */

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${typeof meta === "object" ? JSON.stringify(meta) : meta}` : "";
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

export const logger = {
  info(message, meta) {
    console.log(formatMessage("INFO", message, meta));
  },
  warn(message, meta) {
    console.warn(formatMessage("WARN", message, meta));
  },
  error(message, meta) {
    console.error(formatMessage("ERROR", message, meta));
  },
  debug(message, meta) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatMessage("DEBUG", message, meta));
    }
  },
};
