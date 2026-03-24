import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageHeader, SearchInput, SelectInput, Pagination, Badge } from "@/components/UI";
import { Modal } from "@/components/Modal";
import { GlassCard } from "@/components/StatCard";
import { transactions as initialTransactions } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const categoryIcons: Record<string, string> = {
  "Food & Dining": "🍽️", "Transportation": "🚗", "Shopping": "🛍️",
  "Entertainment": "🎬", "Health & Fitness": "💪", "Bills & Utilities": "⚡",
  "Income": "💰", "Education": "📚", "Travel": "✈️",
};

const CATEGORIES = ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Health & Fitness", "Bills & Utilities", "Education", "Income"];

const emptyForm = { description: "", amount: "", date: "", category: "Food & Dining" };

export default function Transactions() {
  const [allTx, setAllTx] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState<typeof allTx[0] | null>(null);
  const [txType, setTxType] = useState<"income" | "expense">("expense");
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const categories = ["all", ...Array.from(new Set(allTx.map(t => t.category)))];

  const filtered = allTx.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchCat = catFilter === "all" || t.category === catFilter;
    return matchSearch && matchType && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setForm(emptyForm);
    setTxType("expense");
    setFormErrors({});
    setEditItem(null);
    setAddModal(true);
  };

  const openEdit = (t: typeof allTx[0]) => {
    setForm({ description: t.description, amount: String(Math.abs(t.amount)), date: t.date, category: t.category });
    setTxType(t.type as "income" | "expense");
    setFormErrors({});
    setEditItem(t);
    setAddModal(true);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter a valid amount.";
    if (!form.date) e.date = "Date is required.";
    return e;
  };

  const handleSave = () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (editItem) {
      setAllTx(prev => prev.map(t => t.id === editItem.id ? {
        ...t, description: form.description, amount: txType === "expense" ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount)),
        date: form.date, category: form.category, type: txType
      } : t));
      toast.success("Transaction updated! ✅");
    } else {
      const newTx = {
        id: Date.now().toString(), description: form.description,
        amount: txType === "expense" ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount)),
        date: form.date, category: form.category, type: txType, account: "Savings"
      };
      setAllTx(prev => [newTx, ...prev]);
      toast.success("Transaction added! 💰");
    }
    setAddModal(false); setEditItem(null);
  };

  const handleDelete = () => {
    if (!editItem) return;
    setAllTx(prev => prev.filter(t => t.id !== editItem.id));
    toast.success("Transaction deleted!");
    setAddModal(false); setEditItem(null);
  };

  const handleExport = () => {
    const csv = ["Date,Description,Category,Type,Amount",
      ...filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as CSV! 📄");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title="Transactions" subtitle={`${filtered.length} transactions found`}>
        <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
          <Download size={15} /> Export CSV
        </button>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add
        </button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search transactions..." className="flex-1 min-w-48" />
        <SelectInput value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }}
          options={[{ value: "all", label: "All Types" }, { value: "income", label: "Income" }, { value: "expense", label: "Expenses" }]} />
        <SelectInput value={catFilter} onChange={v => { setCatFilter(v); setPage(1); }}
          options={categories.map(c => ({ value: c, label: c === "all" ? "All Categories" : c }))} />
      </div>

      <GlassCard className="overflow-hidden">
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Description</span><span>Category</span><span>Date</span><span>Account</span><span className="text-right">Amount</span>
        </div>

        {paginated.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No transactions found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          paginated.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              onClick={() => openEdit(t)}
              className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0", t.type === "income" ? "bg-success/15" : "bg-destructive/10")}>
                  {categoryIcons[t.category] || "💳"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{t.category} · {new Date(t.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                </div>
              </div>
              <div className="hidden sm:block"><Badge variant={t.type === "income" ? "success" : "default"}>{t.category}</Badge></div>
              <p className="hidden sm:block text-sm text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
              <p className="hidden sm:block text-sm text-muted-foreground">{t.account}</p>
              <div className={cn("flex items-center gap-1 text-sm font-semibold justify-end", t.type === "income" ? "text-success" : "text-destructive")}>
                {t.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                ₹{Math.abs(t.amount).toLocaleString("en-IN")}
              </div>
            </motion.div>
          ))
        )}
        <div className="px-5 pb-4"><Pagination page={page} totalPages={totalPages} onPage={setPage} /></div>
      </GlassCard>

      <Modal open={addModal} onClose={() => { setAddModal(false); setEditItem(null); }} title={editItem ? "Edit Transaction" : "Add Transaction"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTxType("income")} className={cn("py-2.5 rounded-xl border-2 text-sm font-medium transition-colors", txType === "income" ? "border-success bg-success/10 text-success" : "border-border text-muted-foreground hover:border-success/50")}>💰 Income</button>
            <button onClick={() => setTxType("expense")} className={cn("py-2.5 rounded-xl border-2 text-sm font-medium transition-colors", txType === "expense" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:border-destructive/50")}>💸 Expense</button>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Enter description"
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-colors", formErrors.description ? "border-destructive" : "border-border")} />
            {formErrors.description && <p className="text-xs text-destructive mt-1">{formErrors.description}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount (₹)</label>
            <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" min="0"
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-colors", formErrors.amount ? "border-destructive" : "border-border")} />
            {formErrors.amount && <p className="text-xs text-destructive mt-1">{formErrors.amount}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className={cn("w-full px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-colors", formErrors.date ? "border-destructive" : "border-border")} />
            {formErrors.date && <p className="text-xs text-destructive mt-1">{formErrors.date}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setAddModal(false); setEditItem(null); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            {editItem && <button onClick={handleDelete} className="py-2.5 px-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">Delete</button>}
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
