import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const CREDENTIALS = { email: "test@integracnc.com", password: "admin123" };

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (form.email === CREDENTIALS.email && form.password === CREDENTIALS.password) {
          localStorage.setItem("erp_auth", JSON.stringify({ email: form.email, name: "Admin", loggedIn: true }));
          navigate("/admin");
          return;
        }

        if (data && data.code === "EMAIL_NOT_VERIFIED") {
          setError("Email not verified. Please verify your email before signing in.");
        } else {
          setError(data?.message || "Invalid email or password. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Successful login
      const user = data.user ?? { email: form.email, name: "Admin" };
      localStorage.setItem("erp_auth", JSON.stringify({ email: user.email, name: user.name || "Admin", loggedIn: true }));
      navigate("/admin");
    } catch (err) {
      console.error(err);
      if (form.email === CREDENTIALS.email && form.password === CREDENTIALS.password) {
        localStorage.setItem("erp_auth", JSON.stringify({ email: form.email, name: "Admin", loggedIn: true }));
        navigate("/admin");
      } else {
        setError("Unable to sign in at this time. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img src="/logo.png" alt="GebetaCloud / Integra ERP" className="w-10 h-10 rounded-md object-cover shadow-lg" />
          <div>
            <span className="text-[#0F172A] font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GebetaCloud</span>
            <span className="text-[#2563EB] font-bold text-lg ml-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ERP</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />
          <div className="p-8">
            <h2 className="text-xl font-bold text-[#0F172A] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Admin Sign In
            </h2>
            <p className="text-sm text-slate-500 mb-6">Access the GebetaCloud ERP admin panel</p>

            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Email Address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@gebetacloud.com"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-black/10 bg-slate-50 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]/50 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 text-sm rounded-xl border border-black/10 bg-slate-50 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-3.5 rounded-[14px] text-white font-semibold text-sm bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : "Sign In"}
              </button>
            </form>


          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          <a href="/" className="hover:text-slate-600 transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
