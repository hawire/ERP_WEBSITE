import { useState, useEffect } from "react";
import { Search, RefreshCw, Trash2, Mail, Phone, Building2, Users, Briefcase, Calendar, CheckCircle2, Clock, Inbox, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type Submission } from "./submissions";

function CopyBtn({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-black/8 hover:bg-slate-50 transition-all">
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-600 border border-blue-200",
  contacted: "bg-amber-50 text-amber-600 border border-amber-200",
  qualified: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  closed: "bg-slate-100 text-slate-500 border border-slate-200",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "qualified" | "closed">("all");

  async function load() {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      const merged = Array.isArray(data.submissions) ? data.submissions : [];
      setSubmissions(merged);
      if (!selected && merged.length > 0) setSelected(merged[0]);
    } catch (error) {
      console.error("Unable to load submissions:", error);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(sub: Submission) {
    const updated = submissions.map(s => s.id === sub.id ? { ...s, read: true } : s);
    setSubmissions(updated);
    setSelected({ ...sub, read: true });
    try {
      await fetch(`/api/admin/submissions/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    } catch (error) {
      console.error("Unable to mark submission read:", error);
    }
  }

  async function updateStatus(id: string, status: Submission["status"]) {
    const updated = submissions.map(s => s.id === id ? { ...s, status } : s);
    setSubmissions(updated);
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Unable to update submission status:", error);
    }
  }

  async function deleteSubmission(id: string) {
    const updated = submissions.filter(s => s.id !== id);
    setSubmissions(updated);
    setSelected(updated[0] ?? null);
    try {
      await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Unable to delete submission:", error);
    }
  }

  const filtered = submissions.filter(s => {
    const matchFilter = filter === "all" || s.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.company.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const unreadCount = submissions.filter(s => !s.read).length;

  return (
    <div className="flex h-full overflow-hidden">
      {/* List panel */}
      <div className="w-[380px] flex-shrink-0 flex flex-col border-r border-black/5 bg-white overflow-hidden">
        {/* Search + filter bar */}
        <div className="px-4 py-3 border-b border-black/5 flex flex-col gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search submissions…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-black/5 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(["all", "new", "contacted", "qualified", "closed"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${filter === f ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {f}
              </button>
            ))}
            <button onClick={load} className="ml-auto text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50">
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Tabs: Inbox / Spam */}
        <div className="flex border-b border-black/5 px-4">
          <button className="flex items-center gap-1.5 py-2.5 text-xs font-semibold text-[#2563EB] border-b-2 border-[#2563EB] -mb-px">
            <Inbox size={13} />
            Inbox
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">{unreadCount}</span>
            )}
          </button>
          <button className="flex items-center gap-1.5 py-2.5 text-xs font-medium text-slate-400 ml-4">Spam (0)</button>
        </div>

        {/* Submissions list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Inbox size={28} className="mb-2 opacity-40" />
              <p className="text-sm">No submissions found</p>
            </div>
          ) : (
            filtered.map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelected(sub); markRead(sub); }}
                className={`w-full text-left px-4 py-3.5 border-b border-black/4 transition-all hover:bg-slate-50 ${selected?.id === sub.id ? "bg-blue-50 border-l-2 border-l-[#2563EB]" : "border-l-2 border-l-transparent"
                  }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {!sub.read && <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />}
                    <span className={`text-sm truncate ${!sub.read ? "font-semibold text-[#0F172A]" : "font-medium text-slate-700"}`}>
                      {sub.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{timeAgo(sub.createdAt)}</span>
                </div>
                <div className="text-xs text-slate-500 truncate mb-1.5">{sub.company}</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLES[sub.status]}`}>
                    {sub.status}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium capitalize">
                    {sub.type === "demo" ? "Demo Request" : "Get Started"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 max-w-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{formatDate(selected.createdAt)}</p>
                  <h2 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {selected.name}
                  </h2>
                  <p className="text-sm text-slate-500">{selected.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value as Submission["status"])}
                    className="text-xs px-3 py-1.5 rounded-lg border border-black/10 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => deleteSubmission(selected.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[selected.status]}`}>
                  {selected.status === "new" && <Clock size={11} />}
                  {selected.status === "qualified" && <CheckCircle2 size={11} />}
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                  {selected.type === "demo" ? "Demo Request" : "Get Started"}
                </span>
              </div>

              {/* Fields grid */}
              <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/4 mb-5 overflow-hidden shadow-sm">
                {[
                  { icon: Users, label: "Full Name", value: selected.name },
                  { icon: Mail, label: "Email", value: selected.email },
                  { icon: Building2, label: "Company", value: selected.company },
                  { icon: Phone, label: "Phone", value: selected.phone || "—" },
                  { icon: Briefcase, label: "Industry", value: selected.industry || "—" },
                  { icon: Users, label: "Company Size", value: selected.employees || "—" },
                  { icon: Calendar, label: "Submitted", value: formatDate(selected.createdAt) },
                ].map(field => (
                  <div key={field.label} className="flex items-start gap-4 px-5 py-3.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <field.icon size={13} className="text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">{field.label}</p>
                      <p className="text-sm text-[#0F172A] font-medium break-all">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Your GebetaCloud ERP Demo Request`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
                <CopyBtn value={selected.email} label="Copy Email" />
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Select a submission to view details</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
