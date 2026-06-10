import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token")?.trim();
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL.");
      return;
    }

    async function verify() {
      try {
        const response = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
        const payload = await response.json();
        if (!response.ok) {
          setStatus("error");
          setMessage(payload.message || "Unable to verify your email.");
          return;
        }

        setStatus("success");
        setMessage(payload.message || "Email verified successfully.");
      } catch (err) {
        setStatus("error");
        setMessage("Unable to verify your email at this time. Please try again later.");
      }
    }

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />
          <div className="p-8 sm:p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EFF6FF] text-[#2563EB] mb-6">
              {status === "pending" ? <Loader2 size={24} className="animate-spin" /> : status === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {status === "success" ? "Email verified" : status === "pending" ? "Verifying your email…" : "Verification failed"}
            </h1>
            <p className="text-sm text-slate-600 mb-6">{message || "Please wait while we verify your account."}</p>

            {status === "success" ? (
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition"
              >
                Go to sign in
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/auth/register")}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                >
                  Create a new account
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/auth/login")}
                  className="rounded-2xl bg-[#F8FAFC] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
                >
                  Return to login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
