import { ChangeEvent, FormEvent, useState } from "react";
import { X, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
  mode: "started" | "demo";
}

const industries = [
  "Manufacturing", "Retail", "Distribution", "Healthcare",
  "Education", "Construction", "Hospitality", "NGO / Non-profit",
  "Financial Services", "Other",
];

// Blocked disposable / fake email domains
const BLOCKED_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "throwaway.email", "yopmail.com", "fakeinbox.com", "trashmail.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "guerrillamail.info",
  "spam4.me", "dispostable.com", "mailnull.com", "spamgourmet.com",
  "mytemp.email", "tempinbox.com", "discard.email", "maildrop.cc",
  "getnada.com", "ownmail.net", "filzmail.com", "spambox.us",
]);

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validateEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_RE.test(trimmed)) return "Please enter a valid email address.";
  const domain = trimmed.split("@")[1]?.toLowerCase();
  if (!domain || !domain.includes(".")) return "Email domain is invalid.";
  if (BLOCKED_DOMAINS.has(domain)) return "Please use a real work or personal email address.";
  // Must have a TLD of at least 2 chars
  const tld = domain.split(".").at(-1) ?? "";
  if (tld.length < 2) return "Email domain looks invalid. Please check and try again.";
  return "";
}

const inputCls = (err?: string) =>
  `w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-[#1E293B] text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${err
    ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
    : "border-black/10 dark:border-white/10 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50"
  }`;

export function DemoModal({ open, onClose, mode }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", employees: "", industry: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const title = "Book a Demo";
  const subtitle = "Schedule a personalised walkthrough with our enterprise sales team.";

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  }

  function handleEmailBlur() {
    const err = validateEmail(form.email);
    if (err) setErrors(prev => ({ ...prev, email: err }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    const emailErr = validateEmail(form.email);
    if (emailErr) newErrors.email = emailErr;
    if (!form.company.trim()) newErrors.company = "Company name is required.";
    if (!form.industry) newErrors.industry = "Please select an industry.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          company: form.company.trim(),
          phone: form.phone.trim(),
          employees: form.employees,
          industry: form.industry,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Unable to submit request.");
      }

      setSubmitted(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? "Unable to submit request.");
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setLoading(false);
      setErrors({});
    }, 300);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.25)] border border-black/5 dark:border-white/8 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all z-10"
              >
                <X size={16} />
              </button>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="p-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-[#0F172A] dark:text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                      Demo Request Received!
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                      Our team will reach out within 1 business day to confirm your session and next steps.
                    </p>
                    <button onClick={handleClose}
                      className="px-6 py-2.5 rounded-[14px] text-white font-semibold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:-translate-y-0.5 shadow-lg shadow-blue-500/25 transition-all text-sm">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} className="p-7">
                    <div className="mb-6">
                      <h3 className="text-[#0F172A] dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.3rem" }}>
                        {title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
                      {errors.form && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                          {errors.form}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Full Name *</label>
                          <input required name="name" value={form.name} onChange={handleChange}
                            placeholder="Amara Osei" className={inputCls(errors.name)} />
                          {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Work Email *</label>
                          <input required type="email" name="email" value={form.email}
                            onChange={handleChange} onBlur={handleEmailBlur}
                            placeholder="you@company.com" className={inputCls(errors.email)} />
                          {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Company Name *</label>
                        <input required name="company" value={form.company} onChange={handleChange}
                          placeholder="Meridian Industries Ltd." className={inputCls(errors.company)} />
                        {errors.company && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.company}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Industry *</label>
                          <select required name="industry" value={form.industry} onChange={handleChange}
                            className={inputCls(errors.industry)}>
                            <option value="">Select industry</option>
                            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                          </select>
                          {errors.industry && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.industry}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Company Size</label>
                          <select name="employees" value={form.employees} onChange={handleChange} className={inputCls()}>
                            <option value="">Select size</option>
                            <option>1 – 50 employees</option>
                            <option>51 – 200 employees</option>
                            <option>201 – 1,000 employees</option>
                            <option>1,000+ employees</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Phone Number</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                          placeholder="+251 911 000 000" className={inputCls()} />
                      </div>

                      <button type="submit" disabled={loading}
                        className="mt-1 w-full py-3.5 rounded-[14px] text-white font-semibold text-sm bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                        {loading
                          ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                          : <>{mode === "demo" ? "Request Demo" : "Create Free Account"} <ArrowRight size={15} /></>}
                      </button>

                      <p className="text-center text-xs text-slate-400">
                        No credit card required · Cancel anytime · We respect your privacy
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
