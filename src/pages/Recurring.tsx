import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ToggleLeft, ToggleRight, Edit3, Calendar, RefreshCcw } from "lucide-react";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { recurringTransactions } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Recurring() {
  const [items, setItems] = useState(recurringTransactions);
  const [addModal, setAddModal] = useState(false);

  const toggle = (id: string) => setItems(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));

  const monthlyTotal = items.filter(r => r.active).reduce((s, r) => s + r.amount, 0);
  const upcomingCount = items.filter(r => r.active && new Date(r.nextDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Recurring Transactions" subtitle="Manage automatic payments and income">
        <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Recurring
        </button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Monthly Net", value: `${monthlyTotal > 0 ? "+" : ""}$${monthlyTotal.toFixed(2)}`, color: monthlyTotal > 0 ? "text-success" : "text-destructive" },
          { label: "Active Rules", value: items.filter(r => r.active).length, color: "text-primary" },
          { label: "Due This Week", value: upcomingCount, color: upcomingCount > 0 ? "text-warning" : "text-foreground" },
        ].map((s, i) => (
          <GlassCard key={s.label} className="p-5 text-center" delay={i}>
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <RefreshCcw size={16} className="text-primary" />
            <h3 className="font-semibold text-foreground">All Recurring Transactions</h3>
          </div>
        </div>

        {items.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={cn("flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors", !r.active && "opacity-50")}
          >
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
              {r.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{r.name}</p>
                <Badge variant={r.amount > 0 ? "success" : "default"}>{r.category}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCcw size={10} /> {r.frequency}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar size={10} /> Next: {new Date(r.nextDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
            <div className={cn("text-base font-bold flex-shrink-0", r.amount > 0 ? "text-success" : "text-foreground")}>
              {r.amount > 0 ? "+" : ""}${Math.abs(r.amount).toFixed(2)}
            </div>
            <button onClick={() => toggle(r.id)} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
              {r.active ? <ToggleRight size={24} className="text-primary" /> : <ToggleLeft size={24} />}
            </button>
          </motion.div>
        ))}
      </GlassCard>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Recurring Transaction">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
            <input type="text" placeholder="e.g. Netflix Subscription" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Amount ($)</label>
              <input type="number" placeholder="0.00" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Frequency</label>
              <select className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                <option>Monthly</option><option>Weekly</option><option>Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Next Date</label>
            <input type="date" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {["Entertainment", "Utilities", "Health", "Income", "Education"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
            <button className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
