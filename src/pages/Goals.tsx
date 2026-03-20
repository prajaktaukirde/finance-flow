import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Calendar, TrendingUp } from "lucide-react";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { goals } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Goals() {
  const [addModal, setAddModal] = useState(false);
  const [selected, setSelected] = useState<typeof goals[0] | null>(null);

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Savings Goals" subtitle="Track your financial milestones">
        <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Goal
        </button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Goals", value: goals.length, sub: "active goals", icon: "🎯" },
          { label: "Total Saved", value: `$${totalCurrent.toLocaleString()}`, sub: `of $${totalTarget.toLocaleString()} target`, icon: "💰" },
          { label: "Overall Progress", value: `${((totalCurrent / totalTarget) * 100).toFixed(0)}%`, sub: "completion rate", icon: "📈" },
        ].map((s, i) => (
          <GlassCard key={s.label} className="p-5 text-center" delay={i}>
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = (g.current / g.target) * 100;
          const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const monthlyNeeded = (g.target - g.current) / Math.max(1, Math.ceil(daysLeft / 30));

          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(g)}
              className="glass-card rounded-xl p-5 hover-lift cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: g.color + "20" }}>
                    {g.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{g.name}</h3>
                    <p className="text-xs text-muted-foreground">{g.category}</p>
                  </div>
                </div>
                <Badge variant={pct >= 100 ? "success" : pct >= 70 ? "info" : pct >= 40 ? "warning" : "default"}>
                  {pct >= 100 ? "Completed!" : `${pct.toFixed(0)}%`}
                </Badge>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-foreground">${g.current.toLocaleString()}</span>
                  <span className="text-muted-foreground">of ${g.target.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar size={12} />
                  <span>{daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp size={12} />
                  <span>${monthlyNeeded.toFixed(0)}/mo needed</span>
                </div>
              </div>

              {/* Contribute button */}
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="w-full mt-4 py-2 rounded-xl text-xs font-medium transition-all"
                style={{ backgroundColor: g.color + "20", color: g.color }}
              >
                + Add Contribution
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Goal Details" size="md">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: selected.color + "20" }}>
                {selected.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">{selected.category} · Due {new Date(selected.deadline).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Saved", value: `$${selected.current.toLocaleString()}`, color: "text-success" },
                { label: "Remaining", value: `$${(selected.target - selected.current).toLocaleString()}`, color: "text-warning" },
                { label: "Progress", value: `${((selected.current / selected.target) * 100).toFixed(0)}%`, color: "text-primary" },
              ].map(s => (
                <div key={s.label} className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={cn("text-base font-bold", s.color)}>{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Add Contribution ($)</label>
              <input type="number" placeholder="Enter amount" className="w-full px-3 py-2.5 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
            </div>
            <button className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
              Add to Goal
            </button>
          </div>
        )}
      </Modal>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Create New Goal">
        <div className="space-y-4">
          {[{ label: "Goal Name", type: "text", placeholder: "e.g. Emergency Fund" },
            { label: "Target Amount ($)", type: "number", placeholder: "0.00" },
            { label: "Current Amount ($)", type: "number", placeholder: "0.00" },
            { label: "Deadline", type: "date", placeholder: "" }].map(({ label, type, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
              <input type={type} placeholder={placeholder} className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
            <button className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90">Create Goal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
