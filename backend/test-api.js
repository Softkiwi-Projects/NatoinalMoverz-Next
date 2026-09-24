/**
 * Automated test suite for the Contact Form API Service.
 * Tests:
 * 1. Health check endpoint (GET /api/health)
 * 2. Root service info (GET /)
 * 3. Validation rejection (missing fields, invalid email, invalid phone)
 * 4. Honeypot anti-spam capture (returns 200 without email sending)
 * 5. Rate limiting protection (exceeding rate limit triggers 429)
 */

import http from "http";
import app from "./src/server.js";

const TEST_PORT = 5055;
let server;

function makeRequest({ method = "GET", path = "/", headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers,
    };
    if (dataString) {
      reqHeaders["Content-Type"] = "application/json";
      reqHeaders["Content-Length"] = Buffer.byteLength(dataString);
    }

    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: TEST_PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString();
          let json = null;
          try {
            json = JSON.parse(raw);
          } catch {
            json = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        });
      }
    );

    req.on("error", reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log("\n==========================================");
  console.log(" RUNNING CONTACT FORM API SERVICE TESTS");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      resolve();
    });
  });

  try {
    // Test 1: GET /api/health
    {
      const res = await makeRequest({ method: "GET", path: "/api/health" });
      assert(res.status === 200, "GET /api/health returns 200 OK");
      assert(res.data?.status === "ok", "GET /api/health returns status: 'ok'");
    }

    // Test 2: GET /
    {
      const res = await makeRequest({ method: "GET", path: "/" });
      assert(res.status === 200, "GET / returns 200 OK");
      assert(res.data?.service === "National Movers Contact API", "GET / returns service name");
    }

    // Test 3: Validation Error - Missing all fields
    {
      const res = await makeRequest({
        method: "POST",
        path: "/api/contact",
        body: {},
      });
      assert(res.status === 400, "Empty payload returns 400 Bad Request");
      assert(res.data?.success === false, "Empty payload response contains success: false");
      assert(Array.isArray(res.data?.details), "Empty payload contains validation error details");
    }

    // Test 4: Validation Error - Invalid Email format
    {
      const res = await makeRequest({
        method: "POST",
        path: "/api/contact",
        body: {
          name: "John Doe",
          email: "invalid-email-address",
          phone: "021 123 4567",
          message: "Hello, this is a test inquiry message.",
        },
      });
      assert(res.status === 400, "Invalid email returns 400 Bad Request");
      const hasEmailErr = res.data?.details?.some((d) => d.field === "email");
      assert(hasEmailErr, "Validation errors correctly flag the email field");
    }

    // Test 5: Validation Error - Invalid Phone characters
    {
      const res = await makeRequest({
        method: "POST",
        path: "/api/contact",
        body: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "bad-phone-number-with-letters-abc",
          message: "Hello, this is a test inquiry message.",
        },
      });
      assert(res.status === 400, "Invalid phone characters return 400 Bad Request");
      const hasPhoneErr = res.data?.details?.some((d) => d.field === "phone");
      assert(hasPhoneErr, "Validation errors correctly flag the phone field");
    }

    // Test 6: Honeypot Anti-Spam protection
    {
      const res = await makeRequest({
        method: "POST",
        path: "/api/contact",
        body: {
          name: "Spam Bot",
          email: "spambot@example.com",
          message: "Buy cheap backlinks now!",
          botcheck: "i-am-a-bot",
        },
      });
      assert(res.status === 200, "Honeypot submission returns 200 OK (silent drop)");
      assert(res.data?.success === true, "Honeypot response returns success: true to confuse bot");
    }

    // Test 7: CORS preflight (OPTIONS)
    {
      const res = await makeRequest({
        method: "OPTIONS",
        path: "/api/contact",
        headers: {
          Origin: "http://localhost:3000",
          "Access-Control-Request-Method": "POST",
        },
      });
      assert(res.status === 204 || res.status === 200, "OPTIONS preflight returns 200/204");
      assert(
        res.headers["access-control-allow-origin"] === "http://localhost:3000" ||
          res.headers["access-control-allow-origin"] === "*",
        "Access-Control-Allow-Origin header is set properly"
      );
    }

    // Test 8: Rate Limiting
    {
      console.log("  Testing rate limiter threshold...");
      let hit429 = false;
      for (let i = 0; i < 7; i++) {
        const res = await makeRequest({
          method: "POST",
          path: "/api/contact",
          body: {
            botcheck: "rate-limit-test", // Use honeypot so we don't trigger SMTP in test
          },
        });
        if (res.status === 429) {
          hit429 = true;
          break;
        }
      }
      assert(hit429, "Rate limiter returns 429 Too Many Requests after threshold");
    }

    // Test 9: Graceful Error Handling when SMTP is not configured
    {
      // Reset rate limiter window by using a fresh test or subpath/mock if needed,
      // or verify error handling structure
      const res = await makeRequest({
        method: "POST",
        path: "/api/contact",
        headers: {
          "X-Forwarded-For": "198.51.100.25", // Different IP to bypass earlier rate limit
        },
        body: {
          name: "Test Visitor",
          email: "visitor@example.com",
          phone: "021 987 6543",
          message: "Testing graceful SMTP failure handling.",
        },
      });
      assert(
        res.status === 500 || res.status === 200,
        "Valid submission with dummy credentials returns graceful response (status 500 or 200)"
      );
      if (res.status === 500) {
        assert(res.data?.success === false, "Graceful failure response contains success: false");
        assert(
          typeof res.data?.error === "string",
          "Graceful failure response contains descriptive error message"
        );
      }
    }

    // Test 8: Quote form submission without explicit message (structured fields synthesize message)
    {
      const res = await makeRequest({
        method: "POST",
        path: "/api/contact",
        headers: {
          "X-Forwarded-For": "198.51.100.99",
        },
        body: {
          name: "Quote Applicant",
          email: "quote@example.com",
          phone: "021 555 1234",
          moveType: "2 Bedrooms",
          date: "2026-10-15",
          pickup: "36a Sixteenth Ave, Tauranga",
          dropoff: "10 Queen St, Auckland",
        },
      });
      assert(
        res.status === 500 || res.status === 200,
        "Quote submission with structured fields is validated and accepted (status 500 or 200)"
      );
    }
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }

  console.log("\n==========================================");
  console.log(` RESULTS: ${passed} passed, ${failed} failed`);
  console.log("==========================================\n");

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test runner encountered an error:", err);
  if (server) server.close();
  process.exit(1);
});
