'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout, ArrowRight, Globe, ShieldCheck, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left panel (branding) ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col items-center justify-center p-16 overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 max-w-md text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
              <Layout className="w-10 h-10 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3">
              Nexus Hub
            </h1>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              The enterprise documentation platform built for teams that move fast.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-1 gap-3 text-left">
            {[
              { emoji: '✍️', title: 'Rich text authoring', desc: 'A full-featured editor with real-time collaboration.' },
              { emoji: '📁', title: 'Project workspaces', desc: 'Organize docs and notes per project with folder hierarchy.' },
              { emoji: '🔒', title: 'Enterprise security', desc: 'End-to-end encrypted sessions and RBAC.' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
                <span className="text-2xl shrink-0">{f.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/60">Trusted by 500+ enterprise teams</p>
        </div>
      </div>

      {/* ── Right panel (form) ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter">Nexus Hub</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your workspace to continue.</p>
          </div>

          {/* SSO buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Globe, label: 'Google SSO', color: 'text-blue-500' },
              { icon: Sparkles, label: 'GitHub', color: 'text-foreground' },
            ].map(btn => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  type="button"
                  className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm font-semibold"
                >
                  <Icon className={cn('w-4 h-4', btn.color)} />
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">or email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</label>
              <div className={cn(
                'flex items-center gap-3 h-12 px-4 rounded-xl border bg-accent/30 transition-all',
                focused === 'email' ? 'border-primary ring-3 ring-primary/15' : 'border-border'
              )}>
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="name@company.com"
                  className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-[11px] font-bold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className={cn(
                'flex items-center gap-3 h-12 px-4 rounded-xl border bg-accent/30 transition-all',
                focused === 'password' ? 'border-primary ring-3 ring-primary/15' : 'border-border'
              )}>
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 premium-gradient text-white font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Sign in to Nexus <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>End-to-End Encrypted · SOC 2 Compliant</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              No account?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Create a free workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
