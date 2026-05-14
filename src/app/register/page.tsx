'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout, ArrowRight, Globe, Check, User, Mail, Building2, Link2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Your details', desc: 'Name and email to get started.' },
  { id: 2, title: 'Workspace', desc: 'Name your organization.' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', org: '', slug: '' });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    router.push('/dashboard');
  };

  const inputClass = (key: string) => cn(
    'flex items-center gap-3 h-12 px-4 rounded-xl border bg-accent/30 transition-all',
    focused === key ? 'border-primary ring-3 ring-primary/15' : 'border-border'
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left panel ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative flex-col items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 max-w-md text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
              <Layout className="w-10 h-10 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-3">Nexus Hub</h1>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              Start free, scale to enterprise. No credit card required.
            </p>
          </div>

          {/* What you get */}
          <div className="grid grid-cols-1 gap-2.5 text-left">
            {[
              'Unlimited documents & notes',
              'Project workspaces with folder hierarchy',
              'Rich-text editor with PDF export',
              'Team sharing & collaboration',
              'Dark / light mode + custom typography',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/50">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter">Nexus Hub</span>
          </div>

          {/* Step indicator */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0',
                    step > s.id ? 'bg-emerald-500 text-white' :
                    step === s.id ? 'bg-primary text-primary-foreground' :
                    'bg-accent text-muted-foreground'
                  )}>
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn('flex-1 h-0.5 rounded-full transition-all', step > s.id ? 'bg-emerald-500' : 'bg-border')} />
                  )}
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">{STEPS[step - 1].title}</h2>
              <p className="text-muted-foreground mt-1">{STEPS[step - 1].desc}</p>
            </div>
          </div>

          {/* SSO (step 1 only) */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Globe, label: 'Google', color: 'text-blue-500' },
                  { icon: Sparkles, label: 'GitHub', color: 'text-foreground' },
                ].map(btn => {
                  const Icon = btn.icon;
                  return (
                    <button key={btn.label} type="button"
                      className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm font-semibold"
                    >
                      <Icon className={cn('w-4 h-4', btn.color)} />
                      {btn.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">or email</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <div className={inputClass('name')}>
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      value={form.name} onChange={e => set('name', e.target.value)}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                      placeholder="Jane Doe"
                      className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Work Email</label>
                  <div className={inputClass('email')}>
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      type="email"
                      value={form.email} onChange={e => set('email', e.target.value)}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                      placeholder="jane@company.com"
                      className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Organization Name</label>
                  <div className={inputClass('org')}>
                    <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      value={form.org} onChange={e => set('org', e.target.value)}
                      onFocus={() => setFocused('org')} onBlur={() => setFocused(null)}
                      placeholder="Acme Corp"
                      className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workspace Slug</label>
                  <div className={inputClass('slug')}>
                    <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      onFocus={() => setFocused('slug')} onBlur={() => setFocused(null)}
                      placeholder="acme-corp"
                      className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50 font-mono"
                      required
                    />
                    <span className="text-xs text-muted-foreground font-mono shrink-0">.nexus.hub</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-1">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 h-12 rounded-xl border border-border font-bold text-sm hover:bg-accent transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={cn(
                  'h-12 premium-gradient text-white font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all',
                  step > 1 ? 'flex-1' : 'w-full'
                )}
              >
                {step < STEPS.length ? (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Create Workspace <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already on Nexus?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
