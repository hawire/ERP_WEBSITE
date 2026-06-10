import { motion } from "motion/react";
import { BarChart2, Cloud, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: BarChart2,
    title: "Real-Time Analytics",
    desc: "Live dashboards with drill-down capabilities across every business unit. From executive KPIs to operational details — the data you need, exactly when you need it.",
    gradient: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20",
    stat: "200+ Reports",
  },
  {
    icon: Cloud,
    title: "Cloud-Based Access",
    desc: "Access your full ERP from anywhere — browser, tablet, or mobile. Multi-tenant SaaS architecture with automatic updates and zero infrastructure management.",
    gradient: "from-cyan-500 to-cyan-600",
    glow: "shadow-cyan-500/20",
    stat: "99.9% Uptime",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    desc: "ISO 27001 certified, SOC 2 Type II compliant. End-to-end encryption, role-based access control, audit trails, and data residency options for regulated industries.",
    gradient: "from-emerald-500 to-emerald-600",
    glow: "shadow-emerald-500/20",
    stat: "ISO 27001",
  },
  {
    icon: Zap,
    title: "Automation & Workflows",
    desc: "Visual workflow builder, rules engine, and intelligent automation that eliminates repetitive tasks. Connect to 300+ apps via native integrations and open APIs.",
    gradient: "from-violet-500 to-violet-600",
    glow: "shadow-violet-500/20",
    stat: "300+ Integrations",
  },
];

export function WhyChoose() {
  return (
    <section id="solutions" className="py-24 bg-white dark:bg-[#080D1A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-5">
              Why GebetaCloud ERP
            </div>
            <h2 className="text-[#0F172A] dark:text-white mb-6">
              Built for Enterprise Scale.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Priced for Growth.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
              GebetaCloud ERP is engineered for the demands of high-growth businesses — from 50-person SMEs to multinational enterprises managing thousands of transactions daily.
            </p>
            <div className="flex flex-col gap-4">
              {["No infrastructure management", "Unlimited user scaling", "24/7 enterprise support", "African  compliance built-in"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8FAFC] dark:bg-[#111827] rounded-2xl p-5 border border-black/5 dark:border-white/5 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} shadow-lg ${f.glow} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={18} className="text-white" />
                </div>
                <div className="text-xs font-bold text-[#2563EB] dark:text-blue-400 mb-1">{f.stat}</div>
                <h4 className="text-[#0F172A] dark:text-white mb-2 text-base">{f.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
