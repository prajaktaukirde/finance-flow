import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ArrowLeftRight, Target, PieChart, BarChart3,
  FileText, RefreshCcw, Bell, User, Settings, CalendarDays,
  HelpCircle, Info, ChevronLeft, ChevronRight, Wallet, X, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
  { label: "Budgets", icon: Wallet, path: "/budgets" },
  { label: "Goals", icon: Target, path: "/goals" },
  { label: "Analytics", icon: PieChart, path: "/analytics" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Recurring", icon: RefreshCcw, path: "/recurring" },
  { label: "Events", icon: CalendarDays, path: "/events" },
];

const secondaryItems = [
  { label: "Notifications", icon: Bell, path: "/notifications", badge: 3 },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Help", icon: HelpCircle, path: "/help" },
  { label: "About", icon: Info, path: "/about" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AppSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-blue flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
              <p className="font-bold text-sidebar-foreground text-sm leading-tight">FinanceOS</p>
              <p className="text-xs text-muted-foreground">Personal Finance</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto custom-scrollbar mt-2">
        <p className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2", collapsed && "hidden")}>Main Menu</p>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-primary text-primary-foreground shadow-blue"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5 flex-shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} size={18} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-border">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t border-sidebar-border" />
        <p className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2", collapsed && "hidden")}>Account</p>
        {secondaryItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-primary text-primary-foreground shadow-blue"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} size={18} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 truncate">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-border">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle button */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-screen bg-sidebar sticky top-0 border-r border-sidebar-border overflow-hidden flex-shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 md:hidden flex flex-col"
            >
              <div className="absolute top-4 right-4">
                <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground">
                  <X size={18} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
