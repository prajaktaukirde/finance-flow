import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, CalendarDays, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { events } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Events() {
  const [addModal, setAddModal] = useState(false);
  const navigate = useNavigate();

  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === "active").length;
  const totalAmount = events.reduce((s, e) => s + e.totalAmount, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Group Events" subtitle="Track shared expenses with friends & family">
        <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Create Event
        </button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Events", value: totalEvents, icon: "🗓️" },
          { label: "Active Events", value: activeEvents, icon: "⚡" },
          { label: "Total Tracked", value: `$${totalAmount.toLocaleString()}`, icon: "💰" },
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
          const perPerson = event.totalAmount / event.members.length;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/events/${event.id}`)}
              className="glass-card rounded-xl p-5 hover-lift cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {event.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground leading-tight">{event.name}</h3>
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  </div>
                </div>
                <Badge variant={event.status === "active" ? "success" : "default"}>
                  {event.status === "active" ? "Active" : "Settled"}
                </Badge>
              </div>

              {/* Members */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex -space-x-2">
                  {event.members.slice(0, 4).map((m) => (
                    <div key={m.id} className="w-7 h-7 rounded-full gradient-primary border-2 border-card flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {m.avatar[0]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">{event.members.length} members</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-muted rounded-lg p-2.5">
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold text-foreground text-sm">${event.totalAmount.toFixed(2)}</p>
                </div>
                <div className="bg-muted rounded-lg p-2.5">
                  <p className="text-muted-foreground">Per Person</p>
                  <p className="font-bold text-foreground text-sm">${perPerson.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays size={11} /> {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="flex items-center gap-1">{event.expenses.length} expenses <ChevronRight size={12} /></span>
              </div>
            </motion.div>
          );
        })}

        {/* Add new card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: events.length * 0.1 }}
          onClick={() => setAddModal(true)}
          className="glass-card rounded-xl p-5 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all flex flex-col items-center justify-center min-h-48 gap-3"
        >
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-blue">
            <Plus size={22} className="text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Create New Event</p>
            <p className="text-xs text-muted-foreground mt-0.5">Split expenses with friends</p>
          </div>
        </motion.div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Create New Event">
        <div className="space-y-4">
          {[{ label: "Event Name", type: "text", placeholder: "e.g. Weekend Trip to NYC" },
            { label: "Date", type: "date", placeholder: "" }].map(({ label, type, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
              <input type={type} placeholder={placeholder} className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {["Travel", "Party", "Dining", "Household", "Entertainment", "Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Members (comma-separated emails)</label>
            <input type="text" placeholder="friend1@email.com, friend2@email.com" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
            <button className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90">Create Event</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
