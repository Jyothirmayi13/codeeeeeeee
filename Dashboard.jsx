<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MediTree — Smart Scheduling System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --teal:      #0d9488;
    --teal-dark: #0f766e;
    --teal-light:#f0fdfa;
    --teal-ring: rgba(13,148,136,.15);
    --ink:       #0f172a;
    --ink2:      #475569;
    --ink3:      #94a3b8;
    --border:    #e2e8f0;
    --surface:   #ffffff;
    --page:      #f5f8f9;
    --red:       #b91c1c;
    --red-bg:    #fef2f2;
    --amber:     #92400e;
    --amber-bg:  rgba(245,158,11,.09);
    --rose-border:rgba(239,68,68,.25);
    --green-bg:  rgba(16,185,129,.09);
    --green:     #065f46;
    --green-border:rgba(16,185,129,.3);
  }
  body{font-family:'IBM Plex Sans',system-ui,sans-serif;background:var(--page);color:var(--ink);min-height:100vh;font-size:14px}
  h1,h2,.font-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:600;letter-spacing:-0.01em}

  /* ── Layout ── */
  .app{display:flex;min-height:100vh}
  .sidebar{width:230px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;position:fixed;top:0;bottom:0;left:0;z-index:10}
  .logo-wrap{padding:22px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:11px}
  .logo-icon{width:38px;height:38px;border-radius:11px;background:var(--teal);display:flex;align-items:center;justify-content:center;color:#fff;font-size:19px;flex-shrink:0}
  .logo-name{font-family:'Bricolage Grotesque',sans-serif;font-size:16px;font-weight:600;color:var(--ink)}
  .logo-sub{font-size:11px;color:var(--ink3);margin-top:1px}
  nav{flex:1;padding:10px 8px;display:flex;flex-direction:column;gap:2px}
  .nav-btn{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:10px;font-size:13px;cursor:pointer;color:var(--ink2);border:none;background:none;width:100%;text-align:left;transition:background .15s,color .15s;font-family:'IBM Plex Sans',sans-serif}
  .nav-btn:hover{background:#f1f5f9;color:var(--ink)}
  .nav-btn.active{background:var(--teal-light);color:var(--teal-dark);font-weight:500}
  .nav-btn i{font-size:16px;width:18px;text-align:center}

  .main{flex:1;margin-left:230px;display:flex;flex-direction:column;min-width:0}
  .topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 28px;height:62px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:9;backdrop-filter:blur(8px)}
  .topbar-title{font-family:'Bricolage Grotesque',sans-serif;font-size:18px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:7px}
  .topbar-sub{font-size:11px;color:var(--ink3);margin-top:2px}
  .btn-new{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:20px;background:var(--ink);color:#fff;border:none;font-size:13px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:500;transition:background .15s}
  .btn-new:hover{background:#1e293b}

  .content{flex:1;padding:24px 28px;overflow-y:auto}
  .page{display:none}.page.active{display:block}

  /* ── Cards ── */
  .card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 20px;transition:box-shadow .18s}
  .card-title{font-family:'Bricolage Grotesque',sans-serif;font-size:16px;font-weight:600;color:var(--ink);margin-bottom:3px}
  .card-sub{font-size:12px;color:var(--ink3);margin-bottom:14px}

  /* ── Stat cards ── */
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:16px 18px;transition:transform .18s,box-shadow .18s,border-color .18s}
  .stat-card:hover{transform:translateY(-2px);box-shadow:0 12px 30px -18px rgba(15,118,110,.3);border-color:#bae6e0}
  .stat-label{font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;font-weight:500}
  .stat-value{font-family:'Bricolage Grotesque',sans-serif;font-size:30px;font-weight:600;color:var(--ink);margin-top:8px}
  .stat-icon{float:right;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px}

  /* ── Grids ── */
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .g3{display:grid;grid-template-columns:2fr 1fr;gap:18px}
  .g-col2{grid-column:span 2}

  /* ── Table ── */
  .tbl-wrap{border-radius:18px;border:1px solid var(--border);overflow:hidden;background:var(--surface)}
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  thead th{padding:10px 12px;text-align:left;font-size:11px;color:var(--ink3);background:#f8fafc;border-bottom:1px solid var(--border);font-weight:600;text-transform:uppercase;letter-spacing:.05em}
  tbody tr{border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .12s}
  tbody tr:last-child{border-bottom:none}
  tbody tr:hover{background:#f8fafc}
  tbody tr.emergency{background:linear-gradient(90deg,#fef2f2 0%,#fff 100%)}
  tbody tr.emergency:hover{background:linear-gradient(90deg,#fee2e2 0%,#f8fafc 100%)}
  td{padding:10px 12px;color:var(--ink);vertical-align:middle}
  .mono{font-family:monospace;font-size:11px;color:var(--ink3)}
  .td-name{font-weight:500}
  .td-meta{font-size:11px;color:var(--ink3);margin-top:1px}

  /* ── Badges ── */
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500;border:1px solid;white-space:nowrap}
  .b-high{background:rgba(239,68,68,.09);color:#b91c1c;border-color:var(--rose-border)}
  .b-medium{background:var(--amber-bg);color:var(--amber);border-color:rgba(245,158,11,.3)}
  .b-low{background:rgba(13,148,136,.09);color:var(--teal-dark);border-color:rgba(13,148,136,.25)}
  .b-scheduled{background:var(--green-bg);color:var(--green);border-color:var(--green-border)}
  .b-cancelled{background:#f1f5f9;color:var(--ink3);border-color:var(--border)}

  /* ── Live dot ── */
  .live-row{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ink3);margin-bottom:16px}
  .dot{width:8px;height:8px;border-radius:50%;background:#10b981;position:relative;display:inline-block;flex-shrink:0}
  .dot::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(16,185,129,.45);animation:pulse 1.6s ease-out infinite}
  @keyframes pulse{0%{transform:scale(.6);opacity:1}100%{transform:scale(1.9);opacity:0}}

  /* ── Priority queue nodes ── */
  .q-node{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:14px;border:1px solid var(--border);margin-bottom:8px;background:var(--surface);transition:box-shadow .15s}
  .q-node:hover{box-shadow:0 4px 12px -6px rgba(0,0,0,.12)}
  .nc{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0}
  .nc-high{background:rgba(239,68,68,.12);color:#b91c1c}
  .nc-med{background:var(--amber-bg);color:var(--amber)}
  .nc-low{background:rgba(13,148,136,.12);color:var(--teal-dark)}
  .q-conn{width:2px;height:10px;background:var(--border);margin:0 18px}

  /* ── Calendar ── */
  .cal-hdr{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center;margin-bottom:4px}
  .cal-hdr div{font-size:10px;color:var(--ink3);font-weight:600;padding:4px 0}
  .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
  .cal-day{padding:6px 2px;font-size:12px;border-radius:8px;cursor:pointer;text-align:center;transition:background .12s;color:var(--ink2)}
  .cal-day:hover{background:#f1f5f9}
  .cal-day.has{background:rgba(13,148,136,.12);color:var(--teal-dark);font-weight:600}
  .cal-day.sel{background:var(--teal);color:#fff;font-weight:600}

  /* ── Doctor schedule ── */
  .week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
  .day-c{padding:8px 4px;border-radius:10px;font-size:10px;border:1px solid}
  .day-on{background:rgba(13,148,136,.07);border-color:rgba(13,148,136,.3);color:var(--teal-dark)}
  .day-off{background:#f8fafc;border-color:var(--border);color:var(--ink3)}
  .avail-box{padding:11px 14px;border-radius:12px;border:1px solid;margin-top:10px;font-size:12.5px;display:flex;align-items:center;gap:8px}
  .avail-ok{background:#ecfdf5;border-color:rgba(16,185,129,.35);color:#065f46}
  .avail-no{background:#fef2f2;border-color:var(--rose-border);color:#b91c1c}

  /* ── Form ── */
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
  .fgrp{display:flex;flex-direction:column;gap:4px}
  .flbl{font-size:11px;color:var(--ink3);font-weight:500;text-transform:uppercase;letter-spacing:.04em}
  input,select{padding:8px 11px;border-radius:10px;border:1px solid var(--border);font-size:13px;font-family:'IBM Plex Sans',sans-serif;background:#fff;color:var(--ink);width:100%;transition:border-color .15s,box-shadow .15s}
  input:focus,select:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-ring)}
  .btn-p{padding:9px 20px;background:var(--teal);color:#fff;border:none;border-radius:10px;font-size:13px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:500;transition:background .15s}
  .btn-p:hover{background:var(--teal-dark)}
  .btn-s{padding:9px 20px;background:#fff;color:var(--ink2);border:1px solid var(--border);border-radius:10px;font-size:13px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;transition:background .15s}
  .btn-s:hover{background:#f8fafc}

  /* ── Modal ── */
  .overlay{position:fixed;inset:0;background:rgba(15,23,42,.35);display:none;align-items:flex-start;justify-content:center;z-index:100;padding-top:40px;backdrop-filter:blur(2px)}
  .overlay.open{display:flex}
  .modal{background:#fff;border-radius:20px;padding:26px 28px;width:580px;max-width:95vw;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px -12px rgba(0,0,0,.25)}
  .modal-title{font-family:'Bricolage Grotesque',sans-serif;font-size:20px;font-weight:600;color:var(--ink);margin-bottom:4px}
  .modal-sub{font-size:12.5px;color:var(--ink3);margin-bottom:18px}
  .modal-footer{display:flex;justify-content:flex-end;gap:9px;margin-top:18px;padding-top:14px;border-top:1px solid var(--border)}

  /* ── Empty state ── */
  .empty{padding:40px 24px;text-align:center;color:var(--ink3);border:1px dashed var(--border);border-radius:14px;font-size:13px;background:#fff}

  /* ── Avail result in modal ── */
  .avail-modal{padding:11px 14px;border-radius:12px;border:1px solid;margin-top:10px;font-size:12.5px}

  /* ── Due total ── */
  .due-total{text-align:right}
  .due-total .lbl{font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em}
  .due-total .val{font-family:'Bricolage Grotesque',sans-serif;font-size:26px;font-weight:600;color:#b91c1c}

  /* scrollbar */
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
</style>
</head>
<body>

<div class="app">
  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="logo-wrap">
      <div class="logo-icon"><i class="ti ti-activity"></i></div>
      <div>
        <div class="logo-name">MediTree</div>
        <div class="logo-sub">Smart Scheduling System</div>
      </div>
    </div>
    <nav>
      <button class="nav-btn active" onclick="showPage('dashboard',this)"><i class="ti ti-layout-dashboard"></i>Dashboard</button>
      <button class="nav-btn" onclick="showPage('patients',this)"><i class="ti ti-users"></i>Patients</button>
      <button class="nav-btn" onclick="showPage('appointments',this)"><i class="ti ti-calendar"></i>Appointments</button>
      <button class="nav-btn" onclick="showPage('doctors',this)"><i class="ti ti-stethoscope"></i>Doctors</button>
      <button class="nav-btn" onclick="showPage('queue',this)"><i class="ti ti-git-branch"></i>Priority Queue</button>
      <button class="nav-btn" onclick="showPage('dues',this)"><i class="ti ti-wallet"></i>Due Payments</button>
    </nav>
  </div>

  <!-- MAIN -->
  <div class="main">
    <div class="topbar">
      <div>
        <div class="topbar-title" id="topbar-title"><i class="ti ti-layout-dashboard" id="topbar-icon" style="color:var(--teal);font-size:17px"></i> Dashboard</div>
        <div class="topbar-sub">Patient Appointment Scheduling System</div>
      </div>
      <button class="btn-new" onclick="openModal()"><i class="ti ti-plus"></i> New Patient</button>
    </div>

    <div class="content">

      <!-- ═══ DASHBOARD ═══ -->
      <div class="page active" id="page-dashboard">
        <div class="live-row"><span class="dot"></span> Live patient queue &mdash; <strong id="lc">6</strong> active patients, queue depth 4</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(13,148,136,.1);color:var(--teal)"><i class="ti ti-users"></i></div>
            <div class="stat-label">Total Patients</div>
            <div class="stat-value" id="s-total">9</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(14,165,233,.1);color:#0284c7"><i class="ti ti-calendar-check"></i></div>
            <div class="stat-label">Today</div>
            <div class="stat-value" id="s-today">2</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(239,68,68,.1);color:#dc2626"><i class="ti ti-siren"></i></div>
            <div class="stat-label">Emergency</div>
            <div class="stat-value" id="s-emerg">2</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(245,158,11,.1);color:#d97706"><i class="ti ti-wallet"></i></div>
            <div class="stat-label">Total Dues</div>
            <div class="stat-value" id="s-dues">₹4,200</div>
          </div>
        </div>

        <div class="g3">
          <div class="card">
            <div class="card-title">Today's appointments</div>
            <div class="card-sub">Sorted by urgency — emergency cases appear first</div>
            <table>
              <thead><tr><th>Patient</th><th>Doctor</th><th>Time</th><th>Urgency</th></tr></thead>
              <tbody id="dash-today"></tbody>
            </table>
          </div>
          <div class="card">
            <div class="card-title">Scheduling engine</div>
            <div class="card-sub">Auto-priority smart queue</div>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
              <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--ink3)">Active patients</span><strong id="eng-a">6</strong></div>
              <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--ink3)">Queue depth</span><strong>4</strong></div>
              <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--ink3)">Max search steps</span><strong>3</strong></div>
              <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--ink3)">Scheduled</span><strong id="eng-s">6</strong></div>
            </div>
            <button class="nav-btn" style="margin-top:14px;color:var(--teal);padding:7px 10px;font-size:12.5px" onclick="showPage('queue',document.querySelectorAll('.nav-btn')[4])">
              <i class="ti ti-git-branch"></i> View priority queue
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ PATIENTS ═══ -->
      <div class="page" id="page-patients">
        <div class="card" style="margin-bottom:14px;border-radius:16px">
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <div style="flex:1;position:relative;min-width:200px">
              <i class="ti ti-search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--ink3)"></i>
              <input id="ps" placeholder="Search name, ID, diagnosis, doctor..." style="padding-left:32px" oninput="filterP()">
            </div>
            <select id="pu" onchange="filterP()" style="width:160px">
              <option value="">All urgency levels</option>
              <option value="High">High — Emergency</option>
              <option value="Medium">Medium — Urgent</option>
              <option value="Low">Low — Routine</option>
            </select>
            <select id="pst" onchange="filterP()" style="width:140px">
              <option value="">All statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button class="btn-p" onclick="openModal()"><i class="ti ti-plus"></i> Register Patient</button>
          </div>
        </div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Code</th><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Appointment</th><th>Urgency</th><th>Balance Due</th><th>Status</th></tr></thead>
            <tbody id="ptbl"></tbody>
          </table>
        </div>
      </div>

      <!-- ═══ APPOINTMENTS ═══ -->
      <div class="page" id="page-appointments">
        <div class="g2" style="align-items:start">
          <div class="card">
            <div class="card-title">Calendar — May 2026</div>
            <div class="card-sub" style="margin-bottom:10px">Dates with appointments are highlighted</div>
            <div class="cal-hdr">
              <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
            </div>
            <div class="cal-grid" id="cal"></div>
          </div>
          <div class="card">
            <div class="card-title" id="appt-title">6 May 2026</div>
            <div class="card-sub" id="appt-sub">2 appointments scheduled</div>
            <div id="appt-list"></div>
          </div>
        </div>
      </div>

      <!-- ═══ DOCTORS ═══ -->
      <div class="page" id="page-doctors">
        <div class="g2" style="align-items:start">
          <div class="card">
            <div class="card-title">Medical staff</div>
            <div style="display:flex;flex-direction:column;gap:7px;margin-top:10px" id="dlist"></div>
          </div>
          <div id="dpanel"></div>
        </div>
      </div>

      <!-- ═══ PRIORITY QUEUE ═══ -->
      <div class="page" id="page-queue">
        <div class="card" style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
            <div>
              <div class="card-title">Patient priority queue</div>
              <div class="card-sub" style="max-width:420px;margin-bottom:0">Live view of all active patients, automatically arranged by urgency and appointment time. Emergency cases always appear first. The system self-balances to keep lookups fast.</div>
            </div>
            <div style="display:flex;gap:20px;align-items:center">
              <div style="text-align:center"><div style="font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em">Active</div><div style="font-family:'Bricolage Grotesque',sans-serif;font-size:26px;font-weight:600" id="qa">6</div></div>
              <div style="text-align:center"><div style="font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em">Depth</div><div style="font-family:'Bricolage Grotesque',sans-serif;font-size:26px;font-weight:600">4</div></div>
            </div>
          </div>
          <div style="display:flex;gap:18px;margin-top:14px;font-size:12px;flex-wrap:wrap">
            <span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:#ef4444;display:inline-block"></span>Emergency / High</span>
            <span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:#f59e0b;display:inline-block"></span>Medium priority</span>
            <span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:#0d9488;display:inline-block"></span>Routine / Low</span>
          </div>
        </div>
        <div class="card">
          <div id="qviz"></div>
        </div>
      </div>

      <!-- ═══ DUES ═══ -->
      <div class="page" id="page-dues">
        <div class="card" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
          <div>
            <div class="card-title">Due payments</div>
            <div style="font-size:12.5px;color:var(--ink3);margin-top:2px">Patients with outstanding balance</div>
          </div>
          <div class="due-total">
            <div class="lbl">Total outstanding</div>
            <div class="val" id="due-total">₹4,200</div>
          </div>
        </div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Last Appointment</th><th>Fees Paid</th><th style="text-align:right">Balance Due</th></tr></thead>
            <tbody id="dtbl"></tbody>
          </table>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /main -->
</div><!-- /app -->

<!-- MODAL -->
<div class="overlay" id="overlay">
  <div class="modal">
    <div class="modal-title">Register new patient</div>
    <div class="modal-sub">Fill in the details. The patient will be automatically scheduled based on urgency and appointment time.</div>
    <div class="form-grid">
      <div class="fgrp"><label class="flbl">Full name *</label><input id="fn" placeholder="e.g. Priya Sharma"></div>
      <div class="fgrp"><label class="flbl">Age</label><input id="fa" type="number" value="30" min="1" max="120"></div>
      <div class="fgrp"><label class="flbl">Gender</label>
        <select id="fg"><option>Male</option><option>Female</option><option>Other</option></select>
      </div>
      <div class="fgrp"><label class="flbl">Urgency level</label>
        <select id="fp"><option value="Low">Low — Routine</option><option value="Medium">Medium — Urgent</option><option value="High">High — Emergency</option></select>
      </div>
      <div class="fgrp" style="grid-column:1/-1"><label class="flbl">Diagnosis / Symptom *</label><input id="fd" placeholder="e.g. Hypertension, Fracture, Fever"></div>
      <div class="fgrp"><label class="flbl">Assigned doctor *</label>
        <select id="fdr">
          <option value="d1">Dr. Aanya Sharma — General Physician</option>
          <option value="d2">Dr. Rohan Mehta — Cardiologist</option>
          <option value="d3">Dr. Priya Nair — Pediatrician</option>
          <option value="d4">Dr. Vikram Iyer — Orthopedic Surgeon</option>
          <option value="d5">Dr. Sana Kapoor — Dermatologist</option>
        </select>
      </div>
      <div class="fgrp"><label class="flbl">Appointment date &amp; time *</label><input id="ft" type="datetime-local"></div>
      <div class="fgrp"><label class="flbl">Fees paid (₹)</label><input id="ff" type="number" value="0" min="0"></div>
      <div class="fgrp"><label class="flbl">Outstanding balance (₹)</label><input id="fdue" type="number" value="0" min="0"></div>
    </div>
    <div id="avail-modal"></div>
    <div class="modal-footer">
      <button class="btn-s" onclick="closeModal()">Cancel</button>
      <button class="btn-p" onclick="regPatient()"><i class="ti ti-plus"></i> Register Patient</button>
    </div>
  </div>
</div>

<script>
const DOCS=[
  {id:'d1',name:'Dr. Aanya Sharma',spec:'General Physician',sched:{0:['09:00','17:00'],1:['09:00','17:00'],2:['09:00','17:00'],3:['09:00','17:00'],4:['09:00','13:00']}},
  {id:'d2',name:'Dr. Rohan Mehta',spec:'Cardiologist',sched:{0:['09:00','17:00'],1:['09:00','17:00'],2:['09:00','17:00'],3:['09:00','17:00'],4:['09:00','13:00']}},
  {id:'d3',name:'Dr. Priya Nair',spec:'Pediatrician',sched:{0:['10:00','18:00'],1:['10:00','18:00'],3:['10:00','18:00'],4:['10:00','18:00'],5:['10:00','14:00']}},
  {id:'d4',name:'Dr. Vikram Iyer',spec:'Orthopedic Surgeon',sched:{0:['09:00','17:00'],1:['09:00','17:00'],2:['09:00','17:00'],3:['09:00','17:00'],4:['09:00','13:00']}},
  {id:'d5',name:'Dr. Sana Kapoor',spec:'Dermatologist',sched:{0:['10:00','18:00'],1:['10:00','18:00'],3:['10:00','18:00'],4:['10:00','18:00'],5:['10:00','14:00']}}
];

let PP=[
  {id:'p1',code:'P0001',name:'Rahul Verma',age:34,g:'Male',dis:'Cardiac Arrest',dr:'d2',drn:'Dr. Rohan Mehta',appt:'2026-05-06T09:00',pri:'High',paid:5000,due:2000,st:'Scheduled'},
  {id:'p2',code:'P0002',name:'Meera Iyer',age:27,g:'Female',dis:'Fracture — Left Arm',dr:'d4',drn:'Dr. Vikram Iyer',appt:'2026-05-06T11:30',pri:'High',paid:3000,due:1500,st:'Scheduled'},
  {id:'p3',code:'P0003',name:'Amit Singh',age:45,g:'Male',dis:'Hypertension',dr:'d1',drn:'Dr. Aanya Sharma',appt:'2026-05-07T10:00',pri:'Medium',paid:1500,due:0,st:'Scheduled'},
  {id:'p4',code:'P0004',name:'Sunita Rao',age:52,g:'Female',dis:'Diabetes Type 2',dr:'d1',drn:'Dr. Aanya Sharma',appt:'2026-05-08T14:00',pri:'Medium',paid:2000,due:700,st:'Scheduled'},
  {id:'p5',code:'P0005',name:'Kiran Joshi',age:8,g:'Male',dis:'Fever & Cough',dr:'d3',drn:'Dr. Priya Nair',appt:'2026-05-09T09:30',pri:'Low',paid:800,due:0,st:'Scheduled'},
  {id:'p6',code:'P0006',name:'Lakshmi Bhat',age:60,g:'Female',dis:'Skin Rash',dr:'d5',drn:'Dr. Sana Kapoor',appt:'2026-05-12T15:00',pri:'Low',paid:500,due:0,st:'Scheduled'},
  {id:'p7',code:'P0007',name:'Deepak Nair',age:38,g:'Male',dis:'Back Pain',dr:'d4',drn:'Dr. Vikram Iyer',appt:'2026-05-14T11:00',pri:'Low',paid:1000,due:0,st:'Cancelled'},
  {id:'p8',code:'P0008',name:'Anjali Mehta',age:29,g:'Female',dis:'Migraine',dr:'d1',drn:'Dr. Aanya Sharma',appt:'2026-05-15T10:00',pri:'Medium',paid:0,due:0,st:'Scheduled'},
  {id:'p9',code:'P0009',name:'Vivek Kumar',age:55,g:'Male',dis:'Asthma',dr:'d2',drn:'Dr. Rohan Mehta',appt:'2026-05-16T13:00',pri:'Medium',paid:1200,due:0,st:'Scheduled'},
];
let ctr=10, selDoc=DOCS[0], selDay=6;

const po=p=>p==='High'?0:p==='Medium'?1:2;
const bc=p=>p==='High'?'b-high':p==='Medium'?'b-medium':'b-low';
const active=()=>PP.filter(x=>x.st==='Scheduled');
const sorted=()=>active().sort((a,b)=>po(a.pri)-po(b.pri)||a.appt.localeCompare(b.appt));
function fmt(iso){try{const d=new Date(iso);return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'})+' '+d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}catch{return iso}}

const PAGE_ICONS={dashboard:'ti-layout-dashboard',patients:'ti-users',appointments:'ti-calendar',doctors:'ti-stethoscope',queue:'ti-git-branch',dues:'ti-wallet'};
const PAGE_LABELS={dashboard:'Dashboard',patients:'Patients',appointments:'Appointments',doctors:'Doctors',queue:'Priority Queue',dues:'Due Payments'};

function showPage(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  btn.classList.add('active');
  document.getElementById('topbar-title').innerHTML=`<i class="ti ${PAGE_ICONS[id]}" style="color:var(--teal);font-size:17px"></i> ${PAGE_LABELS[id]}`;
  if(id==='patients')renderP();
  if(id==='appointments')renderCal();
  if(id==='doctors')renderDocs();
  if(id==='queue')renderQ();
  if(id==='dues')renderDues();
}

/* ── DASHBOARD ── */
function renderDash(){
  const today='2026-05-06';
  const tpts=active().filter(p=>p.appt.startsWith(today));
  const ec=active().filter(p=>p.pri==='High').length;
  const ac=active().length;
  const totalDue=PP.reduce((s,p)=>s+p.due,0);
  document.getElementById('lc').textContent=ac;
  document.getElementById('s-total').textContent=PP.length;
  document.getElementById('s-today').textContent=tpts.length;
  document.getElementById('s-emerg').textContent=ec;
  document.getElementById('s-dues').textContent='₹'+totalDue.toLocaleString('en-IN');
  document.getElementById('eng-a').textContent=ac;
  document.getElementById('eng-s').textContent=ac;
  const tb=document.getElementById('dash-today');tb.innerHTML='';
  const show=tpts.length?tpts:sorted().slice(0,4);
  show.forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><div class="td-name">${p.name}</div><div class="td-meta">${p.code}</div></td><td style="font-size:12px">${p.drn}</td><td style="font-size:12px">${fmt(p.appt)}</td><td><span class="badge ${bc(p.pri)}">${p.pri}</span></td>`;
    tb.appendChild(tr);
  });
}

/* ── PATIENTS ── */
function renderP(){
  const s=(document.getElementById('ps').value||'').toLowerCase();
  const u=document.getElementById('pu').value;
  const st=document.getElementById('pst').value;
  const data=[...PP].sort((a,b)=>po(a.pri)-po(b.pri)||a.appt.localeCompare(b.appt))
    .filter(p=>{
      if(u&&p.pri!==u)return false;
      if(st&&p.st!==st)return false;
      if(s&&!(p.name+p.code+p.dis+p.drn).toLowerCase().includes(s))return false;
      return true;
    });
  const tb=document.getElementById('ptbl');tb.innerHTML='';
  if(!data.length){tb.innerHTML='<tr><td colspan="8"><div class="empty">No patients match the current filters.</div></td></tr>';return}
  data.forEach(p=>{
    const tr=document.createElement('tr');
    if(p.pri==='High'&&p.st==='Scheduled')tr.className='emergency';
    tr.innerHTML=`<td class="mono">${p.code}</td><td><div class="td-name">${p.name}</div><div class="td-meta">${p.g} · ${p.age}y</div></td><td style="font-size:12.5px">${p.drn}</td><td style="font-size:12px;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.dis}</td><td style="font-size:12px">${fmt(p.appt)}</td><td><span class="badge ${bc(p.pri)}">${p.pri}</span></td><td>${p.due>0?`<span style="color:var(--red);font-weight:600">₹${p.due}</span>`:'<span style="color:var(--ink3)">—</span>'}</td><td><span class="badge ${p.st==='Scheduled'?'b-scheduled':'b-cancelled'}">${p.st}</span></td>`;
    tb.appendChild(tr);
  });
}
function filterP(){renderP()}

/* ── CALENDAR ── */
function renderCal(){
  const apptDays=new Set(active().map(p=>parseInt(p.appt.split('-')[2])));
  const cal=document.getElementById('cal');cal.innerHTML='';
  for(let i=0;i<3;i++){const d=document.createElement('div');cal.appendChild(d)} // May 2026 offset (starts Thu)
  for(let d=1;d<=31;d++){
    const div=document.createElement('div');
    div.className='cal-day'+(apptDays.has(d)?' has':'')+(d===selDay?' sel':'');
    div.textContent=d;
    div.onclick=()=>{selDay=d;renderCal();renderAppt(d)};
    cal.appendChild(div);
  }
  renderAppt(selDay);
}
function renderAppt(day){
  const ds=`2026-05-${String(day).padStart(2,'0')}`;
  const pts=active().filter(p=>p.appt.startsWith(ds)).sort((a,b)=>a.appt.localeCompare(b.appt));
  document.getElementById('appt-title').textContent=`${day} May 2026`;
  document.getElementById('appt-sub').textContent=`${pts.length} appointment${pts.length===1?'':'s'} scheduled`;
  const list=document.getElementById('appt-list');list.innerHTML='';
  if(!pts.length){list.innerHTML='<div class="empty">No appointments on this day.</div>';return}
  pts.forEach(p=>{
    const d=document.createElement('div');
    d.style.cssText='padding:11px 0;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;gap:8px';
    d.innerHTML=`<div><div style="font-size:13px;font-weight:500">${p.name} <span class="mono">${p.code}</span></div><div style="font-size:11.5px;color:var(--ink3);margin-top:2px">${p.dis} · ${p.drn}</div></div><div style="text-align:right;flex-shrink:0"><div style="font-size:12px;color:var(--ink2)">${fmt(p.appt)}</div><span class="badge ${bc(p.pri)}" style="margin-top:4px">${p.pri}</span></div>`;
    list.appendChild(d);
  });
}

/* ── DOCTORS ── */
function renderDocs(){
  const dl=document.getElementById('dlist');dl.innerHTML='';
  DOCS.forEach(d=>{
    const btn=document.createElement('button');
    btn.style.cssText='display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:12px;border:1px solid var(--border);background:#fff;text-align:left;cursor:pointer;width:100%;transition:background .12s,border-color .12s';
    btn.innerHTML=`<div style="width:38px;height:38px;border-radius:10px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ti ti-stethoscope" style="font-size:17px;color:var(--teal)"></i></div><div><div style="font-size:13px;font-weight:500;color:var(--ink)">${d.name}</div><div style="font-size:11px;color:var(--ink3)">${d.spec}</div></div>`;
    if(d.id===selDoc.id){btn.style.background='rgba(13,148,136,.07)';btn.style.borderColor='rgba(13,148,136,.4)'}
    btn.onclick=()=>{selDoc=d;renderDocs();renderDocDetail()};
    dl.appendChild(btn);
  });
  renderDocDetail();
}
function renderDocDetail(){
  const d=selDoc;
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const wk=days.map((_,i)=>{const s=d.sched[i];return`<div class="day-c ${s?'day-on':'day-off'}"><div style="font-weight:600">${days[i]}</div><div style="margin-top:2px">${s?s[0]+'–'+s[1]:'Off'}</div></div>`}).join('');
  const apts=active().filter(p=>p.dr===d.id).sort((a,b)=>a.appt.localeCompare(b.appt));
  const ahtml=apts.length?apts.map(p=>`<div style="padding:10px 0;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:13px;font-weight:500">${p.name} <span class="mono">${p.code}</span></div><div style="font-size:11px;color:var(--ink3);margin-top:2px">${p.dis}</div></div><div style="text-align:right"><div style="font-size:12px">${fmt(p.appt)}</div><span class="badge ${bc(p.pri)}" style="margin-top:3px">${p.pri}</span></div></div>`).join(''):'<div class="empty">No upcoming appointments for this doctor.</div>';
  document.getElementById('dpanel').innerHTML=`
    <div class="card" style="margin-bottom:14px">
      <div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:17px;font-weight:600">${d.name}</div>
      <div style="font-size:12.5px;color:var(--ink3);margin-bottom:14px">${d.spec}</div>
      <div style="font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:8px">Weekly schedule</div>
      <div class="week-grid">${wk}</div>
      <div style="margin-top:16px">
        <div style="font-size:13px;font-weight:500;display:flex;align-items:center;gap:6px;margin-bottom:8px;color:var(--ink)"><i class="ti ti-clock" style="color:var(--teal);font-size:15px"></i> Check appointment slot</div>
        <div style="display:flex;gap:8px">
          <input type="datetime-local" id="avail-in" style="flex:1">
          <button class="btn-p" onclick="chkAvail()">Check</button>
        </div>
        <div id="avail-res"></div>
      </div>
    </div>
    <div class="card">
      <div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:16px;font-weight:600;margin-bottom:3px">Upcoming appointments</div>
      <div style="font-size:12px;color:var(--ink3);margin-bottom:12px">Sorted by date and time</div>
      ${ahtml}
    </div>`;
}
function chkAvail(){
  const v=document.getElementById('avail-in').value;
  if(!v)return;
  const w=new Date(v);
  const wd=w.getDay()===0?6:w.getDay()-1;
  const sc=selDoc.sched[wd];
  const res=document.getElementById('avail-res');
  if(!sc){res.innerHTML='<div class="avail-box avail-no"><i class="ti ti-alert-triangle"></i> Doctor is not on duty at this time.</div>';return}
  const [h1,m1]=sc[0].split(':').map(Number),[h2,m2]=sc[1].split(':').map(Number);
  const s=new Date(w);s.setHours(h1,m1,0);const e=new Date(w);e.setHours(h2,m2,0);
  if(w<s||w>e){res.innerHTML='<div class="avail-box avail-no"><i class="ti ti-alert-triangle"></i> Doctor is not on duty at this time.</div>';return}
  const clash=active().find(p=>p.dr===selDoc.id&&Math.abs(new Date(p.appt)-w)<30*60000);
  if(clash){res.innerHTML=`<div class="avail-box avail-no"><i class="ti ti-alert-triangle"></i> Slot already booked: <strong>${clash.name}</strong> at ${fmt(clash.appt)}</div>`;return}
  res.innerHTML='<div class="avail-box avail-ok"><i class="ti ti-circle-check"></i> Slot is available — doctor is free at this time.</div>';
}

/* ── QUEUE ── */
function renderQ(){
  document.getElementById('qa').textContent=active().length;
  const pts=sorted();
  const qv=document.getElementById('qviz');qv.innerHTML='';
  if(!pts.length){qv.innerHTML='<div class="empty">No active patients. Register a patient to see them here.</div>';return}
  pts.forEach((p,i)=>{
    if(i>0){const l=document.createElement('div');l.className='q-conn';qv.appendChild(l)}
    const nc=p.pri==='High'?'nc-high':p.pri==='Medium'?'nc-med':'nc-low';
    const n=document.createElement('div');n.className='q-node';
    n.innerHTML=`<div class="nc ${nc}">${p.pri[0]}</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500">${p.name} <span class="mono" style="font-size:10px">${p.code}</span></div><div style="font-size:11.5px;color:var(--ink3);margin-top:2px">${p.dis} · ${p.drn} · ${fmt(p.appt)}</div></div><span class="badge ${bc(p.pri)}">${p.pri}</span>`;
    qv.appendChild(n);
  });
}

/* ── DUES ── */
function renderDues(){
  const dues=PP.filter(p=>p.due>0).sort((a,b)=>b.due-a.due);
  const total=dues.reduce((s,p)=>s+p.due,0);
  document.getElementById('due-total').textContent='₹'+total.toLocaleString('en-IN');
  const tb=document.getElementById('dtbl');tb.innerHTML='';
  if(!dues.length){tb.innerHTML='<tr><td colspan="5"><div class="empty">No outstanding balances.</div></td></tr>';return}
  dues.forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><div class="td-name">${p.name}</div><div class="mono">${p.code}</div></td><td style="font-size:12.5px">${p.drn}</td><td style="font-size:12px">${fmt(p.appt)}</td><td style="font-size:12.5px">₹${p.paid.toLocaleString('en-IN')}</td><td style="text-align:right;font-weight:600;color:var(--red)">₹${p.due.toLocaleString('en-IN')}</td>`;
    tb.appendChild(tr);
  });
}

/* ── MODAL ── */
function openModal(){document.getElementById('overlay').classList.add('open');document.getElementById('fn').focus()}
function closeModal(){document.getElementById('overlay').classList.remove('open');document.getElementById('avail-modal').innerHTML=''}
document.getElementById('overlay').onclick=e=>{if(e.target===document.getElementById('overlay'))closeModal()}

document.getElementById('ft').addEventListener('change',()=>{
  const v=document.getElementById('ft').value;
  const drId=document.getElementById('fdr').value;
  if(!v||!drId)return;
  const w=new Date(v);const doc=DOCS.find(d=>d.id===drId);
  const wd=w.getDay()===0?6:w.getDay()-1;const sc=doc.sched[wd];
  const res=document.getElementById('avail-modal');
  if(!sc){res.innerHTML='<div class="avail-modal avail-no" style="border-color:var(--rose-border);background:#fef2f2;color:var(--red)"><i class="ti ti-alert-triangle"></i> Doctor is not on duty at this time.</div>';return}
  const [h1,m1]=sc[0].split(':').map(Number),[h2,m2]=sc[1].split(':').map(Number);
  const s=new Date(w);s.setHours(h1,m1,0);const e2=new Date(w);e2.setHours(h2,m2,0);
  if(w<s||w>e2){res.innerHTML='<div class="avail-modal" style="border-color:var(--rose-border);background:#fef2f2;color:var(--red)"><i class="ti ti-alert-triangle"></i> Outside working hours. Hours today: '+sc[0]+'–'+sc[1]+'</div>';return}
  const clash=active().find(p=>p.dr===drId&&Math.abs(new Date(p.appt)-w)<30*60000);
  if(clash){res.innerHTML=`<div class="avail-modal" style="border-color:var(--rose-border);background:#fef2f2;color:var(--red)"><i class="ti ti-alert-triangle"></i> Slot conflict: <strong>${clash.name}</strong> at ${fmt(clash.appt)}</div>`;return}
  res.innerHTML='<div class="avail-modal" style="border-color:rgba(16,185,129,.35);background:#ecfdf5;color:#065f46"><i class="ti ti-circle-check"></i> Doctor is available at this time.</div>';
});

function regPatient(){
  const name=document.getElementById('fn').value.trim();
  const dis=document.getElementById('fd').value.trim();
  const appt=document.getElementById('ft').value;
  if(!name||!dis||!appt){alert('Please fill name, diagnosis and appointment time.');return}
  const drId=document.getElementById('fdr').value;
  const doc=DOCS.find(d=>d.id===drId);
  const newP={id:'p'+ctr,code:`P${String(ctr).padStart(4,'0')}`,name,age:parseInt(document.getElementById('fa').value)||30,g:document.getElementById('fg').value,dis,dr:drId,drn:doc.name,appt,pri:document.getElementById('fp').value,paid:parseFloat(document.getElementById('ff').value)||0,due:parseFloat(document.getElementById('fdue').value)||0,st:'Scheduled'};
  PP.push(newP);ctr++;
  closeModal();
  document.getElementById('fn').value='';document.getElementById('fd').value='';document.getElementById('ft').value='';
  renderDash();
  const cur=document.querySelector('.page.active');
  if(cur){const id=cur.id.replace('page-','');if(id==='patients')renderP();if(id==='queue')renderQ();if(id==='dues')renderDues();if(id==='appointments')renderCal()}
}

renderDash();
renderCal();
</script>
</body>
</html>
