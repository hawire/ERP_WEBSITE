import { BarChart3, Users, Settings } from "lucide-react";

const pages: Record<string, { icon: typeof BarChart3; title: string; desc: string }> = {
  analytics: {
    icon: BarChart3,
    title: "Analytics",
    desc: "Submission trends, conversion rates, and lead source breakdowns will appear here.",
  },
  contacts: {
    icon: Users,
    title: "Contacts",
    desc: "All contacts extracted from submissions will be listed and manageable here.",
  },
  settings: {
    icon: Settings,
    title: "Settings",
    desc: "Configure form fields, email notifications, team members, and integrations here.",
  },
};

export function AnalyticsPage() { return <Placeholder id="analytics" />; }
export function ContactsPage() { return <Placeholder id="contacts" />; }
export function SettingsPage() { return <Placeholder id="settings" />; }

function Placeholder({ id }: { id: string }) {
  const page = pages[id];
  const Icon = page.icon;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Icon size={24} className="text-[#2563EB]" />
      </div>
      <h2 className="text-lg font-bold text-[#0F172A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {page.title}
      </h2>
      <p className="text-sm text-slate-500 max-w-xs">{page.desc}</p>
    </div>
  );
}
