import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const PORT = Number(process.env.SERVER_PORT || 4000);
const APP_URL = (process.env.APP_URL || process.env.FRONTEND_URL || "http://localhost:5175").replace(/\/+$/, "");
const FRONTEND_URL = process.env.FRONTEND_URL || APP_URL;
const VERIFICATION_WINDOW_MS = 1000 * 60 * 60 * 24; // 24 hours
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USING_TEST_MAILER = !(process.env.MAILER_HOST && process.env.MAILER_USER && process.env.MAILER_PASS);

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf-8");
  }
  try {
    await fs.access(SUBMISSIONS_FILE);
  } catch {
    await fs.writeFile(SUBMISSIONS_FILE, "[]", "utf-8");
  }
}

async function loadUsers() {
  await ensureDataFile();
  const content = await fs.readFile(USERS_FILE, "utf-8");
  return content ? JSON.parse(content) : [];
}

async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

async function loadSubmissions() {
  await ensureDataFile();
  const content = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
  return content ? JSON.parse(content) : [];
}

async function saveSubmissions(submissions) {
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateEmail(email) {
  if (!email || typeof email !== "string") return "Email is required.";
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address.";
  return "";
}

function validatePassword(password) {
  if (!password || typeof password !== "string") return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return "";
}

function createVerificationToken() {
  return randomBytes(32).toString("hex");
}

function buildVerificationLink(token) {
  return `${APP_URL}/auth/verify?token=${encodeURIComponent(token)}`;
}

let transporterPromise;
async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  const hasMailerConfig = process.env.MAILER_HOST && process.env.MAILER_USER && process.env.MAILER_PASS;
  if (hasMailerConfig) {
    transporterPromise = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: Number(process.env.MAILER_PORT || 587),
      secure: process.env.MAILER_SECURE === "true",
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporterPromise = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.warn("[server] MAILER_HOST, MAILER_USER, and MAILER_PASS are not set. Using Nodemailer test account for development.");
  }

  return transporterPromise;
}

