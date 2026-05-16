import { useState, useEffect, useCallback } from "react";

// ─── Supabase Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://nsuefetxyxcsbnrhopqe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdWVmZXR4eXhjc2JucmhvcHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTIyNzEsImV4cCI6MjA5NDUyODI3MX0.zeKFhnZB29ZxTo7wwJGrrldp14MisXQup01FEwmarI4";

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

const db = {
  getLeads: () => sbFetch("leads?order=created_at.desc&select=*"),
  insertLead: (lead) => sbFetch("leads", { method: "POST", body: JSON.stringify(toSnakeLead(lead)) }),
  updateLead: (id, lead) => sbFetch(`leads?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(toSnakeLead(lead)) }),
  getAccounts: () => sbFetch("accounts?order=created_at.desc&select=*"),
  insertAccount: (a) => sbFetch("accounts", { method: "POST", body: JSON.stringify(toSnakeAccount(a)) }),
  updateAccount: (id, a) => sbFetch(`accounts?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(toSnakeAccount(a)) }),
  getContacts: () => sbFetch("contacts?order=created_at.desc&select=*"),
  insertContact: (c) => sbFetch("contacts", { method: "POST", body: JSON.stringify(toSnakeContact(c)) }),
  updateContact: (id, c) => sbFetch(`contacts?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(toSnakeContact(c)) }),
  getOpportunities: () => sbFetch("opportunities?order=created_at.desc&select=*"),
  insertOpportunity: (o) => sbFetch("opportunities", { method: "POST", body: JSON.stringify(toSnakeOpp(o)) }),
  updateOpportunity: (id, o) => sbFetch(`opportunities?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(toSnakeOpp(o)) }),
  getInteractions: () => sbFetch("interactions?order=created_at.desc&select=*"),
  insertInteraction: (i) => sbFetch("interactions", { method: "POST", body: JSON.stringify(toSnakeInt(i)) }),
};

function toSnakeLead(l) {
  return { id: l.id, subject: l.subject, first_name: l.firstName, last_name: l.lastName, title: l.title, email: l.email, phone: l.phone, company: l.company, street: l.street, city: l.city, zip: l.zip, country: l.country, lead_source: l.leadSource, status: l.status, notes: l.notes || [], qualified_at: l.qualifiedAt || null };
}
function fromSnakeLead(l) {
  return { id: l.id, subject: l.subject, firstName: l.first_name, lastName: l.last_name, title: l.title, email: l.email, phone: l.phone, company: l.company, street: l.street, city: l.city, zip: l.zip, country: l.country, leadSource: l.lead_source, status: l.status, notes: l.notes || [], qualifiedAt: l.qualified_at, createdAt: l.created_at };
}
function toSnakeAccount(a) {
  return { id: a.id, name: a.name, website: a.website, industry: a.industry, phone: a.phone, street: a.street, city: a.city, zip: a.zip, country: a.country, from_lead_id: a.fromLeadId || null };
}
function fromSnakeAccount(a) {
  return { id: a.id, name: a.name, website: a.website, industry: a.industry, phone: a.phone, street: a.street, city: a.city, zip: a.zip, country: a.country, fromLeadId: a.from_lead_id, createdAt: a.created_at };
}
function toSnakeContact(c) {
  return { id: c.id, first_name: c.firstName, last_name: c.lastName, title: c.title, email: c.email, phone: c.phone, account_id: c.accountId || null, account_name: c.accountName, from_lead_id: c.fromLeadId || null };
}
function fromSnakeContact(c) {
  return { id: c.id, firstName: c.first_name, lastName: c.last_name, title: c.title, email: c.email, phone: c.phone, accountId: c.account_id, accountName: c.account_name, fromLeadId: c.from_lead_id, createdAt: c.created_at };
}
function toSnakeOpp(o) {
  return { id: o.id, name: o.name, account_id: o.accountId || null, account_name: o.accountName, contact_id: o.contactId || null, contact_name: o.contactName, stage: o.stage, amount: o.amount ? parseFloat(o.amount) : null, close_date: o.closeDate || null, lead_source: o.leadSource, from_lead_id: o.fromLeadId || null };
}
function fromSnakeOpp(o) {
  return { id: o.id, name: o.name, accountId: o.account_id, accountName: o.account_name, contactId: o.contact_id, contactName: o.contact_name, stage: o.stage, amount: o.amount, closeDate: o.close_date, leadSource: o.lead_source, fromLeadId: o.from_lead_id, createdAt: o.created_at };
}
function toSnakeInt(i) {
  return { id: i.id, type: i.type, subject: i.subject, date: i.date, account_id: i.accountId || null, account_name: i.accountName, contact_id: i.contactId || null, contact_name: i.contactName, opportunity_id: i.opportunityId || null, opportunity_name: i.opportunityName, notes: i.notes, outcome: i.outcome, created_by: i.createdBy };
}
function fromSnakeInt(i) {
  return { id: i.id, type: i.type, subject: i.subject, date: i.date, accountId: i.account_id, accountName: i.account_name, contactId: i.contact_id, contactName: i.contact_name, opportunityId: i.opportunity_id, opportunityName: i.opportunity_name, notes: i.notes, outcome: i.outcome, createdBy: i.created_by, createdAt: i.created_at };
}

const COLORS = {
  bg: "#0f1117", surface: "#181c27", card: "#1e2333", border: "#2a3044",
  accent: "#4f8ef7", accentSoft: "#1a2d4f", success: "#34d399", successSoft: "#0d2e22",
  warn: "#fbbf24", warnSoft: "#2e2210", danger: "#f87171", dangerSoft: "#2e1010",
  purple: "#a78bfa", purpleSoft: "#1e1a38", text: "#e2e8f0", muted: "#64748b", subtle: "#94a3b8",
};

