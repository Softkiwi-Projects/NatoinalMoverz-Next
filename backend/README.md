# Contact Form Backend API Service

A lightweight, secure, and production-ready Node.js/Express API service for processing website contact form submissions and dispatching branded email notifications via Google SMTP (Gmail).

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Google SMTP Configuration](#google-smtp-configuration)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [1. Health Check (`GET /api/health`)](#1-health-check-get-apihealth)
  - [2. Contact Submission (`POST /api/contact`)](#2-contact-submission-post-apicontact)
- [Frontend Integration Guide](#frontend-integration-guide)
- [Automated Testing](#automated-testing)
- [Production Deployment](#production-deployment)
  - [Docker & Docker Compose](#option-a-docker--docker-compose-recommended)
  - [Process Manager (PM2)](#option-b-process-manager-pm2)
  - [Cloud Platforms (Render, Railway, Fly.io)](#option-c-cloud-platforms-render-railway-flyio)
  - [Nginx Reverse Proxy Configuration](#nginx-reverse-proxy-configuration)
- [Security Considerations](#security-considerations)

---

## Features

- **Field Validation & Sanitization**: Comprehensive validation of names, emails, phone numbers, and messages. Strips control characters (`\r`, `\n`) from single-line headers to prevent SMTP header injection attacks, and escapes HTML entities.
- **Spam & Abuse Protection**:
  - **Honeypot Trap**: Catches automated bots silently without alerting the bot or wasting SMTP email quotas.
  - **IP Rate Limiting**: Built-in sliding-window rate limiter (default: 5 submissions per 15 minutes per IP).
- **Google SMTP / Gmail Delivery**:
  - Sends immediate notifications to the website owner using Google's secure SMTP servers.
  - Sets the visitor's email address as the `Reply-To` header so the website owner can reply directly.
  - Includes visitor's name, email, phone, message, and submission timestamp (formatted in New Zealand Time and UTC).
  - Dual-format delivery: modern, branded, mobile-responsive HTML email template + clean plain-text fallback.
- **CORS Handling**: Configurable origin list via environment variables with support for preflight `OPTIONS` requests.
- **Production Hardened**:
  - Security headers using `helmet`.
  - Strict payload limits (50kb) to prevent buffer overflows.
  - Request logging with timestamps, response times, and IP tracking.
  - Graceful shutdown handlers for `SIGTERM` and `SIGINT`.
  - Zero unhandled exceptions or crashes on bad input or network downtime.

---

## Project Structure

```
backend/
├── src/
│   ├── config.js         # Environment variable loader & validator
│   ├── email.js          # Nodemailer setup, Google SMTP client & email templates
│   ├── logger.js         # Structured timestamped console logger
│   ├── rateLimiter.js    # Rate-limiting middleware
│   ├── server.js         # Express app, middleware, routes & graceful shutdown
│   └── validator.js      # Input validation, sanitization & honeypot logic
├── .dockerignore
├── .env.example          # Environment variables template
├── .gitignore
├── Dockerfile            # Multi-stage production container build
├── docker-compose.yml    # Docker Compose definition
├── package.json          # Dependencies and scripts
├── README.md             # This documentation
└── test-api.js           # Automated test suite (19 unit/integration tests)
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- A **Google / Gmail account** (personal `@gmail.com` or Google Workspace) with **2-Step Verification** enabled.

---

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your details (especially your Google App Password, explained below):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000,https://nationalmovers.co.nz
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
MAIL_TO=info@nationalmovers.co.nz
```

### 3. Start the Server

```bash
# Development mode (auto-reload on code change)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` and verify the SMTP connection.

---

## Google SMTP Configuration

Google requires an **App Password** for third-party applications to send emails through Gmail/Google Workspace accounts. Standard account passwords will not work.

### Step-by-Step Setup:

1. **Sign in to your Google Account**:
   Visit [https://myaccount.google.com/security](https://myaccount.google.com/security).

2. **Enable 2-Step Verification**:
   Under *"How you sign in to Google"*, ensure **2-Step Verification** is turned **ON**. (Google requires 2-Step Verification before enabling App Passwords).

3. **Generate an App Password**:
   - Go directly to: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   - Enter an App name, e.g., `National Movers Contact API`.
   - Click **Create**.
   - Google will display a **16-character code** (e.g. `abcd efgh ijkl mnop`).

4. **Add to `.env`**:
   Copy the 16 characters and paste into your `.env` file under `SMTP_PASS` (spaces can be kept or removed; the service automatically strips them):
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcdefghijklmnop
   ```

5. **Sender and Recipient**:
   - Set `MAIL_FROM="National Movers Contact" <your-email@gmail.com>`
   - Set `MAIL_TO=info@nationalmovers.co.nz` (the email address where you want to receive new leads).

---

## Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `5000` | Port for the HTTP server to listen on. |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`). |
| `CORS_ORIGIN` | No | `http://localhost:3000...` | Comma-separated list of allowed origins, or `*` for development. |
| `RATE_LIMIT_WINDOW_MINUTES` | No | `15` | Time window in minutes for IP rate limiting. |
| `RATE_LIMIT_MAX_REQUESTS` | No | `5` | Maximum number of contact form submissions allowed per IP in the window. |
| `SMTP_HOST` | Yes | `smtp.gmail.com` | SMTP host address (Google is `smtp.gmail.com`). |
| `SMTP_PORT` | Yes | `465` | SMTP port (`465` for SSL, `587` for STARTTLS). |
| `SMTP_SECURE` | No | `true` | `true` for port 465, `false` for port 587. |
| `SMTP_USER` | **Yes** | — | Google / Gmail address. |
| `SMTP_PASS` | **Yes** | — | 16-character Google App Password. |
| `MAIL_FROM` | No | `${SMTP_USER}` | Sender name and address displayed on the notification email. |
| `MAIL_TO` | **Yes** | `info@nationalmovers.co.nz` | Destination inbox where contact submissions are sent. |
| `MAIL_SUBJECT_PREFIX` | No | `[Website Contact]` | Subject prefix for notification emails. |

---

## API Documentation

### 1. Health Check (`GET /api/health`)

Use this endpoint for Docker health checks, uptime monitors, or load-balancer target group health checks.

**Request:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "uptimeSeconds": 142,
  "timestamp": "2026-09-24T09:45:00.000Z"
}
```

---

### 2. Contact Submission (`POST /api/contact`)

Processes and validates a visitor's contact enquiry and dispatches an email notification to the site owner.

**Headers:**
- `Content-Type: application/json`
- `Accept: application/json`

**Request Payload:**

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Full name of the person (2–100 characters). |
| `email` | string | **Yes** | Valid email address. Set as the `Reply-To` in the notification. |
| `phone` | string | No | Contact phone number (digits, spaces, `+`, `-`, parentheses; 6–30 characters). |
| `message` | string | **Yes** | Enquiry message (5–5,000 characters). |
| `botcheck` | string | No | Invisible honeypot field. Leave empty. If filled, the request is silently discarded. |

#### Example Request:

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "email": "sarah.connor@example.co.nz",
    "phone": "+64 21 555 0192",
    "message": "Hi, I would like to enquire about residential moving services in Tauranga next month."
  }'
```

#### Success Response (`200 OK`):

```json
{
  "success": true,
  "message": "Thank you for contacting us. Your message has been sent successfully."
}
```

#### Validation Error Response (`400 Bad Request`):

```json
{
  "success": false,
  "error": "Validation failed. Please correct the specified fields and try again.",
  "details": [
    {
      "field": "email",
      "message": "Please enter a valid email address."
    }
  ]
}
```

#### Rate Limit Response (`429 Too Many Requests`):

```json
{
  "success": false,
  "error": "Too many requests. Please wait a few minutes before submitting again.",
  "retryAfterMinutes": 15
}
```

#### Server Error Response (`500 Internal Server Error`):

```json
{
  "success": false,
  "error": "An unexpected error occurred while sending your message. Please try again later or reach out to us directly."
}
```

---

## Frontend Integration Guide

Here is an example of submitting data from your frontend React component or vanilla JavaScript to this endpoint:

```javascript
async function submitContactForm(formData) {
  const API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL || "http://localhost:5000/api/contact";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        botcheck: formData.botcheck || "", // Honeypot field
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Submission failed");
    }

    return { success: true, message: result.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
```

---

## Automated Testing

The service includes an automated test suite verifying input validation, email sanitization, honeypot anti-spam trapping, CORS handling, rate limiting, and graceful error recovery.

Run the test suite:

```bash
cd backend
npm test
```

Expected output:
```
==========================================
 RESULTS: 19 passed, 0 failed
==========================================
```

---

## Production Deployment

### Option A: Docker & Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. Create and configure your `.env` file in `backend/.env`.
3. Build and launch the container in detached mode:

```bash
cd backend
docker compose up -d --build
```

4. View logs:
```bash
docker compose logs -f
```

5. Stop container:
```bash
docker compose down
```

---

### Option B: Process Manager (PM2)

For deployment on an Ubuntu/Debian VPS:

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the service:
```bash
cd backend
pm2 start src/server.js --name "national-movers-api"
```

3. Ensure it starts on system boot:
```bash
pm2 startup
pm2 save
```

4. Monitor status and logs:
```bash
pm2 status
pm2 logs national-movers-api
```

---

### Option C: Cloud Platforms (Render, Railway, Fly.io)

1. **Render**:
   - Create a new **Web Service**.
   - Connect your repository.
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables (`SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, etc.) under the **Environment** tab.

2. **Railway**:
   - Create a new project from your GitHub repository.
   - Set Root Directory to `/backend`.
   - Add environment variables in the Railway dashboard.

---

### Nginx Reverse Proxy Configuration

If running behind Nginx on a VPS with SSL (Let's Encrypt):

```nginx
server {
    server_name api.nationalmovers.co.nz;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    # ssl_certificate and ssl_certificate_key managed by certbot
}
```

---

## Security Considerations

1. **No Credentials in Git**: `.env` is listed in `.gitignore` and `.dockerignore`. Never commit passwords or app keys.
2. **App Passwords Only**: Never use your primary Google account password; only use Google App Passwords which can be revoked at any time.
3. **CRLF Injection Prevention**: All single-line headers (visitor name, email, phone) have carriage return (`\r`) and newline (`\n`) characters stripped before passing to Nodemailer.
4. **HTML Escaping**: User-submitted content in HTML notification emails is escaped to prevent injection.
5. **Rate Limiting**: Defends the server and your SMTP quota against volumetric denial-of-service and automated form blasting.
