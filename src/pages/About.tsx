import { GlassCard } from "@/components/StatCard";
import { PageHeader } from "@/components/UI";
import { BarChart3, Shield, Zap, Users } from "lucide-react";

export default function About() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="About Finance Flow" subtitle="Your intelligent personal finance companion" />
      <div className="space-y-4">
        <GlassCard className="p-6 text-center" delay={0}>
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-blue">
            <BarChart3 size={28} className="text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Finance Flow</h2>
          <p className="text-sm text-muted-foreground mt-1">Version 1.0.0</p>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">A modern personal finance management system to help you track expenses, manage budgets, set savings goals, and split group expenses effortlessly.</p>
        </GlassCard>
        <div className="grid grid-cols-2 gap-4">
          {[{ icon: Shield, label: "Secure & Private", desc: "Your data never leaves your device", color: "text-success" },
            { icon: Zap, label: "Lightning Fast", desc: "Optimized for performance", color: "text-warning" },
            { icon: BarChart3, label: "Rich Analytics", desc: "Visual insights into spending", color: "text-primary" },
            { icon: Users, label: "Group Expenses", desc: "Split costs with friends", color: "text-accent" }].map(({ icon: Icon, label, desc, color }, i) => (
            <GlassCard key={label} className="p-4" delay={i + 1}>
              <Icon size={20} className={`${color} mb-2`} />
              <p className="font-medium text-foreground text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-5 text-center" delay={5}>
          <p className="text-xs text-muted-foreground">© 2025 Finance Flow. All rights reserved.</p>
        </GlassCard>
      </div>
    </div>
  );
}
