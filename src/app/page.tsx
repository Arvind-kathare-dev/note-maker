'use client';

import LandingNavbar from '@/components/shared/LandingNavbar';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  Search, 
  BarChart3,
  Workflow,
  BookOpen,
  Code2,
  Users2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-inter">
      <LandingNavbar />
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[150px] -z-10 animate-pulse" />

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4 fill-primary" />
              <span>Experience Nexus Platform 2.0</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              The Ultimate Hub for <br />
              <span className="text-gradient">Company Knowledge.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              A unified workspace to create, manage, and share workflow docs, developer guides, and client documentation with professional precision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login">
                <Button size="lg" className="premium-gradient text-primary-foreground px-10 h-16 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 border-0 group">
                  Get Started <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border bg-card/50 hover:bg-accent h-16 px-10 text-xl font-bold rounded-2xl backdrop-blur-md">
                View Documentation
              </Button>
            </div>
          </motion.div>

          {/* Premium Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-24 relative"
          >
            <div className="relative rounded-[32px] border border-border bg-card p-4 shadow-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
              <div className="rounded-[24px] overflow-hidden border border-border shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000" 
                  alt="Nexus Enterprise Dashboard" 
                  className="w-full h-auto opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-12 -left-12 p-6 rounded-3xl bg-card border border-border shadow-2xl hidden xl:block animate-bounce-slow">
              <Workflow className="w-8 h-8 text-blue-500" />
            </div>
            <div className="absolute -bottom-12 -right-12 p-6 rounded-3xl bg-card border border-border shadow-2xl hidden xl:block animate-bounce-slow" style={{ animationDelay: '1s' }}>
              <Code2 className="w-8 h-8 text-emerald-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Structured Knowledge Section */}
      <section className="py-32 px-6 bg-accent/20 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Structured for Enterprise Excellence</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Categorize your intelligence into systematic workflows that scale with your team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard 
              icon={<Workflow className="w-8 h-8 text-blue-500" />}
              title="Workflow Docs"
              description="Standardize your internal processes and operational SOPs for maximum efficiency."
              color="blue"
            />
            <CategoryCard 
              icon={<BookOpen className="w-8 h-8 text-purple-500" />}
              title="Meeting Notes"
              description="Capture decisions and action items in a centralized, searchable knowledge base."
              color="purple"
            />
            <CategoryCard 
              icon={<Code2 className="w-8 h-8 text-emerald-500" />}
              title="Developer Guides"
              description="Comprehensive technical documentation and API references for your engineers."
              color="green"
            />
            <CategoryCard 
              icon={<Users2 className="w-8 h-8 text-amber-500" />}
              title="Client Portals"
              description="Securely share project handovers and progress reports with external stakeholders."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to Elevate Your <br />Company Documentation?</h2>
          <Link href="/login">
            <Button size="lg" className="premium-gradient text-primary-foreground px-12 h-16 text-2xl font-bold rounded-2xl shadow-3xl shadow-primary/40 border-0">
              Launch Your Workspace
            </Button>
          </Link>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      </section>
    </div>
  );
}

function CategoryCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:border-blue-500/40",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:border-purple-500/40",
    green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:border-emerald-500/40",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:border-amber-500/40",
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={cn(
        "p-10 rounded-[32px] border bg-card transition-all duration-300 shadow-sm hover:shadow-2xl",
        colors[color]
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mb-8 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}
