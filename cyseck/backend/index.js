require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for OTPs and attempts (for demo)
const otpStore = {};   // { emailOrPhone: { otp, attempts, blockedUntil } }

// Helper function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request OTP
app.post("/auth/request-otp", (req, res) => {
  const { emailOrPhone } = req.body;

  if (!emailOrPhone) {
    return res.status(400).json({ error: "Email or phone required" });
  }

  const otp = generateOTP();

  otpStore[emailOrPhone] = {
    otp,
    attempts: 0,
    blockedUntil: null,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  console.log("=================================");
  console.log("MOCK OTP GENERATED");
  console.log("User:", emailOrPhone);
  console.log("OTP:", otp);
  console.log("=================================");

  res.json({ message: "OTP generated and sent (mock)" });
});





// Verify OTP
app.post("/auth/verify-otp", (req, res) => {
  const { emailOrPhone, otp } = req.body;

  if (!emailOrPhone || !otp) return res.status(400).json({ error: "Email/phone and OTP required" });

  const entry = otpStore[emailOrPhone];
  if (!entry) return res.status(400).json({ error: "No OTP requested" });

  const now = Date.now();
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return res.status(429).json({ error: "Blocked. Try again later." });
  }

  if (entry.otp === otp) {
    entry.attempts = 0;
    const token = uuidv4(); // Mock session token
    return res.json({ message: "OTP verified", token });
  } else {
    entry.attempts += 1;
    if (entry.attempts >= 3) {
      entry.blockedUntil = now + 10 * 60 * 1000; // block 10 minutes
      return res.status(429).json({ error: "Too many failed attempts. Blocked for 10 min." });
    }
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

// Mock user info
app.get("/auth/me", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token required" });

  // In real app, check token validity. Here we mock
  return res.json({ name: "Mahendar BS", email: "mahendar@example.com" });
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
