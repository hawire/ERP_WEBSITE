import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router";

const navLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "Modules", href: "#modules" },
  { label: "Industries", href: "#industries" },
  { label: "About", href: "#about" },
];

export function Navbar({ darkMode, setDarkMode, onBookDemo }: { darkMode: boolean; setDarkMode: (v: boolean) => void; onBookDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 dark:bg-[#0A0F1E]/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-black/5 dark:border-white/5"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
              <img src="/logo.png" alt="GebetaCloud / Integra ERP" className="w-9 h-9 rounded-md object-cover" />
            </div>
            <div>
              <span className="text-[#0F172A] dark:text-white font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                GebetaCloud
              </span>
              <span className="text-[#2563EB] font-bold tracking-tight ml-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                ERP
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="flex items-center gap-0.5 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] font-medium transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </button>
            <button
              onClick={onBookDemo}
              className="text-sm px-5 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Book Demo
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0A0F1E] border-t border-black/5 dark:border-white/5 shadow-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-slate-700 dark:text-slate-300 hover:text-[#2563EB] font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
              <button onClick={() => { setMobileOpen(false); onBookDemo(); }} className="text-center py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-lg shadow-blue-500/20">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
