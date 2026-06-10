export interface Submission {
  id: string;
  createdAt: string;
  type: "started" | "demo";
  name: string;
  email: string;
  company: string;
  phone: string;
  employees: string;
  industry: string;
  status: "new" | "contacted" | "qualified" | "closed";
  read: boolean;
}

export const SEED: Submission[] = [
  {
    id: "sub-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    type: "demo",
    name: "Amara Osei",
    email: "amara.osei@meridianmfg.com",
    company: "Meridian Manufacturing Ltd.",
    phone: "+233 20 456 7890",
    employees: "201 – 1,000 employees",
    industry: "Manufacturing",
    status: "qualified",
    read: true,
  },
  {
    id: "sub-002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    type: "started",
    name: "Fatima Al-Hassan",
    email: "f.alhassan@panafrica.co",
    company: "PanAfrica Distribution Group",
    phone: "+234 803 000 1234",
    employees: "1,000+ employees",
    industry: "Distribution",
    status: "contacted",
    read: true,
  },
  {
    id: "sub-003",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    type: "demo",
    name: "Dr. Kelechi Nduka",
    email: "knduka@apexhealthcare.ng",
    company: "Apex Healthcare Systems",
    phone: "+234 701 234 5678",
    employees: "51 – 200 employees",
    industry: "Healthcare",
    status: "new",
    read: false,
  },
  {
    id: "sub-004",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: "demo",
    name: "Yohannes Girma",
    email: "yohannes@bluenileconstruct.et",
    company: "Blue Nile Construction",
    phone: "+251 911 234 567",
    employees: "51 – 200 employees",
    industry: "Construction",
    status: "new",
    read: false,
  },
  {
    id: "sub-005",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    type: "started",
    name: "Chioma Eze",
    email: "chioma@retailhub.ng",
    company: "RetailHub Nigeria",
    phone: "+234 812 345 6789",
    employees: "1 – 50 employees",
    industry: "Retail",
    status: "closed",
    read: true,
  },
  {
    id: "sub-006",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    type: "demo",
    name: "Grace Mwangi",
    email: "grace.mwangi@africafingroup.ke",
    company: "Africa Finance Group",
    phone: "+254 722 888 000",
    employees: "201 – 1,000 employees",
    industry: "Financial Services",
    status: "qualified",
    read: true,
  },
  {
    id: "sub-007",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    type: "started",
    name: "Emmanuel Tesfaye",
    email: "emmanuel@addislogistics.et",
    company: "Addis Logistics PLC",
    phone: "+251 930 111 222",
    employees: "51 – 200 employees",
    industry: "Distribution",
    status: "contacted",
    read: true,
  },
];

export function loadSubmissions(): Submission[] {
  const stored: Submission[] = JSON.parse(localStorage.getItem("erp_submissions") ?? "[]");
  const merged = [...stored];
  for (const seed of SEED) {
    if (!merged.find(s => s.id === seed.id)) merged.push(seed);
  }
  return merged;
}

export function saveSubmissions(subs: Submission[]) {
  const fromStorage: Submission[] = JSON.parse(localStorage.getItem("erp_submissions") ?? "[]");
  // only persist user-created ones; update status/read for all
  const ids = new Set(fromStorage.map(s => s.id));
  const updated = fromStorage.map(s => subs.find(x => x.id === s.id) ?? s);
  // also update seed ones that may have changed
  localStorage.setItem("erp_submissions", JSON.stringify(updated));
}
