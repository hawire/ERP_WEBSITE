import { motion } from "motion/react";
import { DollarSign, Package, Users, Briefcase, ShoppingCart, TrendingUp, Factory, FolderKanban, Cpu, BarChart3, ArrowRight } from "lucide-react";

const modules = [
  {
    icon: DollarSign,
    title: "Accounting & Finance",
    desc: "Multi-currency ledger, automated reconciliation, tax compliance, and real-time P&L reporting across all entities.",
    color: "blue",
    gradient: "from-blue-500/10 to-blue-600/5",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    border: "group-hover:border-blue-500/30",
  },
  {
    icon: Package,
    title: "Inventory Management",
    desc: "Real-time stock tracking, multi-warehouse control, automated reorder points, and full batch/lot traceability.",
    color: "violet",
    gradient: "from-violet-500/10 to-violet-600/5",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
    border: "group-hover:border-violet-500/30",
  },
  {
    icon: Briefcase,
    title: "CRM",
    desc: "Pipeline management, lead scoring, customer lifecycle tracking, and integrated sales forecasting with AI insights.",
    color: "cyan",
    gradient: "from-cyan-500/10 to-cyan-600/5",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-500",
    border: "group-hover:border-cyan-500/30",
  },
  {
    icon: Users,
    title: "HR & Payroll",
    desc: "Employee onboarding, attendance, leave management, payroll automation, and performance review workflows.",
    color: "emerald",
    gradient: "from-emerald-500/10 to-emerald-600/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    border: "group-hover:border-emerald-500/30",
  },
  {
    icon: ShoppingCart,
    title: "Procurement",
    desc: "Vendor management, purchase requisitions, three-way matching, contract lifecycle, and supplier scorecards.",
    color: "amber",
    gradient: "from-amber-500/10 to-amber-600/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
    border: "group-hover:border-amber-500/30",
  },
  {
    icon: TrendingUp,
    title: "Sales Management",
    desc: "Quotations, order management, delivery tracking, invoicing, and territory-based commission calculation.",
    color: "rose",
    gradient: "from-rose-500/10 to-rose-600/5",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500",
    border: "group-hover:border-rose-500/30",
  },
  {
    icon: Factory,
    title: "Manufacturing",
    desc: "Bill of materials, production scheduling, work orders, quality control, and shop floor management.",
    color: "indigo",
    gradient: "from-indigo-500/10 to-indigo-600/5",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-500",
    border: "group-hover:border-indigo-500/30",
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    desc: "Gantt charts, resource allocation, budget tracking, milestone planning, and collaborative task management.",
    color: "teal",
    gradient: "from-teal-500/10 to-teal-600/5",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-500",
    border: "group-hover:border-teal-500/30",
  },
  {
    icon: Cpu,
    title: "Asset Management",
    desc: "Fixed asset register, depreciation schedules, maintenance tracking, and asset lifecycle optimization.",
    color: "orange",
    gradient: "from-orange-500/10 to-orange-600/5",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-500",
    border: "group-hover:border-orange-500/30",
  },
  {
    icon: BarChart3,
    title: "Reporting & Analytics",
    desc: "Custom dashboards, 200+ built-in reports, ad-hoc queries, scheduled exports, and executive BI views.",
    color: "pink",
    gradient: "from-pink-500/10 to-pink-600/5",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-500",
    border: "group-hover:border-pink-500/30",
  },
];

export function Modules() {
  return (
    <section id="modules" className="py-24 bg-[#F8FAFC] dark:bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-5">
            10 Integrated Modules
          </div>
          <h2 className="text-[#0F172A] dark:text-white mb-4">
            Everything Your Business Needs,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Fully Connected</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Each module works seamlessly with every other — no data silos, no manual reconciliation, no integration headaches.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {modules.slice(0, 8).map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`group relative bg-white dark:bg-[#111827] rounded-2xl p-6 border border-black/5 dark:border-white/5 ${m.border} hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className={`w-11 h-11 ${m.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <m.icon size={20} className={m.iconColor} />
                </div>
                <h4 className="text-[#0F172A] dark:text-white mb-2">{m.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${m.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
          {/* Last 2 span full on xl */}
          {modules.slice(8).map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 8) * 0.06 }}
              className={`group relative bg-white dark:bg-[#111827] rounded-2xl p-6 border border-black/5 dark:border-white/5 ${m.border} hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden sm:col-span-1`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className={`w-11 h-11 ${m.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <m.icon size={20} className={m.iconColor} />
                </div>
                <h4 className="text-[#0F172A] dark:text-white mb-2">{m.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${m.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
