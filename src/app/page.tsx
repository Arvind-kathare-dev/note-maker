'use client';

import React, { useState } from 'react';
import LandingNavbar from '@/components/shared/LandingNavbar';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  FileText, 
  Shield, 
  Zap, 
  Search, 
  BarChart3,
  Workflow,
  BookOpen,
  Code2,
  Sparkles,
  Sliders,
  FolderPlus,
  ArrowUpRight,
  Sun,
  Moon,
  Check,
  ShieldCheck,
  KeyRound,
  LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Types & Constants for the Sandbox ---
type ThemeMode = 'dark' | 'light';
type AccentColor = 'blue' | 'purple' | 'green' | 'rose' | 'orange' | 'mint' | 'crimson';
type FontFamily = 'inter' | 'outfit' | 'montserrat';

const ACCENTS: { id: AccentColor; label: string; colorClass: string; hex: string }[] = [
  { id: 'blue', label: 'Ocean Blue', colorClass: 'bg-blue-500', hex: '#6366f1' },
  { id: 'purple', label: 'Royal Purple', colorClass: 'bg-purple-500', hex: '#8b5cf6' },
  { id: 'green', label: 'Forest Green', colorClass: 'bg-emerald-500', hex: '#10b981' },
  { id: 'rose', label: 'Rose Red', colorClass: 'bg-rose-500', hex: '#ef4444' },
  { id: 'orange', label: 'Sunset Orange', colorClass: 'bg-orange-500', hex: '#f97316' },
  { id: 'mint', label: 'Emerald Mint', colorClass: 'bg-teal-400', hex: '#14b8a6' },
  { id: 'crimson', label: 'Crimson Red', colorClass: 'bg-rose-800', hex: '#991b1b' },
];

const FONTS: { id: FontFamily; label: string; classVar: string }[] = [
  { id: 'inter', label: 'Inter (Modern)', classVar: 'font-inter' },
  { id: 'outfit', label: 'Outfit (Geometric)', classVar: 'font-outfit' },
  { id: 'montserrat', label: 'Montserrat (Bold)', classVar: 'font-montserrat' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Create Dedicated Modules',
    description: 'Establish secure module spaces with custom colors and emojis designed to categorize your documentation silos easily.',
    icon: <FolderPlus className="w-6 h-6 text-blue-500" />,
    badge: 'Structure'
  },
  {
    step: '02',
    title: 'Configure Custom Sections',
    description: 'Define customized categories like Admins, Developers, and Partners to structure database manuals perfectly.',
    icon: <Workflow className="w-6 h-6 text-purple-500" />,
    badge: 'Organization'
  },
  {
    step: '03',
    title: 'Manage Dynamic Pages',
    description: 'Use folders, nested documents, and high-fidelity text layouts to write process manuals that stay accessible.',
    icon: <FileText className="w-6 h-6 text-emerald-500" />,
    badge: 'Collaboration'
  },
  {
    step: '04',
    title: 'Brand & Launch Portal',
    description: 'Customize color accents, dark/light modes, and font presets. Publish a premium branded reader for clients.',
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    badge: 'Sharing'
  }
];

