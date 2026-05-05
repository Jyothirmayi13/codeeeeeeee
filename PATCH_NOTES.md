# MediTree — Patch Notes
## Two changes applied across all frontend files

---

### 1. Watermark removed
**File:** `src/App.js` — Sidebar component

REMOVE this entire div from the bottom of `<aside>`:
```jsx
<div className="p-4 text-xs text-slate-400 border-t border-slate-200">
  Built with an AVL Tree data structure.
</div>
```
Replace with: nothing (delete it entirely).

---

### 2. Technical AVL terms → Hospital language

| File | Old text | New text |
|------|----------|----------|
| `App.js` Sidebar subtitle | `AVL Appointment System` | `Smart Scheduling System` |
| `App.js` NAV label | `AVL Tree` | `Priority Queue` |
| `Dashboard.jsx` live indicator | `Live AVL tree — X nodes, height Y` | `Live patient queue — X active patients, queue depth Y` |
| `Dashboard.jsx` card subtitle | `In-order traversal of the AVL tree (priority then time)` | `Sorted by urgency — emergency cases first, then by time` |
| `Dashboard.jsx` sidebar card title | `Data Structure` | `Scheduling Engine` |
| `Dashboard.jsx` sidebar card subtitle | `Self-balancing AVL Tree` | `Auto-priority smart queue` |
| `Dashboard.jsx` stat row | `Nodes` | `Active patients` |
| `Dashboard.jsx` stat row | `Tree height` | `Queue depth` |
| `Dashboard.jsx` stat row | `Expected O(log n)` | `Max search steps` |
| `Dashboard.jsx` link text | `Visualize tree` | `View priority queue` |
| `TreeView.jsx` page title | `AVL Tree Visualization` | `Patient Priority Queue` |
| `TreeView.jsx` description | AVL technical explanation | Plain English: "automatically arranged by urgency and appointment time" |
| `TreeView.jsx` stat label | `Nodes` | `Active patients` |
| `TreeView.jsx` stat label | `Height` | `Queue depth` |
| `TreeView.jsx` node label | `h=X [bf]` balance factor | `{priority}` (just shows High/Medium/Low) |
| `TreeView.jsx` legend | `Low priority` | `Routine / Low priority` |
| `TreeView.jsx` legend | `High priority` | `Emergency / High priority` |
| `TreeView.jsx` empty state | `Add a patient to see it appear here` | `Add a patient to see them appear here` |
| `PatientFormDialog.jsx` dialog title | `New Patient` | `Register New Patient` |
| `PatientFormDialog.jsx` description | `node will be inserted into the AVL tree and rebalanced` | `system will automatically schedule them based on priority` |
| `PatientFormDialog.jsx` field label | `Patient Code` placeholder | `(auto-assigned)` |
| `PatientFormDialog.jsx` field label | `Disease / Symptom` | `Diagnosis / Symptom` |
| `PatientFormDialog.jsx` field label | `Doctor` | `Assigned Doctor` |
| `PatientFormDialog.jsx` field label | `Appointment` | `Appointment Date & Time` |
| `PatientFormDialog.jsx` field label | `Priority` | `Urgency Level` |
| `PatientFormDialog.jsx` priority options | `High (Emergency)` | `High — Emergency` |
| `PatientFormDialog.jsx` priority options | `Medium` | `Medium — Urgent` |
| `PatientFormDialog.jsx` priority options | `Low` | `Low — Routine` |
| `PatientFormDialog.jsx` field label | `Due Amount (₹)` | `Outstanding Balance (₹)` |
| `PatientFormDialog.jsx` toast | `Patient added to AVL tree` | `Patient registered and added to schedule` |
| `PatientFormDialog.jsx` submit btn | `Add to AVL Tree` | `Register Patient` |
| `PatientFormDialog.jsx` update btn | `Update` | `Update Record` |
| `PatientFormDialog.jsx` checking text | `Checking doctor availability...` | `Checking doctor's schedule...` |
| `PatientFormDialog.jsx` avail text | `Outside working hours` | `Doctor is not working at this time` |
| `PatientFormDialog.jsx` conflict text | `Same-doctor appointment:` | `Another appointment:` |
| `Patients.jsx` search placeholder | `Search name, code, disease, doctor...` | `Search name, ID, diagnosis, doctor...` |
| `Patients.jsx` priority filter labels | `High / Medium / Low` | `High — Emergency / Medium — Urgent / Low — Routine` |
| `Patients.jsx` add button | `Add Patient` | `Register Patient` |
| `Patients.jsx` column header | `Disease` | `Diagnosis` |
| `Patients.jsx` column header | `Priority` | `Urgency` |
| `Patients.jsx` column header | `Dues` | `Balance Due` |
| `Patients.jsx` delete confirm | `Delete X? This removes them from the AVL tree.` | `Remove X from the system? This cannot be undone.` |
| `Patients.jsx` delete toast | `Patient deleted` | `Patient removed` |
| `Doctors.jsx` sidebar title | `Doctors` | `Medical Staff` |
| `Doctors.jsx` availability label | `Check availability` | `Check appointment slot` |
| `Doctors.jsx` avail result text | `Conflict with another patient` | `Slot is already booked by another patient` |
| `Doctors.jsx` avail result text | `Outside working hours` | `Doctor is not on duty at this time` |
| `Doctors.jsx` avail result text | `Doctor is available` | `Slot is available — doctor is free` |
| `Doctors.jsx` conflict list | `Same-doctor:` | `Existing booking:` |
| `Doctors.jsx` appointments title | `Scheduled Appointments` | `Upcoming Appointments` |
| `Doctors.jsx` empty state | `No appointments scheduled.` | `No upcoming appointments for this doctor.` |

---

## Files NOT changed (no AVL/watermark references):
- `Appointments.jsx` — already clean
- `Dues.jsx` — already clean  
- `PatientDetailsDialog.jsx` — already clean
- `App.css` — no text content
- `lib/api.js` — backend calls only, not shown to users
- `backend/server.py` — backend, not shown to users
