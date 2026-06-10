import { motion } from "motion/react";

const companies = [
  { name: "Safaricom", width: 110 },
  { name: "Abyssina Bank", width: 100 },
  { name: "EthioTelecom", width: 120 },
  { name: "Dangote Group", width: 115 },
  { name: "KCB Group", width: 85 },
  { name: "Anbesa Bank", width: 90 },
];

function CompanyLogo({ name, width }: { name: string; width: number }) {
  return (
    <div
      className="flex items-center justify-center px-6 py-3 opacity-40 hover:opacity-70 transition-opacity duration-300"
      style={{ minWidth: width + 48 }}
    >
      <div
        className="h-6 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold tracking-widest text-xs uppercase"
        style={{ width, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.12em" }}
      >
        {name}
      </div>
    </div>
  );
}

export function TrustedBy() {
  return (
    <section className="py-16 bg-white dark:bg-[#080D1A] border-y border-black/5 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 text-center">
        <p className="text-sm text-slate-400 tracking-widest uppercase font-semibold">
          Trusted by industry leaders across Africa
        </p>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...companies, ...companies].map((c, i) => (
            <CompanyLogo key={i} name={c.name} width={c.width} />
          ))}
        </div>
        <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap" aria-hidden>
          {[...companies, ...companies].map((c, i) => (
            <CompanyLogo key={i + 1000} name={c.name} width={c.width} />
          ))}
        </div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-[#080D1A] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-[#080D1A] to-transparent" />
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
