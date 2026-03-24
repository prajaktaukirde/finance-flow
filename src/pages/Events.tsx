import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, CalendarDays, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { events as initialEvents } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const emptyForm = { name: "", date: "", category: "Travel", members: "" };
const CATEGORIES = ["Travel", "Party", "Dining", "Household", "Entertainment", "Sports", "Other"];
const ICONS: Record<string, string> = { Travel: "✈️", Party: "🎉", Dining: "🍽️", Household: "🏠", Entertainment: "🎬", Sports: "⚽", Other: "📅" };

export default function Events() {
  const [events, setEvents] = useState(initialEvents);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const totalAmount = events.reduce((s, e) => s + e.totalAmount, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Event name is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.members.trim()) e.members = "Add at least one member.";
    return e;
  };

  const handleCreate = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const memberNames = form.members.split(",").map(m => m.trim()).filter(Boolean);
    if (memberNames.length === 0) { setFormErrors({ members: "Add at least one member." }); return; }
    const newEvent = {
      id: Date.now().toString(),
      name: form.name, icon: ICONS[form.category] || "📅",
      date: form.date, totalAmount: 0,
      members: memberNames.map((name, idx) => ({ id: String(idx + 1), name, avatar: name[0].toUpperCase(), paid: 0, owes: 0 })),
      expenses: [], status: "active", category: form.category
    };
    setEvents(prev => [newEvent, ...prev]);
    toast.success(`Event "${form.name}" created! 🎉`);
    setAddModal(false);
    setForm(emptyForm);
    setTimeout(() => navigate(`/events/${newEvent.id}`), 300);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvents(prev => prev.filter(ev => ev.id !== id));
    toast.success(`"${name}" deleted!`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Group Events" subtitle="Track shared expenses with friends & family">
        <button onClick={() => { setForm(emptyForm); setFormErrors({}); setAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Create Event
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Events", value: events.length, icon: "🗓️" },
          { label: "Active Events", value: events.filter(e => e.status === "active").length, icon: "⚡" },
          { label: "Total Tracked", value: `₹${totalAmount.toLocaleString("en-IN")}`, icon: "💰" },
        ].map((s, i) => (
          <GlassCard key={s.label} className="p-5 text-center" delay={i}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((event, i) => {
          const perPerson = event.members.length > 0 ? event.totalAmount / event.members.length : 0;
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/events/${event.id}`)} className="glass-card rounded-xl p-5 hover-lift cursor-pointer relative group">
              <button onClick={(e) => handleDelete(event.id, event.name, e)}
                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                <Trash2 size={14} />
              </button>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">{event.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground leading-tight pr-6">{event.name}</h3>
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  </div>
                </div>
                <Badge variant={event.status === "active" ? "success" : "default"}>{event.status === "active" ? "Active" : "Settled"}</Badge>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex -space-x-2">
                  {event.members.slice(0, 4).map((m) => (
                    <div key={m.id} className="w-7 h-7 rounded-full gradient-primary border-2 border-card flex items-center justify-center text-primary-foreground text-xs font-bold">{m.avatar[0]}</div>
                  ))}
                  {event.members.length > 4 && <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-bold text-muted-foreground">+{event.members.length - 4}</div>}
                </div>
                <span className="text-xs text-muted-foreground ml-1 flex items-center gap-1"><Users size={11} /> {event.members.length} members</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-muted rounded-lg p-2.5">
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold text-foreground text-sm">₹{event.totalAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-muted rounded-lg p-2.5">
                  <p className="text-muted-foreground">Per Person</p>
                  <p className="font-bold text-foreground text-sm">₹{Math.round(perPerson).toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays size={11} /> {new Date(event.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                <span className="flex items-center gap-1">{event.expenses.length} expenses <ChevronRight size={12} /></span>
              </div>
            </motion.div>
          );
        })}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: events.length * 0.1 }}
          onClick={() => { setForm(emptyForm); setFormErrors({}); setAddModal(true); }}
          className="glass-card rounded-xl p-5 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all flex flex-col items-center justify-center min-h-48 gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-blue"><Plus size={22} className="text-primary-foreground" /></div>
          <div className="text-center">
            <p className="font-medium text-foreground">Create New Event</p>
            <p className="text-xs text-muted-foreground mt-0.5">Split expenses with friends</p>
          </div>
        </motion.div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Create New Event">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Event Name</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Weekend Trip to Goa"
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.name ? "border-destructive" : "border-border")} />
            {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.date ? "border-destructive" : "border-border")} />
            {formErrors.date && <p className="text-xs text-destructive mt-1">{formErrors.date}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Members (comma-separated names)</label>
            <input type="text" value={form.members} onChange={e => setForm(p => ({ ...p, members: e.target.value }))} placeholder="Rahul, Priya, Arjun..."
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.members ? "border-destructive" : "border-border")} />
            {formErrors.members && <p className="text-xs text-destructive mt-1">{formErrors.members}</p>}
            {form.members && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.members.split(",").map(m => m.trim()).filter(Boolean).map((m, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">{m}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Create Event</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
