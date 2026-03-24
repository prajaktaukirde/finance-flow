import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Welcome back! Signed in successfully. 🎉");
    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-600/10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-blue mb-3">
            <TrendingUp className="text-primary-foreground" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Finance Flow</h1>
          <p className="text-muted-foreground text-sm mt-1">Your personal finance companion</p>
        </div>

        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-border">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {errors.general && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors((p) => ({ ...p, email: "" })); }}
                  placeholder="arjun@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.email ? "border-destructive" : "border-border focus:border-primary"}`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors((p) => ({ ...p, password: "" })); }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.password ? "border-destructive" : "border-border focus:border-primary"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => toast("Password reset link sent! Check your email.", { icon: "📧" })}
                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-blue hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Signing in...</>
              ) : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="px-3 text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary text-center">
            🔐 Demo: Enter any valid email & password (6+ chars) to sign in
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© 2024 Finance Flow • Secure & Private</p>
      </div>
    </div>
  );
}
