import { useEffect, useState } from "react";
import { api, fmtDT, priorityBadge } from "../lib/api";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Stethoscope, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [appts, setAppts] = useState([]);
  const [checkAt, setCheckAt] = useState("");
  const [avail, setAvail] = useState(null);

  useEffect(() => {
    api.doctors().then((ds) => {
      setDoctors(ds);
      if (ds.length) setSelected(ds[0]);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.doctorAppts(selected.id).then(setAppts);
    setAvail(null);
    setCheckAt("");
  }, [selected]);

  const check = async () => {
    if (!checkAt || !selected) return;
    const iso = new Date(checkAt).toISOString();
    const r = await api.doctorAvail(selected.id, iso);
    setAvail(r);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6" data-testid="doctors-page">
      <Card className="p-4 rounded-2xl border-slate-200 lg:col-span-1">
        <div className="font-heading text-lg">Medical Staff</div>
        <div className="mt-3 space-y-2">
          {doctors.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selected?.id === d.id
                  ? "border-teal-400 bg-teal-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
              data-testid={`doctor-card-${d.name.replace(/\s+/g, "-")}`}
            >
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-slate-100 grid place-items-center">
                  <Stethoscope className="h-4 w-4 text-teal-700" />
                </div>
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.specialty}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        {selected && (
          <>
            <Card className="p-5 rounded-2xl border-slate-200">
              <div className="font-heading text-xl">{selected.name}</div>
              <div className="text-sm text-slate-500">{selected.specialty}</div>

              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Weekly Schedule</div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {DAYS.map((d, i) => {
                    const s = selected.schedule?.[String(i)] || [];
                    return (
                      <div key={d} className={`p-2 rounded-lg text-xs border ${s.length ? "bg-teal-50 border-teal-200 text-teal-800" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                        <div className="font-semibold">{d}</div>
                        <div>{s.length ? `${s[0]}–${s[1]}` : "Off"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl border border-slate-200 bg-white">
                <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-700" /> Check appointment slot
                </div>
                <div className="mt-2 flex gap-2">
                  <Input type="datetime-local" value={checkAt}
                         onChange={(e) => setCheckAt(e.target.value)}
                         data-testid="availability-input" />
                  <Button onClick={check} className="bg-teal-700 hover:bg-teal-800"
                          data-testid="availability-check-btn">Check</Button>
                </div>
                {avail && (
                  <div className="mt-3 text-sm p-3 rounded-lg border"
                       style={{ borderColor: avail.available ? "#a7f3d0" : "#fecaca",
                                background: avail.available ? "#ecfdf5" : "#fef2f2" }}>
                    <div className="flex items-center gap-2">
                      {avail.available
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        : <AlertTriangle className="h-4 w-4 text-rose-600" />}
                      <span className={avail.available ? "text-emerald-700 font-medium" : "text-rose-700 font-medium"}>
                        {avail.available
                          ? "Slot is available — doctor is free"
                          : avail.within_working_hours
                          ? "Slot is already booked by another patient"
                          : "Doctor is not on duty at this time"}
                      </span>
                    </div>
                    {avail.conflicts?.length > 0 && (
                      <ul className="mt-1 text-rose-700 list-disc ml-5">
                        {avail.conflicts.map((c, i) => (
                          <li key={i}>Existing booking: {c.name} ({c.patient_code}) at {fmtDT(c.appointment_at)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border-slate-200">
              <div className="font-heading text-xl">Upcoming Appointments</div>
              <div className="text-sm text-slate-500">Sorted by date and time</div>
              <div className="mt-3 divide-y divide-slate-100">
                {appts.length === 0
                  ? <div className="empty-state">No upcoming appointments for this doctor.</div>
                  : appts.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{p.name}
                          <span className="ml-2 text-xs text-slate-400 font-mono">{p.patient_code}</span>
                        </div>
                        <div className="text-sm text-slate-500">{p.disease}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-700">{fmtDT(p.appointment_at)}</div>
                        <Badge className={`mt-1 border ${priorityBadge(p.priority)}`} variant="outline">{p.priority}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
