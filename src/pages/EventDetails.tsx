import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Check, Users, DollarSign, Receipt } from "lucide-react";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/UI";
import { events } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

function computeSettlements(members: typeof events[0]["members"], expenses: typeof events[0]["expenses"]) {
  const totalPerPerson = expenses.reduce((s, e) => s + e.amount, 0) / members.length;
  const balances = members.map(m => {
    const paid = expenses.filter(e => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0);
    return { ...m, balance: paid - totalPerPerson };
  });
  const settlements: { from: string; to: string; amount: number }[] = [];
  const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b }));
  const creditors = balances.filter(b => b.balance > 0.01).map(b => ({ ...b }));
  debtors.forEach(debtor => {
    creditors.forEach(creditor => {
      if (Math.abs(debtor.balance) > 0.01 && creditor.balance > 0.01) {
        const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
        settlements.push({ from: debtor.name, to: creditor.name, amount });
        debtor.balance += amount;
        creditor.balance -= amount;
      }
    });
  });
  return { settlements, totalPerPerson };
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);

  if (!event) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Event not found</p>
        <button onClick={() => navigate("/events")} className="mt-3 text-primary hover:underline text-sm">← Back to Events</button>
      </div>
    );
  }

  const { settlements, totalPerPerson } = computeSettlements(event.members, event.expenses);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/events")} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">{event.icon}</div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{event.name}</h1>
            <p className="text-sm text-muted-foreground">{event.category} · {new Date(event.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>
        <Badge variant={event.status === "active" ? "success" : "default"}>{event.status === "active" ? "Active" : "Settled"}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Amount", value: `₹${event.totalAmount.toLocaleString("en-IN")}`, icon: "💰" },
              { label: "Per Person", value: `₹${Math.round(totalPerPerson).toLocaleString("en-IN")}`, icon: "👤" },
              { label: "Expenses", value: event.expenses.length, icon: "🧾" },
            ].map((s, i) => (
              <GlassCard key={s.label} className="p-4 text-center" delay={i}>
                <p className="text-xl mb-0.5">{s.icon}</p>
                <p className="font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="overflow-hidden" delay={3}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Receipt size={16} className="text-primary" /> Expenses</h3>
              <button onClick={() => setAddExpenseModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium shadow-blue hover:opacity-90 transition-opacity">
                <Plus size={13} /> Add
              </button>
            </div>
            {event.expenses.map((ex, i) => {
              const paidByMember = event.members.find(m => m.id === ex.paidBy);
              const splitAmt = ex.amount / event.members.length;
              return (
                <motion.div key={ex.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm flex-shrink-0 font-bold text-primary">{ex.description[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{ex.description}</p>
                    <p className="text-xs text-muted-foreground">Paid by {paidByMember?.name} · {new Date(ex.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-foreground">₹{ex.amount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground">₹{Math.round(splitAmt).toLocaleString("en-IN")}/person</p>
                  </div>
                </motion.div>
              );
            })}
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="overflow-hidden" delay={4}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Users size={16} className="text-primary" /> Members</h3>
              <button onClick={() => setAddMemberModal(true)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Plus size={14} /></button>
            </div>
            {event.members.map((m) => {
              const paid = event.expenses.filter(e => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0);
              const balance = paid - totalPerPerson;
              return (
                <div key={m.id} className="flex items-center gap-3 p-3 border-b border-border last:border-0">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">{m.avatar[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">Paid: ₹{paid.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={cn("text-xs font-semibold", balance >= 0 ? "text-success" : "text-destructive")}>
                    {balance >= 0 ? "+" : ""}₹{Math.round(Math.abs(balance)).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </GlassCard>

          <GlassCard className="p-4" delay={5}>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><DollarSign size={16} className="text-primary" /> Settlements</h3>
            {settlements.length === 0 ? (
              <div className="text-center py-4">
                <Check size={24} className="mx-auto text-success mb-2" />
                <p className="text-sm text-success font-medium">All settled up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {settlements.map((s, i) => (
                  <div key={i} className="bg-muted rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-destructive">{s.from}</span> → <span className="font-medium text-success">{s.to}</span>
                      </p>
                      <span className="text-sm font-bold text-foreground">₹{Math.round(s.amount).toLocaleString("en-IN")}</span>
                    </div>
                    <button onClick={() => toast.success(`Settlement of ₹${Math.round(s.amount).toLocaleString("en-IN")} marked as paid!`)}
                      className="w-full py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium shadow-blue hover:opacity-90 transition-opacity">
                      Settle Up ✓
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <Modal open={addExpenseModal} onClose={() => setAddExpenseModal(false)} title="Add Expense">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
            <input type="text" placeholder="e.g. Hotel booking" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount (₹)</label>
            <input type="number" placeholder="0" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Paid By</label>
            <select className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {event.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Split Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 rounded-xl border-2 border-primary bg-primary/10 text-primary text-sm font-medium">Equal Split</button>
              <button className="py-2 rounded-xl border-2 border-border text-muted-foreground text-sm font-medium hover:border-primary/50 transition-colors">Custom Split</button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddExpenseModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => { setAddExpenseModal(false); toast.success("Expense added!"); }} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Add Expense</button>
          </div>
        </div>
      </Modal>

      <Modal open={addMemberModal} onClose={() => setAddMemberModal(false)} title="Add Member">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
            <input type="text" placeholder="Member name" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Email / Phone</label>
            <input type="text" placeholder="email or phone number" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddMemberModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => { setAddMemberModal(false); toast.success("Member added!"); }} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Add Member</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
