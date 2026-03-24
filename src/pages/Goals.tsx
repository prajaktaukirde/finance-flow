import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, TrendingUp, Trash2 } from "lucide-react";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { goals as initialGoals } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const GOAL_ICONS = ["🏠", "✈️", "🚗", "💍", "📚", "💻", "🏋️", "🌴", "💰", "🎯"];
const GOAL_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
const emptyGoal = { name: "", target: "", current: "", deadline: "", category: "Savings", icon: "🎯", color: GOAL_COLORS[0] };

export default function Goals() {
  const [goals, setGoals] = useState(initialGoals);
  const [addModal, setAddModal] = useState(false);
  const [selected, setSelected] = useState<typeof goals[0] | null>(null);
  const [contribution, setContribution] = useState("");
  const [form, setForm] = useState(emptyGoal);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);

  const openAdd = () => {
    setForm(emptyGoal);
    setFormErrors({});
    setAddModal(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Goal name is required.";
    if (!form.target || Number(form.target) <= 0) e.target = "Enter a valid target amount.";
    if (form.current && Number(form.current) < 0) e.current = "Amount cannot be negative.";
    if (!form.deadline) e.deadline = "Deadline is required.";
    return e;
  };

  const handleSaveGoal = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setGoals(prev => [...prev, {
      id: Date.now().toString(), name: form.name, target: Number(form.target),
      current: Number(form.current) || 0, deadline: form.deadline,
      category: form.category, icon: form.icon, color: form.color
    }]);
    toast.success("Goal created! 🎯");
    setAddModal(false);
  };

  const handleAddContribution = () => {
    const amount = Number(contribution);
    if (!contribution || isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid contribution amount.");
      return;
    }
    if (!selected) return;
    setGoals(prev => prev.map(g => g.id === selected.id ? { ...g, current: Math.min(g.current + amount, g.target) } : g));
    toast.success(`₹${amount.toLocaleString("en-IN")} added to ${selected.name}! 💰`);
    setContribution("");
    setSelected(null);
  };

  const handleDeleteGoal = () => {
    if (!selected) return;
    setGoals(prev => prev.filter(g => g.id !== selected.id));
    toast.success("Goal deleted!");
    setSelected(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Savings Goals" subtitle="Track your financial milestones">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Goal
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Goals", value: goals.length, sub: "active goals", icon: "🎯" },
          { label: "Total Saved", value: `₹${totalCurrent.toLocaleString("en-IN")}`, sub: `of ₹${totalTarget.toLocaleString("en-IN")} target`, icon: "💰" },
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
            <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-5 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: g.color + "20" }}>{g.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{g.name}</h3>
                    <p className="text-xs text-muted-foreground">{g.category}</p>
                  </div>
                </div>
                <Badge variant={pct >= 100 ? "success" : pct >= 70 ? "info" : pct >= 40 ? "warning" : "default"}>{pct >= 100 ? "Done! 🎉" : `${pct.toFixed(0)}%`}</Badge>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-foreground">₹{g.current.toLocaleString("en-IN")}</span>
                  <span className="text-muted-foreground">of ₹{g.target.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full" style={{ backgroundColor: g.color }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar size={12} /><span>{daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}</span></div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><TrendingUp size={12} /><span>₹{Math.round(monthlyNeeded).toLocaleString("en-IN")}/mo needed</span></div>
              </div>
              <button onClick={() => { setContribution(""); setSelected(g); }}
                className="w-full py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: g.color + "20", color: g.color }}>
                + Add Contribution
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Contribution Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Add Contribution">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: selected.color + "20" }}>{selected.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">{selected.category} · Due {new Date(selected.deadline).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Saved", value: `₹${selected.current.toLocaleString("en-IN")}`, color: "text-success" },
                { label: "Remaining", value: `₹${(selected.target - selected.current).toLocaleString("en-IN")}`, color: "text-warning" },
                { label: "Progress", value: `${((selected.current / selected.target) * 100).toFixed(0)}%`, color: "text-primary" },
              ].map(s => (
                <div key={s.label} className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={cn("text-sm font-bold mt-0.5", s.color)}>{s.value}</p>
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Contribution Amount (₹)</label>
              <input type="number" value={contribution} onChange={e => setContribution(e.target.value)} placeholder="Enter amount" min="0"
                className="w-full px-3 py-2.5 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleDeleteGoal} className="py-2.5 px-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1.5">
                <Trash2 size={14} /> Delete
              </button>
              <button onClick={handleAddContribution} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
                Add to Goal
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Goal Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Create New Goal">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Goal Name</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Emergency Fund"
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.name ? "border-destructive" : "border-border")} />
            {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Target Amount (₹)</label>
              <input type="number" value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} placeholder="0" min="0"
                className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.target ? "border-destructive" : "border-border")} />
              {formErrors.target && <p className="text-xs text-destructive mt-1">{formErrors.target}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Current Amount (₹)</label>
              <input type="number" value={form.current} onChange={e => setForm(p => ({ ...p, current: e.target.value }))} placeholder="0" min="0"
                className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.deadline ? "border-destructive" : "border-border")} />
            {formErrors.deadline && <p className="text-xs text-destructive mt-1">{formErrors.deadline}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">Pick an Icon</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setForm(p => ({ ...p, icon: ic }))}
                  className={cn("w-9 h-9 rounded-lg text-lg transition-all", form.icon === ic ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-muted/80")}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">Pick a Color</label>
            <div className="flex gap-2">
              {GOAL_COLORS.map(col => (
                <button key={col} type="button" onClick={() => setForm(p => ({ ...p, color: col }))}
                  className={cn("w-7 h-7 rounded-full transition-all", form.color === col ? "ring-2 ring-offset-2 ring-offset-card" : "")}
                  style={{ backgroundColor: col, boxShadow: form.color === col ? `0 0 0 2px ${col}` : undefined }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleSaveGoal} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Create Goal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
