import { Outlet, NavLink, useNavigate, Navigate } from "react-router";
import { useState } from "react";
import { FileText, Users, Settings, Bell, LogOut, ExternalLink, BarChart3, Menu, X, ChevronDown, Mail } from "lucide-react";

const navItems = [
  { to: "/admin", icon: FileText, label: "Submissions", end: true },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics", end: false },
  { to: "/admin/contacts", icon: Users, label: "Contacts", end: false },
  { to: "/admin/settings", icon: Settings, label: "Settings", end: false },
];

function getAuth() {
  try { return JSON.parse(localStorage.getItem("erp_auth") ?? "null"); } catch { return null; }
}

export function AdminLayout() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!auth?.loggedIn) return <Navigate to="/admin/login" replace />;

  function signOut() {
    localStorage.removeItem("erp_auth");
    navigate("/admin/login");
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className={`flex-shrink-0 flex flex-col bg-white border-r border-black/5 transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"}`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-black/5 gap-2.5 flex-shrink-0">
          <img src="/logo.png" alt="GebetaCloud / Integra ERP" className="w-7 h-7 rounded-md object-cover flex-shrink-0" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <span className="text-[#0F172A] font-bold text-sm tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>GebetaCloud</span>
              <span className="text-[#2563EB] font-bold text-sm ml-0.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>ERP</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
            {sidebarOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>

        {/* Form selector */}
        {sidebarOpen && (
          <div className="px-3 py-3 border-b border-black/5">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText size={11} className="text-blue-600" />
              </div>
              <span className="text-slate-700 font-medium truncate text-xs">Demo Requests</span>
              <ChevronDown size={12} className="ml-auto text-slate-400 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}>
              {({ isActive }) => (
                <>
                  <item.icon size={16} className={isActive ? "text-[#2563EB]" : "text-slate-400"} />
                  {sidebarOpen && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-black/5 flex flex-col gap-0.5">
          {sidebarOpen && (
            <div className="px-3 py-2 mb-1">
              <p className="text-xs font-semibold text-slate-700 truncate">{auth.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{auth.email}</p>
            </div>
          )}
          <button onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
            <ExternalLink size={16} className="text-slate-400" />
            {sidebarOpen && <span>View Website</span>}
          </button>
          <button onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={16} className="text-slate-400" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-black/5 flex items-center px-6 gap-4 flex-shrink-0">
          <h1 className="text-sm font-semibold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            GebetaCloud ERP — Admin
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={signOut} title="Click to sign out">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="/logo.png" alt="logo" className="w-8 h-8 object-cover" />
              </div>
              {sidebarOpen && <span className="text-xs text-slate-600 font-medium hidden lg:block">{auth.name}</span>}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