const TITLES = ["CEO","CFO","COO","CMO","CRO","CIO","VP","Other"];
const LEAD_SOURCES = ["Website","LinkedIn","Word of Mouth","Other"];
const LEAD_STATUSES = ["New","Working","Nurturing","Qualified","Disqualified"];
const OPP_STAGES = ["Prospecting","Qualification","Proposal","Negotiation","Closed Won","Closed Lost"];
const INTERACTION_TYPES = ["Call","Email","Meeting","Demo","Follow-up","Other"];
const CURRENT_USER = "Sarkis Derbedrossian";

function uid() { return Math.random().toString(36).slice(2, 10); }
function now() { return new Date().toISOString(); }
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtShortDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const Badge = ({ color = COLORS.accent, bg, children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color, background: bg || color + "22" }}>{children}</span>
);

const statusColor = (s) => {
  const map = { New: [COLORS.accent, COLORS.accentSoft], Working: [COLORS.warn, COLORS.warnSoft], Nurturing: [COLORS.purple, COLORS.purpleSoft], Qualified: [COLORS.success, COLORS.successSoft], Disqualified: [COLORS.danger, COLORS.dangerSoft] };
  return map[s] || [COLORS.muted, COLORS.surface];
};

const stageColor = (s) => {
  if (s === "Closed Won") return [COLORS.success, COLORS.successSoft];
  if (s === "Closed Lost") return [COLORS.danger, COLORS.dangerSoft];
  if (s === "Negotiation") return [COLORS.warn, COLORS.warnSoft];
  return [COLORS.accent, COLORS.accentSoft];
};

function Input({ label, value, onChange, type = "text", options, placeholder, required, rows }) {
  const base = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit" };
  if (options) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}{required && " *"}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={base}><option value="">Select…</option>{options.map(o => <option key={o}>{o}</option>)}</select>
    </div>
  );
  if (rows) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}{required && " *"}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{ ...base, resize: "vertical" }} />
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}{required && " *"}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled }) {
  const styles = { primary: { background: COLORS.accent, color: "#fff", border: "none" }, success: { background: COLORS.success, color: "#0a1f14", border: "none" }, danger: { background: COLORS.danger, color: "#fff", border: "none" }, ghost: { background: "transparent", color: COLORS.subtle, border: `1px solid ${COLORS.border}` }, outline: { background: "transparent", color: COLORS.accent, border: `1px solid ${COLORS.accent}` } };
  const sizes = { sm: { padding: "5px 12px", fontSize: 12 }, md: { padding: "8px 18px", fontSize: 13 }, lg: { padding: "11px 24px", fontSize: 14 } };
  return <button onClick={onClick} disabled={disabled} style={{ ...styles[variant], ...sizes[size], borderRadius: 8, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: "inherit" }}>{children}</button>;
}

function Card({ children, style, onClick }) {
  if (onClick) return <button onClick={onClick} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, ...style, width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit", display: "block" }}>{children}</button>;
  return <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, ...style }}>{children}</div>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, width: "100%", maxWidth: wide ? 780 : 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 0, background: COLORS.card, zIndex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return <Card style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div><div><div style={{ fontSize: 26, fontWeight: 900, color: COLORS.text, lineHeight: 1 }}>{value}</div><div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, fontWeight: 600 }}>{label}</div></div></Card>;
}

