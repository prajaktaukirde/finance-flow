import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Apply theme class whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Remove both classes first to ensure clean state
    root.classList.remove("dark", "light");
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = localStorage.getItem("theme");
    
    // Only auto-switch if user hasn't manually set a preference
    if (!stored) {
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [mounted]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, setTheme, mounted };
}
