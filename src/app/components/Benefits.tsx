import { motion } from "motion/react";
import { Zap, TrendingDown, Eye, Globe, Database, Rocket } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Increase Productivity",
    desc: "Automated workflows eliminate repetitive manual tasks. Employees spend time on strategic work, not data entry. Average 40% reduction in administrative overhead.",
    stat: "40%",
    statLabel: "less admin time",
  },
  {
    icon: TrendingDown,
    title: "Reduce Operational Costs",
    desc: "Eliminate redundant systems, reduce error-related rework, and optimize procurement through competitive bidding and spend analytics.",
    stat: "28%",
    statLabel: "cost reduction",
  },
  {
    icon: Eye,
    title: "Better Decision Making",
    desc: "Real-time data across every department means executives make decisions on current information, not last week's spreadsheet export.",
    stat: "3x",
    statLabel: "faster reporting",
  },
  {
    icon: Globe,
    title: "End-to-End Visibility",
    desc: "Track every order, invoice, asset, and employee in one place. Full audit trails, cross-module traceability, and zero blind spots.",
    stat: "100%",
    statLabel: "traceability",
  },
  {
    icon: Database,
    title: "Centralized Data",
    desc: "Single source of truth eliminates data conflicts between departments. One system, one version of the truth, synchronized in real time.",
    stat: "1",
    statLabel: "source of truth",
  },
  {
    icon: Rocket,
    title: "Faster Business Growth",
    desc: "Onboard new business units, countries, and legal entities without re-implementing. Scale operations on the same platform as you grow.",
    stat: "2x",
    statLabel: "faster scaling",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-white dark:bg-[#080D1A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-5">
            Measurable Business Impact
          </div>
          <h2 className="text-[#0F172A] dark:text-white mb-4">
            The ROI You Can Count On
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            GebetaCloud ERP customers consistently report measurable improvements across every area of the business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-[#F8FAFC] dark:bg-[#111827] rounded-2xl p-7 border border-black/5 dark:border-white/5 hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 bg-[#EFF6FF] dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                    <b.icon size={18} className="text-[#2563EB]" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#2563EB]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em" }}>{b.stat}</div>
                    <div className="text-xs text-slate-400">{b.statLabel}</div>
                  </div>
                </div>
                <h4 className="text-[#0F172A] dark:text-white mb-2">{b.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
