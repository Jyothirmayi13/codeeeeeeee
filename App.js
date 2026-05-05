import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays,
  GitBranch, Wallet, Activity, Plus,
} from "lucide-react";

import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import Doctors from "@/pages/Doctors";
import TreeView from "@/pages/TreeView";
import Appointments from "@/pages/Appointments";
import Dues from "@/pages/Dues";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
axios.defaults.baseURL = API;

const NAV = [
  { to: "/",            label: "Dashboard",    icon: LayoutDashboard },
  { to: "/patients",    label: "Patients",     icon: Users },
  { to: "/appointments",label: "Appointments", icon: CalendarDays },
  { to: "/doctors",     label: "Doctors",      icon: Stethoscope },
  { to: "/tree",        label: "Priority Queue", icon: GitBranch },
  { to: "/dues",        label: "Due Payments", icon: Wallet },
];

function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-slate-200 bg-white"
           data-testid="app-sidebar">
      <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-200">
        <div className="h-10 w-10 rounded-xl bg-teal-600 text-white grid place-items-center shadow-sm">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="font-heading text-lg leading-tight text-slate-900">MediTree</div>
          <div className="text-xs text-slate-500">Smart Scheduling System</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-800 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      {/* No watermark or branding footer */}
    </aside>
  );
}

function Topbar() {
  const loc = useLocation();
  const cur = NAV.find((n) => n.to === loc.pathname) || NAV[0];
  const Icon = cur.icon;
  return (
    <header className="h-20 px-6 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="md:hidden h-10 w-10 rounded-xl bg-teal-600 text-white grid place-items-center">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-slate-900">
            <Icon className="h-4 w-4 text-teal-700" />
            <span className="font-heading text-xl">{cur.label}</span>
          </div>
          <div className="text-xs text-slate-500">Patient Appointment Scheduling System</div>
        </div>
      </div>
      <NavLink
        to="/patients?new=1"
        className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-800 transition"
        data-testid="topbar-new-patient-btn"
      >
        <Plus className="h-4 w-4" /> New Patient
      </NavLink>
    </header>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#f5f8f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => { axios.get("/").catch(() => {}); }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/tree" element={<TreeView />} />
            <Route path="/dues" element={<Dues />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
