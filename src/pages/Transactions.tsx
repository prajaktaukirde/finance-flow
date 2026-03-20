import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Download, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageHeader, SearchInput, SelectInput, Pagination, Badge } from "@/components/UI";
import { Modal } from "@/components/Modal";
import { GlassCard } from "@/components/StatCard";
import { transactions } from "@/data/mockData";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const categoryIcons: Record<string, string> = {
  "Food & Dining": "🍽️", "Transportation": "🚗", "Shopping": "🛍️",
  "Entertainment": "🎬", "Health & Fitness": "💪", "Bills & Utilities": "⚡",
  "Income": "💰", "Education": "📚", "Travel": "✈️",
};

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState<typeof transactions[0] | null>(null);

  const categories = ["all", ...Array.from(new Set(transactions.map(t => t.category)))];

  const filtered = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchCat = catFilter === "all" || t.category === catFilter;
    return matchSearch && matchType && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title="Transactions" subtitle={`${filtered.length} transactions found`}>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
          <Download size={15} /> Export
        </button>
        <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search transactions..." className="flex-1 min-w-48" />
        <SelectInput value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }}
          options={[{ value: "all", label: "All Types" }, { value: "income", label: "Income" }, { value: "expense", label: "Expenses" }]} />
        <SelectInput value={catFilter} onChange={v => { setCatFilter(v); setPage(1); }}
          options={categories.map(c => ({ value: c, label: c === "all" ? "All Categories" : c }))} />
      </div>

      <GlassCard className="overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span>Account</span>
          <span className="text-right">Amount</span>
        </div>

        {paginated.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No transactions found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          paginated.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setEditItem(t)}
              className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 col-span-1 sm:col-span-1">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0", t.type === "income" ? "bg-success/15" : "bg-destructive/10")}>
                  {categoryIcons[t.category] || "💳"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{t.category} · {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <Badge variant={t.type === "income" ? "success" : "default"}>{t.category}</Badge>
              </div>
              <p className="hidden sm:block text-sm text-muted-foreground">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              <p className="hidden sm:block text-sm text-muted-foreground">{t.account}</p>
              <div className={cn("flex items-center gap-1 text-sm font-semibold justify-end", t.type === "income" ? "text-success" : "text-destructive")}>
                {t.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                ${Math.abs(t.amount).toFixed(2)}
              </div>
            </motion.div>
          ))
        )}

        <div className="px-5 pb-4">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal open={addModal || !!editItem} onClose={() => { setAddModal(false); setEditItem(null); }} title={editItem ? "Edit Transaction" : "Add Transaction"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 rounded-xl border-2 border-success bg-success/10 text-success text-sm font-medium">💰 Income</button>
            <button className="py-2.5 rounded-xl border-2 border-border text-muted-foreground text-sm font-medium hover:border-destructive/50 hover:bg-destructive/5 transition-colors">💸 Expense</button>
          </div>
          {[{ label: "Description", type: "text", placeholder: "Enter description", defaultValue: editItem?.description || "" },
            { label: "Amount", type: "number", placeholder: "0.00", defaultValue: editItem ? String(Math.abs(editItem.amount)) : "" },
            { label: "Date", type: "date", placeholder: "", defaultValue: editItem?.date || "" }].map(({ label, type, placeholder, defaultValue }) => (
            <div key={label}>
              <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
              <input type={type} placeholder={placeholder} defaultValue={defaultValue}
                className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select defaultValue={editItem?.category} className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
              {["Food & Dining", "Transportation", "Shopping", "Entertainment", "Health & Fitness", "Bills & Utilities", "Education", "Income"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setAddModal(false); setEditItem(null); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            {editItem && <button className="py-2.5 px-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">Delete</button>}
            <button onClick={() => { setAddModal(false); setEditItem(null); }} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
