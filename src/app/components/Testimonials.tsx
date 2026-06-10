import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amare Belachew",
    title: "CFO, Meridian Manufacturing Ltd.",
    avatar: "AO",
    color: "from-blue-500 to-blue-600",
    stars: 5,
    quote:
      "GebetaCloud ERP transformed how we manage our 3-plant operation. Financial close that used to take 12 days now takes 3. The multi-currency consolidation alone saved us 80 hours a month. It's the best technology decision we've made in a decade.",
    metric: "12 → 3 days financial close",
  },
  {
    name: "Fatima Al-Hassan",
    title: "CEO, PanAfrica Distribution Group",
    avatar: "FH",
    color: "from-violet-500 to-violet-600",
    stars: 5,
    quote:
      "We evaluated SAP, Oracle, and Microsoft Dynamics. GebetaCloud matched the functionality at a fraction of the cost, with local implementation support that actually understood our business context. Our inventory accuracy went from 74% to 98.5% in 6 months.",
    metric: "74% → 98.5% inventory accuracy",
  },
  {
    name: "Dr. Kaleab Negash",
    title: "Director of Operations, Apex Healthcare Systems",
    avatar: "KN",
    color: "from-emerald-500 to-emerald-600",
    stars: 4,
    quote:
      "Healthcare compliance is non-negotiable. GebetaCloud ERP came pre-configured for our regulatory requirements, had us live in 11 weeks, and the audit trail capabilities have been invaluable during our NHIS accreditation review.",
    metric: "11-week implementation",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#F8FAFC] dark:bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-5">
            Customer Stories
          </div>
          <h2 className="text-[#0F172A] dark:text-white mb-4">
            Trusted by Business Leaders
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Hear from the finance chiefs, CEOs, and operations directors who made the switch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-[#111827] rounded-2xl p-7 border border-black/5 dark:border-white/5 hover:shadow-2xl hover:shadow-black/8 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </p>

              {/* Metric pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EFF6FF] dark:bg-blue-500/10 mb-6 self-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400">{t.metric}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-black/5 dark:border-white/5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{t.avatar}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F172A] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{t.name}</div>
                  <div className="text-xs text-slate-500">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
