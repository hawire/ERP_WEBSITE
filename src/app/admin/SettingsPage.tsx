import { useState } from "react";
import { Save, Check } from "lucide-react";

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden mb-5">
      <div className="px-6 py-4 border-b border-black/5">
        <h3 className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 text-sm rounded-xl border border-black/10 bg-slate-50 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]/50 transition-all";

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@gebetacloud.com", orgName: "GebetaCloud Technologies", website: "https://erp.gebetacloud.com" });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Settings</h2>
            <p className="text-sm text-slate-500 mt-0.5">Manage your admin panel configuration</p>
          </div>
          <button onClick={save}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all">
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </button>
        </div>

        {/* Organisation */}
        <Section title="Organisation" desc="Basic information about your organisation">
          <div className="grid grid-cols-2 gap-4">
            {(["orgName", "website"] as const).map(k => (
              <div key={k}>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block capitalize">{k === "orgName" ? "Organisation Name" : "Website"}</label>
                <input value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} className={inputCls} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Admin Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Admin Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
