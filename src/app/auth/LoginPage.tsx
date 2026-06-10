import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { validateEmail, validatePassword } from "./utils";

export function AuthLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setNeedsVerification(false);

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Unable to sign in.");
        if (result.code === "EMAIL_NOT_VERIFIED") {
          setNeedsVerification(true);
          setVerificationLink(result.verificationLink || "");
          setPreviewUrl(result.previewUrl || "");
        }
        return;
      }

      localStorage.setItem("gebeta_auth", JSON.stringify(result.user));
      setMessage("Signed in successfully. You can now access protected features.");
      setVerificationLink("");
      setPreviewUrl("");

      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (err) {
      setError("Unable to connect to the authentication service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Unable to resend verification link.");
        return;
      }
      setMessage(result.message || "Verification email resent. Please check your inbox.");
      setVerificationLink(result.verificationLink || "");
      setPreviewUrl(result.previewUrl || "");
    } catch (err) {
      setError("Unable to resend verification email right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />
          <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
            <p className="text-sm text-slate-500 mb-6">Only verified accounts may sign in.</p>

            {message && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <p>{message}</p>
                {verificationLink && (
                  <p className="mt-2 break-all">
                    <a href={verificationLink} target="_blank" rel="noreferrer" className="font-semibold text-[#1D4ED8] hover:underline">
                      Verify your email now
                    </a>
                  </p>
                )}
                {previewUrl && (
                  <p className="mt-2 text-xs text-slate-600">
                    Preview email: <a href={previewUrl} target="_blank" rel="noreferrer" className="underline text-[#1D4ED8]">Open preview</a>
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Work email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/30 disabled:opacity-70"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign in"}
              </button>
            </form>

            {needsVerification && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="mb-3">Your account is not verified yet.</p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
                >
                  Resend verification email
                </button>
                {verificationLink && (
                  <p className="mt-3 text-sm text-slate-700">
                    Quick verify: <a href={verificationLink} target="_blank" rel="noreferrer" className="font-semibold text-[#1D4ED8] hover:underline">Verify now</a>
                  </p>
                )}
                {previewUrl && (
                  <p className="mt-2 text-xs text-slate-500">
                    Preview email: <a href={previewUrl} target="_blank" rel="noreferrer" className="underline text-[#1D4ED8]">Open preview</a>
                  </p>
                )}
              </div>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
              New here? <button type="button" onClick={() => navigate("/auth/register")} className="font-semibold text-slate-900 hover:text-[#2563EB]">Create account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