function LeadForm({ initial, onSave, onCancel }) {
  const empty = { subject: "", firstName: "", lastName: "", title: "", email: "", phone: "", company: "", street: "", city: "", zip: "", country: "", leadSource: "", status: "New", notes: [] };
  const [f, setF] = useState(initial || empty);
  const [newNote, setNewNote] = useState("");
  useEffect(() => { setF(initial || empty); setNewNote(""); }, [initial]);
  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));
  const addNote = () => {
    if (!newNote.trim()) return;
    setF(p => ({ ...p, notes: [...p.notes, { id: uid(), text: newNote.trim(), createdAt: now(), createdBy: CURRENT_USER }] }));
    setNewNote("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Subject" value={f.subject} onChange={set("subject")} required />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="First Name" value={f.firstName} onChange={set("firstName")} required />
        <Input label="Last Name" value={f.lastName} onChange={set("lastName")} required />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Title" value={f.title} onChange={set("title")} options={TITLES} />
        <Input label="Lead Source" value={f.leadSource} onChange={set("leadSource")} options={LEAD_SOURCES} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Email" value={f.email} onChange={set("email")} type="email" />
        <Input label="Phone" value={f.phone} onChange={set("phone")} />
      </div>
      <Input label="Company Name" value={f.company} onChange={set("company")} />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
        <Input label="Street" value={f.street} onChange={set("street")} />
        <Input label="City" value={f.city} onChange={set("city")} />
        <Input label="Zip" value={f.zip} onChange={set("zip")} />
        <Input label="Country" value={f.country} onChange={set("country")} />
      </div>
      <Input label="Status" value={f.status} onChange={set("status")} options={LEAD_STATUSES} />
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Notes</div>
        {[...f.notes].reverse().map(n => (
          <div key={n.id} style={{ background: COLORS.surface, borderRadius: 8, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${COLORS.accent}` }}>
            <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>{n.createdBy} · {fmtDate(n.createdAt)}</div>
            <div style={{ fontSize: 13, color: COLORS.text }}>{n.text}</div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note…" onKeyDown={e => e.key === "Enter" && addNote()} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          <Btn onClick={addNote} variant="ghost" size="sm">+ Add</Btn>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
        <Btn onClick={onCancel} variant="ghost">Cancel</Btn>
        <Btn onClick={() => onSave(f)}>Save Lead</Btn>
      </div>
    </div>
  );
}

function LeadsView({ leads, setLeads, setAccounts, setContacts, setOpportunities, setTab }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [filter, setFilter] = useState("All");

  const qualify = (lead) => {
    const accountId = uid(); const contactId = uid(); const oppId = uid();
    setAccounts(p => [...p, { id: accountId, name: lead.company, website: "", industry: "", phone: lead.phone, street: lead.street, city: lead.city, zip: lead.zip, country: lead.country, createdAt: now(), fromLeadId: lead.id }]);
    setContacts(p => [...p, { id: contactId, firstName: lead.firstName, lastName: lead.lastName, title: lead.title, email: lead.email, phone: lead.phone, accountId, accountName: lead.company, createdAt: now(), fromLeadId: lead.id }]);
    setOpportunities(p => [...p, { id: oppId, name: `${lead.company} — Opportunity`, accountId, accountName: lead.company, contactId, contactName: `${lead.firstName} ${lead.lastName}`, stage: "Prospecting", amount: "", closeDate: "", leadSource: lead.leadSource, createdAt: now(), fromLeadId: lead.id }]);
    setLeads(p => p.map(l => l.id === lead.id ? { ...l, status: "Qualified", qualifiedAt: now() } : l));
    setDetail(null);
    setTimeout(() => setTab("qualified"), 300);
  };

  const saveLead = (f) => {
    if (editing) setLeads(p => p.map(l => l.id === editing.id ? { ...editing, ...f } : l));
    else setLeads(p => [...p, { ...f, id: uid(), createdAt: now(), qualifiedAt: null }]);
    setShowForm(false); setEditing(null);
  };

  const addNoteToDetail = () => {
    if (!newNote.trim() || !detail) return;
    const note = { id: uid(), text: newNote.trim(), createdAt: now(), createdBy: CURRENT_USER };
    const updated = { ...detail, notes: [...detail.notes, note] };
    setLeads(p => p.map(l => l.id === detail.id ? updated : l));
    setDetail(updated); setNewNote("");
  };

  const filtered = filter === "All" ? leads.filter(l => l.status !== "Qualified" && l.status !== "Disqualified") : leads.filter(l => l.status === filter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: COLORS.text }}>Leads</h2><p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>Your pipeline starts here — every big deal was once just a name 🎯</p></div>
        <Btn onClick={() => { setEditing(null); setShowForm(true); }}>+ New Lead</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["All", "New", "Working", "Nurturing"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: filter === s ? COLORS.accent : COLORS.surface, color: filter === s ? "#fff" : COLORS.muted, border: `1px solid ${filter === s ? COLORS.accent : COLORS.border}` }}>{s}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>No leads yet. Go get 'em! 🚀</div>}
        {filtered.map(lead => {
          const [sc, sbg] = statusColor(lead.status);
          return (
            <Card key={lead.id} onClick={() => setDetail(lead)}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: COLORS.accent, fontSize: 15 }}>{lead.firstName?.[0]}{lead.lastName?.[0]}</div>
                  <div><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>{lead.firstName} {lead.lastName}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{lead.title} · {lead.company}</div></div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Badge color={sc} bg={sbg}>{lead.status}</Badge>{lead.leadSource && <Badge color={COLORS.purple} bg={COLORS.purpleSoft}>{lead.leadSource}</Badge>}</div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted, display: "flex", gap: 16, flexWrap: "wrap" }}>
                {lead.subject && <span>📌 {lead.subject}</span>}{lead.email && <span>📧 {lead.email}</span>}{lead.city && <span>📍 {lead.city}, {lead.country}</span>}<span>📝 {lead.notes.length} note{lead.notes.length !== 1 ? "s" : ""}</span>
              </div>
            </Card>
          );
        })}
      </div>
      {showForm && <Modal title={editing ? "Edit Lead" : "New Lead"} onClose={() => { setShowForm(false); setEditing(null); }} wide><LeadForm initial={editing} onSave={saveLead} onCancel={() => { setShowForm(false); setEditing(null); }} /></Modal>}
      {detail && (
        <Modal title={`${detail.firstName} ${detail.lastName}`} onClose={() => setDetail(null)} wide>
          {(() => {
            const [sc, sbg] = statusColor(detail.status);
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Badge color={sc} bg={sbg}>{detail.status}</Badge>{detail.leadSource && <Badge color={COLORS.purple} bg={COLORS.purpleSoft}>{detail.leadSource}</Badge>}{detail.title && <Badge color={COLORS.warn} bg={COLORS.warnSoft}>{detail.title}</Badge>}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[["Company", detail.company], ["Subject", detail.subject], ["Email", detail.email], ["Phone", detail.phone], ["Location", [detail.street, detail.city, detail.zip, detail.country].filter(Boolean).join(", ")], ["Created", fmtShortDate(detail.createdAt)]].map(([k, v]) => v ? <div key={k}><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 13, color: COLORS.text, marginTop: 2 }}>{v}</div></div> : null)}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Notes ({detail.notes.length})</div>
                  {[...detail.notes].reverse().map(n => <div key={n.id} style={{ background: COLORS.surface, borderRadius: 8, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${COLORS.accent}` }}><div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>✍️ {n.createdBy} · {fmtDate(n.createdAt)}</div><div style={{ fontSize: 13, color: COLORS.text }}>{n.text}</div></div>)}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note…" onKeyDown={e => e.key === "Enter" && addNoteToDetail()} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                    <Btn onClick={addNoteToDetail} variant="ghost" size="sm">+ Add</Btn>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                  <Btn onClick={() => { const toEdit = detail; setDetail(null); setTimeout(() => { setEditing(toEdit); setShowForm(true); }, 50); }} variant="ghost">✏️ Edit</Btn>
                  {detail.status !== "Qualified" && detail.status !== "Disqualified" && <Btn onClick={() => qualify(detail)} variant="success" size="md">⚡ Qualify Lead</Btn>}
                  {detail.status !== "Qualified" && detail.status !== "Disqualified" && <Btn onClick={() => { const updated = { ...detail, status: "Disqualified" }; setLeads(p => p.map(l => l.id === detail.id ? updated : l)); setDetail(updated); }} variant="danger" size="md">🚫 Disqualify</Btn>}
                  {detail.status === "Qualified" && <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.success, fontSize: 13, fontWeight: 700 }}>✅ Qualified on {fmtShortDate(detail.qualifiedAt)}</div>}
                  {detail.status === "Disqualified" && <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.danger, fontSize: 13, fontWeight: 700 }}>🚫 Disqualified</div>}
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

