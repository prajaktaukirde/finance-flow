import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Check, Users, DollarSign, Receipt, Trash2, Edit2 } from "lucide-react";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/UI";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { eventAPI } from "@/services/api";

// Types
interface Member {
  id: string;
  name: string;
  avatar: string;
  paid?: number;
  owes?: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splitType?: "equal" | "custom" | "selective";
  customSplits?: Record<string, number>;
  selectedMembers?: string[];
  isSettlement?: boolean;
}

interface Event {
  _id: string;
  name: string;
  icon: string;
  date: string;
  category: string;
  totalAmount: number;
  members: Member[];
  expenses: Expense[];
  status: "active" | "settled";
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  
  // Modals
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [editExpenseModal, setEditExpenseModal] = useState(false);
  
  // Forms
  const [expenseForm, setExpenseForm] = useState({ 
    description: "", 
    amount: "", 
    paidBy: "", 
    splitType: "equal" as "equal" | "custom" | "selective",
    customSplits: {} as Record<string, string>,
    selectedMembers: [] as string[]
  });
  
  const [editExpenseForm, setEditExpenseForm] = useState({ 
    id: "",
    description: "", 
    amount: "", 
    paidBy: "",
    splitType: "equal" as "equal" | "custom" | "selective",
    customSplits: {} as Record<string, string>,
    selectedMembers: [] as string[]
  });
  