async function sendVerificationEmail(user, token) {
  const transporter = await getTransporter();
  const verificationLink = buildVerificationLink(token);
  const mailOptions = {
    from: process.env.MAILER_FROM || "GebetaCloud ERP <no-reply@gebetacloud.com>",
    to: user.email,
    subject: "Verify your GebetaCloud ERP email",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#0F172A;line-height:1.6;">
        <p>Hello ${user.name || "there"},</p>
        <p>Thank you for creating an account. Please verify your email address by clicking the button below:</p>
        <p><a href="${verificationLink}" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:8px;">Verify email</a></p>
        <p>If the button does not work, paste this link into your browser:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this email, you can safely ignore it.</p>
      </div>
    `,
  };

  // Try sending with the configured transporter. If that fails and we were
  // using a real SMTP config, fall back to a Nodemailer test account so
  // developers still get a usable preview link during local development.
  try {
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.info(`[server] Verification email preview available at: ${previewUrl}`);
    return { verificationLink, previewUrl: previewUrl || null, sent: true, fallbackToTest: false };
  } catch (err) {
    console.error("[server] Error sending verification email with configured transporter:", err?.message || err);

    // If we already are using the test mailer, just return the failure.
    if (USING_TEST_MAILER) {
      return { verificationLink, previewUrl: null, sent: false, fallbackToTest: false };
    }

    // Attempt fallback using a fresh test account so the developer can still
    // view the email in the Ethereal preview URL.
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      const info2 = await testTransporter.sendMail(mailOptions);
      const previewUrl2 = nodemailer.getTestMessageUrl(info2);
      if (previewUrl2) console.info(`[server] Fallback verification email preview available at: ${previewUrl2}`);
      return { verificationLink, previewUrl: previewUrl2 || null, sent: false, fallbackToTest: true };
    } catch (err2) {
      console.error("[server] Fallback test mailer also failed:", err2?.message || err2);
      return { verificationLink, previewUrl: null, sent: false, fallbackToTest: false };
    }
  }
}

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, name, password } = req.body ?? {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      return res.status(400).json({ message: emailError || passwordError });
    }

    const normalizedEmail = normalizeEmail(email);
    const users = await loadUsers();
    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      if (existingUser.verified) {
        return res.status(400).json({ message: "This email is already registered and verified. Please sign in instead." });
      }

      return res.status(400).json({
        message: "A registration already exists for this email address. Please check your inbox for the verification link or request a new one from the login page.",
        code: "EMAIL_NOT_VERIFIED",
        verificationLink: USING_TEST_MAILER && existingUser.verificationToken ? buildVerificationLink(existingUser.verificationToken) : undefined,
      });
    }

    const token = createVerificationToken();
    const verificationExpires = Date.now() + VERIFICATION_WINDOW_MS;
    const passwordHash = await bcrypt.hash(password, 10);

    users.push({
      id: randomBytes(16).toString("hex"),
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split("@")[0],
      passwordHash,
      verified: false,
      verificationToken: token,
      verificationExpires,
      createdAt: new Date().toISOString(),
    });

    await saveUsers(users);
    const emailResult = await sendVerificationEmail({ email: normalizedEmail, name: name?.trim() }, token);

    const payload = { message: "Verification process started. Please verify your email within 24 hours." };
    if (emailResult) {
      if (emailResult.previewUrl) payload.previewUrl = emailResult.previewUrl;
      if (emailResult.verificationLink) payload.verificationLink = emailResult.verificationLink;
      payload.emailSent = !!emailResult.sent;
      payload.fallbackToTest = !!emailResult.fallbackToTest;
      if (!emailResult.sent && !emailResult.fallbackToTest) {
        payload.message = "We were unable to send an email via the configured mail server. Please contact the site administrator or try again later.";
      }
    }
    return res.json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to complete registration at this time." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const normalizedEmail = normalizeEmail(email);
    const users = await loadUsers();
    const user = users.find((item) => item.email === normalizedEmail);

    if (!user || !(await bcrypt.compare(password ?? "", user.passwordHash))) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!user.verified) {
      const response = {
        message: "Email address has not been verified. Please check your inbox or request a new verification link.",
        code: "EMAIL_NOT_VERIFIED",
      };
      if (USING_TEST_MAILER && user.verificationToken) {
        response.verificationLink = buildVerificationLink(user.verificationToken);
      }
      return res.status(403).json(response);
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to complete login at this time." });
  }
});

app.post("/api/auth/resend-verification", async (req, res) => {
  try {
    const { email } = req.body ?? {};
    const normalizedEmail = normalizeEmail(email);
    const users = await loadUsers();
    const user = users.find((item) => item.email === normalizedEmail);

    if (!user) {
      return res.status(400).json({ message: "No account found with that email address." });
    }

    if (user.verified) {
      return res.status(400).json({ message: "This account is already verified. Please sign in." });
    }

    const token = createVerificationToken();
    user.verificationToken = token;
    user.verificationExpires = Date.now() + VERIFICATION_WINDOW_MS;
    await saveUsers(users);
    const emailResult = await sendVerificationEmail(user, token);
    const payload = { message: "A fresh verification email has been sent." };
    if (emailResult) {
      if (emailResult.previewUrl) payload.previewUrl = emailResult.previewUrl;
      if (emailResult.verificationLink) payload.verificationLink = emailResult.verificationLink;
      payload.emailSent = !!emailResult.sent;
      payload.fallbackToTest = !!emailResult.fallbackToTest;
      if (!emailResult.sent && !emailResult.fallbackToTest) {
        payload.message = "We were unable to send an email via the configured mail server. Please contact the site administrator or try again later.";
      }
    }
    return res.json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to resend verification email at this time." });
  }
});

app.get("/api/auth/verify", async (req, res) => {
  try {
    const token = String(req.query.token || "").trim();
    if (!token) {
      return res.status(400).json({ message: "Verification token is required." });
    }

    const users = await loadUsers();
    const user = users.find((item) => item.verificationToken === token);

    if (!user) {
      return res.status(400).json({ message: "Verification link is invalid or has already been used." });
    }

    if (!user.verificationExpires || Date.now() > user.verificationExpires) {
      return res.status(400).json({ message: "Verification link has expired. Please request a new one." });
    }

    user.verified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await saveUsers(users);

    return res.json({ message: "Email verified successfully. You may now sign in." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to verify email at this time." });
  }
});

app.post("/api/demo-request", async (req, res) => {
  try {
    const { name, email, company, phone, employees, industry } = req.body ?? {};
    const emailError = validateEmail(email);
    if (!name?.trim()) return res.status(400).json({ message: "Full name is required." });
    if (emailError) return res.status(400).json({ message: emailError });
    if (!company?.trim()) return res.status(400).json({ message: "Company name is required." });
    if (!industry?.trim()) return res.status(400).json({ message: "Industry is required." });

    const submissions = await loadSubmissions();
    const submission = {
      id: randomBytes(16).toString("hex"),
      createdAt: new Date().toISOString(),
      type: "demo",
      name: name.trim(),
      email: normalizeEmail(email),
      company: company.trim(),
      phone: phone?.trim() || "",
      employees: employees?.trim() || "",
      industry: industry.trim(),
      status: "new",
      read: false,
    };

    submissions.unshift(submission);
    await saveSubmissions(submissions);

    return res.json({ message: "Demo request received. Thank you!", submission });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to submit the demo request at this time." });
  }
});

app.get("/api/admin/submissions", async (req, res) => {
  try {
    const submissions = await loadSubmissions();
    return res.json({ submissions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load submissions." });
  }
});

app.patch("/api/admin/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, read } = req.body ?? {};
    const submissions = await loadSubmissions();
    const index = submissions.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).json({ message: "Submission not found." });

    if (status) submissions[index].status = status;
    if (read !== undefined) submissions[index].read = !!read;
    await saveSubmissions(submissions);

    return res.json({ submission: submissions[index] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update the submission." });
  }
});

app.delete("/api/admin/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await loadSubmissions();
    const filtered = submissions.filter((item) => item.id !== id);
    if (filtered.length === submissions.length) return res.status(404).json({ message: "Submission not found." });
    await saveSubmissions(filtered);
    return res.json({ message: "Submission deleted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to delete the submission." });
  }
});

// --- Admin helpers & endpoints -------------------------------------------------

function requireAdminKey(req, res, next) {
  const provided = String(req.headers["x-admin-key"] || req.query.adminKey || "").trim();
  const expected = String(process.env.ADMIN_KEY || "").trim();
  if (!expected) return res.status(500).json({ message: "Admin API not configured (ADMIN_KEY missing)." });
  if (!provided || provided !== expected) return res.status(403).json({ message: "Forbidden - invalid admin key." });
  return next();
}

function buildAdminLoginLink(token) {
  return `${APP_URL}/auth/magic?token=${encodeURIComponent(token)}`;
}

async function sendAdminLoginLinkEmail(user, token) {
  const transporter = await getTransporter();
  const loginLink = buildAdminLoginLink(token);
  const mailOptions = {
    from: process.env.MAILER_FROM || "GebetaCloud ERP <no-reply@gebetacloud.com>",
    to: user.email,
    subject: "Your one-time login link for GebetaCloud ERP",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#0F172A;line-height:1.6;">
        <p>Hello ${user.name || "there"},</p>
        <p>An administrator has created a one-time login link for your account. Click the button below to sign in immediately (link expires in 15 minutes):</p>
        <p><a href="${loginLink}" style="display:inline-block;padding:12px 20px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:8px;">Sign in</a></p>
        <p>If the button does not work, paste this link into your browser:</p>
        <p><a href="${loginLink}">${loginLink}</a></p>
        <p>If you did not expect this, you can ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.info(`[server] Admin login email preview available at: ${previewUrl}`);
    return { loginLink, previewUrl: previewUrl || null, sent: true, fallbackToTest: false };
  } catch (err) {
    console.error("[server] Error sending admin login email:", err?.message || err);
    if (USING_TEST_MAILER) {
      return { loginLink, previewUrl: null, sent: false, fallbackToTest: false };
    }
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      const info2 = await testTransporter.sendMail(mailOptions);
      const previewUrl2 = nodemailer.getTestMessageUrl(info2);
      if (previewUrl2) console.info(`[server] Fallback admin login email preview available at: ${previewUrl2}`);
      return { loginLink, previewUrl: previewUrl2 || null, sent: false, fallbackToTest: true };
    } catch (err2) {
      console.error("[server] Fallback admin login mailer failed:", err2?.message || err2);
      return { loginLink, previewUrl: null, sent: false, fallbackToTest: false };
    }
  }
}

app.get("/api/admin/users", requireAdminKey, async (req, res) => {
  try {
    const users = await loadUsers();
    const out = users.map(u => ({ id: u.id, email: u.email, name: u.name, verified: !!u.verified, createdAt: u.createdAt }));
    return res.json({ users: out });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to list users." });
  }
});

app.post("/api/admin/send-login-link", requireAdminKey, async (req, res) => {
  try {
    const { email } = req.body ?? {};
    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ message: emailErr });
    const normalized = normalizeEmail(email);
    const users = await loadUsers();
    const user = users.find(u => u.email === normalized);
    if (!user) return res.status(404).json({ message: "User not found." });

    const token = createVerificationToken();
    user.loginToken = token;
    user.loginTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await saveUsers(users);

    const emailResult = await sendAdminLoginLinkEmail(user, token);
    const payload = { message: "One-time login link created." };
    if (emailResult) {
      if (emailResult.previewUrl) payload.previewUrl = emailResult.previewUrl;
      if (emailResult.loginLink) payload.loginLink = emailResult.loginLink;
      payload.emailSent = !!emailResult.sent;
      payload.fallbackToTest = !!emailResult.fallbackToTest;
      if (!emailResult.sent && !emailResult.fallbackToTest) {
        payload.message = "Unable to send email via configured mail server. Admin login link is available in the response.";
      }
    }
    return res.json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to create login link." });
  }
});

app.get("/api/auth/magic-login", async (req, res) => {
  try {
    const token = String(req.query.token || "").trim();
    if (!token) return res.status(400).json({ message: "Token required." });
    const users = await loadUsers();
    const user = users.find(u => u.loginToken === token);
    if (!user) return res.status(400).json({ message: "Invalid or expired token." });
    if (!user.loginTokenExpires || Date.now() > user.loginTokenExpires) return res.status(400).json({ message: "Token expired." });
    // consume token
    user.loginToken = null;
    user.loginTokenExpires = null;
    await saveUsers(users);
    return res.json({ user: { id: user.id, name: user.name, email: user.email, verified: !!user.verified } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to process magic login." });
  }
});

app.get("/api/auth/status", async (req, res) => {
  return res.json({ app: "GebetaCloud ERP Auth", version: "1.0" });
});

async function seedAdmin() {
  try {
    const users = await loadUsers();
    const adminEmail = "test@integracnc.com";
    const existing = users.find(u => u.email === adminEmail);
    if (!existing) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      users.push({
        id: randomBytes(16).toString("hex"),
        email: adminEmail,
        name: "Admin",
        passwordHash,
        verified: true,
        verificationToken: null,
        verificationExpires: null,
        createdAt: new Date().toISOString(),
      });
      await saveUsers(users);
      console.log(`[server] Seeded admin user: ${adminEmail}`);
    }
  } catch (err) {
    console.error("[server] Error seeding admin user:", err);
  }
}

(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`[server] Auth server listening on http://localhost:${PORT}`);
  });
})();
