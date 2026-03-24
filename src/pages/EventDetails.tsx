import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Check, Users, DollarSign, Receipt, Trash2, Edit2, X } from "lucide-react";
import { GlassCard } from "@/components/StatCard";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/UI";
import { events as initialEvents } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const STORAGE_KEY = "finance-flow-events";

// Component for adding members with autocomplete
interface AddMemberFormProps {
  allEvents: typeof initialEvents;
  existingMembers: typeof initialEvents[0]["members"];
  onAdd: (name: string, email?: string) => void;
  onCancel: () => void;
}

function AddMemberForm({ allEvents, existingMembers, onAdd, onCancel }: AddMemberFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Get all unique member names from all events
  const allMemberNames = Array.from(new Set(
    allEvents.flatMap(e => e.members.map(m => m.name))
  )).filter(n => n && !existingMembers.some(em => em.name.toLowerCase() === n.toLowerCase()));
  
  // Filter suggestions based on input
  const suggestions = name.trim() 
    ? allMemberNames.filter(n => n.toLowerCase().includes(name.toLowerCase()))
    : allMemberNames;
  
  const handleSelect = (selectedName: string) => {
    setName(selectedName);
    setShowSuggestions(false);
    // Try to find email from previous events
    const prevMember = allEvents
      .flatMap(e => e.members)
      .find(m => m.name === selectedName);
    if (prevMember && 'email' in prevMember) {
      setEmail((prevMember as any).email || "");
    }
  };
  
  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    onAdd(name.trim(), email.trim() || undefined);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => {
            setName(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Type or select a name"
          className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
            <div className="p-1">
              <p className="text-xs text-muted-foreground px-2 py-1">Previously used names (click to select)</p>
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleSelect(suggestion)}
                  className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Click outside to close suggestions */}
        {showSuggestions && (
          <button
            onClick={() => setShowSuggestions(false)}
            className="fixed inset-0 z-0"
            tabIndex={-1}
          />
        )}
      </div>
      
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Email / Phone (optional)</label>
        <input 
          type="text" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          placeholder="email or phone number"
          className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
        />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
        <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Add Member</button>
      </div>
    </div>
  );
}

