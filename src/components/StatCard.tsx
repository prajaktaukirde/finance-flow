import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label?: string };
  gradient?: string;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon, trend, gradient, delay = 0 }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="glass-card rounded-xl p-5 hover-lift"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", isPositive ? "text-success" : "text-destructive")}>
              <span>{isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
              {trend.label && <span className="text-muted-foreground font-normal">{trend.label}</span>}
            </div>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm", gradient || "gradient-primary")}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={cn("glass-card rounded-xl", className)}
    >
      {children}
    </motion.div>
  );
}
