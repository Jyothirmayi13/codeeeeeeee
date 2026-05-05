import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, fmtDT, priorityBadge } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search, X, History } from "lucide-react";
import PatientFormDialog from "../components/PatientFormDialog";
import PatientDetailsDialog from "../components/PatientDetailsDialog";

export default function Patients() {
  const loc = useLocation();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors]   = useState([]);
  const [search, setSearch]     = useState("");
  const [fDoctor, setFDoctor]   = useState("all");
  const [fPriority, setFPriority] = useState("all");
  const [fStatus, setFStatus]   = useState("all");

  const [formOpen, setFormOpen]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  const load = () => api.patients().then(setPatients);
  useEffect(() => {
    load();
    api.doctors().then(setDoctors);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(loc.search);
    if (q.get("new") === "1") { setEditing(null); setFormOpen(true); }
  }, [loc.search]);

  const filtered = useMemo(() => {
    return patients.filter(p => {
      if (fDoctor   !== "all" && p.doctor_id !== fDoctor)  return false;
      if (fPriority !== "all" && p.priority  !== fPriority) return false;
      if (fStatus   !== "all" && p.status    !== fStatus)   return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = `${p.name} ${p.patient_code} ${p.disease} ${p.doctor_name}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [patients, search, fDoctor, fPriority, fStatus]);

  const onDelete = async (p) => {
    if (!window.confirm(`Remove ${p.name} from the system? This cannot be undone.`)) return;
    await api.deletePatient(p.id);
    toast.success("Patient removed");
    load();
  };

  const onCancel = async (p) => {
    await api.cancel(p.id);
    toast.success("Appointment cancelled");
    load();
  };

  return (
    <div className="space-y-4" data-testid="patients-page">
      <Card className="p-4 rounded-2xl border-slate-200">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, ID, diagnosis, doctor..."
              className="pl-9"
              data-testid="patient-search-input"
            />
          </div>

          <Select value={fDoctor} onValueChange={setFDoctor}>
            <SelectTrigger className="w-[220px]" data-testid="filter-doctor">
              <SelectValue placeholder="All doctors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All doctors</SelectItem>
              {doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={fPriority} onValueChange={setFPriority}>
            <SelectTrigger className="w-[160px]" data-testid="filter-priority">
              <SelectValue placeholder="All urgency levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All urgency levels</SelectItem>
              <SelectItem value="High">High — Emergency</SelectItem>
              <SelectItem value="Medium">Medium — Urgent</SelectItem>
              <SelectItem value="Low">Low — Routine</SelectItem>
            </SelectContent>
          </Select>

          <Select value={fStatus} onValueChange={setFStatus}>
            <SelectTrigger className="w-[160px]" data-testid="filter-status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            className="bg-teal-700 hover:bg-teal-800"
            data-testid="add-patient-btn"
          >
            <Plus className="h-4 w-4 mr-1" /> Register Patient
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl border-slate-200 overflow-hidden">
        <Table data-testid="patients-table">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Balance Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="empty-state">No patients match the current filters.</div>
                </TableCell>
              </TableRow>
            ) : filtered.map(p => (
              <TableRow
                key={p.id}
                className={`row-click ${p.priority === "High" && p.status === "Scheduled" ? "emergency-row" : ""}`}
                onClick={() => setDetailsId(p.id)}
                data-testid={`patient-row-${p.patient_code}`}
              >
                <TableCell className="font-mono text-xs text-slate-500">{p.patient_code}</TableCell>
                <TableCell>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.gender} · {p.age}y</div>
                </TableCell>
                <TableCell>{p.doctor_name}</TableCell>
                <TableCell className="max-w-[180px] truncate">{p.disease}</TableCell>
                <TableCell className="text-sm">{fmtDT(p.appointment_at)}</TableCell>
                <TableCell>
                  <Badge className={`border ${priorityBadge(p.priority)}`} variant="outline">{p.priority}</Badge>
                </TableCell>
                <TableCell>{p.due_amount > 0 ? <span className="text-rose-600 font-medium">₹{p.due_amount}</span> : <span className="text-slate-400">—</span>}</TableCell>
                <TableCell>
                  <Badge variant="outline"
                    className={p.status === "Scheduled" ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                        : "border-slate-200 bg-slate-50 text-slate-500"}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" title="Edit record"
                            onClick={() => { setEditing(p); setFormOpen(true); }}
                            data-testid={`edit-btn-${p.patient_code}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {p.status === "Scheduled" && (
                      <Button size="icon" variant="ghost" title="Cancel appointment"
                              onClick={() => onCancel(p)}
                              data-testid={`cancel-btn-${p.patient_code}`}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" title="View history"
                            onClick={() => setDetailsId(p.id)}
                            data-testid={`history-btn-${p.patient_code}`}>
                      <History className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Delete record"
                            onClick={() => onDelete(p)}
                            data-testid={`delete-btn-${p.patient_code}`}>
                      <Trash2 className="h-4 w-4 text-rose-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <PatientFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        patient={editing}
        doctors={doctors}
        onSaved={() => { load(); setFormOpen(false); }}
      />
      <PatientDetailsDialog
        patientId={detailsId}
        onClose={() => setDetailsId(null)}
        onChanged={load}
      />
    </div>
  );
}
