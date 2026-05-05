import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { api } from "../lib/api";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

const emptyForm = {
  patient_code: "", name: "", age: 25, gender: "Male", disease: "",
  doctor_id: "", appointment_at: "", priority: "Low",
  fees_paid: 0, due_amount: 0, height_cm: 0, weight_kg: 0,
};

export default function PatientFormDialog({ open, onClose, patient, doctors, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({
        ...emptyForm, ...patient,
        appointment_at: patient.appointment_at
          ? patient.appointment_at.slice(0, 16)
          : "",
      });
    } else {
      setForm(emptyForm);
    }
    setAvailability(null);
  }, [patient, open]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!form.doctor_id || !form.appointment_at) { setAvailability(null); return; }
    const iso = new Date(form.appointment_at).toISOString();
    setChecking(true);
    api.doctorAvail(form.doctor_id, iso)
      .then((r) => setAvailability(r))
      .catch(() => setAvailability(null))
      .finally(() => setChecking(false));
  }, [form.doctor_id, form.appointment_at]);

  const submit = async () => {
    if (!form.name || !form.doctor_id || !form.appointment_at || !form.disease) {
      toast.error("Please fill name, disease, doctor and appointment time");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        appointment_at: new Date(form.appointment_at).toISOString(),
        age: Number(form.age),
        fees_paid: Number(form.fees_paid),
        due_amount: Number(form.due_amount),
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
      };
      if (patient) {
        await api.updatePatient(patient.id, body);
        toast.success("Patient record updated");
      } else {
        await api.addPatient(body);
        toast.success("Patient registered and added to schedule");
      }
      onSaved();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl" data-testid="patient-form-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {patient ? "Edit Patient Record" : "Register New Patient"}
          </DialogTitle>
          <DialogDescription>
            Fill in the patient details. The system will automatically schedule them based on priority and appointment time.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Patient Code">
            <Input value={form.patient_code} placeholder="(auto-assigned)"
                   onChange={(e) => update("patient_code", e.target.value)}
                   data-testid="form-code" />
          </Field>
          <Field label="Full Name *">
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} data-testid="form-name"/>
          </Field>
          <Field label="Age">
            <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} data-testid="form-age" />
          </Field>
          <Field label="Gender">
            <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger data-testid="form-gender"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Diagnosis / Symptom *" wide>
            <Input value={form.disease} onChange={(e) => update("disease", e.target.value)} data-testid="form-disease"/>
          </Field>
          <Field label="Assigned Doctor *">
            <Select value={form.doctor_id} onValueChange={(v) => update("doctor_id", v)}>
              <SelectTrigger data-testid="form-doctor"><SelectValue placeholder="Choose doctor"/></SelectTrigger>
              <SelectContent>
                {doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name} · {d.specialty}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Appointment Date & Time *">
            <Input type="datetime-local" value={form.appointment_at}
                   onChange={(e) => update("appointment_at", e.target.value)}
                   data-testid="form-appointment" />
          </Field>
          <Field label="Urgency Level">
            <Select value={form.priority} onValueChange={(v) => update("priority", v)}>
              <SelectTrigger data-testid="form-priority"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High — Emergency</SelectItem>
                <SelectItem value="Medium">Medium — Urgent</SelectItem>
                <SelectItem value="Low">Low — Routine</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Fees Paid (₹)">
            <Input type="number" value={form.fees_paid} onChange={(e) => update("fees_paid", e.target.value)} />
          </Field>
          <Field label="Outstanding Balance (₹)">
            <Input type="number" value={form.due_amount} onChange={(e) => update("due_amount", e.target.value)} />
          </Field>
          <Field label="Height (cm)">
            <Input type="number" value={form.height_cm} onChange={(e) => update("height_cm", e.target.value)} />
          </Field>
          <Field label="Weight (kg)">
            <Input type="number" value={form.weight_kg} onChange={(e) => update("weight_kg", e.target.value)} />
          </Field>
        </div>

        {form.doctor_id && form.appointment_at && (
          <div className="mt-2 rounded-xl border p-3 text-sm" data-testid="availability-panel">
            {checking ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking doctor's schedule...
              </div>
            ) : availability ? (
              <AvailabilityView a={availability} />
            ) : null}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving} className="bg-teal-700 hover:bg-teal-800"
                  data-testid="form-submit-btn">
            {saving ? "Saving..." : patient ? "Update Record" : "Register Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Field = ({ label, children, wide }) => (
  <div className={wide ? "sm:col-span-2" : ""}>
    <Label className="text-xs text-slate-600">{label}</Label>
    <div className="mt-1">{children}</div>
  </div>
);

function AvailabilityView({ a }) {
  const ok = a.available;
  return (
    <div>
      <div className="flex items-center gap-2">
        {ok
          ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          : <AlertTriangle className="h-4 w-4 text-amber-600" />}
        <span className={`font-medium ${ok ? "text-emerald-700" : "text-amber-700"}`}>
          {ok ? "Doctor is available at this time" : a.within_working_hours ? "Schedule conflict detected" : "Doctor is not working at this time"}
        </span>
      </div>
      <div className="mt-1 text-slate-500">
        {a.schedule_today && a.schedule_today.length === 2
          ? `Working hours today: ${a.schedule_today[0]} – ${a.schedule_today[1]}`
          : "Doctor is off today."}
      </div>
      {a.conflicts && a.conflicts.length > 0 && (
        <ul className="mt-2 space-y-1">
          {a.conflicts.map((c, i) => (
            <li key={i} className="text-rose-700">
              · Another appointment: {c.name} ({c.patient_code}) at {new Date(c.appointment_at).toLocaleString()}
              {" "}— only {Math.abs(c.minutes_apart)} min apart.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
