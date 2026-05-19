'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  FolderKanban, 
  Activity, 
  ArrowUpRight, 
  Clock,
  MoreVertical,
  BookOpen,
  Code2,
  Users2,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Backpack,
  Compass,
  ArrowRight,
  Sparkles,
  Plus,
  Lock,
  ShieldAlert,
  Briefcase,
  History,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/store/useProjectStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { projects, setActiveProject } = useProjectStore();
  const { documents, setActiveDoc, createDocument } = useDocumentStore();
  const { user } = useAuthStore();
  const [filterProjectId, setFilterProjectId] = useState<string>('all');

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'admin';

  // Project authorization filtering
  const allowedProjects = projects;

  // Document authorization filtering
  const getAuthorizedCategories = () => {
    const base = ['teacher', 'admin', 'student', 'developer'];
    const customIds = allowedProjects.flatMap(p => p.sections || []).map(s => s.id);
    return Array.from(new Set([...base, ...customIds]));
  };

  const allowedCategories = getAuthorizedCategories();
  const allowedDocs = documents.filter(d => 
    allowedProjects.some(p => p.id === d.projectId) && 
    allowedCategories.includes(d.category) &&
    (isAdmin ? true : d.status === 'published')
  );

  const filteredDocs = filterProjectId === 'all'
    ? allowedDocs
    : allowedDocs.filter(d => d.projectId === filterProjectId);

  const recentDocs = filteredDocs.slice(0, 5);
  const recentProjects = allowedProjects.slice(0, 4);

  // Core metrics calculated from real database directories
  const totalProjectsCount = allowedProjects.length;
  const publishedDocsCount = allowedDocs.filter(d => d.status === 'published' || !d.status).length;
  const draftDocsCount = allowedDocs.filter(d => d.status === 'draft').length;
  
  const allSections = allowedProjects.flatMap(p => p.sections || []);
  const uniqueSectionIds = Array.from(new Set(allSections.map(s => s.id)));
  const totalSectionsCount = uniqueSectionIds.length;

  if (totalProjectsCount === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-xl mx-auto text-center h-[80vh] font-inter text-slate-300">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 flex flex-col items-center"
        >
          {/* Glowing Animated Icon Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/35 transition-all duration-500" />
            <div className="relative w-20 h-20 rounded-3xl bg-slate-900 border border-primary/25 flex items-center justify-center shadow-2xl">
              <FolderKanban className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black font-outfit uppercase tracking-tight text-slate-900 dark:text-slate-100">
              No Projects Registered
            </h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
              Veloc database is currently pristine
            </p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-md">
            There are no active projects configured in your database directory. Start organizing your workflows, developer specs, and company SOPs today!
          </p>

          <div className="pt-2 flex flex-col items-center gap-3">
            {isAdmin ? (
              <Button 
                onClick={() => router.push('/dashboard/projects')} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-wider px-6 h-12 rounded-xl transition-all shadow-lg shadow-primary/15 cursor-pointer animate-pulse"
              >
                <Plus className="w-4 h-4 mr-2" /> Create First Project
              </Button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-[#0c1527]/60 border border-border/40 rounded-xl px-4 py-2.5 backdrop-blur-md">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Reader Status · Contact Administrator to Assign Projects
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Dynamic names mapping based on selected profile context
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'teacher': return 'Staff SOPs';
      case 'admin': return 'Admin Controls';
      case 'student': return 'Client Guides';
      case 'developer': return 'Dev specs';
      default: {
        const section = projects.flatMap(p => p.sections || []).find(s => s.id === category);
        return section ? `${section.label} Manuals` : category;
      }
    }
  };

  const handleOpenDoc = (docId: string, projectId: string) => {
    setActiveProject(projectId);
    setActiveDoc(docId);
    router.push(`/dashboard/documents/${docId}`);
  };

  // Compile sections list with dynamic document counts
  const sectionMetrics = (() => {
    const seenIds = new Set<string>();
    const list: Array<{ id: string; label: string; icon: string; count: number; percentage: number }> = [];

    allSections.forEach(s => {
      if (!seenIds.has(s.id)) {
        seenIds.add(s.id);
        const count = allowedDocs.filter(d => d.category === s.id).length;
        list.push({
          id: s.id,
          label: s.label,
          icon: s.icon || 'BookOpen',
          count,
          percentage: allowedDocs.length > 0 ? Math.round((count / allowedDocs.length) * 100) : 0
        });
      }
    });

    return list.sort((a, b) => b.count - a.count);
  })();

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto font-inter text-slate-700 dark:text-slate-300">
      
      {/* State-of-the-Art Dynamic Hero banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-xs">
        <div className="relative z-10 max-w-3xl space-y-5">
          <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 px-3 py-1 font-bold rounded-xl text-[10px] uppercase tracking-wider select-none">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> ACTIVE ROLE: {isAdmin ? 'Veloc Admin' : 'Client Reader'}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight font-outfit uppercase text-slate-900 dark:text-slate-50">
            Veloc Docs Portal
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
            Welcome back, <span className="font-extrabold text-slate-900 dark:text-white">{user?.name}</span>. Explore systematic, project-wise module onboarding flows, developer APIs, and operational guidelines optimized for your custom access profile.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {isAdmin ? (
              <Button onClick={() => {
                const doc = documents[0];
                if (doc) handleOpenDoc(doc.id, doc.projectId || 'p1');
                else router.push('/dashboard/projects');
              }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 h-11 rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer">
                Launch Writer Desk
              </Button>
            ) : (
              <Button onClick={() => {
                if (recentDocs[0]) handleOpenDoc(recentDocs[0].id, recentDocs[0].projectId || 'p1');
              }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 h-11 rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer">
                Explore Guides
              </Button>
            )}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-xl px-4 py-2">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Authorized Workspaces: <span className="text-slate-900 dark:text-slate-100 font-black">{totalProjectsCount}</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
      </div>

      {/* Database Directory Stats Grid */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">
          Active Database Directory
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Workspace Directories", value: totalProjectsCount, desc: "Active project suites", icon: FolderKanban, color: "text-primary bg-primary/10" },
            { title: "Published Manuals", value: publishedDocsCount, desc: "Live client & staff guides", icon: FileText, color: "text-emerald-500 bg-emerald-500/10" },
            { title: "Drafts & Revisions", value: draftDocsCount, desc: "In-progress revisions", icon: Activity, color: "text-amber-500 bg-amber-500/10" },
            { title: "Configured Sections", value: totalSectionsCount, desc: "Custom module sections", icon: Compass, color: "text-sky-500 bg-sky-500/10" }
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden relative">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">{stat.value}</h3>
                  <p className="text-[10px] font-semibold text-slate-500">{stat.desc}</p>
                </div>
                <div className={cn("p-3 rounded-2xl shrink-0", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Dashboard Interactive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column: Workspaces & Updates (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Authorized Project Suite */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase font-outfit">
                  Active Workspace Suite
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dynamic onboarding & specs suite</p>
              </div>
              <Link href="/dashboard/projects" className="text-xs font-bold text-primary hover:underline transition-all flex items-center gap-1">
                Configure Workspaces <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recentProjects.map(project => {
                const projDocs = documents.filter(d => d.projectId === project.id);
                const publishedCount = projDocs.filter(d => d.status === 'published' || !d.status).length;
                const progressVal = projDocs.length > 0 ? Math.round((publishedCount / projDocs.length) * 100) : 0;
                const projectColor = project.color || 'var(--primary)';

                return (
                  <div 
                    key={project.id} 
                    onClick={() => {
                      setActiveProject(project.id);
                      router.push(`/dashboard/projects/${project.id}`);
                    }}
                    style={{ 
                      borderLeftColor: projectColor,
                      borderLeftWidth: '4px'
                    } as any}
                    className="bg-card border border-border/40 hover:border-primary/30 transition-all rounded-2xl p-5 cursor-pointer group shadow-xs hover:shadow-lg relative overflow-hidden text-left flex flex-col justify-between min-h-[200px]"
                  >
                    {/* Hover highlight background glow based on project custom color */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-2 transition-opacity duration-300 pointer-events-none"
                      style={{ backgroundColor: projectColor }}
                    />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-border/30 flex items-center justify-center text-lg shadow-inner shrink-0 select-none">
                          {project.icon}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                            {project.category || 'School Based'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-sm mb-1 group-hover:text-primary transition-colors text-slate-900 dark:text-slate-100">
                          {project.name}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed font-semibold">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border/10 mt-4 relative z-10">
                      {/* Dynamic progress bar */}
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                        <span>{projDocs.length} Manuals Configured</span>
                        <span>{progressVal}% Live</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden border border-border/20">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${progressVal}%`,
                            backgroundColor: projectColor 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Recent Documentation Operations */}
          <div className="space-y-5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-left">
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase font-outfit">
                  Recent Document Operations
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quick jump into authorized documentation</p>
              </div>

              {/* Module Filter Tabs */}
              <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 border border-border/40 rounded-xl max-w-full overflow-x-auto scrollbar-thin">
                <button
                  onClick={() => setFilterProjectId('all')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                    filterProjectId === 'all'
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                {allowedProjects.map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => setFilterProjectId(proj.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap",
                      filterProjectId === proj.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{proj.icon}</span>
                    <span className="max-w-[70px] truncate">{proj.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-card border border-border/30 rounded-2xl overflow-hidden shadow-xs">
              {recentDocs.map((doc, i) => {
                const project = projects.find(p => p.id === doc.projectId);
                return (
                  <div 
                    key={doc.id} 
                    onClick={() => handleOpenDoc(doc.id, doc.projectId || 'p1')}
                    className={cn(
                      "flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-all group cursor-pointer text-left",
                      i !== recentDocs.length - 1 && "border-b border-border/15"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 border border-border/30 flex items-center justify-center text-base shadow-xs shrink-0 select-none group-hover:scale-105 transition-transform">
                        {doc.emoji || '📄'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs mb-0.5 group-hover:text-primary transition-colors text-slate-900 dark:text-slate-100 truncate">
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider flex-wrap">
                          <span className="text-primary">{getCategoryLabel(doc.category)}</span>
                          <span className="text-slate-300 dark:text-slate-700 font-bold select-none">•</span>
                          {project && (
                            <span className="text-slate-400 truncate max-w-[100px]">{project.name}</span>
                          )}
                          <span className="text-slate-350 dark:text-slate-700 font-bold select-none">•</span>
                          <span className="text-slate-500 font-semibold">{format(new Date(doc.updatedAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5">
                        {doc.status && (
                          <Badge className={cn(
                            "font-bold text-[8px] uppercase px-2 py-0.5 rounded-lg border",
                            doc.status === 'published' && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
                            doc.status === 'draft' && "bg-amber-500/10 border-amber-500/30 text-amber-500",
                            doc.status === 'archived' && "bg-rose-500/10 border-rose-500/30 text-rose-500"
                          )}>
                            {doc.status}
                          </Badge>
                        )}
                        {doc.tags.slice(0, 1).map(tag => (
                          <Badge key={tag} className="bg-slate-100 dark:bg-slate-900 border border-border/40 text-slate-400 font-bold text-[8px] uppercase px-2 py-0.5 rounded-lg">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
              {recentDocs.length === 0 && (
                <div className="p-8 text-center">
                  <Compass className="w-8 h-8 text-slate-650 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 italic">No manuals available for reading under this active profile.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Section Directory insights & Sim Panel (Span 1) */}
        <div className="space-y-8">
          
          {/* Section Directory insights card */}
          <div className="space-y-4">
            <h2 className="text-sm font-black flex items-center gap-2 text-slate-900 dark:text-slate-200 uppercase tracking-widest font-outfit text-left">
              <Compass className="w-4 h-4 text-primary shrink-0" /> Section Density Distribution
            </h2>
            <Card className="bg-card border-border/40 shadow-xs text-left overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dynamic manual density by category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {sectionMetrics.map((c, i) => {
                  const Icon = c.id === 'teacher' ? GraduationCap
                             : c.id === 'admin' ? ShieldAlert
                             : c.id === 'student' ? Backpack
                             : c.id === 'developer' ? Code2
                             : BookOpen;

                  const color = c.id === 'teacher' ? 'text-primary'
                              : c.id === 'admin' ? 'text-purple-400'
                              : c.id === 'student' ? 'text-amber-400'
                              : c.id === 'developer' ? 'text-sky-400'
                              : 'text-primary';

                  return (
                    <div key={c.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={cn("w-4 h-4 shrink-0", color)} />
                          <span className="truncate text-slate-800 dark:text-slate-200 font-semibold">{c.label}</span>
                        </div>
                        <span className="text-slate-400 font-black shrink-0">{c.count} docs</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-border/20">
                        <div 
                           className={cn(
                            "h-full rounded-full transition-all duration-300",
                            c.id === 'teacher' ? "bg-primary" :
                            c.id === 'admin' ? "bg-purple-500" :
                            c.id === 'student' ? "bg-amber-500" :
                            c.id === 'developer' ? "bg-sky-500" : "bg-primary"
                          )}
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {sectionMetrics.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-4">No sections loaded in active workspaces.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick-Login simulation desktop notice card */}
          <div className="space-y-4">
            <h2 className="text-sm font-black flex items-center gap-2 text-slate-900 dark:text-slate-200 uppercase tracking-widest font-outfit text-left">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" /> Simulator Quick desk
            </h2>
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-slate-600 dark:text-slate-350 text-xs leading-relaxed relative group overflow-hidden text-left">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <p className="font-black text-amber-500 mb-2.5 uppercase tracking-widest text-[9px]">Veloc System simulation Notice</p>
              <p className="font-semibold text-xs leading-relaxed">
                To test the permissions layout, sign out and sign in using the <span className="font-extrabold text-slate-800 dark:text-slate-200">"Quick-Login Simulator Desk"</span> on the login screen! Select the Veloc Administrator to create, edit, and delete documents, or select any of the specific Client Reader accounts to view their strictly authorized folders and flat, beautiful reader links!
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-black text-[8px]">
                  VL
                </div>
                <span className="text-[9px] font-bold text-amber-500/60">Veloc Admin Service</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
