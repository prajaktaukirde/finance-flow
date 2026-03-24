import { motion } from "framer-motion";
import { Download, FileText, BarChart3, Calendar, X, TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";
import { PageHeader } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { monthlyData } from "@/data/mockData";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const reportTypes = [
  { id: "monthly", name: "Monthly Summary", icon: "📅", desc: "Income, expenses & savings breakdown", color: "#3b82f6" },
  { id: "category", name: "Category Analysis", icon: "🗂️", desc: "Spending breakdown by category", color: "#8b5cf6" },
  { id: "budget", name: "Budget Report", icon: "💰", desc: "Budget vs actual comparison", color: "#22c55e" },
  { id: "tax", name: "Tax Summary", icon: "📋", desc: "Annual income & deductibles (ITR)", color: "#f59e0b" },
  { id: "cash-flow", name: "Cash Flow", icon: "💸", desc: "Money in vs money out trends", color: "#06b6d4" },
  { id: "goals", name: "Goals Progress", icon: "🎯", desc: "Savings goals performance", color: "#ec4899" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-sm border border-border">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: ₹{Number(p.value).toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const categoryData = [
  { name: "Food & Dining", value: 15000, color: "#ef4444" },
  { name: "Transportation", value: 8000, color: "#f59e0b" },
  { name: "Shopping", value: 12000, color: "#8b5cf6" },
  { name: "Entertainment", value: 5000, color: "#ec4899" },
  { name: "Bills & Utilities", value: 10000, color: "#06b6d4" },
  { name: "Healthcare", value: 3000, color: "#22c55e" },
];

const budgetData = [
  { category: "Food", budget: 18000, actual: 15000 },
  { category: "Transport", budget: 10000, actual: 8000 },
  { category: "Shopping", budget: 15000, actual: 12000 },
  { category: "Entertainment", budget: 6000, actual: 5000 },
  { category: "Bills", budget: 12000, actual: 10000 },
];

const goalsData = [
  { name: "Emergency Fund", target: 100000, current: 65000, deadline: "Dec 2025" },
  { name: "Vacation", target: 50000, current: 30000, deadline: "Jun 2025" },
  { name: "New Laptop", target: 80000, current: 45000, deadline: "Aug 2025" },
];

export default function Reports() {
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<typeof reportTypes[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const generatePDF = (reportType: typeof reportTypes[0]) => {
    setGeneratingPDF(reportType.id);
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text("Finance Flow", 14, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(reportType.name, 14, 35);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 45);
      
      // Summary section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Report Summary", 14, 60);
      
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Description: ${reportType.desc}`, 14, 70);
      doc.text(`Report Period: January 2025`, 14, 78);
      
      // Table data
      const tableData = monthlyData.map(m => [
        m.month,
        `₹${m.income.toLocaleString("en-IN")}`,
        `₹${m.expenses.toLocaleString("en-IN")}`,
        `₹${m.savings.toLocaleString("en-IN")}`,
        `${((m.savings / m.income) * 100).toFixed(0)}%`
      ]);
      
      autoTable(doc, {
        startY: 90,
        head: [["Month", "Income", "Expenses", "Savings", "Rate"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [240, 248, 255]
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        }
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount} | Finance Flow Report`, 14, doc.internal.pageSize.height - 10);
      }
      
      doc.save(`${reportType.id}-report-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success(`${reportType.name} PDF exported successfully!`);
    } catch (error) {
      toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setGeneratingPDF(null);
    }
  };

  const viewReport = (reportType: typeof reportTypes[0]) => {
    setSelectedReport(reportType);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null);
  };

  const renderReportContent = () => {
    if (!selectedReport) return null;

    const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
    const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);

    switch (selectedReport.id) {
      case "monthly":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-100/50 dark:bg-green-950/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">Total Income</span>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">₹{totalIncome.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-red-100/50 dark:bg-red-950/30 p-4 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                  <TrendingDown size={16} />
                  <span className="text-sm font-medium">Total Expenses</span>
                </div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">₹{totalExpenses.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-blue-100/50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <Wallet size={16} />
                  <span className="text-sm font-medium">Total Savings</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{totalSavings.toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="savings" name="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "category":
        return (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold">₹{cat.value.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "budget":
        return (
          <div className="space-y-4">
            {budgetData.map((item) => {
              const percentage = (item.actual / item.budget) * 100;
              return (
                <div key={item.category} className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className={`text-sm font-semibold ${percentage > 100 ? "text-red-500" : "text-green-500"}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${percentage > 100 ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Actual: ₹{item.actual.toLocaleString("en-IN")}</span>
                    <span>Budget: ₹{item.budget.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "cash-flow":
        return (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-100/50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Net Cash Flow</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">+₹{(totalIncome - totalExpenses).toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 bg-blue-100/50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Avg Monthly Savings</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{Math.round(totalSavings / monthlyData.length).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-4">
            {goalsData.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.name} className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target size={18} className="text-primary" />
                      <span className="font-medium">{goal.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{goal.deadline}</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">₹{goal.current.toLocaleString("en-IN")} of ₹{goal.target.toLocaleString("en-IN")}</span>
                    <span className="font-semibold text-primary">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "tax":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100/50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Annual Income</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{totalIncome.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 bg-purple-100/50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Taxable Income (Est.)</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">₹{Math.round(totalIncome * 0.8).toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Deductible Expenses</h4>
              {categoryData.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">{cat.name}</span>
                  <span className="text-sm font-medium">₹{cat.value.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-yellow-100/50 dark:bg-yellow-950/30 rounded-xl border border-yellow-300 dark:border-yellow-700">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This is a simplified tax summary. Please consult a tax professional for accurate ITR filing.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p>Detailed report view coming soon for {selectedReport.name}</p>
          </div>
        );
    }
  };

  const exportCSV = () => {
    const headers = ["Month", "Income", "Expenses", "Savings", "Rate"];
    const rows = monthlyData.map(m => [
      m.month,
      m.income,
      m.expenses,
      m.savings,
      ((m.savings / m.income) * 100).toFixed(0) + "%"
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Exported as CSV!");
  };

  const exportSummaryPDF = () => {
    setGeneratingPDF("summary");
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text("Finance Flow", 14, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Monthly Summary Report", 14, 35);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 45);
      
      // Summary stats
      const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
      const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
      const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Financial Overview", 14, 60);
      
      doc.setFontSize(10);
      doc.setTextColor(34, 197, 94);
      doc.text(`Total Income: ₹${totalIncome.toLocaleString("en-IN")}`, 14, 72);
      doc.setTextColor(239, 68, 68);
      doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString("en-IN")}`, 14, 80);
      doc.setTextColor(59, 130, 246);
      doc.text(`Total Savings: ₹${totalSavings.toLocaleString("en-IN")}`, 14, 88);
      doc.setTextColor(100, 100, 100);
      doc.text(`Savings Rate: ${((totalSavings / totalIncome) * 100).toFixed(1)}%`, 14, 96);
      
      // Table data
      const tableData = monthlyData.map(m => [
        m.month,
        `₹${m.income.toLocaleString("en-IN")}`,
        `₹${m.expenses.toLocaleString("en-IN")}`,
        `₹${m.savings.toLocaleString("en-IN")}`,
        `${((m.savings / m.income) * 100).toFixed(0)}%`
      ]);
      
      autoTable(doc, {
        startY: 110,
        head: [["Month", "Income", "Expenses", "Savings", "Rate"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [240, 248, 255]
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        }
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount} | Finance Flow Report`, 14, doc.internal.pageSize.height - 10);
      }
      
      doc.save(`monthly-summary-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Monthly Summary PDF exported successfully!");
    } catch (error) {
      toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setGeneratingPDF(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title="Reports" subtitle="Generate and export financial reports">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          <Calendar size={14} />
          <span>January 2025</span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reportTypes.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass-card rounded-xl p-5 hover-lift cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: r.color + "20" }}>{r.icon}</div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => viewReport(r)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="View Report"><BarChart3 size={14} /></button>
                <button onClick={() => generatePDF(r)} disabled={generatingPDF === r.id} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-50" title="Export PDF"><Download size={14} /></button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground">{r.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => viewReport(r)} className="flex-1 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity text-white" style={{ backgroundColor: r.color }}>View Report</button>
              <button 
                onClick={() => generatePDF(r)} 
                disabled={generatingPDF === r.id}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
              >
                {generatingPDF === r.id ? "..." : "PDF"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <GlassCard className="p-5" delay={6}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Monthly Summary Preview</h3>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
              <Download size={13} /> Export CSV
            </button>
            <button 
              onClick={exportSummaryPDF} 
              disabled={generatingPDF === "summary"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium shadow-blue hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <FileText size={13} /> {generatingPDF === "summary" ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ left: -5, right: 10 }} barSize={18} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="savings" name="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

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
                  <td className="py-2.5 px-3 text-success">₹{m.income.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 text-destructive">₹{m.expenses.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 text-primary">₹{m.savings.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{((m.savings / m.income) * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Report View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 bg-card border-border">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedReport && (
                  <>
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: selectedReport.color + "20" }}
                    >
                      {selectedReport.icon}
                    </div>
                    <div>
                      <DialogTitle className="text-xl text-foreground">{selectedReport.name}</DialogTitle>
                      <p className="text-sm text-muted-foreground">{selectedReport.desc}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="px-6 py-4 max-h-[60vh]">
            {renderReportContent()}
          </ScrollArea>
          <div className="p-6 pt-0 flex gap-3 justify-end border-t border-border mt-4">
            <Button variant="outline" onClick={closeDialog}>
              <X size={16} className="mr-2" /> Close
            </Button>
            {selectedReport && (
              <Button 
                onClick={() => generatePDF(selectedReport)}
                disabled={generatingPDF === selectedReport.id}
                className="bg-primary text-primary-foreground"
              >
                <FileText size={16} className="mr-2" />
                {generatingPDF === selectedReport.id ? "Generating..." : "Export PDF"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