function AccountsView({ accounts, setAccounts }) {
  const [detail, setDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { name: "", website: "", industry: "", phone: "", street: "", city: "", zip: "", country: "" };
  const [f, setF] = useState(empty);
  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));
  const save = () => { if (editing) setAccounts(p => p.map(a => a.id === editing.id ? { ...editing, ...f } : a)); else setAccounts(p => [...p, { ...f, id: uid(), createdAt: now() }]); setShowForm(false); setEditing(null); setF(empty); };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: COLORS.text }}>Accounts</h2><p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>The companies you're building relationships with 🏢</p></div>
        <Btn onClick={() => { setEditing(null); setF(empty); setShowForm(true); }}>+ New Account</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {accounts.length === 0 && <div style={{ color: COLORS.muted, gridColumn: "1/-1", textAlign: "center", padding: 40 }}>No accounts yet. Qualify a lead to get started! 🌱</div>}
        {accounts.map(a => <Card key={a.id} onClick={() => setDetail(a)}><div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><div style={{ width: 42, height: 42, borderRadius: 10, background: COLORS.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: COLORS.purple, fontSize: 16, flexShrink: 0 }}>{a.name?.[0]}</div><div><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>{a.name}</div>{a.industry && <div style={{ fontSize: 12, color: COLORS.muted }}>{a.industry}</div>}{(a.city || a.country) && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>📍 {[a.city, a.country].filter(Boolean).join(", ")}</div>}{a.fromLeadId && <Badge color={COLORS.success} bg={COLORS.successSoft}>From Lead</Badge>}</div></div></Card>)}
      </div>
      {showForm && <Modal title={editing ? "Edit Account" : "New Account"} onClose={() => { setShowForm(false); setEditing(null); }}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><Input label="Account Name" value={f.name} onChange={set("name")} required /><Input label="Industry" value={f.industry} onChange={set("industry")} /><Input label="Phone" value={f.phone} onChange={set("phone")} /><Input label="Website" value={f.website} onChange={set("website")} /><div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}><Input label="Street" value={f.street} onChange={set("street")} /><Input label="City" value={f.city} onChange={set("city")} /><Input label="Zip" value={f.zip} onChange={set("zip")} /><Input label="Country" value={f.country} onChange={set("country")} /></div><div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Btn onClick={() => { setShowForm(false); setEditing(null); }} variant="ghost">Cancel</Btn><Btn onClick={save}>Save Account</Btn></div></div></Modal>}
      {detail && <Modal title={detail.name} onClose={() => setDetail(null)}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[["Industry", detail.industry], ["Phone", detail.phone], ["Website", detail.website], ["Address", [detail.street, detail.city, detail.zip, detail.country].filter(Boolean).join(", ")], ["Created", fmtShortDate(detail.createdAt)]].map(([k, v]) => v ? <div key={k}><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 13, color: COLORS.text, marginTop: 2 }}>{v}</div></div> : null)}<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}><Btn onClick={() => { setF({ name: detail.name, website: detail.website || "", industry: detail.industry || "", phone: detail.phone || "", street: detail.street || "", city: detail.city || "", zip: detail.zip || "", country: detail.country || "" }); setEditing(detail); setDetail(null); setShowForm(true); }} variant="ghost">Edit</Btn></div></div></Modal>}
    </div>
  );
}

function ContactsView({ contacts, setContacts, accounts }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const empty = { firstName: "", lastName: "", title: "", email: "", phone: "", accountId: "" };
  const [f, setF] = useState(empty);
  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));
  const save = () => { const acc = accounts.find(a => a.id === f.accountId); if (editing) setContacts(p => p.map(c => c.id === editing.id ? { ...editing, ...f, accountName: acc?.name || "" } : c)); else setContacts(p => [...p, { ...f, id: uid(), createdAt: now(), accountName: acc?.name || "" }]); setShowForm(false); setEditing(null); setF(empty); };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: COLORS.text }}>Contacts</h2><p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>The humans behind the companies — treat them well 🤝</p></div>
        <Btn onClick={() => { setEditing(null); setF(empty); setShowForm(true); }}>+ New Contact</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {contacts.length === 0 && <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>No contacts yet. Qualify a lead to auto-create one! 👋</div>}
        {contacts.map(c => <Card key={c.id} onClick={() => setDetail(c)}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.successSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: COLORS.success, fontSize: 14 }}>{c.firstName?.[0]}{c.lastName?.[0]}</div><div><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>{c.firstName} {c.lastName}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{c.title && `${c.title} · `}{c.accountName}</div></div></div><div style={{ fontSize: 12, color: COLORS.muted, display: "flex", gap: 16 }}>{c.email && <span>📧 {c.email}</span>}{c.phone && <span>📞 {c.phone}</span>}</div></div></Card>)}
      </div>
      {showForm && <Modal title={editing ? "Edit Contact" : "New Contact"} onClose={() => { setShowForm(false); setEditing(null); }}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Input label="First Name" value={f.firstName} onChange={set("firstName")} required /><Input label="Last Name" value={f.lastName} onChange={set("lastName")} required /></div><Input label="Title" value={f.title} onChange={set("title")} options={TITLES} /><Input label="Email" value={f.email} onChange={set("email")} type="email" /><Input label="Phone" value={f.phone} onChange={set("phone")} /><div><label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account</label><select value={f.accountId} onChange={e => set("accountId")(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginTop: 4 }}><option value="">No account</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div><div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Btn onClick={() => { setShowForm(false); setEditing(null); }} variant="ghost">Cancel</Btn><Btn onClick={save}>Save Contact</Btn></div></div></Modal>}
      {detail && <Modal title={`${detail.firstName} ${detail.lastName}`} onClose={() => setDetail(null)}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{detail.title && <Badge color={COLORS.warn} bg={COLORS.warnSoft}>{detail.title}</Badge>}{[["Company", detail.accountName], ["Email", detail.email], ["Phone", detail.phone], ["Created", fmtShortDate(detail.createdAt)]].map(([k, v]) => v ? <div key={k}><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 13, color: COLORS.text, marginTop: 2 }}>{v}</div></div> : null)}<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}><Btn onClick={() => { setF({ firstName: detail.firstName, lastName: detail.lastName, title: detail.title || "", email: detail.email || "", phone: detail.phone || "", accountId: detail.accountId || "" }); setEditing(detail); setDetail(null); setShowForm(true); }} variant="ghost">Edit</Btn></div></div></Modal>}
    </div>
  );
}

