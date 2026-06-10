const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BLOCKED_DOMAINS = new Set([
  "10minutemail.com",
  "mailinator.com",
  "trashmail.com",
  "yopmail.com",
  "tempmail.com",
  "throwaway.email",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "guerrillamail.com",
]);

export function validateEmail(email: string) {
  if (!email) return "Email is required.";
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed)) return "Please enter a valid email address.";
  const domain = trimmed.split("@")[1] ?? "";
  if (!domain || !domain.includes(".")) return "Email domain is invalid.";
  if (BLOCKED_DOMAINS.has(domain)) return "Please use a real work or personal email address.";
  return "";
}

export function validatePassword(password: string) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return "";
}
