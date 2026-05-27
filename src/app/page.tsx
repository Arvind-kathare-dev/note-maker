import Link from 'next/link';
import { BookOpen, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] font-inter text-slate-100 selection:bg-emerald-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 h-16 border-b border-border/10 bg-[#030712]/80 backdrop-blur-xl z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center font-outfit font-black text-emerald-400">
            LS
          </div>
          <span className="font-outfit font-black tracking-wider text-sm">LITTLE SEEDS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            Admin Login
          </Link>
          <Link href="/docs" className="h-8 px-4 bg-emerald-500 hover:bg-emerald-400 text-[#030712] rounded-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
            View Docs
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 lg:px-12 flex flex-col items-center justify-center min-h-screen text-center relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl max-h-3xl bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 space-y-8 max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Platform Documentation
          </div>

          <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">
            The Complete Guide to Little Seeds
          </h1>

          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
            Explore our comprehensive documentation, integration guides, and platform modules. Everything you need to understand and build with Little Seeds, open to the public.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
            <Link 
              href="/docs" 
              className="h-14 px-8 rounded-xl bg-white hover:bg-slate-200 text-[#030712] flex items-center gap-3 font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-5 h-5" /> Start Reading Docs
            </Link>
            
            <Link 
              href="/login" 
              className="h-14 px-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-white flex items-center gap-3 font-black text-sm uppercase tracking-wider transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Admin Access
            </Link>
          </div>

        </div>

      </main>

    </div>
  );
}
