import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DollarSign, Package, Users, Briefcase } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const tabs = [
  { id: "finance", label: "Financial Dashboard", icon: DollarSign },
  { id: "inventory", label: "Inventory Dashboard", icon: Package },
  { id: "hr", label: "HR Dashboard", icon: Users },
  { id: "crm", label: "CRM Dashboard", icon: Briefcase },
];

const financeData = [
  { m: "Jan", rev: 310, exp: 220 }, { m: "Feb", rev: 340, exp: 240 },
  { m: "Mar", rev: 360, exp: 255 }, { m: "Apr", rev: 395, exp: 265 },
  { m: "May", rev: 420, exp: 270 }, { m: "Jun", rev: 468, exp: 285 },
];

const inventoryData = [
  { name: "Electronics", value: 3200 }, { name: "Apparel", value: 2100 },
  { name: "Machinery", value: 1800 }, { name: "FMCG", value: 4500 },
  { name: "Pharma", value: 900 },
];

const hrData = [
  { dept: "Engineering", headcount: 140, open: 8 },
  { dept: "Sales", headcount: 92, open: 12 },
  { dept: "Operations", headcount: 180, open: 5 },
  { dept: "Finance", headcount: 45, open: 3 },
  { dept: "HR", headcount: 28, open: 2 },
];

const crmPipeline = [
  { name: "New Leads", value: 184, color: "#2563EB" },
  { name: "Qualified", value: 97, color: "#06B6D4" },
  { name: "Proposal", value: 52, color: "#8B5CF6" },
  { name: "Negotiation", value: 31, color: "#F59E0B" },
  { name: "Won", value: 24, color: "#10B981" },
];

function FinanceDash() {
  return (
    <div className="grid grid-cols-3 gap-4 p-5">
      {[
        { l: "Net Revenue", v: "$4.68M", c: "+18.4%", up: true },
        { l: "Gross Profit", v: "$2.12M", c: "+22.1%", up: true },
        { l: "Operating Expenses", v: "$1.43M", c: "-3.2%", up: false },
      ].map(s => (
        <div key={s.l} className="bg-[#1E293B] rounded-xl p-4 border border-white/5">
          <div className="text-xs text-slate-500 mb-1">{s.l}</div>
          <div className="text-xl font-bold text-white" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{s.v}</div>
          <div className={`text-xs mt-1 font-semibold ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.c} vs last year</div>
        </div>
      ))}
      <div className="col-span-3 bg-[#1E293B] rounded-xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Revenue vs Expenses (H1 2024)</span>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-1 bg-blue-500 rounded inline-block"/> Revenue</span>
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-1 bg-rose-500 rounded inline-block"/> Expenses</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={financeData}>
            <XAxis dataKey="m" tick={{fill:"#64748B",fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"#1E293B",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
            <Area type="monotone" dataKey="rev" stroke="#2563EB" strokeWidth={2} fill="#2563EB" fillOpacity={0.18} dot={false}/>
            <Area type="monotone" dataKey="exp" stroke="#F43F5E" strokeWidth={2} fill="#F43F5E" fillOpacity={0.12} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function InventoryDash() {
  const COLORS = ["#2563EB","#06B6D4","#8B5CF6","#10B981","#F59E0B"];
  return (
    <div className="grid grid-cols-2 gap-4 p-5">
      <div className="bg-[#1E293B] rounded-xl p-4 border border-white/5">
        <div className="text-sm font-semibold text-white mb-4" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Stock by Category</div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={inventoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name})=>name} labelLine={false}>
              {inventoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
            </Pie>
            <Tooltip contentStyle={{background:"#1E293B",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-3">
        {[
          { l: "Total SKUs", v: "14,392", badge: "Active" },
          { l: "Low Stock Alerts", v: "47", badge: "Action Required", warn: true },
          { l: "Warehouse Utilization", v: "82%", badge: "3 Locations" },
          { l: "Avg Turnover Rate", v: "4.2x", badge: "+0.6 vs Q1" },
        ].map(s => (
          <div key={s.l} className="bg-[#1E293B] rounded-xl p-3.5 border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{s.l}</div>
              <div className="text-lg font-bold text-white" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{s.v}</div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${s.warn ? "text-amber-400 bg-amber-400/10" : "text-emerald-400 bg-emerald-400/10"}`}>{s.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HRDash() {
  return (
    <div className="grid grid-cols-3 gap-4 p-5">
      {[
        { l: "Total Employees", v: "1,247", c: "+38 this month" },
        { l: "Open Positions", v: "30", c: "Across 5 departments" },
        { l: "Payroll (Jun)", v: "$2.84M", c: "Processed on time" },
      ].map(s => (
        <div key={s.l} className="bg-[#1E293B] rounded-xl p-4 border border-white/5">
          <div className="text-xs text-slate-500 mb-1">{s.l}</div>
          <div className="text-xl font-bold text-white" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{s.v}</div>
          <div className="text-xs text-emerald-400 mt-1">{s.c}</div>
        </div>
      ))}
      <div className="col-span-3 bg-[#1E293B] rounded-xl p-4 border border-white/5">
        <div className="text-sm font-semibold text-white mb-3" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Headcount by Department</div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={hrData} barSize={28}>
            <XAxis dataKey="dept" tick={{fill:"#64748B",fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"#1E293B",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
            <Bar dataKey="headcount" fill="#2563EB" radius={[4,4,0,0]}/>
            <Bar dataKey="open" fill="#06B6D4" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CRMDash() {
  return (
    <div className="grid grid-cols-2 gap-4 p-5">
      <div className="bg-[#1E293B] rounded-xl p-4 border border-white/5">
        <div className="text-sm font-semibold text-white mb-4" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Sales Pipeline</div>
        <div className="space-y-3">
          {crmPipeline.map(p => (
            <div key={p.name}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">{p.name}</span>
                <span className="text-white font-semibold">{p.value} deals</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${(p.value/184)*100}%`, background: p.color}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[
          { l: "Pipeline Value", v: "$18.4M", badge: "+24% MoM" },
          { l: "Win Rate", v: "34.2%", badge: "+2.8pts" },
          { l: "Avg Deal Size", v: "$92K", badge: "Enterprise" },
          { l: "Avg Sales Cycle", v: "47 days", badge: "-6 days" },
        ].map(s => (
          <div key={s.l} className="bg-[#1E293B] rounded-xl p-3.5 border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{s.l}</div>
              <div className="text-lg font-bold text-white" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{s.v}</div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-lg text-blue-400 bg-blue-400/10">{s.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const dashMap: Record<string, React.ReactNode> = {
  finance: <FinanceDash />,
  inventory: <InventoryDash />,
  hr: <HRDash />,
  crm: <CRMDash />,
};

export function ProductShowcase() {
  const [active, setActive] = useState("finance");

  return (
    <section className="py-24 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(37,99,235,0.12),transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-5">
            Product Showcase
          </div>
          <h2 className="text-white mb-4">See It In Action</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Purpose-built dashboards for every business function — each connected, each contextual, each giving you the clarity to act fast.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active === t.id
                  ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        <div className="rounded-2xl border border-white/8 bg-[#1a2332] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          {/* Window chrome */}
          <div className="bg-[#0F172A] px-5 py-3 border-b border-white/5 flex items-center gap-3">
            <div className="flex gap-1.5">
              {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}}/>)}
            </div>
            <div className="flex-1 mx-4 h-6 bg-[#1E293B] rounded-lg flex items-center px-3">
              <span className="text-[10px] text-slate-500 font-mono">erp.gebetacloud.com/dashboard</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {dashMap[active]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