function OpportunitiesView({ opportunities, setOpportunities, accounts, contacts }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const empty = { name: "", accountId: "", contactId: "", stage: "Prospecting", amount: "", closeDate: "", leadSource: "" };
  const [f, setF] = useState(empty);
  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));
  const save = () => { const acc = accounts.find(a => a.id === f.accountId); const con = contacts.find(c => c.id === f.contactId); if (editing) setOpportunities(p => p.map(o => o.id === editing.id ? { ...editing, ...f, accountName: acc?.name || "", contactName: con ? `${con.firstName} ${con.lastName}` : "" } : o)); else setOpportunities(p => [...p, { ...f, id: uid(), createdAt: now(), accountName: acc?.name || "", contactName: con ? `${con.firstName} ${con.lastName}` : "" }]); setShowForm(false); setEditing(null); setF(empty); };
  const totalPipeline = opportunities.filter(o => o.stage !== "Closed Lost").reduce((s, o) => s + (parseFloat(o.amount) || 0), 0);
  const totalWon = opportunities.filter(o => o.stage === "Closed Won").reduce((s, o) => s + (parseFloat(o.amount) || 0), 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: COLORS.text }}>Opportunities</h2><p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>Where the magic (and the revenue) happens 💰</p></div>
        <Btn onClick={() => { setEditing(null); setF(empty); setShowForm(true); }}>+ New Opportunity</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <Card><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase" }}>Total Pipeline</div><div style={{ fontSize: 28, fontWeight: 900, color: COLORS.accent, marginTop: 4 }}>${totalPipeline.toLocaleString()}</div></Card>
        <Card><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase" }}>Closed Won</div><div style={{ fontSize: 28, fontWeight: 900, color: COLORS.success, marginTop: 4 }}>${totalWon.toLocaleString()}</div></Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opportunities.length === 0 && <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>No opportunities yet. Qualify a lead to start! 🌊</div>}
        {opportunities.map(o => { const [sc, sbg] = stageColor(o.stage); return <Card key={o.id} onClick={() => setDetail(o)}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}><div><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>{o.name}</div><div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{o.accountName}{o.contactName && ` · ${o.contactName}`}</div></div><div style={{ display: "flex", gap: 10, alignItems: "center" }}>{o.amount && <span style={{ fontWeight: 800, color: COLORS.accent, fontSize: 15 }}>${parseFloat(o.amount).toLocaleString()}</span>}<Badge color={sc} bg={sbg}>{o.stage}</Badge></div></div>{o.closeDate && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>🗓️ Close date: {fmtShortDate(o.closeDate)}</div>}</Card>; })}
      </div>
      {showForm && <Modal title={editing ? "Edit Opportunity" : "New Opportunity"} onClose={() => { setShowForm(false); setEditing(null); }}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><Input label="Opportunity Name" value={f.name} onChange={set("name")} required /><div><label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account</label><select value={f.accountId} onChange={e => set("accountId")(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginTop: 4 }}><option value="">Select account…</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div><div><label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</label><select value={f.contactId} onChange={e => set("contactId")(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginTop: 4 }}><option value="">Select contact…</option>{contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}</select></div><Input label="Stage" value={f.stage} onChange={set("stage")} options={OPP_STAGES} /><Input label="Amount ($)" value={f.amount} onChange={set("amount")} type="number" /><Input label="Close Date" value={f.closeDate} onChange={set("closeDate")} type="date" /><Input label="Lead Source" value={f.leadSource} onChange={set("leadSource")} options={LEAD_SOURCES} /><div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Btn onClick={() => { setShowForm(false); setEditing(null); }} variant="ghost">Cancel</Btn><Btn onClick={save}>Save Opportunity</Btn></div></div></Modal>}
      {detail && (() => { const [sc, sbg] = stageColor(detail.stage); return <Modal title={detail.name} onClose={() => setDetail(null)}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><div style={{ display: "flex", gap: 8 }}><Badge color={sc} bg={sbg}>{detail.stage}</Badge>{detail.leadSource && <Badge color={COLORS.purple} bg={COLORS.purpleSoft}>{detail.leadSource}</Badge>}</div>{detail.amount && <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.accent }}>${parseFloat(detail.amount).toLocaleString()}</div>}{[["Account", detail.accountName], ["Contact", detail.contactName], ["Close Date", detail.closeDate ? fmtShortDate(detail.closeDate) : null], ["Created", fmtShortDate(detail.createdAt)]].map(([k, v]) => v ? <div key={k}><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 13, color: COLORS.text, marginTop: 2 }}>{v}</div></div> : null)}<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}><Btn onClick={() => { setF({ name: detail.name, accountId: detail.accountId || "", contactId: detail.contactId || "", stage: detail.stage, amount: detail.amount || "", closeDate: detail.closeDate || "", leadSource: detail.leadSource || "" }); setEditing(detail); setDetail(null); setShowForm(true); }} variant="ghost">Edit</Btn></div></div></Modal>; })()}
    </div>
  );
}

