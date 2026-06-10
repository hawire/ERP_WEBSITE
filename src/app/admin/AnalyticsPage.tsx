import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { TrendingUp, Users, CheckCircle2, Clock, FileText, BarChart3 } from "lucide-react";

const COLORS = ["#2563EB", "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6", "#F43F5E", "#EC4899", "#14B8A6"];

function kpiCard(label: string, value: string | number, sub: string, Icon: React.ElementType, color: string) {
  return (
    <div key={label} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center`} style={{ background: color + "20" }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-[#0F172A] mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

export function AnalyticsPage() {
  const [subs, setSubs] = useState([] as any[]);

  useEffect(() => {
    async function fetchSubs() {
      try {
        const res = await fetch("/api/admin/submissions");
        const data = await res.json();
        setSubs(Array.isArray(data.submissions) ? data.submissions : []);
      } catch (error) {
        console.error("Unable to load submission analytics:", error);
      }
    }
    fetchSubs();
  }, []);

  const total = subs.length;
  const demos = subs.filter(s => s.type === "demo").length;
  const qualified = subs.filter(s => s.status === "qualified").length;
  const convRate = total > 0 ? Math.round((qualified / total) * 100) : 0;

  // By status
  const byStatus = ["new", "contacted", "qualified", "closed"].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: subs.filter(x => x.status === s).length,
  }));

  // By industry
  const industryMap: Record<string, number> = {};
  subs.forEach(s => { if (s.industry) industryMap[s.industry] = (industryMap[s.industry] ?? 0) + 1; });
  const byIndustry = Object.entries(industryMap).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

  // By type
  const byType = [
    { name: "Demo Request", value: demos },
    { name: "Get Started", value: total - demos },
  ];

  // By size
  const sizeMap: Record<string, number> = {};
  subs.forEach(s => { if (s.employees) sizeMap[s.employees] = (sizeMap[s.employees] ?? 0) + 1; });
  const bySize = Object.entries(sizeMap).map(([name, count]) => ({ name, count }));

  // Simulated trend (last 7 days based on createdAt)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const trend = days.map(d => ({
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
    submissions: subs.filter(s => {
      const sd = new Date(s.createdAt);
      return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth() && sd.getDate() === d.getDate();
    }).length,
  }));

  const tipStyle = { background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12, color: "#fff" };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Analytics Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Submission and conversion data across all demo requests</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiCard("Total Submissions", total, "All time", FileText, "#2563EB")}
          {kpiCard("Demo Requests", demos, `${total - demos} Get Started`, BarChart3, "#06B6D4")}
          {kpiCard("Qualified Leads", qualified, `${convRate}% conversion`, CheckCircle2, "#10B981")}
          {kpiCard("Avg. Response", "< 4h", "Business hours", Clock, "#F59E0B")}
        </div>

        {/* Trend + By status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Submissions (Last 7 Days)</h3>
                <p className="text-xs text-slate-400">Daily submission volume</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tipStyle} />
                <Line type="monotone" dataKey="submissions" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: "#2563EB", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Pipeline by Status</h3>
            <div className="space-y-3">
              {byStatus.map((s, i) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">{s.name}</span>
                    <span className="font-bold text-[#0F172A]">{s.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: total > 0 ? `${(s.count / total) * 100}%` : "0%", background: COLORS[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* By industry + by type */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Leads by Industry</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={byIndustry} barSize={20} layout="vertical">
                <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={tipStyle} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {byIndustry.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Request Type Split</h3>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={byType} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${Math.round(percent * 100)}%`} labelLine={false} fontSize={10}>
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={tipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {byType.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    {t.name}
                  </span>
                  <span className="font-bold text-[#0F172A]">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
