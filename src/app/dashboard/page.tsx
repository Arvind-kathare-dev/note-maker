'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  FolderKanban, 
  Users, 
  Activity, 
  ArrowUpRight, 
  Clock,
  MoreVertical,
  Workflow,
  BookOpen,
  Code2,
  Users2,
  ChevronRight,
  TrendingUp,
  Download,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/store/useProjectStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { projects } = useProjectStore();
  const { documents } = useDocumentStore();

  const recentDocs = documents.slice(0, 5);
  const recentProjects = projects.slice(0, 4);

  const stats = [
    { title: "Workflow Docs", value: documents.filter(d => d.category === 'workflow').length, icon: Workflow, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Meeting Notes", value: documents.filter(d => d.category === 'note').length, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Developer Guides", value: documents.filter(d => d.category === 'developer').length, icon: Code2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Client Portals", value: documents.filter(d => d.category === 'client').length, icon: Users2, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl premium-gradient p-12 text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-transparent mb-6 backdrop-blur-md px-3 py-1">
            Documentation Hub v2.0
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Welcome to Nexus</h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed mb-8">
            Manage your company's workflow, developer guides, and client documentation in one professional workspace.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-primary hover:bg-white/90 font-bold px-6 h-12 rounded-xl">
              Create New Doc
            </Button>
            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 font-bold px-6 h-12 rounded-xl backdrop-blur-md">
              View Analytics
            </Button>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-2xl" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> 12%
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
            {/* Decorative line */}
            <div className={cn("absolute bottom-0 left-0 right-0 h-1", stat.color.replace('text', 'bg'))} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Work */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Active Projects</h2>
              <p className="text-sm text-muted-foreground font-medium">Continue working where you left off</p>
            </div>
            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentProjects.map(project => (
              <Card key={project.id} className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-xl shadow-inner">
                    {project.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 2h ago</span>
                      <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> 12 Docs</span>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-accent flex items-center justify-center text-[10px] font-bold">
                          U{i}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recent Documents</h2>
              <p className="text-sm text-muted-foreground font-medium">Quick access to your latest files</p>
            </div>
            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl">
              Open Library <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {recentDocs.map((doc, i) => (
              <div 
                key={doc.id} 
                className={cn(
                  "flex items-center justify-between p-5 hover:bg-accent/30 transition-all group cursor-pointer",
                  i !== recentDocs.length - 1 && "border-b border-border/50"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                    {doc.emoji || '📄'}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-0.5 group-hover:text-primary transition-colors">{doc.title}</h4>
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-tight">
                      <span className="text-primary/70">{doc.category}</span>
                      <span className="text-border">•</span>
                      <span>Modified {format(new Date(doc.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2">
                    {doc.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-accent text-muted-foreground font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Team Activity
            </h2>
            <Card className="bg-card border-border shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4 group">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-xs group-hover:ring-2 ring-primary transition-all">
                        SW
                      </div>
                      {i !== 4 && <div className="absolute top-10 left-5 w-px h-6 bg-border" />}
                    </div>
                    <div className="flex-1 space-y-1 pb-6">
                      <p className="text-sm font-medium leading-relaxed">
                        <span className="font-bold text-foreground">Sarah Wilson</span> published 
                        <span className="text-primary font-bold"> API Guide v2</span> in 
                        <span className="font-bold"> Nexus Project</span>
                      </p>
                      <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 24m ago
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="bg-accent/50 p-4 border-t border-border">
                <Button variant="ghost" className="w-full text-sm font-bold text-muted-foreground hover:text-primary">
                  View Full Audit Log
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-500">
              <BookOpen className="w-5 h-5" /> Pinned Notes
            </h2>
            <div className="p-8 rounded-3xl bg-amber-500/5 border-2 border-dashed border-amber-500/20 text-amber-900/80 dark:text-amber-200/80 text-sm leading-relaxed relative group overflow-hidden">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <p className="font-black text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-widest text-[10px]">Important Task</p>
              <p className="font-semibold text-base leading-relaxed">
                Update the client onboarding flow SOP before Monday. Must include the new security protocols.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                  AD
                </div>
                <span className="text-xs font-bold text-amber-700/60 dark:text-amber-400/60">Assigned by Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