function InteractionsView({ interactions, setInteractions, accounts, contacts, opportunities }) {
  const [showForm, setShowForm] = useState(false);
  const empty = { type: "", subject: "", date: new Date().toISOString().slice(0,10), accountId: "", contactId: "", opportunityId: "", notes: "", outcome: "" };
  const [f, setF] = useState(empty);
  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));
  const typeIcon = { Call: "📞", Email: "📧", Meeting: "🤝", Demo: "🖥️", "Follow-up": "🔄", Other: "💬" };
  const save = () => { const acc = accounts.find(a => a.id === f.accountId); const con = contacts.find(c => c.id === f.contactId); const opp = opportunities.find(o => o.id === f.opportunityId); setInteractions(p => [{ ...f, id: uid(), createdAt: now(), createdBy: CURRENT_USER, accountName: acc?.name || "", contactName: con ? `${con.firstName} ${con.lastName}` : "", opportunityName: opp?.name || "" }, ...p]); setShowForm(false); setF(empty); };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: COLORS.text }}>Interactions</h2><p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>Every touchpoint logged — because "I think we spoke?" is not a strategy 😅</p></div>
        <Btn onClick={() => { setF(empty); setShowForm(true); }}>+ Log Interaction</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {interactions.length === 0 && <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>No interactions yet. Get out there and talk to people! 📣</div>}
        {interactions.map(i => <Card key={i.id}><div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}><div style={{ width: 42, height: 42, borderRadius: 10, background: COLORS.warnSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{typeIcon[i.type] || "💬"}</div><div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}><div><span style={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>{i.subject || i.type}</span>{i.type && <Badge color={COLORS.warn} bg={COLORS.warnSoft}>{i.type}</Badge>}</div><div style={{ fontSize: 11, color: COLORS.muted }}>{fmtShortDate(i.date)} · {i.createdBy}</div></div><div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, display: "flex", gap: 12, flexWrap: "wrap" }}>{i.accountName && <span>🏢 {i.accountName}</span>}{i.contactName && <span>👤 {i.contactName}</span>}{i.opportunityName && <span>💼 {i.opportunityName}</span>}</div>{i.notes && <div style={{ fontSize: 12, color: COLORS.subtle, marginTop: 8, background: COLORS.surface, padding: "8px 12px", borderRadius: 6 }}>{i.notes}</div>}{i.outcome && <div style={{ fontSize: 12, color: COLORS.success, marginTop: 6 }}>✅ Outcome: {i.outcome}</div>}</div></div></Card>)}
      </div>
      {showForm && <Modal title="Log Interaction" onClose={() => { setShowForm(false); setF(empty); }}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Input label="Type" value={f.type} onChange={set("type")} options={INTERACTION_TYPES} required /><Input label="Date" value={f.date} onChange={set("date")} type="date" /></div><Input label="Subject" value={f.subject} onChange={set("subject")} placeholder="e.g. Discovery call with Sarah" /><div><label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account</label><select value={f.accountId} onChange={e => set("accountId")(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginTop: 4 }}><option value="">No account</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div><div><label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</label><select value={f.contactId} onChange={e => set("contactId")(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginTop: 4 }}><option value="">No contact</option>{contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}</select></div><div><label style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Opportunity</label><select value={f.opportunityId} onChange={e => set("opportunityId")(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginTop: 4 }}><option value="">No opportunity</option>{opportunities.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div><Input label="Notes" value={f.notes} onChange={set("notes")} rows={3} placeholder="What was discussed?" /><Input label="Outcome" value={f.outcome} onChange={set("outcome")} placeholder="e.g. Follow-up call booked for Friday" /><div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Btn onClick={() => { setShowForm(false); setF(empty); }} variant="ghost">Cancel</Btn><Btn onClick={save}>Log It</Btn></div></div></Modal>}
    </div>
  );
}

function Dashboard({ leads, accounts, contacts, opportunities, interactions }) {
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentInts = [...interactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const wonRevenue = opportunities.filter(o => o.stage === "Closed Won").reduce((s, o) => s + (parseFloat(o.amount) || 0), 0);
  const stageCounts = OPP_STAGES.map(s => ({ stage: s, count: opportunities.filter(o => o.stage === s).length }));
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: COLORS.text }}>Dashboard</h2><p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>Your command center. Let's see how you're doing 🎯</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Leads" value={leads.length} icon="🎯" color={COLORS.accent} />
        <StatCard label="Qualified" value={leads.filter(l => l.status === "Qualified").length} icon="⚡" color={COLORS.success} />
        <StatCard label="Accounts" value={accounts.length} icon="🏢" color={COLORS.purple} />
        <StatCard label="Contacts" value={contacts.length} icon="👥" color={COLORS.warn} />
        <StatCard label="Opportunities" value={opportunities.length} icon="💼" color={COLORS.accent} />
        <StatCard label="Won Revenue" value={`$${wonRevenue.toLocaleString()}`} icon="💰" color={COLORS.success} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text, marginBottom: 14 }}>Pipeline by Stage</div>
          {stageCounts.map(({ stage, count }) => { const [sc] = stageColor(stage); const max = Math.max(...stageCounts.map(s => s.count), 1); return <div key={stage} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.subtle, marginBottom: 4 }}><span>{stage}</span><span style={{ fontWeight: 700, color: COLORS.text }}>{count}</span></div><div style={{ height: 6, background: COLORS.border, borderRadius: 3 }}><div style={{ height: 6, width: `${(count / max) * 100}%`, background: sc, borderRadius: 3 }} /></div></div>; })}
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text, marginBottom: 12 }}>Recent Leads</div>
            {recentLeads.length === 0 && <div style={{ color: COLORS.muted, fontSize: 13 }}>No leads yet</div>}
            {recentLeads.map(l => { const [sc, sbg] = statusColor(l.status); return <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{l.firstName} {l.lastName}</div><div style={{ fontSize: 11, color: COLORS.muted }}>{l.company}</div></div><Badge color={sc} bg={sbg}>{l.status}</Badge></div>; })}
          </Card>
          <Card style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text, marginBottom: 12 }}>Recent Interactions</div>
            {recentInts.length === 0 && <div style={{ color: COLORS.muted, fontSize: 13 }}>No interactions yet</div>}
            {recentInts.map(i => <div key={i.id} style={{ marginBottom: 8 }}><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{i.subject || i.type}</div><div style={{ fontSize: 11, color: COLORS.muted }}>{i.accountName} · {fmtShortDate(i.date)}</div></div>)}
          </Card>
        </div>
      </div>
    </div>
  );
}

