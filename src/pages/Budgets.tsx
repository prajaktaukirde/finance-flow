import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { budgetAPI } from "@/services/api";

const CATEGORIES = ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Health & Fitness", "Bills & Utilities"];
const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
const emptyForm = { category: CATEGORIES[0], allocated: "", spent: "" };

export default function Budgets() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch budgets from API
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await budgetAPI.getAll();
        setBudgets(response.data);
      } catch (error) {
        toast.error('Failed to load budgets');
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overBudget = budgets.filter(b => b.spent > b.allocated).length;

  const openAdd = () => {
    setForm(emptyForm);
    setFormErrors({});
    setEditItem(null);
    setAddModal(true);
  };

  const openEdit = (b: typeof budgets[0]) => {
    setForm({ category: b.category, allocated: String(b.allocated), spent: String(b.spent) });
    setFormErrors({});
    setEditItem(b);
    setAddModal(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.allocated || Number(form.allocated) <= 0) e.allocated = "Enter a valid limit.";
    if (form.spent && Number(form.spent) < 0) e.spent = "Spent cannot be negative.";
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const icons: Record<string, string> = { "Food & Dining": "🍽️", "Transportation": "🚗", "Shopping": "🛍️", "Entertainment": "🎬", "Health & Fitness": "💪", "Bills & Utilities": "⚡" };
    
    try {
      if (editItem) {
        const response = await budgetAPI.update(editItem._id, {
          category: form.category,
          allocated: Number(form.allocated),
          spent: Number(form.spent) || editItem.spent
        });
        setBudgets(prev => prev.map(b => b._id === editItem._id ? response.data : b));
        toast.success("Budget updated! ✅");
      } else {
        const response = await budgetAPI.create({
          category: form.category,
          icon: icons[form.category] || "💰",
          allocated: Number(form.allocated),
          spent: Number(form.spent) || 0,
          color
        });
        setBudgets(prev => [...prev, response.data]);
        toast.success("Budget created! 🎯");
      }
      setAddModal(false); setEditItem(null);
    } catch (error: any) {
      console.error('Budget save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async () => {
    if (!editItem) return;
    try {
      await budgetAPI.delete(editItem._id);
      setBudgets(prev => prev.filter(b => b._id !== editItem._id));
      toast.success("Budget deleted!");
      setAddModal(false); setEditItem(null);
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Budgets" subtitle="Manage your monthly spending limits">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Budget
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Allocated", value: `₹${totalAllocated.toLocaleString("en-IN")}`, sub: "per month", color: "text-primary" },
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, sub: `${((totalSpent / totalAllocated) * 100).toFixed(0)}% of budget`, color: totalSpent > totalAllocated ? "text-destructive" : "text-foreground" },
          { label: "Over Budget", value: `${overBudget}`, sub: `of ${budgets.length} categories`, color: overBudget > 0 ? "text-destructive" : "text-success" },
        ].map((s, i) => (
          <GlassCard key={s.label} className="p-5 text-center" delay={i}>
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b, i) => {
          const pct = Math.min((b.spent / b.allocated) * 100, 100);
          const remaining = b.allocated - b.spent;
          const isOver = b.spent > b.allocated;
          const isWarning = pct >= 80 && !isOver;

          return (
            <motion.div key={b._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-5 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: b.color + "20" }}>{b.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{b.category}</h3>
                    <p className="text-xs text-muted-foreground">₹{b.allocated.toLocaleString("en-IN")} / month limit</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={isOver ? "destructive" : isWarning ? "warning" : "success"}>{isOver ? "Over" : isWarning ? "Warning" : "On Track"}</Badge>
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Edit3 size={14} /></button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className={cn("font-semibold", isOver ? "text-destructive" : "text-foreground")}>₹{b.spent.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.4 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full" style={{ backgroundColor: isOver ? "#ef4444" : isWarning ? "#f59e0b" : b.color }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{pct.toFixed(0)}% used</span>
                  <span className={cn(remaining < 0 ? "text-destructive font-medium" : "")}>
                    {remaining < 0 ? `₹${Math.abs(remaining).toLocaleString("en-IN")} over` : `₹${remaining.toLocaleString("en-IN")} left`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal open={addModal} onClose={() => { setAddModal(false); setEditItem(null); }} title={editItem ? "Edit Budget" : "Add Budget"}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Monthly Limit (₹)</label>
            <input type="number" value={form.allocated} onChange={e => setForm(p => ({ ...p, allocated: e.target.value }))} placeholder="0" min="0"
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.allocated ? "border-destructive" : "border-border")} />
            {formErrors.allocated && <p className="text-xs text-destructive mt-1">{formErrors.allocated}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount Spent So Far (₹)</label>
            <input type="number" value={form.spent} onChange={e => setForm(p => ({ ...p, spent: e.target.value }))} placeholder="0" min="0"
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setAddModal(false); setEditItem(null); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            {editItem && <button onClick={handleDelete} className="p-2.5 px-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1.5"><Trash2 size={14} /></button>}
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
              {editItem ? "Update Budget" : "Save Budget"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
