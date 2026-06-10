import { motion } from "motion/react";
import { ArrowRight, TrendingUp, Package, Users, BarChart3, ShoppingCart } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 310000, target: 280000 },
  { month: "Feb", revenue: 340000, target: 300000 },
  { month: "Mar", revenue: 360000, target: 320000 },
  { month: "Apr", revenue: 395000, target: 360000 },
  { month: "May", revenue: 420000, target: 390000 },
  { month: "Jun", revenue: 468000, target: 420000 },
];

const kpis = [
  { label: "Total Revenue", value: "$4.68M", change: "+18.4%", up: true, icon: TrendingUp, color: "from-blue-500 to-blue-600" },
  { label: "Active Orders", value: "2,841", change: "+6.2%", up: true, icon: ShoppingCart, color: "from-cyan-500 to-cyan-600" },
  { label: "Inventory Items", value: "14,392", change: "-2.1%", up: false, icon: Package, color: "from-violet-500 to-violet-600" },
  { label: "Employees", value: "1,247", change: "+3.8%", up: true, icon: Users, color: "from-emerald-500 to-emerald-600" },
];

const pipeline = [
  { name: "Prospect", value: 42, color: "#2563EB" },
  { name: "Qualified", value: 28, color: "#06B6D4" },
  { name: "Proposal", value: 16, color: "#8B5CF6" },
  { name: "Closed", value: 14, color: "#10B981" },
];

const recentOrders = [
  { id: "PO-8821", vendor: "Sunrise Materials", amount: "$128,400", status: "Approved", date: "Jun 9" },
  { id: "PO-8820", vendor: "Atlas Logistics", amount: "$67,200", status: "Pending", date: "Jun 8" },
  { id: "PO-8819", vendor: "Delta Manufacturing", amount: "$245,000", status: "Approved", date: "Jun 7" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-white font-semibold">${(payload[0].value / 1000).toFixed(0)}K</p>
      </div>
    );
  }
  return null;
};

export function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0F172A]">
      {/* Background mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.25),transparent)]" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Trusted ERP for Modern Businesses
            </div>

            <h1 className="text-white mb-6" style={{ letterSpacing: "-0.03em" }}>
              Manage Your Entire Business From{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                One Intelligent Platform
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              GebetaCloud ERP integrates finance, inventory, HR, CRM, procurement, sales, and operations into one powerful cloud platform — built for the way modern enterprises work.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] text-white font-semibold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                Book a Demo
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-8">
              {[
                { v: "500+", l: "Enterprise Clients" },
                { v: "99.9%", l: "Uptime SLA" },

              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.v}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A] shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              {/* Dashboard header */}
              <div className="bg-[#1E293B] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  {["#EF4444", "#F59E0B", "#10B981"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </div>
                <div className="text-xs text-slate-500 mx-auto font-mono">erp.gebetacloud.com — Executive Dashboard</div>
              </div>

              <div className="p-5">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {kpis.map((k) => (
                    <div key={k.label} className="bg-[#1E293B] rounded-xl p-3.5 border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${k.color} flex items-center justify-center shadow-lg`}>
                          <k.icon size={14} className="text-white" />
                        </div>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${k.up ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                          {k.change}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{k.value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
                    </div>
                  ))}
                </div>

                {/* Revenue Chart */}
                <div className="bg-[#1E293B] rounded-xl p-4 border border-white/5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Revenue Analytics</div>
                      <div className="text-xs text-slate-500 mt-0.5">H1 2024 performance</div>
                    </div>
                    <div className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg font-semibold">+18.4% YoY</div>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fill="#2563EB" fillOpacity={0.15} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Pipeline */}
                  <div className="bg-[#1E293B] rounded-xl p-3.5 border border-white/5">
                    <div className="text-xs font-semibold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Sales Pipeline</div>
                    <div className="space-y-2">
                      {pipeline.map((p) => (
                        <div key={p.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{p.name}</span>
                            <span className="text-white font-medium">{p.value}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${p.value}%`, background: p.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-[#1E293B] rounded-xl p-3.5 border border-white/5">
                    <div className="text-xs font-semibold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Purchase Orders</div>
                    <div className="space-y-2.5">
                      {recentOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-medium text-white">{o.id}</div>
                            <div className="text-[10px] text-slate-500">{o.vendor}</div>
                          </div>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${o.status === "Approved" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}`}>
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