function QualifiedLeadsView({ leads, setLeads }) {
  const [detail, setDetail] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [filter, setFilter] = useState("All");
  const addNoteToDetail = () => { if (!newNote.trim() || !detail) return; const note = { id: uid(), text: newNote.trim(), createdAt: now(), createdBy: CURRENT_USER }; const updated = { ...detail, notes: [...detail.notes, note] }; setLeads(p => p.map(l => l.id === detail.id ? updated : l)); setDetail(updated); setNewNote(""); };
  const closedLeads = leads.filter(l => l.status === "Qualified" || l.status === "Disqualified");
  const filtered = filter === "All" ? closedLeads : closedLeads.filter(l => l.status === filter);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: COLORS.text }}>Qualified Leads</h2><p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>Leads that have been actioned — the green ones made it! 🏆</p></div>
        <div style={{ display: "flex", gap: 8 }}><Badge color={COLORS.success} bg={COLORS.successSoft}>{leads.filter(l => l.status === "Qualified").length} Qualified</Badge><Badge color={COLORS.danger} bg={COLORS.dangerSoft}>{leads.filter(l => l.status === "Disqualified").length} Disqualified</Badge></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["All", "Qualified", "Disqualified"].map(s => <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: filter === s ? COLORS.accent : COLORS.surface, color: filter === s ? "#fff" : COLORS.muted, border: `1px solid ${filter === s ? COLORS.accent : COLORS.border}` }}>{s}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>No leads here yet — go qualify some! ⚡</div>}
        {filtered.map(lead => { const isQ = lead.status === "Qualified"; const color = isQ ? COLORS.success : COLORS.danger; const bg = isQ ? COLORS.successSoft : COLORS.dangerSoft; return <Card key={lead.id} onClick={() => setDetail(lead)}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color, fontSize: 15 }}>{lead.firstName?.[0]}{lead.lastName?.[0]}</div><div><div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>{lead.firstName} {lead.lastName}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{lead.title} · {lead.company}</div></div></div><div style={{ display: "flex", gap: 8 }}><Badge color={color} bg={bg}>{lead.status}</Badge>{lead.leadSource && <Badge color={COLORS.purple} bg={COLORS.purpleSoft}>{lead.leadSource}</Badge>}</div></div><div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted, display: "flex", gap: 16, flexWrap: "wrap" }}>{lead.email && <span>📧 {lead.email}</span>}{lead.city && <span>📍 {lead.city}, {lead.country}</span>}{isQ && lead.qualifiedAt && <span>✅ Qualified {fmtShortDate(lead.qualifiedAt)}</span>}</div></Card>; })}
      </div>
      {detail && (() => { const isQ = detail.status === "Qualified"; const color = isQ ? COLORS.success : COLORS.danger; const bg = isQ ? COLORS.successSoft : COLORS.dangerSoft; return <Modal title={`${detail.firstName} ${detail.lastName}`} onClose={() => setDetail(null)} wide><div style={{ display: "flex", flexDirection: "column", gap: 20 }}><div style={{ display: "flex", gap: 10 }}><Badge color={color} bg={bg}>{detail.status}</Badge>{detail.leadSource && <Badge color={COLORS.purple} bg={COLORS.purpleSoft}>{detail.leadSource}</Badge>}{detail.title && <Badge color={COLORS.warn} bg={COLORS.warnSoft}>{detail.title}</Badge>}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{[["Company", detail.company], ["Email", detail.email], ["Phone", detail.phone], ["Location", [detail.street, detail.city, detail.zip, detail.country].filter(Boolean).join(", ")], [isQ ? "Qualified On" : "Disqualified On", fmtShortDate(detail.qualifiedAt || detail.createdAt)]].map(([k, v]) => v ? <div key={k}><div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 13, color: COLORS.text, marginTop: 2 }}>{v}</div></div> : null)}</div><div><div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", marginBottom: 10 }}>Notes ({detail.notes.length})</div>{[...detail.notes].reverse().map(n => <div key={n.id} style={{ background: COLORS.surface, borderRadius: 8, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${color}` }}><div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>✍️ {n.createdBy} · {fmtDate(n.createdAt)}</div><div style={{ fontSize: 13, color: COLORS.text }}>{n.text}</div></div>)}<div style={{ display: "flex", gap: 8, marginTop: 8 }}><input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note…" onKeyDown={e => e.key === "Enter" && addNoteToDetail()} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} /><Btn onClick={addNoteToDetail} variant="ghost" size="sm">+ Add</Btn></div></div></div></Modal>; })()}
    </div>
  );
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⚡" },
  { id: "leads", label: "Leads", icon: "🎯" },
  { id: "qualified", label: "Qualified Leads", icon: "✅" },
  { id: "accounts", label: "Accounts", icon: "🏢" },
  { id: "contacts", label: "Contacts", icon: "👥" },
  { id: "opportunities", label: "Opportunities", icon: "💼" },
  { id: "interactions", label: "Interactions", icon: "🔄" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [leads, setLeadsState] = useState([]);
  const [accounts, setAccountsState] = useState([]);
  const [contacts, setContactsState] = useState([]);
  const [opportunities, setOpportunitiesState] = useState([]);
  const [interactions, setInteractionsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [l, a, c, o, i] = await Promise.all([db.getLeads(), db.getAccounts(), db.getContacts(), db.getOpportunities(), db.getInteractions()]);
        setLeadsState(l.map(fromSnakeLead));
        setAccountsState(a.map(fromSnakeAccount));
        setContactsState(c.map(fromSnakeContact));
        setOpportunitiesState(o.map(fromSnakeOpp));
        setInteractionsState(i.map(fromSnakeInt));
      } catch (e) { setDbError(e.message); } finally { setLoading(false); }
    }
    loadAll();
  }, []);

  const setLeads = useCallback((updater) => {
    setLeadsState(prev => { const next = typeof updater === "function" ? updater(prev) : updater; next.forEach(lead => { const old = prev.find(l => l.id === lead.id); if (!old) db.insertLead(lead).catch(console.error); else if (JSON.stringify(old) !== JSON.stringify(lead)) db.updateLead(lead.id, lead).catch(console.error); }); return next; });
  }, []);

  const setAccounts = useCallback((updater) => {
    setAccountsState(prev => { const next = typeof updater === "function" ? updater(prev) : updater; next.forEach(a => { const old = prev.find(x => x.id === a.id); if (!old) db.insertAccount(a).catch(console.error); else if (JSON.stringify(old) !== JSON.stringify(a)) db.updateAccount(a.id, a).catch(console.error); }); return next; });
  }, []);

  const setContacts = useCallback((updater) => {
    setContactsState(prev => { const next = typeof updater === "function" ? updater(prev) : updater; next.forEach(c => { const old = prev.find(x => x.id === c.id); if (!old) db.insertContact(c).catch(console.error); else if (JSON.stringify(old) !== JSON.stringify(c)) db.updateContact(c.id, c).catch(console.error); }); return next; });
  }, []);

  const setOpportunities = useCallback((updater) => {
    setOpportunitiesState(prev => { const next = typeof updater === "function" ? updater(prev) : updater; next.forEach(o => { const old = prev.find(x => x.id === o.id); if (!old) db.insertOpportunity(o).catch(console.error); else if (JSON.stringify(old) !== JSON.stringify(o)) db.updateOpportunity(o.id, o).catch(console.error); }); return next; });
  }, []);

  const setInteractions = useCallback((updater) => {
    setInteractionsState(prev => { const next = typeof updater === "function" ? updater(prev) : updater; next.forEach(i => { const old = prev.find(x => x.id === i.id); if (!old) db.insertInteraction(i).catch(console.error); }); return next; });
  }, []);

  if (loading) return <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}><div style={{ fontSize: 32 }}>⚡</div><div style={{ color: COLORS.text, fontWeight: 800, fontSize: 18 }}>Sarkis CRM</div><div style={{ color: COLORS.muted, fontSize: 13 }}>Forbinder til databasen...</div></div>;
  if (dbError) return <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 40 }}><div style={{ fontSize: 32 }}>🔴</div><div style={{ color: COLORS.text, fontWeight: 800, fontSize: 18 }}>Database fejl</div><div style={{ color: COLORS.danger, fontSize: 13, textAlign: "center", maxWidth: 400 }}>{dbError}</div></div>;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ width: 220, flexShrink: 0, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
          <div style={{ padding: "24px 20px 16px" }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.text, letterSpacing: "-0.5px" }}><span style={{ color: COLORS.accent }}>●</span> Sarkis CRM</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Simple. Smart. Yours.</div>
          </div>
          <nav style={{ flex: 1, padding: "8px 12px" }}>
            {NAV.map(n => {
              const count = n.id === "qualified" ? leads.filter(l => l.status === "Qualified" || l.status === "Disqualified").length : null;
              return <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, marginBottom: 2, background: tab === n.id ? COLORS.accentSoft : "transparent", color: tab === n.id ? COLORS.accent : COLORS.muted, border: "none", cursor: "pointer", textAlign: "left", fontWeight: tab === n.id ? 800 : 600, fontSize: 13, fontFamily: "inherit" }}><span style={{ fontSize: 16 }}>{n.icon}</span><span style={{ flex: 1 }}>{n.label}</span>{count > 0 && <span style={{ background: COLORS.success, color: "#0a1f14", borderRadius: 10, fontSize: 10, fontWeight: 900, padding: "1px 7px" }}>{count}</span>}</button>;
            })}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: COLORS.accent, fontSize: 13 }}>SD</div>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{CURRENT_USER}</div><div style={{ fontSize: 10, color: COLORS.muted }}>Admin</div></div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 28, overflowX: "hidden" }}>
          {tab === "dashboard" && <Dashboard leads={leads} accounts={accounts} contacts={contacts} opportunities={opportunities} interactions={interactions} />}
          {tab === "leads" && <LeadsView leads={leads} setLeads={setLeads} setAccounts={setAccounts} setContacts={setContacts} setOpportunities={setOpportunities} setTab={setTab} />}
          {tab === "qualified" && <QualifiedLeadsView leads={leads} setLeads={setLeads} />}
          {tab === "accounts" && <AccountsView accounts={accounts} setAccounts={setAccounts} />}
          {tab === "contacts" && <ContactsView contacts={contacts} setContacts={setContacts} accounts={accounts} />}
          {tab === "opportunities" && <OpportunitiesView opportunities={opportunities} setOpportunities={setOpportunities} accounts={accounts} contacts={contacts} />}
          {tab === "interactions" && <InteractionsView interactions={interactions} setInteractions={setInteractions} accounts={accounts} contacts={contacts} opportunities={opportunities} />}
        </div>
      </div>
    </div>
  );
}

