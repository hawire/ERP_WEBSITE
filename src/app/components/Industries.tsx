import { motion } from "motion/react";
import { Factory, ShoppingBag, Truck, Heart, GraduationCap, Building2, UtensilsCrossed, Globe } from "lucide-react";

const industries = [
  { icon: Factory, label: "Manufacturing", desc: "Bill of materials, production planning, quality control" },
  { icon: ShoppingBag, label: "Retail", desc: "POS integration, inventory, loyalty programs" },
  { icon: Truck, label: "Distribution", desc: "Route planning, fleet management, delivery tracking" },
  { icon: Heart, label: "Healthcare", desc: "Patient management, compliance, medical billing" },
  { icon: GraduationCap, label: "Education", desc: "Student records, fee management, academic planning" },
  { icon: Building2, label: "Construction", desc: "Project costing, subcontractor management, BOQ" },
  { icon: UtensilsCrossed, label: "Hospitality", desc: "Reservations, housekeeping, revenue management" },
  { icon: Globe, label: "NGOs", desc: "Donor tracking, grant management, program reporting" },
];

export function Industries() {
  return (
    <section id="industries" className="py-24 bg-[#F8FAFC] dark:bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-5">
            Industry Solutions
          </div>
          <h2 className="text-[#0F172A] dark:text-white mb-4">
            Tailored for Your Industry
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Pre-configured workflows, reports, and compliance templates for 8+ industries — go live faster with less customization.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group bg-white dark:bg-[#111827] rounded-2xl p-6 border border-black/5 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E293B] group-hover:bg-gradient-to-br group-hover:from-[#2563EB] group-hover:to-[#1D4ED8] flex items-center justify-center transition-all duration-300 shadow-sm">
                <ind.icon
                  size={20}
                  className="text-[#2563EB] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h4 className="text-[#0F172A] dark:text-white text-base mb-1.5">{ind.label}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{ind.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
