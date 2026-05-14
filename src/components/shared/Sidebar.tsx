'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Users, 
  Settings, 
  Search,
  ChevronRight,
  Plus,
  LogOut,
  HelpCircle,
  Hash,
  Workflow,
  BookOpen,
  Code2,
  Users2,
  Download,
  Send,
  MoreVertical,
  Palette,
  ChevronDown,
  Star,
  Clock,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import SettingsModal from './SettingsModal';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { projects, activeProjectId } = useProjectStore();
  const { createDocument, documents } = useDocumentStore();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const pinnedDocs = documents.filter(d => d.isPinned).slice(0, 3);

  return (
    <>
      <div 
        className={cn(
          "h-screen border-r border-border/50 bg-card/80 backdrop-blur-xl transition-all duration-300 flex flex-col z-50",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Workspace Switcher / Logo */}
        <div className="p-5 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent/80 transition-all cursor-pointer group w-full">
              <div className="w-9 h-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-md shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm truncate leading-none mb-1 text-foreground">Nexus</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Standard Plan</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          {isCollapsed && (
             <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-md mx-auto cursor-pointer" onClick={() => setIsCollapsed(false)}>
               <span className="font-bold text-xl">N</span>
             </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-none">
          {/* Dashboard Link */}
          <div className="space-y-1">
             <Link href="/dashboard">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group cursor-pointer",
                pathname === '/dashboard' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="font-bold text-sm">Dashboard</span>}
              </div>
            </Link>
            <Link href="/dashboard/projects">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group cursor-pointer",
                pathname === '/dashboard/projects' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
                <FolderKanban className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="font-bold text-sm">Projects</span>}
              </div>
            </Link>
          </div>


          {/* Projects Section */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div 
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className="px-3 py-2 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                   <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", !isProjectsOpen && "-rotate-90")} />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Projects</p>
                </div>
                <Link
                  href="/dashboard/projects"
                  onClick={e => e.stopPropagation()}
                  className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity"
                >
                  <Plus className="w-3 h-3" />
                </Link>
              </div>
            )}
            
            {((!isCollapsed && isProjectsOpen) || isCollapsed) && (
              <div className="space-y-0.5">
                {projects.map(project => (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                    <div 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all relative group",
                        pathname.includes(project.id) ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                      {!isCollapsed && (
                        <>
                          <span className="truncate flex-1 font-medium">{project.name}</span>
                          <MoreVertical className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground" />
                        </>
                      )}
                    </div>
                  </Link>
                ))}
                {!isCollapsed && (
                  <Link href="/dashboard/projects" className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-[11px] text-muted-foreground hover:text-primary transition-all font-bold uppercase tracking-widest bg-accent/30 hover:bg-accent/50 w-fit mx-2">
                    <LayoutDashboard className="w-3 h-3" /> View all projects
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User & Settings Footer */}
        <div className="p-3 mt-auto space-y-1 bg-background/50 backdrop-blur-sm">
           <Button 
            variant="ghost" 
            onClick={() => setIsSettingsOpen(true)}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent h-9 px-3 rounded-lg",
              isCollapsed && "justify-center px-0"
            )}
          >
            <Palette className="w-4 h-4" />
            {!isCollapsed && <span className="font-medium text-sm">Theme Settings</span>}
          </Button>
          
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg transition-all group relative",
            !isCollapsed && "hover:bg-accent cursor-pointer",
            isCollapsed && "justify-center"
          )}>
            <Avatar className="w-8 h-8 border border-border shadow-sm">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold truncate text-foreground">{user?.name}</p>
                <p className="text-[9px] text-muted-foreground truncate uppercase font-bold tracking-widest">Free Account</p>
              </div>
            )}
            {!isCollapsed && (
               <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={logout}>
                 <LogOut className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600" />
               </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="px-2 pt-2">
               <button 
                onClick={() => setIsCollapsed(true)}
                className="w-full py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
               >
                 <ChevronRight className="w-3 h-3 rotate-180" /> Collapse Sidebar
               </button>
            </div>
          )}
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