function computeSettlements(members: typeof initialEvents[0]["members"], expenses: typeof initialEvents[0]["expenses"]) {
  if (members.length === 0) return { settlements: [] as { from: string; fromId: string; to: string; toId: string; amount: number }[], totalPerPerson: 0 };
  
  // Calculate what each person owes and paid
  const balances = members.map(m => {
    // Calculate total paid by this member
    const paid = expenses.filter(e => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0);
    
    // Calculate total owed by this member (based on split type)
    let owed = 0;
    for (const exp of expenses) {
      const expAny = exp as any;
      if (expAny.splitType === "custom" && expAny.customSplits) {
        // Custom split - use the specific amount for this member
        owed += expAny.customSplits[m.id] || 0;
      } else if (expAny.splitType === "selective" && expAny.selectedMembers) {
        // Selective split - only split among selected members
        if (expAny.selectedMembers.includes(m.id)) {
          owed += expAny.amount / expAny.selectedMembers.length;
        }
      } else {
        // Equal split among all members
        owed += expAny.amount / members.length;
      }
    }
    
    return { ...m, paid, owed, balance: paid - owed };
  });
  
  const totalPerPerson = expenses.reduce((s, e) => s + e.amount, 0) / members.length;
  
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
  
  return { settlements, totalPerPerson, balances };
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Load events from localStorage
  const [allEvents, setAllEvents] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialEvents;
  });
  
  const event = allEvents.find((e: typeof initialEvents[0]) => e.id === id);
  
  // Persist events whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allEvents));
  }, [allEvents]);
  
  const updateEvent = (updates: Partial<typeof event>) => {
    setAllEvents((prev: typeof initialEvents) => 
      prev.map((e: typeof initialEvents[0]) => e.id === id ? { ...e, ...updates } : e)
    );
  };

  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ 
    description: "", 
    amount: "", 
    paidBy: "", 
    splitType: "equal" as "equal" | "custom" | "selective",
    customSplits: {} as Record<string, string>,
    selectedMembers: [] as string[]
  });
  const [memberForm, setMemberForm] = useState({ name: "", email: "" });
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editExpenseForm, setEditExpenseForm] = useState({ 
    description: "", 
    amount: "", 
    paidBy: "",
    splitType: "equal" as "equal" | "custom" | "selective",
    customSplits: {} as Record<string, string>,
    selectedMembers: [] as string[]
  });
  const [editExpenseModal, setEditExpenseModal] = useState(false);

  if (!event) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Event not found</p>
        <button onClick={() => navigate("/events")} className="mt-3 text-primary hover:underline text-sm">← Back to Events</button>
      </div>
    );
  }

  // Calculate totals dynamically from expenses
  const calculatedTotal = event.expenses?.reduce((s: number, exp: typeof event.expenses[0]) => s + (exp.amount || 0), 0) || 0;
  const { settlements, totalPerPerson } = computeSettlements(event.members, event.expenses);

  const handleAddExpense = () => {
    if (!expenseForm.description.trim() || !expenseForm.amount || !expenseForm.paidBy) {
      toast.error("Please fill all fields");
      return;
    }
    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Validate custom split if selected
    let customSplitData: Record<string, number> | undefined;
    if (expenseForm.splitType === "custom") {
      const splits: Record<string, number> = {};
      let totalSplit = 0;
      
      for (const member of event.members) {
        const splitAmount = parseFloat(expenseForm.customSplits[member.id] || "0");
        if (isNaN(splitAmount) || splitAmount < 0) {
          toast.error(`Invalid split amount for ${member.name}`);
          return;
        }
        splits[member.id] = splitAmount;
        totalSplit += splitAmount;
      }
      
      if (Math.abs(totalSplit - amount) > 0.01) {
        toast.error(`Split amounts must sum to total: ₹${amount.toLocaleString("en-IN")} (current: ₹${totalSplit.toLocaleString("en-IN")})`);
        return;
      }
      
      customSplitData = splits;
    }
    
    const newExpense = {
      id: `ex${Date.now()}`,
      description: expenseForm.description,
      amount,
      paidBy: expenseForm.paidBy,
      splitType: expenseForm.splitType,
      customSplits: customSplitData,
      date: new Date().toISOString().split("T")[0],
    };
    
    const updatedExpenses = [...event.expenses, newExpense];
    
    updateEvent({ expenses: updatedExpenses });
    toast.success("Expense added!");
    setAddExpenseModal(false);
    setExpenseForm({ description: "", amount: "", paidBy: "", splitType: "equal", customSplits: {}, selectedMembers: [] });
  };

  const handleDeleteExpense = (expenseId: string, description: string) => {
    if (confirm(`Delete expense "${description}"?`)) {
      const updatedExpenses = event.expenses.filter((e: typeof event.expenses[0]) => e.id !== expenseId);
      const newTotal = updatedExpenses.reduce((sum: number, e: typeof event.expenses[0]) => sum + e.amount, 0);
      updateEvent({ expenses: updatedExpenses, totalAmount: newTotal });
      toast.success("Expense deleted!");
    }
  };

  const handleEditExpense = (expense: typeof event.expenses[0]) => {
    setEditingExpense(expense.id);
    setEditExpenseForm({ 
      description: expense.description, 
      amount: expense.amount.toString(), 
      paidBy: expense.paidBy,
      splitType: expense.splitType || "equal",
      customSplits: expense.customSplits ? Object.fromEntries(
        Object.entries(expense.customSplits).map(([k, v]) => [k, v.toString()])
      ) : {},
      selectedMembers: expense.selectedMembers || event.members.map((m: typeof event.members[0]) => m.id)
    });
    setEditExpenseModal(true);
  };

  const handleUpdateExpense = () => {
    if (!editExpenseForm.description.trim() || !editExpenseForm.amount || !editExpenseForm.paidBy) {
      toast.error("Please fill all fields");
      return;
    }
    const amount = parseFloat(editExpenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Validate custom split if selected
    let customSplitData: Record<string, number> | undefined;
    if (editExpenseForm.splitType === "custom") {
      const splits: Record<string, number> = {};
      let totalSplit = 0;
      
      for (const member of event.members) {
        const splitAmount = parseFloat(editExpenseForm.customSplits[member.id] || "0");
        if (isNaN(splitAmount) || splitAmount < 0) {
          toast.error(`Invalid split amount for ${member.name}`);
          return;
        }
        splits[member.id] = splitAmount;
        totalSplit += splitAmount;
      }
      
      if (Math.abs(totalSplit - amount) > 0.01) {
        toast.error(`Split amounts must sum to total: ₹${amount.toLocaleString("en-IN")} (current: ₹${totalSplit.toLocaleString("en-IN")})`);
        return;
      }
      
      customSplitData = splits;
    }
    
    const updatedExpenses = event.expenses.map((e: typeof event.expenses[0]) => 
      e.id === editingExpense ? { 
        ...e, 
        description: editExpenseForm.description, 
        amount, 
        paidBy: editExpenseForm.paidBy,
        splitType: editExpenseForm.splitType,
        customSplits: customSplitData
      } : e
    );
    
    updateEvent({ expenses: updatedExpenses });
    toast.success("Expense updated!");
    setEditExpenseModal(false);
    setEditingExpense(null);
  };

  const handleAddMember = () => {
    if (!memberForm.name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    const newMember = {
      id: `m${Date.now()}`,
      name: memberForm.name,
      avatar: memberForm.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      paid: 0,
      owes: 0,
    };
    
    updateEvent({ members: [...event.members, newMember] });
    toast.success("Member added!");
    setAddMemberModal(false);
    setMemberForm({ name: "", email: "" });
  };

  const handleDeleteMember = (memberId: string, name: string) => {
    if (event.members.length <= 1) {
      toast.error("Event must have at least one member");
      return;
    }
    if (confirm(`Remove member "${name}"?`)) {
      updateEvent({ members: event.members.filter((m: typeof event.members[0]) => m.id !== memberId) });
      toast.success("Member removed!");
    }
  };

  const handleSettleUp = (fromMemberId: string, toMemberId: string, amount: number) => {
    const fromMember = event.members.find((m: typeof event.members[0]) => m.id === fromMemberId);
    const toMember = event.members.find((m: typeof event.members[0]) => m.id === toMemberId);
    
    if (!fromMember || !toMember) return;
    
    // Create a settlement expense to record the payment
    const settlementExpense = {
      id: `settle${Date.now()}`,
      description: `Settlement: ${fromMember.name} paid ${toMember.name}`,
      amount: amount,
      paidBy: fromMemberId,
      splitType: "custom" as const,
      customSplits: { [toMemberId]: amount },
      date: new Date().toISOString().split("T")[0],
      isSettlement: true,
    };
    
    const updatedExpenses = [...event.expenses, settlementExpense];
    updateEvent({ expenses: updatedExpenses });
    
    toast.success(`₹${Math.round(amount).toLocaleString("en-IN")} settled from ${fromMember.name} to ${toMember.name}!`);
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
              event.expenses.map((ex: typeof event.expenses[0], i: number) => {
                const paidByMember = event.members.find((m: typeof event.members[0]) => m.id === ex.paidBy);
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
            {event.members.map((m: typeof event.members[0]) => {
              const paid = event.expenses.filter((e: typeof event.expenses[0]) => e.paidBy === m.id).reduce((s: number, e: typeof event.expenses[0]) => s + e.amount, 0);
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
                {settlements.map((s: typeof settlements[0], i: number) => (
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
              {event.members.map((m: typeof event.members[0]) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Split Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setExpenseForm(p => ({ ...p, splitType: "equal", customSplits: {}, selectedMembers: [] }))} className={cn("py-2 rounded-xl border-2 text-sm font-medium transition-colors", expenseForm.splitType === "equal" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>Equal</button>
              <button onClick={() => {
                // Pre-fill with equal split amounts when switching to custom
                const totalAmount = parseFloat(expenseForm.amount || "0");
                const equalShare = event.members.length > 0 && totalAmount > 0 ? totalAmount / event.members.length : 0;
                const preFilledSplits: Record<string, string> = {};
                event.members.forEach((m: typeof event.members[0]) => {
                  preFilledSplits[m.id] = equalShare > 0 ? equalShare.toFixed(0) : "0";
                });
                setExpenseForm(p => ({ ...p, splitType: "custom", customSplits: preFilledSplits, selectedMembers: event.members.map((m: typeof event.members[0]) => m.id) }));
              }} className={cn("py-2 rounded-xl border-2 text-sm font-medium transition-colors", expenseForm.splitType === "custom" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>Custom</button>
              <button onClick={() => {
                // Select specific members
                setExpenseForm(p => ({ ...p, splitType: "selective", customSplits: {}, selectedMembers: event.members.map((m: typeof event.members[0]) => m.id) }));
              }} className={cn("py-2 rounded-xl border-2 text-sm font-medium transition-colors", expenseForm.splitType === "selective" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>Select</button>
            </div>
          </div>
          
          {/* Select Members */}
          {expenseForm.splitType === "selective" && (
            <div className="space-y-3 p-3 bg-muted/50 rounded-xl">
              <label className="text-xs font-medium text-muted-foreground block">Select Members to Split</label>
              {event.members.map((member: typeof event.members[0]) => {
                const isSelected = expenseForm.selectedMembers.includes(member.id);
                return (
                  <label key={member.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => {
                        const newSelected = e.target.checked
                          ? [...expenseForm.selectedMembers, member.id]
                          : expenseForm.selectedMembers.filter(id => id !== member.id);
                        setExpenseForm(p => ({ ...p, selectedMembers: newSelected }));
                      }}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                      {member.avatar[0]}
                    </div>
                    <span className="text-sm text-foreground flex-1">{member.name}</span>
                  </label>
                );
              })}
              <p className="text-xs text-muted-foreground pt-2">
                {expenseForm.selectedMembers.length} of {event.members.length} members selected
              </p>
            </div>
          )}
          
          {/* Custom Split Configuration */}
          {(expenseForm.splitType === "custom" || expenseForm.splitType === "selective") && (
            <div className="space-y-3 p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground block">
                  {expenseForm.splitType === "selective" ? "Split Amounts (Selected Members)" : "Custom Split Amounts"}
                </label>
                <button 
                  onClick={() => {
                    // Reset to equal split amounts
                    const totalAmount = parseFloat(expenseForm.amount || "0");
                    const membersToSplit = expenseForm.splitType === "selective" 
                      ? event.members.filter((m: typeof event.members[0]) => expenseForm.selectedMembers.includes(m.id))
                      : event.members;
                    const equalShare = membersToSplit.length > 0 && totalAmount > 0 ? totalAmount / membersToSplit.length : 0;
                    const resetSplits: Record<string, string> = {};
                    membersToSplit.forEach((m: typeof event.members[0]) => {
                      resetSplits[m.id] = equalShare > 0 ? equalShare.toFixed(0) : "0";
                    });
                    setExpenseForm(p => ({ ...p, customSplits: resetSplits }));
                  }}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Reset to Equal
                </button>
              </div>
              {(expenseForm.splitType === "selective" 
                ? event.members.filter((m: typeof event.members[0]) => expenseForm.selectedMembers.includes(m.id))
                : event.members
              ).map((member: typeof event.members[0]) => {
                const totalAmount = parseFloat(expenseForm.amount || "0");
                const membersToSplit = expenseForm.splitType === "selective" 
                  ? event.members.filter((m: typeof event.members[0]) => expenseForm.selectedMembers.includes(m.id))
                  : event.members;
                const equalShare = membersToSplit.length > 0 && totalAmount > 0 ? totalAmount / membersToSplit.length : 0;
                const currentValue = expenseForm.customSplits[member.id] || (equalShare > 0 ? equalShare.toFixed(0) : "0");
                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                      {member.avatar[0]}
                    </div>
                    <span className="text-sm text-foreground flex-1">{member.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">₹</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={currentValue}
                        onChange={e => {
                          const newValue = e.target.value;
                          setExpenseForm(p => ({
                            ...p,
                            customSplits: { ...p.customSplits, [member.id]: newValue }
                          }));
                        }}
                        className="w-20 px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground text-right"
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Total Split:</span>
                <span className={cn(
                  "text-sm font-medium",
                  Math.abs(Object.values(expenseForm.customSplits).reduce((s, v) => s + (parseFloat(v) || 0), 0) - parseFloat(expenseForm.amount || "0")) < 0.01
                    ? "text-success"
                    : "text-destructive"
                )}>
                  ₹{Object.values(expenseForm.customSplits).reduce((s, v) => s + (parseFloat(v) || 0), 0).toLocaleString("en-IN")} / ₹{parseFloat(expenseForm.amount || "0").toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddExpenseModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleAddExpense} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Add Expense</button>
          </div>
        </div>
      </Modal>

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
              {event.members.map((m: typeof event.members[0]) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Split Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setEditExpenseForm(p => ({ ...p, splitType: "equal", customSplits: {} }))} className={cn("py-2 rounded-xl border-2 text-sm font-medium transition-colors", editExpenseForm.splitType === "equal" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>Equal Split</button>
              <button onClick={() => setEditExpenseForm(p => ({ ...p, splitType: "custom" }))} className={cn("py-2 rounded-xl border-2 text-sm font-medium transition-colors", editExpenseForm.splitType === "custom" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>Custom Split</button>
            </div>
          </div>
          
          {/* Custom Split Configuration for Edit */}
          {editExpenseForm.splitType === "custom" && (
            <div className="space-y-3 p-3 bg-muted/50 rounded-xl">
              <label className="text-xs font-medium text-muted-foreground block">Custom Split Amounts</label>
              {event.members.map((member: typeof event.members[0]) => {
                const totalAmount = parseFloat(editExpenseForm.amount || "0");
                const equalShare = event.members.length > 0 && totalAmount > 0 ? totalAmount / event.members.length : 0;
                const currentValue = editExpenseForm.customSplits[member.id] || "";
                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                      {member.avatar[0]}
                    </div>
                    <span className="text-sm text-foreground flex-1">{member.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">₹</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={currentValue}
                        onChange={e => {
                          const newValue = e.target.value;
                          setEditExpenseForm(p => ({
                            ...p,
                            customSplits: { ...p.customSplits, [member.id]: newValue }
                          }));
                        }}
                        placeholder={equalShare > 0 ? equalShare.toFixed(0) : "0"}
                        className="w-20 px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground text-right"
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Total Split:</span>
                <span className={cn(
                  "text-sm font-medium",
                  Math.abs(Object.values(editExpenseForm.customSplits).reduce((s, v) => s + (parseFloat(v) || 0), 0) - parseFloat(editExpenseForm.amount || "0")) < 0.01
                    ? "text-success"
                    : "text-destructive"
                )}>
                  ₹{Object.values(editExpenseForm.customSplits).reduce((s, v) => s + (parseFloat(v) || 0), 0).toLocaleString("en-IN")} / ₹{parseFloat(editExpenseForm.amount || "0").toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditExpenseModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleUpdateExpense} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Update Expense</button>
          </div>
        </div>
      </Modal>

      <Modal open={addMemberModal} onClose={() => setAddMemberModal(false)} title="Add Member">
        <AddMemberForm 
          allEvents={allEvents}
          existingMembers={event.members}
          onAdd={(name, email) => {
            const newMember = {
              id: `m${Date.now()}`,
              name: name,
              avatar: name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
              paid: 0,
              owes: 0,
              email: email || undefined,
            };
            updateEvent({ members: [...event.members, newMember] });
            toast.success(`${name} added to event!`);
            setAddMemberModal(false);
            setMemberForm({ name: "", email: "" });
          }}
          onCancel={() => setAddMemberModal(false)}
        />
      </Modal>
    </div>
  );
}
