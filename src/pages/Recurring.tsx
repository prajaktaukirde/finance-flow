import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ToggleLeft, ToggleRight, Calendar, RefreshCcw, Trash2 } from "lucide-react";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { recurringTransactions as initialRecurring } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const emptyForm = { name: "", amount: "", frequency: "Monthly", nextDate: "", category: "Entertainment", type: "expense" as "income" | "expense" };
const CATEGORIES = ["Entertainment", "Utilities", "Health", "Income", "Education", "Insurance", "Subscriptions", "Other"];

export default function Recurring() {
  const [items, setItems] = useState(initialRecurring);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const toggle = (id: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const item = items.find(r => r.id === id);
    if (item) toast(item.active ? `${item.name} paused` : `${item.name} activated`, { icon: item.active ? "⏸️" : "▶️" });
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(r => r.id !== id));
    toast.success("Recurring transaction removed!");
  };

  const monthlyTotal = items.filter(r => r.active).reduce((s, r) => s + r.amount, 0);
  const upcomingCount = items.filter(r => r.active && new Date(r.nextDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter a valid amount.";
    if (!form.nextDate) e.nextDate = "Next date is required.";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const icons: Record<string, string> = { Entertainment: "🎬", Utilities: "⚡", Health: "💊", Income: "💰", Education: "📚", Insurance: "🛡️", Subscriptions: "📱", Other: "💳" };
    const amount = form.type === "expense" ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount));
    setItems(prev => [...prev, {
      id: Date.now().toString(), name: form.name, amount, frequency: form.frequency,
      nextDate: form.nextDate, category: form.category, icon: icons[form.category] || "💳", active: true
    }]);
    toast.success("Recurring transaction added! 🔄");
    setAddModal(false);
    setForm(emptyForm);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Recurring Transactions" subtitle="Manage automatic payments and income">
        <button onClick={() => { setForm(emptyForm); setFormErrors({}); setAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Recurring
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Monthly Net", value: `${monthlyTotal > 0 ? "+" : ""}₹${Math.abs(monthlyTotal).toLocaleString("en-IN")}`, color: monthlyTotal > 0 ? "text-success" : "text-destructive" },
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
        <div className="p-5 border-b border-border flex items-center gap-2">
          <RefreshCcw size={16} className="text-primary" />
          <h3 className="font-semibold text-foreground">All Recurring Transactions</h3>
        </div>
        {items.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-4xl mb-2">🔄</p>
            <p>No recurring transactions yet</p>
          </div>
        ) : items.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className={cn("flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors", !r.active && "opacity-50")}>
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">{r.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{r.name}</p>
                <Badge variant={r.amount > 0 ? "success" : "default"}>{r.category}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><RefreshCcw size={10} /> {r.frequency}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={10} /> Next: {new Date(r.nextDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
              </div>
            </div>
            <div className={cn("text-base font-bold flex-shrink-0", r.amount > 0 ? "text-success" : "text-foreground")}>
              {r.amount > 0 ? "+" : ""}₹{Math.abs(r.amount).toLocaleString("en-IN")}
            </div>
            <button onClick={() => toggle(r.id)} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
              {r.active ? <ToggleRight size={24} className="text-primary" /> : <ToggleLeft size={24} />}
            </button>
            <button onClick={() => deleteItem(r.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </GlassCard>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Recurring Transaction">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setForm(p => ({ ...p, type: "income" }))} className={cn("py-2.5 rounded-xl border-2 text-sm font-medium transition-colors", form.type === "income" ? "border-success bg-success/10 text-success" : "border-border text-muted-foreground hover:border-success/50")}>💰 Income</button>
            <button onClick={() => setForm(p => ({ ...p, type: "expense" }))} className={cn("py-2.5 rounded-xl border-2 text-sm font-medium transition-colors", form.type === "expense" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:border-destructive/50")}>💸 Expense</button>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Netflix Subscription"
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.name ? "border-destructive" : "border-border")} />
            {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" min="0"
                className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.amount ? "border-destructive" : "border-border")} />
              {formErrors.amount && <p className="text-xs text-destructive mt-1">{formErrors.amount}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Frequency</label>
              <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Next Date</label>
            <input type="date" value={form.nextDate} onChange={e => setForm(p => ({ ...p, nextDate: e.target.value }))}
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground", formErrors.nextDate ? "border-destructive" : "border-border")} />
            {formErrors.nextDate && <p className="text-xs text-destructive mt-1">{formErrors.nextDate}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
