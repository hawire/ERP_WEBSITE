import { Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="about" className="bg-[#0A0F1E] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30">
                <img src="/logo.png" alt="GebetaCloud / Integra ERP" className="w-9 h-9 object-cover" />
              </div>
              <div>
                <span className="text-white font-bold" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>GebetaCloud</span>
                <span className="text-[#2563EB] font-bold ml-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>ERP</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              One Platform. Complete Business Control. The enterprise ERP built for Africa and the modern world.
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-slate-500">
              <a href="mailto:test@integracnc.com" className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                <Mail size={13} /> test@integracnc.com
              </a>
              <div className="flex items-center gap-2 text-slate-500">
                <Phone size={13} /> +251941909521
              </div>
              <span className="flex items-center gap-2">
                <MapPin size={13} /> Addis Ababa, Ethiopia
              </span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © 2026 GebetaCloud Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {[
              { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/birhanu-b-alene" },
              { icon: Github, label: "GitHub", href: "http://www.github.com/BirhanuB123" },

            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-200 hover:bg-white/5 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