export default function LandingPage() {
  // Sandbox state
  const [sandboxMode, setSandboxMode] = useState<ThemeMode>('dark');
  const [sandboxAccent, setSandboxAccent] = useState<AccentColor>('purple');
  const [sandboxFont, setSandboxFont] = useState<FontFamily>('outfit');

  // Workflow active step state
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const selectedAccent = ACCENTS.find(a => a.id === sandboxAccent) || ACCENTS[0];
  const selectedFont = FONTS.find(f => f.id === sandboxFont) || FONTS[0];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-inter">
      <LandingNavbar />
      
      {/* Background radial gradients for depth */}
      <div className="absolute top-[-5%] left-[-5%] w-[45vw] h-[45vw] bg-primary/10 rounded-full blur-[160px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/15 rounded-full blur-[180px] -z-10 animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />

      {/* Hero Section */}
      <section className="pt-36 md:pt-48 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Zap Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider mb-8 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>Next Generation Veloc Platform 3.0</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tight mb-8 leading-[1.08] max-w-5xl">
              The Hub for Enterprise <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-400 to-emerald-400">
                Workspace Knowledge
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-semibold">
              A unified platform to manage structured workflow docs, developer manuals, and share beautiful, client-facing portals styled exactly to your client brand.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground px-10 h-14 text-sm font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-primary/25 group transition-all duration-300">
                  Access Dashboard <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#sandbox" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border bg-card/45 hover:bg-accent text-muted-foreground hover:text-foreground h-14 px-10 text-sm font-black uppercase tracking-wider rounded-2xl backdrop-blur-md transition-all duration-300">
                  Try Theme Sandbox
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Premium Preview & Layout Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            {/* Premium glass frame surrounding dashboard card */}
            <div className="relative rounded-[32px] border border-border/80 bg-card/40 p-3 sm:p-5 shadow-3xl overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-emerald-500/5 pointer-events-none" />
              <div className="rounded-[22px] overflow-hidden border border-border shadow-inner bg-background relative flex aspect-video">
                
                {/* Simulated Sidebar */}
                <div className="w-[20%] border-r border-border bg-card/65 p-3 hidden md:flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-[10px] text-primary">⚡</div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-foreground">Veloc Docs</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[8px] font-black uppercase tracking-wider text-muted-foreground px-1">Active Modules</div>
                      <div className="h-6 rounded-lg bg-accent/80 flex items-center gap-2 px-2 text-[9px] font-bold text-foreground">
                        <span>🌱</span> <span className="truncate">Client Space</span>
                      </div>
                      <div className="h-6 rounded-lg flex items-center gap-2 px-2 text-[9px] font-bold text-muted-foreground hover:bg-accent/40">
                        <span>🚀</span> <span className="truncate">SaaS Manuals</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-6 bg-accent/40 rounded-lg flex items-center gap-2 px-2 text-[8px] font-extrabold text-muted-foreground">
                    <span>👤</span> <span className="truncate">Administrator</span>
                  </div>
                </div>

                {/* Simulated Main Dashboard Grid */}
                <div className="flex-1 bg-background p-4 sm:p-6 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="text-xs sm:text-base font-black font-outfit text-foreground leading-none">Active Database Directory</h3>
                        <p className="text-[9px] text-muted-foreground mt-1">Select workspace module directory files to read or edit</p>
                      </div>
                      <div className="h-7 px-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center">
                        Active Database
                      </div>
                    </div>
                    
                    {/* Simulated project grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-card border border-border rounded-xl space-y-2 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 rounded-t-xl" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🌱</span>
                          <span className="text-[10px] font-black text-foreground">Ordiana Physician</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">Client documentation pool containing custom categories.</p>
                      </div>
                      <div className="p-3 bg-card border border-border rounded-xl space-y-2 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-t-xl" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🚀</span>
                          <span className="text-[10px] font-black text-foreground">NextGen SaaS</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">Technical product blueprints, REST APIs and guidelines.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between bg-accent/25 border border-border/60 p-2 rounded-xl text-[9px] text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Connection Stable</span>
                    <span className="font-mono">v3.0.0-Stable</span>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Decorative Floating Badges */}
            <div className="absolute -top-6 -left-6 p-4 rounded-2xl bg-card border border-border shadow-xl hidden lg:block animate-bounce-slow">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Client Handovers</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-card border border-border shadow-xl hidden lg:block animate-bounce-slow" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-foreground">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Full Portal Customizer</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Workflow Stepper Section */}
      <section className="py-24 px-6 border-t border-border bg-accent/5" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tight mb-4 text-foreground">
              How Veloc Structures Your Knowledge Flow
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-medium">
              Create secure, categorized spaces and publish tailored branding layouts for team members and external stakeholders alike.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left - Stepper Buttons */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
              {WORKFLOW_STEPS.map((step, idx) => (
                <button
                  key={step.step}
                  onClick={() => setActiveWorkflow(idx)}
                  className={cn(
                    'w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer',
                    activeWorkflow === idx 
                      ? 'bg-card border-primary/30 shadow-lg translate-x-2'
                      : 'bg-transparent border-transparent hover:bg-accent/40 hover:border-border/60'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border transition-all duration-300',
                    activeWorkflow === idx ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-accent/50 border-border text-muted-foreground'
                  )}>
                    {step.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-primary">{step.step}</span>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-accent/65 px-2 py-0.5 rounded text-muted-foreground">{step.badge}</span>
                    </div>
                    <h3 className="text-sm font-black text-foreground">{step.title}</h3>
                  </div>
                </button>
              ))}
            </div>

            {/* Right - High-fidelity workflow preview card */}
            <div className="lg:col-span-7 flex items-center">
              <div className="w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-primary tracking-widest">Active Step Detail</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground font-semibold">Veloc Visual Guide</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-black font-outfit text-foreground leading-tight">
                    {WORKFLOW_STEPS[activeWorkflow].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                    {WORKFLOW_STEPS[activeWorkflow].description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                      {WORKFLOW_STEPS[activeWorkflow].step}
                    </div>
                    <span className="text-[11px] font-bold text-foreground">System Engine Active</span>
                  </div>
                  <Link href="/login">
                    <Button variant="ghost" className="text-xs font-black uppercase tracking-wider text-primary hover:text-primary/95 flex items-center gap-1.5">
                      Explore Live <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Theme Sandbox / Brand Preview Section */}
      <section className="py-24 px-6 border-t border-border relative overflow-hidden" id="sandbox">
        {/* Radial blur container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              <Sliders className="w-3 h-3 text-primary" />
              <span>Theme Sandbox Simulator</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tight mb-4 text-foreground">
              Simulate Your Portal Branding Live
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-medium">
              Veloc allows admins to set dynamic dark/light modes, accent colors, and custom typography fonts. Adjust the dials below to preview the client page render immediately!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Theme Dials & Controls */}
            <div className="lg:col-span-5 bg-card/60 backdrop-blur-md border border-border p-6 rounded-3xl space-y-6">
              
              {/* Dial: Appearance mode toggle */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Appearance Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSandboxMode('dark')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer',
                      sandboxMode === 'dark' ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-accent text-muted-foreground'
                    )}
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </button>
                  <button
                    onClick={() => setSandboxMode('light')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer',
                      sandboxMode === 'light' ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-accent text-muted-foreground'
                    )}
                  >
                    <Sun className="w-3.5 h-3.5" /> Light
                  </button>
                </div>
              </div>

              {/* Dial: Color accents */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Accent branding color</label>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENTS.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => setSandboxAccent(acc.id)}
                      className={cn(
                        'h-9 rounded-xl border flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all relative truncate cursor-pointer',
                        sandboxAccent === acc.id ? 'border-primary bg-primary/5 text-foreground' : 'border-border hover:bg-accent text-muted-foreground'
                      )}
                      title={acc.label}
                    >
                      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', acc.colorClass)} />
                      <span className="truncate hidden sm:inline">{acc.label.split(' ')[1] || acc.label}</span>
                      {sandboxAccent === acc.id && (
                        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-bl" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dial: Fonts */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Typography font style</label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map(fnt => (
                    <button
                      key={fnt.id}
                      onClick={() => setSandboxFont(fnt.id)}
                      className={cn(
                        'h-10 px-3 rounded-xl border flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer',
                        sandboxFont === fnt.id ? 'bg-primary/10 border-primary text-primary font-black' : 'border-border hover:bg-accent text-muted-foreground'
                      )}
                    >
                      <span className="truncate">{fnt.label}</span>
                      <span className="text-[9px] opacity-40 font-mono shrink-0 font-light">Aa</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-accent/25 border border-border rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-bold">
                  These customization parameters are saved dynamically per module space and load instantly for clients.
                </p>
              </div>

            </div>

            {/* Right Column: Live Mockup Preview Widget */}
            <div className="lg:col-span-7">
              <div 
                className={cn(
                  'w-full border shadow-2xl rounded-[32px] overflow-hidden transition-all duration-300 p-5 sm:p-6 text-left min-h-[420px] flex flex-col justify-between relative',
                  sandboxMode === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                )}
                style={{ 
                  borderColor: selectedAccent.hex + '40',
                }}
              >
                {/* Simulated Portal Top Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 shadow-sm"
                      style={{ 
                        backgroundColor: selectedAccent.hex + '20',
                        color: selectedAccent.hex
                      }}
                    >
                      🏢
                    </div>
                    <div>
                      <h4 className={cn('text-xs font-black font-outfit uppercase leading-none tracking-wider', selectedFont.classVar)}>
                        Ordiana Physician Client Space
                      </h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">Secure Document Vault</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border"
                      style={{ 
                        backgroundColor: selectedAccent.hex + '10',
                        borderColor: selectedAccent.hex + '35',
                        color: selectedAccent.hex
                      }}
                    >
                      Active Theme
                    </span>
                  </div>
                </div>

                {/* Simulated Portal Main Panel Content */}
                <div className="py-6 space-y-4 flex-1">
                  <div className="space-y-1">
                    <h3 className={cn('text-xl sm:text-2xl font-black leading-tight', selectedFont.classVar)}>
                      Welcome to your project handover repository
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                      Select custom sections from the sidebar inside your portal dashboard. This theme rendering runs inside a custom CSS sandbox variable block.
                    </p>
                  </div>

                  {/* Highlight Box styled after selected colors */}
                  <div 
                    className="p-4 rounded-2xl border"
                    style={{
                      backgroundColor: selectedAccent.hex + '05',
                      borderColor: selectedAccent.hex + '20'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" style={{ color: selectedAccent.hex }} />
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: selectedAccent.hex }}>Branded Touchpoints</span>
                    </div>
                    <p className="text-[10.5px] text-muted-foreground leading-relaxed font-bold">
                      All highlights, pills, buttons, and hover indicators on this page dynamically adapt to <span className="font-black" style={{ color: selectedAccent.hex }}>{selectedAccent.label}</span> layout rules.
                    </p>
                  </div>
                </div>

                {/* Simulated Bottom Actions */}
                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground font-mono uppercase">Branding preset applied</span>
                  <button 
                    className="px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-md transition-all cursor-pointer hover:scale-105"
                    style={{ backgroundColor: selectedAccent.hex }}
                  >
                    Accept Document Handover
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Security & Features Grid */}
      <section className="py-24 px-6 border-t border-border bg-accent/15" id="solutions">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tight mb-4 text-foreground">
              Powerful Document Tools Built In
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-medium">
              Veloc integrates key workspace capabilities to deliver absolute control over developer documentation and partner guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-outfit text-foreground mb-2">Role Isolation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Admin controls restrict or grant document viewing access, dividing sections cleanly between partners and developers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-outfit text-foreground mb-2">Instant Global Search</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Rapid indexing across all custom sections. Find SOPs, meeting updates, or API schemas instantly from a single input field.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-outfit text-foreground mb-2">Directory Overview</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Clear dashboard cards displaying modules status, category metadata, and document count.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access/Call to Action Section */}
      <section className="py-24 px-6 border-t border-border text-center relative overflow-hidden" id="pricing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <h2 className="text-4xl md:text-7xl font-black font-outfit tracking-tight text-foreground leading-[1.1]">
            Elevate Your Company <br />
            Knowledge Systems
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-semibold">
            Join enterprise workspaces structuring their internal workflows and building branded document portals with Veloc.
          </p>
          
          <div className="pt-4">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-primary-foreground px-12 h-16 text-base font-black uppercase tracking-wider rounded-2xl shadow-2xl shadow-primary/30 group">
                Launch Dashboard <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-12 border-t border-border/60">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> Self-hosted Vaults</span>
            <span className="flex items-center gap-1"><KeyRound className="w-3.5 h-3.5 text-primary" /> Granular Admin Permissions</span>
            <span className="flex items-center gap-1"><LayoutGrid className="w-3.5 h-3.5 text-primary" /> Infinite Modules</span>
          </div>
        </div>
      </section>
      
      {/* Footer bar */}
      <footer className="py-8 px-6 border-t border-border/60 text-center text-xs text-muted-foreground font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Veloc Platforms. All rights reserved.</p>
          <div className="flex gap-6 font-bold uppercase text-[10px] tracking-wider">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#sandbox" className="hover:text-foreground transition-colors">Branding Simulator</Link>
            <Link href="#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
