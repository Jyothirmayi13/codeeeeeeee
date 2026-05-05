import { useEffect, useState } from "react";
import { api, fmtDT, priorityBadge } from "../lib/api";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Users, CalendarCheck, Siren, Wallet, GitBranch, ArrowUpRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, accent, testid }) => (
  <div className="stat-card" data-testid={testid}>
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
        <div className="mt-2 font-heading text-3xl text-slate-900">{value ?? "—"}</div>
      </div>
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [today, setToday]   = useState([]);

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
    api.today().then(setToday).catch(() => {});
  }, []);

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="live-dot" /> Live patient queue — {stats?.tree_size ?? 0} active patients, queue depth {stats?.tree_height ?? 0}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}        label="Total Patients"   value={stats?.total_patients}   accent="bg-teal-50 text-teal-700"   testid="stat-total"/>
        <StatCard icon={CalendarCheck} label="Today"           value={stats?.today_appointments} accent="bg-sky-50 text-sky-700"    testid="stat-today"/>
        <StatCard icon={Siren}         label="Emergency"       value={stats?.emergency_cases}   accent="bg-rose-50 text-rose-700"   testid="stat-emergency"/>
        <StatCard icon={Wallet}        label="Total Dues"      value={stats ? `₹${stats.total_due.toLocaleString()}` : null} accent="bg-amber-50 text-amber-700" testid="stat-dues"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-slate-200" data-testid="today-appointments-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-heading text-xl">Today's Appointments</div>
              <div className="text-sm text-slate-500">Sorted by urgency — emergency cases first, then by time</div>
            </div>
            <NavLink to="/appointments" className="text-sm text-teal-700 hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </NavLink>
          </div>
          {today.length === 0 ? (
            <div className="empty-state">No appointments scheduled for today.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {today.slice(0, 8).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{p.name}
                      <span className="text-xs text-slate-400 font-mono ml-2">{p.patient_code}</span>
                    </div>
                    <div className="text-sm text-slate-500">{p.disease} · {p.doctor_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-700">{fmtDT(p.appointment_at)}</div>
                    <Badge className={`mt-1 border ${priorityBadge(p.priority)}`} variant="outline">
                      {p.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 rounded-2xl border-slate-200" data-testid="tree-stats-card">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-teal-700" />
            <div className="font-heading text-xl">Scheduling Engine</div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Auto-priority smart queue</p>

          <div className="mt-5 space-y-3">
            <Row k="Active patients"     v={stats?.tree_size ?? 0} />
            <Row k="Queue depth"         v={stats?.tree_height ?? 0} />
            <Row k="Max search steps"    v={Math.ceil(Math.log2((stats?.tree_size || 1) + 1))} />
            <Row k="Scheduled"           v={stats?.scheduled ?? 0} />
          </div>

          <NavLink
            to="/tree"
            className="mt-6 inline-flex items-center gap-2 text-sm text-teal-700 hover:underline"
            data-testid="view-tree-link"
          >
            View priority queue <ArrowUpRight className="h-3.5 w-3.5" />
          </NavLink>
        </Card>
      </div>
    </div>
  );
}

const Row = ({ k, v }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{k}</span>
    <span className="font-medium text-slate-900">{v}</span>
  </div>
);
