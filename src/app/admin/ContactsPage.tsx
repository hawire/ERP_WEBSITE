import { useEffect, useMemo, useState } from "react";
import { type Submission } from "./submissions";
import { Search, Mail, Phone, Building2, Copy, Check } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-600",
  contacted: "bg-amber-50 text-amber-600",
  qualified: "bg-emerald-50 text-emerald-600",
  closed: "bg-slate-100 text-slate-500",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button onClick={copy} className="ml-1 text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0">
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

export function ContactsPage() {
  const [allSubs, setAllSubs] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "company" | "industry" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    async function fetchSubs() {
      try {
        const res = await fetch("/api/admin/submissions");
        const data = await res.json();
        setAllSubs(Array.isArray(data.submissions) ? data.submissions : []);
      } catch (error) {
        console.error("Unable to load contacts:", error);
      }
    }
    fetchSubs();
  }, []);

  const contacts = useMemo(() => {
    let list = [...allSubs];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.company.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [allSubs, search, sortKey, sortDir]);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const thCls = "text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 cursor-pointer select-none hover:text-[#2563EB] transition-colors";

  return (
    <div className="flex h-full overflow-hidden">
      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Contacts</h2>
              <p className="text-sm text-slate-500 mt-0.5">{contacts.length} contacts from form submissions</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts…"
                className="pl-9 pr-4 py-2 text-sm bg-white border border-black/8 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/5">
                  <tr className="px-5">
                    <th className={`${thCls} pl-5`} onClick={() => toggleSort("name")}>Name {sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                    <th className={thCls} onClick={() => toggleSort("company")}>Company {sortKey === "company" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                    <th className={thCls} onClick={() => toggleSort("industry")}>Industry {sortKey === "industry" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                    <th className={thCls}>Email</th>
                    <th className={thCls}>Phone</th>
                    <th className={thCls}>Status</th>
                    <th className={`${thCls} pr-5`} onClick={() => toggleSort("createdAt")}>Date {sortKey === "createdAt" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4">
                  {contacts.map(c => (
                    <tr key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === c.id ? "bg-blue-50" : ""}`}>
                      <td className="py-3.5 pl-5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">{c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
                          </div>
                          <span className="text-sm font-semibold text-[#0F172A] whitespace-nowrap">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 text-sm text-slate-600 whitespace-nowrap">{c.company}</td>
                      <td className="py-3.5 pr-3 text-sm text-slate-500 whitespace-nowrap">{c.industry || "—"}</td>
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <span className="truncate max-w-[160px]">{c.email}</span>
                          <CopyButton text={c.email} />
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center text-sm text-slate-600">
                          {c.phone ? (
                            <><span className="whitespace-nowrap">{c.phone}</span><CopyButton text={c.phone} /></>
                          ) : <span className="text-slate-300">—</span>}
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold capitalize ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                      </td>
                      <td className="py-3.5 pr-5 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-sm">No contacts found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Side detail */}
      {selected && (
        <div className="w-72 flex-shrink-0 border-l border-black/5 bg-white overflow-y-auto p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center">
              <span className="text-white text-sm font-bold">{selected.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{selected.name}</p>
              <p className="text-xs text-slate-500">{selected.company}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm mb-5">
            {[
              { icon: Mail, label: "Email", value: selected.email, href: `mailto:${selected.email}` },
              { icon: Phone, label: "Phone", value: selected.phone || "—" },
              { icon: Building2, label: "Industry", value: selected.industry || "—" },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{f.label}</p>
                {f.label === "Email" ? (
                  <a href={`mailto:${selected.email}`} className="text-[#2563EB] hover:underline break-all">{f.value}</a>
                ) : (
                  <p className="text-slate-700 break-all">{f.value}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <a href={`mailto:${selected.email}?subject=GebetaCloud ERP — Follow Up`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all">
              <Mail size={14} /> Send Email
            </a>
            {/* Call action removed per request - phone number shown above as plain text */}
          </div>
        </div>
      )}
    </div>
  );
}
