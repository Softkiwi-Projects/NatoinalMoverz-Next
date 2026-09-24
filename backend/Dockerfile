# Production Dockerfile for Contact Form API Service
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Set node environment
ENV NODE_ENV=production

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY src/ ./src/

# Expose API port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Run as non-root user for security
USER node

# Start service
CMD ["node", "src/server.js"]
