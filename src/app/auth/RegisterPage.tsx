import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { validateEmail, validatePassword } from "./utils";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const nameError = !form.name.trim() ? "Full name is required." : "";

    setErrors({ email: emailError, password: passwordError, name: nameError });
    if (emailError || passwordError || nameError) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.name, password: form.password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.message || "Unable to register at this time.");
        setVerificationLink(payload.verificationLink || "");
        setPreviewUrl(payload.previewUrl || "");
        return;
      }

      setMessage(payload.message || "A verification email has been sent.");
      setVerificationLink(payload.verificationLink || "");
      setPreviewUrl(payload.previewUrl || "");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError("Unable to register at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />
          <div className="p-8 sm:p-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-sm text-slate-500 mb-6">Register with a real email address and verify before signing in.</p>

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
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full name</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25"
                />
                {errors.name && <p className="mt-2 text-xs text-rose-600">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Work email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25"
                />
                {errors.email && <p className="mt-2 text-xs text-rose-600">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25"
                />
                {errors.password && <p className="mt-2 text-xs text-rose-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/30 disabled:opacity-70"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Registering…</> : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already verified? <button type="button" onClick={() => navigate("/auth/login")} className="font-semibold text-slate-900 hover:text-[#2563EB]">Sign in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
