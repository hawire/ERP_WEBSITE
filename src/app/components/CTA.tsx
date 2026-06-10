import { motion } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";

const OWNER_EMAIL = "test@integracnc.com";

export function CTA({ onScheduleDemo }: { onScheduleDemo: () => void }) {
  return (
    <section className="py-24 bg-[#0F172A] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(37,99,235,0.2),transparent)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Get Started Today
          </div>

          <h2 className="text-white mb-6">
            Ready to Transform Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Business Operations?
            </span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Join 500+ enterprises already running on GebetaCloud ERP. Our team will assess your needs and design a migration plan that minimizes disruption and maximizes ROI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onScheduleDemo}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[14px] text-white font-semibold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Schedule Demo
              <ArrowRight size={16} />
            </button>
            <a
              href={`mailto:${OWNER_EMAIL}?subject=GebetaCloud ERP Inquiry`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[14px] text-white font-semibold border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
            >
              <Phone size={15} />
              Contact Sales
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
            {["No credit card", "Implementation support", "Dedicated onboarding"].map(item => (
              <span key={item} className="flex items-center gap-2">
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3 3 7-7" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
