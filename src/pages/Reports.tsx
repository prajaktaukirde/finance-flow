import { motion } from "framer-motion";
import { Download, FileText, BarChart3, Calendar } from "lucide-react";
import { PageHeader } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { monthlyData, transactions } from "@/data/mockData";

const reportTypes = [
  { id: "monthly", name: "Monthly Summary", icon: "📅", desc: "Income, expenses & savings breakdown", color: "#3b82f6" },
  { id: "category", name: "Category Analysis", icon: "🗂️", desc: "Spending breakdown by category", color: "#8b5cf6" },
  { id: "budget", name: "Budget Report", icon: "💰", desc: "Budget vs actual comparison", color: "#22c55e" },
  { id: "tax", name: "Tax Summary", icon: "📋", desc: "Annual income & deductibles", color: "#f59e0b" },
  { id: "cash-flow", name: "Cash Flow", icon: "💸", desc: "Money in vs money out trends", color: "#06b6d4" },
  { id: "goals", name: "Goals Progress", icon: "🎯", desc: "Savings goals performance", color: "#ec4899" },
];

export default function Reports() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title="Reports" subtitle="Generate and export financial reports">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          <Calendar size={14} />
          <span>January 2025</span>
        </div>
      </PageHeader>

      {/* Report cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reportTypes.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card rounded-xl p-5 hover-lift cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: r.color + "20" }}>
                {r.icon}
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="View">
                  <BarChart3 size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="Export CSV">
                  <Download size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground">{r.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity text-primary-foreground" style={{ backgroundColor: r.color }}>
                View Report
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors text-muted-foreground">
                PDF
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview */}
      <GlassCard className="p-5" delay={6}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Monthly Summary Preview</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
              <Download size={13} /> Export CSV
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium shadow-blue hover:opacity-90 transition-opacity">
              <FileText size={13} /> Export PDF
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ left: -15, right: 10 }} barSize={18} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, ""]} />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="savings" name="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Month", "Income", "Expenses", "Savings", "Rate"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(m => (
                <tr key={m.month} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">{m.month}</td>
                  <td className="py-2.5 px-3 text-success">${m.income.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-destructive">${m.expenses.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-primary">${m.savings.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{((m.savings / m.income) * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