  const [memberForm, setMemberForm] = useState({ name: "" });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const [eventRes, eventsRes] = await Promise.all([
          eventAPI.getById(id!),
          eventAPI.getAll()
        ]);
        setEvent(eventRes.data);
        setAllEvents(eventsRes.data);
      } catch (error) {
        toast.error('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Event not found</p>
        <button onClick={() => navigate("/events")} className="mt-3 text-primary hover:underline text-sm">← Back to Events</button>
      </div>
    );
  }

  // Calculate totals
  const calculatedTotal = event.expenses?.reduce((s, exp) => s + (exp.amount || 0), 0) || 0;
  const totalPerPerson = event.members.length > 0 ? calculatedTotal / event.members.length : 0;

  // Compute settlements
  const computeSettlements = () => {
    if (event.members.length === 0) return { settlements: [] as { from: string; fromId: string; to: string; toId: string; amount: number }[], totalPerPerson: 0 };
    
    const balances = event.members.map(m => {
      const paid = event.expenses.filter(e => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0);
      return { ...m, paid, balance: paid - totalPerPerson };
    });
    
    const settlements: { from: string; fromId: string; to: string; toId: string; amount: number }[] = [];
    const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b }));
    const creditors = balances.filter(b => b.balance > 0.01).map(b => ({ ...b }));
    
    debtors.forEach(debtor => {
      creditors.forEach(creditor => {
        if (Math.abs(debtor.balance) > 0.01 && creditor.balance > 0.01) {
          const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
          settlements.push({ from: debtor.name, fromId: debtor.id, to: creditor.name, toId: creditor.id, amount });
          debtor.balance += amount;
          creditor.balance -= amount;
        }
      });
    });
    
    return { settlements, totalPerPerson };
  };

  const { settlements } = computeSettlements();

  // Handlers
  const handleAddExpense = async () => {
    if (!expenseForm.description.trim() || !expenseForm.amount || !expenseForm.paidBy) {
      toast.error("Please fill all fields");
      return;
    }
    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      const newExpense: Expense = {
        id: `ex${Date.now()}`,
        description: expenseForm.description,
        amount,
        paidBy: expenseForm.paidBy,
        splitType: expenseForm.splitType,
        date: new Date().toISOString().split("T")[0],
      };
      
      const updatedExpenses = [...event.expenses, newExpense];
      const response = await eventAPI.update(id!, { expenses: updatedExpenses });
      setEvent(response.data);
      toast.success("Expense added!");
      setAddExpenseModal(false);
      setExpenseForm({ description: "", amount: "", paidBy: "", splitType: "equal", customSplits: {}, selectedMembers: [] });
    } catch (error: any) {
      console.error('Add expense error:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId: string, description: string) => {
    if (confirm(`Delete expense "${description}"?`)) {
      try {
        const updatedExpenses = event.expenses.filter(e => e.id !== expenseId);
        const response = await eventAPI.update(id!, { expenses: updatedExpenses });
        setEvent(response.data);
        toast.success("Expense deleted!");
      } catch (error: any) {
        console.error('Delete expense error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete expense');
      }
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditExpenseForm({
      id: expense.id,
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      splitType: expense.splitType || "equal",
      customSplits: expense.customSplits ? Object.fromEntries(
        Object.entries(expense.customSplits).map(([k, v]) => [k, v.toString()])
      ) : {},
      selectedMembers: expense.selectedMembers || event.members.map(m => m.id)
    });
    setEditExpenseModal(true);
  };

  const handleUpdateExpense = async () => {
    if (!editExpenseForm.description.trim() || !editExpenseForm.amount || !editExpenseForm.paidBy) {
      toast.error("Please fill all fields");
      return;
    }
    const amount = parseFloat(editExpenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      const updatedExpenses = event.expenses.map(e => 
        e.id === editExpenseForm.id ? { 
          ...e, 
          description: editExpenseForm.description, 
          amount, 
          paidBy: editExpenseForm.paidBy,
          splitType: editExpenseForm.splitType
        } : e
      );
      
      const response = await eventAPI.update(id!, { expenses: updatedExpenses });
      setEvent(response.data);
      toast.success("Expense updated!");
      setEditExpenseModal(false);
    } catch (error: any) {
      console.error('Update expense error:', error);
      toast.error(error.response?.data?.message || 'Failed to update expense');
    }
  };

  const handleAddMember = async () => {
    if (!memberForm.name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    try {
      const newMember: Member = {
        id: `m${Date.now()}`,
        name: memberForm.name,
        avatar: memberForm.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        paid: 0,
        owes: 0,
      };
      
      const response = await eventAPI.update(id!, { members: [...event.members, newMember] });
      setEvent(response.data);
      toast.success("Member added!");
      setAddMemberModal(false);
      setMemberForm({ name: "" });
    } catch (error: any) {
      console.error('Add member error:', error);
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleDeleteMember = async (memberId: string, name: string) => {
    if (event.members.length <= 1) {
      toast.error("Event must have at least one member");
      return;
    }
    if (confirm(`Remove member "${name}"?`)) {
      try {
        const response = await eventAPI.update(id!, { members: event.members.filter(m => m.id !== memberId) });
        setEvent(response.data);
        toast.success("Member removed!");
      } catch (error: any) {
        console.error('Remove member error:', error);
        toast.error(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const handleSettleUp = async (fromMemberId: string, toMemberId: string, amount: number) => {
    const fromMember = event.members.find(m => m.id === fromMemberId);
    const toMember = event.members.find(m => m.id === toMemberId);
    
    if (!fromMember || !toMember) return;
    
    try {
      const settlementExpense: Expense = {
        id: `settle${Date.now()}`,
        description: `Settlement: ${fromMember.name} paid ${toMember.name}`,
        amount: amount,
        paidBy: fromMemberId,
        splitType: "custom",
        customSplits: { [toMemberId]: amount },
        date: new Date().toISOString().split("T")[0],
        isSettlement: true,
      };
      
      const response = await eventAPI.update(id!, { expenses: [...event.expenses, settlementExpense] });
      setEvent(response.data);
      toast.success(`₹${Math.round(amount).toLocaleString("en-IN")} settled!`);
    } catch (error) {
      toast.error('Failed to settle');
    }
  };

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
              { label: "Total Amount", value: `₹${calculatedTotal.toLocaleString("en-IN")}`, icon: "💰" },
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
            {event.expenses.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Receipt size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No expenses yet. Add your first expense!</p>
              </div>
            ) : (
              event.expenses.map((ex, i) => {
                const paidByMember = event.members.find(m => m.id === ex.paidBy);
                const splitAmt = event.members.length > 0 ? ex.amount / event.members.length : 0;
                return (
                  <motion.div key={ex.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm flex-shrink-0 font-bold text-primary">{ex.description[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{ex.description}</p>
                      <p className="text-xs text-muted-foreground">Paid by {paidByMember?.name || "Unknown"} · {new Date(ex.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">₹{ex.amount.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-muted-foreground">₹{Math.round(splitAmt).toLocaleString("en-IN")}/person</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditExpense(ex)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteExpense(ex.id, ex.description)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="overflow-hidden" delay={4}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Users size={16} className="text-primary" /> Members ({event.members.length})</h3>
              <button onClick={() => setAddMemberModal(true)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Plus size={14} /></button>
            </div>
            {event.members.map((m) => {
              const paid = event.expenses.filter(e => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0);
              const balance = paid - totalPerPerson;
              return (
                <div key={m.id} className="flex items-center gap-3 p-3 border-b border-border last:border-0 group">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">{m.avatar[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">Paid: ₹{paid.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={cn("text-xs font-semibold", balance >= 0 ? "text-success" : "text-destructive")}>
                    {balance >= 0 ? "+" : ""}₹{Math.round(Math.abs(balance)).toLocaleString("en-IN")}
                  </span>
                  <button onClick={() => handleDeleteMember(m.id, m.name)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
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
                    <button onClick={() => handleSettleUp(s.fromId, s.toId, s.amount)}
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

      {/* Add Expense Modal */}
      <Modal open={addExpenseModal} onClose={() => setAddExpenseModal(false)} title="Add Expense">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
            <input type="text" value={expenseForm.description} onChange={e => setExpenseForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Hotel booking" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount (₹)</label>
            <input type="text" inputMode="decimal" value={expenseForm.amount} onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Paid By</label>
            <select value={expenseForm.paidBy} onChange={e => setExpenseForm(p => ({ ...p, paidBy: e.target.value }))} className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              <option value="">Select member</option>
              {event.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddExpenseModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleAddExpense} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Add Expense</button>
          </div>
        </div>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal open={editExpenseModal} onClose={() => setEditExpenseModal(false)} title="Edit Expense">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
            <input type="text" value={editExpenseForm.description} onChange={e => setEditExpenseForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Hotel booking" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount (₹)</label>
            <input type="text" inputMode="decimal" value={editExpenseForm.amount} onChange={e => setEditExpenseForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Paid By</label>
            <select value={editExpenseForm.paidBy} onChange={e => setEditExpenseForm(p => ({ ...p, paidBy: e.target.value }))} className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {event.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditExpenseModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleUpdateExpense} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Update Expense</button>
          </div>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <Modal open={addMemberModal} onClose={() => setAddMemberModal(false)} title="Add Member">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
            <input type="text" value={memberForm.name} onChange={e => setMemberForm(p => ({ ...p, name: e.target.value }))} placeholder="Member name" className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddMemberModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleAddMember} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Add Member</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
