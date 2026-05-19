'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  ChevronRight,
  Plus,
  LogOut,
  ChevronDown,
  Palette,
  Briefcase,
  Users2,
  Lock,
  Pin,
  Star,
  MoreVertical,
  Trash2,
  Edit3,
  FolderPlus,
  GraduationCap,
  ShieldAlert,
  Backpack,
  Code2,
  BookOpen,
  X,
  Link2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore, getProjectSections } from '@/store/useProjectStore';
import { useDocumentStore, Doc } from '@/store/useDocumentStore';
import SettingsModal from './SettingsModal';
import ProjectModal from './ProjectModal';
import { Select } from '@/components/ui/select';

const SECTION_ICON_OPTIONS = [
  { emoji: 'GraduationCap', label: '🎓' },
  { emoji: 'ShieldAlert', label: '🛡️' },
  { emoji: 'Backpack', label: '🎒' },
  { emoji: 'Code2', label: '💻' },
  { emoji: 'Briefcase', label: '💼' },
  { emoji: 'Users2', label: '👥' },
  { emoji: 'BookOpen', label: '📝' }
].map(opt => ({ value: opt.emoji, label: opt.label }));

type ClientRole = string;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const { projects, activeProjectId, setActiveProject, createProject, deleteProject, updateProject } = useProjectStore();
  const {
    folders, documents, activeDocId, createDocument, createFolder,
    deleteDocument, deleteFolder, setActiveDoc, togglePin,
    toggleFavorite, updateDocument
  } = useDocumentStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [renameProjectVal, setRenameProjectVal] = useState('');
  const [openProjectMenuId, setOpenProjectMenuId] = useState<string | null>(null);

  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameFolderVal, setRenameFolderVal] = useState('');

  // Track open/collapsed categories inside active project
  const [collapsedCategories, setCollapsedCategories] = useState<Record<ClientRole, boolean>>({
    teacher: false,
    admin: false,
    student: false,
    developer: false,
  });

  // Track folder creation inline
  const [newFolderCategory, setNewFolderCategory] = useState<ClientRole | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Project Creation Modal state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Section edit states
  const [openSectionMenuId, setOpenSectionMenuId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<{ projectId: string, sectionId: string, label: string, icon: string } | null>(null);

  const [isSectionsConfigOpen, setIsSectionsConfigOpen] = useState(false);
  const [selectedProjectForConfig, setSelectedProjectForConfig] = useState<any>(null);
  const [configCustomSections, setConfigCustomSections] = useState<Array<{ id: string; label: string; icon: string }>>([]);

  const handleOpenSectionsConfig = (project: any) => {
    setSelectedProjectForConfig(project);
    setConfigCustomSections(
      project.sections && project.sections.length > 0
        ? project.sections
        : [{ id: `sec_${Math.random().toString(36).slice(2, 7)}`, label: 'New Custom Section', icon: 'BookOpen' }]
    );
    setIsSectionsConfigOpen(true);
  };

  const handleDeleteSection = async (projectId: string, sectionId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (confirm("Are you sure you want to delete this custom section? All documents inside will remain, but the section view will be removed.")) {
      const updatedSections = (project.sections || []).filter((s: any) => s.id !== sectionId);
      await updateProject(projectId, { sections: updatedSections });
    }
  };

  const handleAddConfigCustomSection = () => {
    const newId = `sec_${Math.random().toString(36).slice(2, 7)}`;
    setConfigCustomSections(prev => [...prev, { id: newId, label: 'New Custom Section', icon: 'BookOpen' }]);
  };

  const handleRemoveConfigCustomSection = (id: string) => {
    setConfigCustomSections(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateConfigSectionLabel = (id: string, label: string) => {
    setConfigCustomSections(prev => prev.map(s => s.id === id ? { ...s, label } : s));
  };

  const handleUpdateConfigSectionIcon = (id: string, icon: string) => {
    setConfigCustomSections(prev => prev.map(s => s.id === id ? { ...s, icon } : s));
  };

  const handleSaveConfigSections = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForConfig) return;
    const formatted = configCustomSections.map(s => ({
      id: s.id,
      label: s.label.trim(),
      icon: s.icon
    }));
    await updateProject(selectedProjectForConfig.id, { sections: formatted });
    setIsSectionsConfigOpen(false);
    setSelectedProjectForConfig(null);
  };

  // 1. Detect if logged in user is Veloc Admin (Full edit rights)
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'admin';

  // 2. Project-wise Access: return all projects from the database
  const getAuthorizedProjects = () => {
    return projects;
  };

  const allowedProjects = getAuthorizedProjects();

  const activeProject = projects.find(p => p.id === activeProjectId);

  // Dynamic names mapping based on active project context
  const dynamicRoleMeta: Record<ClientRole, { label: string; icon: any; color: string }> = {
    teacher: {
      label: activeProject?.sectionLabels?.teacher ||
        (activeProjectId === 'p2' ? 'Coaches SOPs' : activeProjectId === 'p3' ? 'Merchant Manuals' : 'Teachers Manuals'),
      icon: GraduationCap,
      color: 'text-emerald-400',
    },
    admin: {
      label: activeProject?.sectionLabels?.admin ||
        (activeProjectId === 'p2' ? 'Platform Settings' : activeProjectId === 'p3' ? 'Warehouse Guidelines' : 'Admin Portal Setup'),
      icon: ShieldAlert,
      color: 'text-purple-400',
    },
    student: {
      label: activeProject?.sectionLabels?.student ||
        (activeProjectId === 'p2' ? 'Athlete Mobile Guide' : activeProjectId === 'p3' ? 'Customer Helpdesk' : 'Student & Parent Guides'),
      icon: Backpack,
      color: 'text-amber-400',
    },
    developer: {
      label: activeProject?.sectionLabels?.developer ||
        (activeProjectId === 'p2' ? 'WebSocket Sync API' : activeProjectId === 'p3' ? 'Headless API Specs' : 'Core Developer Specs'),
      icon: Code2,
      color: 'text-sky-400',
    },
  };

  const handleNewDoc = async (category: ClientRole, folderId?: string) => {
    if (!activeProjectId) return;
    const doc = await createDocument(folderId || null, null, activeProjectId, category);
    setActiveDoc(doc.id);
    startRename(doc);
    router.push(`/dashboard/documents/${doc.id}`);
  };

  const handleCreateFolder = async (category: ClientRole) => {
    if (newFolderName.trim() && activeProjectId) {
      const parentId = `f_${category}_${activeProjectId}`;
      await createFolder(newFolderName.trim(), parentId, activeProjectId);
      setNewFolderName('');
    }
    setNewFolderCategory(null);
  };

  const startRename = (doc: Doc) => {
    setRenamingId(doc.id);
    setRenameVal(doc.title);
  };

  const commitRename = () => {
    if (renamingId && renameVal.trim()) {
      updateDocument(renamingId, { title: renameVal.trim() });
    }
    setRenamingId(null);
  };

  const startFolderRename = (folderId: string, currentName: string) => {
    setRenamingFolderId(folderId);
    setRenameFolderVal(currentName);
  };

  const commitFolderRename = () => {
    if (renamingFolderId && renameFolderVal.trim()) {
      const folders = useDocumentStore.getState().folders;
      const folder = folders.find(f => f.id === renamingFolderId);
      if (folder) {
        useDocumentStore.setState({
          folders: folders.map(f => f.id === renamingFolderId ? { ...f, name: renameFolderVal.trim() } : f)
        });
      }
    }
    setRenamingFolderId(null);
  };

  const toggleCategory = (role: ClientRole) => {
    setCollapsedCategories(prev => ({ ...prev, [role]: !prev[role] }));
  };

  return (
    <>
      <div
        className={cn(
          "h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 flex flex-col z-50 text-sidebar-foreground select-none",
          isCollapsed ? "w-20" : "w-76"
        )}
      >
        {/* Veloc Branding Header */}
        <div className="p-5 flex flex-col shrink-0 gap-3 border-b border-border/20">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent border border-border w-full relative">
              <div className="w-9 h-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 font-outfit font-black text-lg">
                V
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="font-extrabold text-sm text-foreground font-outfit tracking-wider uppercase">Veloc</span>
                <span className="text-[9px] text-primary font-black uppercase tracking-widest leading-none mt-0.5">Docs Portal</span>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className={cn(
                  "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm tracking-wide",
                  isAdmin ? "bg-primary/10 text-primary border border-primary/20" : "bg-accent text-muted-foreground"
                )}>
                  {isAdmin ? 'Admin' : 'Client'}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mx-auto cursor-pointer font-outfit font-black text-xl" onClick={() => setIsCollapsed(false)}>
              V
            </div>
          )}
        </div>

        {/* Unified Project & Document Navigation Tree */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">

          {/* Dashboard Link */}
          <div className="space-y-1">
            <Link href="/dashboard">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group cursor-pointer text-xs font-bold uppercase tracking-wider",
                pathname === '/dashboard' ? "bg-primary/10 text-primary font-extrabold" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Dashboard</span>}
              </div>
            </Link>
            {isAdmin && (
              <Link href="/dashboard/clients">
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group cursor-pointer text-xs font-bold uppercase tracking-wider",
                  pathname === '/dashboard/clients' ? "bg-primary/10 text-primary font-extrabold" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}>
                  <Users2 className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Manage Clients</span>}
                </div>
              </Link>
            )}
          </div>

          {/* Projects and their Created Docs underneath! */}
          <div className="space-y-4">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 mb-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Module Directories
                </p>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsCreateProjectOpen(true);
                    }}
                    className="p-0.5 hover:bg-accent rounded text-primary transition-all cursor-pointer"
                    title="Create New Module"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="space-y-3">
              {allowedProjects.map(project => {
                const isActiveProject = activeProjectId === project.id;

                // Filter docs/folders of this project
                const projDocs = documents.filter(d =>
                  d.projectId === project.id &&
                  (isAdmin ? true : d.status === 'published')
                );
                const projFolders = folders.filter(f => f.projectId === project.id);

                return (
                  <div
                    key={project.id}
                    className={cn(
                      "rounded-2xl border transition-all text-left",
                      isActiveProject
                        ? "bg-accent/40 dark:bg-accent/20 border-primary/20 shadow-xl"
                        : "border-transparent bg-transparent"
                    )}
                  >

                    {/* Project Header Trigger */}
                    <div
                      onClick={() => {
                        if (isActiveProject) {
                          setActiveProject(null);
                          router.push('/dashboard');
                        } else {
                          setActiveProject(project.id);
                          router.push(`/dashboard/projects/${project.id}`);
                        }
                      }}
                      className="group/proj w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/30 text-left font-bold text-xs cursor-pointer relative"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-base shrink-0 select-none">{project.icon}</span>
                        {!isCollapsed && (
                          <div className="flex flex-col min-w-0 flex-1">
                            {renamingProjectId === project.id ? (
                              <input
                                autoFocus
                                value={renameProjectVal}
                                onChange={e => setRenameProjectVal(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (renameProjectVal.trim()) {
                                      updateProject(project.id, { name: renameProjectVal.trim() });
                                    }
                                    setRenamingProjectId(null);
                                  }
                                  if (e.key === 'Escape') {
                                    setRenamingProjectId(null);
                                  }
                                }}
                                onBlur={() => {
                                  if (renameProjectVal.trim()) {
                                    updateProject(project.id, { name: renameProjectVal.trim() });
                                  }
                                  setRenamingProjectId(null);
                                }}
                                onClick={e => e.stopPropagation()}
                                className="bg-transparent border-b border-primary/50 text-xs font-bold focus:outline-none py-0.5 text-foreground min-w-0"
                              />
                            ) : (
                              <span className={cn("truncate text-xs leading-none transition-colors select-none", isActiveProject ? "text-primary font-extrabold" : "text-muted-foreground")}>
                                {project.name}
                              </span>
                            )}
                            <div className="flex items-center gap-1.5 mt-0.5 select-none">
                              <span className="text-[9px] text-primary font-extrabold truncate max-w-[80px]" title={project.category || 'School Based'}>
                                {project.category || 'School Based'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isAdmin && (
                            <div className="relative flex items-center justify-center" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setOpenProjectMenuId(openProjectMenuId === project.id ? null : project.id);
                                }}
                                className="p-0.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover/proj:opacity-100 cursor-pointer"
                                title="Project settings"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {openProjectMenuId === project.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setOpenProjectMenuId(null)} />
                                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-2xl py-1 min-w-[150px] animate-in fade-in zoom-in-95 text-foreground">
                                    <button
                                      onClick={() => {
                                        handleOpenSectionsConfig(project);
                                        setOpenProjectMenuId(null);
                                      }}
                                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-[10.5px] font-bold hover:bg-accent text-primary transition-all cursor-pointer border-b border-border/40 pb-2"
                                    >
                                      <Plus className="w-3.5 h-3.5 text-primary" /> Add/Edit Sections
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRenamingProjectId(project.id);
                                        setRenameProjectVal(project.name);
                                        setOpenProjectMenuId(null);
                                      }}
                                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-[10.5px] font-bold hover:bg-accent text-foreground transition-all cursor-pointer mt-1"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" /> Rename Module
                                    </button>
                                    <button
                                      onClick={() => {
                                        const url = `${window.location.origin}/public/${project.id}`;
                                        navigator.clipboard.writeText(url);
                                        setToastMessage('Public link copied to clipboard!');
                                        setTimeout(() => setToastMessage(''), 3000);
                                        setOpenProjectMenuId(null);
                                      }}
                                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-[10.5px] font-bold hover:bg-accent text-foreground transition-all cursor-pointer mt-1"
                                    >
                                      <Link2 className="w-3.5 h-3.5" /> Copy Public Link
                                    </button>
                                    <div className="border-t border-border mt-1 pt-1">
                                      <button
                                        onClick={() => {
                                          deleteProject(project.id);
                                          setOpenProjectMenuId(null);
                                        }}
                                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-[10.5px] font-bold hover:bg-rose-500/10 text-rose-500 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform select-none", !isActiveProject && "-rotate-90")} />
                        </div>
                      )}
                    </div>

                    {/* Active Project Documents (Expanded under Project) */}
                    {isActiveProject && !isCollapsed && (
                      <div className="pl-4 pr-3 pb-3 space-y-4 mt-2 border-t border-border/5 select-none animate-in fade-in duration-200">
                        {getProjectSections(project).length === 0 && (
                          <div className="py-4 text-center px-2 border border-dashed border-border rounded-xl bg-accent/10">
                            <p className="text-[10px] text-muted-foreground italic font-semibold leading-relaxed">No sections configured</p>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  handleOpenSectionsConfig(project);
                                }}
                                className="mt-2 text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                              >
                                <Plus className="w-3 h-3" /> Configure Custom Sections
                              </button>
                            )}
                          </div>
                        )}
                        {getProjectSections(project).map(section => {
                          const role = section.id;
                          const Icon = section.icon === 'GraduationCap' ? GraduationCap
                            : section.icon === 'ShieldAlert' ? ShieldAlert
                              : section.icon === 'Backpack' ? Backpack
                                : section.icon === 'Code2' ? Code2
                                  : section.icon === 'Briefcase' ? Briefcase
                                    : section.icon === 'Users2' ? Users2
                                      : BookOpen;

                          const iconColor = section.id === 'teacher' ? 'text-primary'
                            : section.id === 'admin' ? 'text-purple-400'
                              : section.id === 'student' ? 'text-amber-400'
                                : section.id === 'developer' ? 'text-sky-400'
                                  : 'text-primary';

                          const meta = {
                            label: section.label,
                            icon: Icon,
                            color: iconColor
                          };

                          const isCatCollapsed = collapsedCategories[role] ?? false;

                          const catDocs = projDocs.filter(d => d.category === role);
                          const catFolders = projFolders.filter(f => f.parentId === `f_${role}_${project.id}` || f.id === `f_${role}_${project.id}`);
                          const rootFolders = catFolders.filter(f => !f.parentId || f.id === `f_${role}_${project.id}`);
                          const unfiled = catDocs.filter(d => !d.folderId);
                          const pinned = catDocs.filter(d => d.isPinned);

                          return (
                            <div key={role} className="space-y-1.5 pt-2 border-b border-border/5 pb-2 last:border-0">

                              {/* Category header */}
                              <div className="flex items-center justify-between group/cat">
                                <button
                                  onClick={() => toggleCategory(role)}
                                  className="flex items-center gap-1.5 text-left hover:text-foreground transition-colors"
                                >
                                  {isCatCollapsed ? (
                                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                                  )}
                                  <Icon className={cn("w-3.5 h-3.5 shrink-0", meta.color)} />
                                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground font-outfit">
                                    {meta.label}
                                  </span>
                                </button>

                                {/* Inline creators ONLY for Veloc Admin */}
                                {isAdmin && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover/cat:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                    <button
                                      onClick={() => handleNewDoc(role)}
                                      className="p-0.5 hover:bg-accent rounded text-primary transition-all cursor-pointer"
                                      title="Add manual"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>

                                    {/* 3-dots menu for Section */}
                                    <div className="relative flex items-center justify-center">
                                      <button
                                        onClick={() => {
                                          setOpenSectionMenuId(openSectionMenuId === `${project.id}_${role}` ? null : `${project.id}_${role}`);
                                        }}
                                        className="p-0.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                                        title="Section settings"
                                      >
                                        <MoreVertical className="w-3 h-3" />
                                      </button>

                                      {openSectionMenuId === `${project.id}_${role}` && (
                                        <>
                                          <div className="fixed inset-0 z-40" onClick={() => setOpenSectionMenuId(null)} />
                                          <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-2xl py-1 min-w-[130px] animate-in fade-in zoom-in-95 text-foreground text-left">
                                            <button
                                              onClick={() => {
                                                setEditingSection({ projectId: project.id, sectionId: role, label: section.label, icon: section.icon || 'BookOpen' });
                                                setOpenSectionMenuId(null);
                                              }}
                                              className="flex items-center gap-2 w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-accent text-primary transition-all cursor-pointer border-b border-border/40 pb-2"
                                            >
                                              <Edit3 className="w-3 h-3 text-primary" /> Edit Section
                                            </button>
                                            <button
                                              onClick={() => {
                                                handleDeleteSection(project.id, role);
                                                setOpenSectionMenuId(null);
                                              }}
                                              className="flex items-center gap-2 w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-rose-500/10 text-rose-500 cursor-pointer mt-1"
                                            >
                                              <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Document links */}
                              {!isCatCollapsed && (
                                <div className="pl-3 space-y-1">
                                  {/* Folder addition inline */}
                                  {newFolderCategory === role && (
                                    <div className="px-1 py-1">
                                      <input
                                        autoFocus
                                        value={newFolderName}
                                        onChange={e => setNewFolderName(e.target.value)}
                                        onKeyDown={e => {
                                          if (e.key === 'Enter') handleCreateFolder(role);
                                          if (e.key === 'Escape') setNewFolderCategory(null);
                                        }}
                                        onBlur={() => handleCreateFolder(role)}
                                        placeholder="Folder name..."
                                        className="w-full bg-accent border border-border rounded-lg px-2 py-0.5 text-[10px] font-semibold focus:outline-none text-foreground"
                                      />
                                    </div>
                                  )}

                                  {/* Folders */}
                                  {rootFolders.map(folder => {
                                    const folderDocs = catDocs.filter(d => d.folderId === folder.id);
                                    const isRootCategoryFolder = folder.id === `f_${role}_${project.id}`;

                                    if (isRootCategoryFolder) {
                                      return (
                                        <div key={folder.id} className="space-y-0.5">
                                          {folderDocs.map(doc => (
                                            <DocLinkItem
                                              key={doc.id} doc={doc} activeDocId={activeDocId}
                                              isAdmin={isAdmin} activeStyles={meta.color}
                                              allDocs={catDocs} onRename={startRename}
                                              renamingId={renamingId} renameVal={renameVal}
                                              setRenameVal={setRenameVal} commitRename={commitRename}
                                              deleteDocument={deleteDocument} togglePin={togglePin}
                                              toggleFavorite={toggleFavorite} handleSelect={() => {
                                                setActiveDoc(doc.id);
                                                router.push(`/dashboard/documents/${doc.id}`);
                                              }}
                                              handleNewSubDoc={() => handleNewDoc(role, doc.id)}
                                            />
                                          ))}
                                        </div>
                                      );
                                    }

                                    return (
                                      <div key={folder.id} className="space-y-0.5 pt-1">
                                        <div className="flex items-center justify-between px-2 py-0.5 group/header">
                                          {renamingFolderId === folder.id ? (
                                            <input
                                              autoFocus
                                              value={renameFolderVal}
                                              onChange={e => setRenameFolderVal(e.target.value)}
                                              onKeyDown={e => {
                                                if (e.key === 'Enter') commitFolderRename();
                                                if (e.key === 'Escape') setRenamingFolderId(null);
                                              }}
                                              onBlur={commitFolderRename}
                                              className="w-full bg-background border border-border rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider focus:outline-none text-foreground mr-2"
                                            />
                                          ) : (
                                            <h4
                                              onDoubleClick={() => isAdmin && startFolderRename(folder.id, folder.name)}
                                              className="text-[9px] font-black text-muted-foreground uppercase tracking-wider flex-1 truncate cursor-pointer hover:text-foreground"
                                            >
                                              {folder.name}
                                            </h4>
                                          )}
                                          {isAdmin && folder.id !== `f_${role}_${project.id}` && renamingFolderId !== folder.id && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                                              <button
                                                onClick={() => startFolderRename(folder.id, folder.name)}
                                                className="p-0.5 hover:bg-amber-500/10 rounded text-amber-500 transition-colors"
                                                title="Rename folder"
                                              >
                                                <Edit3 className="w-2.5 h-2.5" />
                                              </button>
                                              <button
                                                onClick={() => deleteFolder(folder.id)}
                                                className="p-0.5 hover:bg-rose-500/10 rounded text-rose-500 transition-colors"
                                                title="Delete folder"
                                              >
                                                <Trash2 className="w-2.5 h-2.5" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                        {folderDocs.map(doc => (
                                          <DocLinkItem
                                            key={doc.id} doc={doc} activeDocId={activeDocId}
                                            isAdmin={isAdmin} activeStyles={meta.color}
                                            allDocs={catDocs} onRename={startRename}
                                            renamingId={renamingId} renameVal={renameVal}
                                            setRenameVal={setRenameVal} commitRename={commitRename}
                                            deleteDocument={deleteDocument} togglePin={togglePin}
                                            toggleFavorite={toggleFavorite} handleSelect={() => {
                                              setActiveDoc(doc.id);
                                              router.push(`/dashboard/documents/${doc.id}`);
                                            }}
                                            handleNewSubDoc={() => handleNewDoc(role, doc.id)}
                                          />
                                        ))}
                                      </div>
                                    );
                                  })}

                                  {/* Other guides */}
                                  {unfiled.filter(d => !d.parentId).map(doc => (
                                    <DocLinkItem
                                      key={doc.id} doc={doc} activeDocId={activeDocId}
                                      isAdmin={isAdmin} activeStyles={meta.color}
                                      allDocs={catDocs} onRename={startRename}
                                      renamingId={renamingId} renameVal={renameVal}
                                      setRenameVal={setRenameVal} commitRename={commitRename}
                                      deleteDocument={deleteDocument} togglePin={togglePin}
                                      toggleFavorite={toggleFavorite} handleSelect={() => {
                                        setActiveDoc(doc.id);
                                        router.push(`/dashboard/documents/${doc.id}`);
                                      }}
                                      handleNewSubDoc={() => handleNewDoc(role, doc.id)}
                                    />
                                  ))}

                                  {/* Empty state notice */}
                                  {unfiled.length === 0 && rootFolders.length === 0 && (
                                    <div className="pl-3 py-2 text-left select-none animate-in fade-in duration-200">
                                      <p className="text-[10px] text-muted-foreground italic font-semibold">No manuals created yet</p>
                                      {isAdmin && (
                                        <button
                                          onClick={() => handleNewDoc(role)}
                                          className="mt-1 text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                          <Plus className="w-2.5 h-2.5" /> Create First Manual
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-3 mt-auto space-y-1 bg-background border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setIsSettingsOpen(true)}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent h-9 px-3 rounded-lg text-xs font-bold",
              isCollapsed && "justify-center px-0"
            )}
          >
            <Palette className="w-4 h-4" />
            {!isCollapsed && <span>Theme settings</span>}
          </Button>

          {user ? (
            <div className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-all group relative text-left",
              !isCollapsed && "hover:bg-accent cursor-pointer",
              isCollapsed && "justify-center"
            )}>
              <Avatar className="w-8 h-8 border border-border shadow-sm">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold truncate text-foreground leading-none">{user?.name}</p>
                  <p className="text-[8px] text-muted-foreground truncate uppercase font-black tracking-widest mt-1">
                    {isAdmin ? 'Veloc Admin' : 'Client Reader'}
                  </p>
                </div>
              )}
              {!isCollapsed && (
                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={logout}>
                  <LogOut className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600 cursor-pointer" />
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => router.push('/login')}
              className={cn(
                "w-full bg-primary hover:bg-primary/95 text-primary-foreground font-black text-[10px] uppercase tracking-wider rounded-xl py-2 flex items-center justify-center gap-2 h-9 cursor-pointer",
                isCollapsed && "px-0"
              )}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Admin Sign In</span>}
            </Button>
          )}

          {!isCollapsed ? (
            <div className="px-2 pt-2">
              <button
                onClick={() => setIsCollapsed(true)}
                className="w-full py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> Collapse Sidebar
              </button>
            </div>
          ) : (
            <div className="px-2 pt-2">
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-full py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Create Project Overlay Modal */}
      {isCreateProjectOpen && (
        <ProjectModal
          onClose={() => setIsCreateProjectOpen(false)}
        />
      )}

      {/* Sections Config Overlay Modal */}
      {isSectionsConfigOpen && selectedProjectForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md space-y-6 text-left shadow-2xl relative">
            <button
              onClick={() => {
                setIsSectionsConfigOpen(false);
                setSelectedProjectForConfig(null);
              }}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground font-outfit uppercase tracking-wider">Configure Sections</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Manage custom workspace sections for {selectedProjectForConfig.name}</p>
            </div>

            <form onSubmit={handleSaveConfigSections} className="space-y-5">

              <div className="space-y-3 bg-accent/20 p-4 border border-border rounded-2xl max-h-[300px] overflow-y-auto scrollbar-thin">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WORKSPACE CUSTOM SECTIONS</span>
                  <button
                    type="button"
                    onClick={handleAddConfigCustomSection}
                    className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary/95 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> ADD SECTION
                  </button>
                </div>

                <div className="space-y-2">
                  {configCustomSections.map((section, idx) => (
                    <div key={section.id} className="flex items-center gap-3 bg-card border border-border p-3 rounded-2xl hover:border-primary/45 hover:shadow-lg transition-all group/item">
                      <div className="relative shrink-0">
                        <Select
                          value={section.icon}
                          onChange={val => handleUpdateConfigSectionIcon(section.id, val)}
                          options={SECTION_ICON_OPTIONS}
                          className="w-18"
                          triggerClassName="h-9 px-2 rounded-xl"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          required
                          value={section.label}
                          onChange={e => handleUpdateConfigSectionLabel(section.id, e.target.value)}
                          placeholder={`Section ${idx + 1} name...`}
                          className="w-full bg-background border border-border hover:border-border/80 focus:border-primary/40 focus:bg-background rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/45"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveConfigCustomSection(section.id)}
                        className="p-2 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl text-rose-400 hover:text-rose-300 transition-colors shrink-0 cursor-pointer"
                        title="Remove custom section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {configCustomSections.length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic text-center py-4 select-none">No custom sections. Click Add Section above.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSectionsConfigOpen(false);
                    setSelectedProjectForConfig(null);
                  }}
                  className="flex-1 h-11 rounded-xl border border-border text-xs font-bold hover:bg-accent transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/10 transition-all cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md space-y-6 text-left shadow-2xl relative">
            <button
              onClick={() => setEditingSection(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground font-outfit uppercase tracking-wider">Edit Section</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Modify section name and icon</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const { projectId, sectionId, label, icon } = editingSection;
                const project = projects.find(p => p.id === projectId);
                if (!project) return;

                const updatedSections = (project.sections || []).map((s: any) =>
                  s.id === sectionId ? { ...s, label: label.trim(), icon } : s
                );

                await updateProject(projectId, { sections: updatedSections });
                setEditingSection(null);
              }}
              className="space-y-5"
            >
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Section Name</label>
                  <input
                    type="text"
                    required
                    value={editingSection.label}
                    onChange={e => setEditingSection(prev => prev ? { ...prev, label: e.target.value } : null)}
                    placeholder="Enter section name..."
                    className="w-full bg-background border border-border hover:border-border/80 focus:border-primary/45 focus:bg-background rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/45"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Section Icon</label>
                  <Select
                    value={editingSection.icon}
                    onChange={val => setEditingSection(prev => prev ? { ...prev, icon: val } : null)}
                    options={SECTION_ICON_OPTIONS}
                    className="w-full"
                    triggerClassName="h-10 px-3 rounded-xl text-xs font-bold bg-background border border-border"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="flex-1 h-11 rounded-xl border border-border text-xs font-bold hover:bg-accent transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/10 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-100 flex items-center gap-3 p-4 rounded-xl bg-primary text-primary-foreground shadow-2xl max-w-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1 text-xs font-bold">
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface DocLinkProps {
  doc: Doc; activeDocId: string | null; isAdmin: boolean; activeStyles: string;
  allDocs: Doc[]; renamingId: string | null; renameVal: string;
  setRenameVal: (v: string) => void; commitRename: () => void;
  deleteDocument: (id: string) => void; togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void; onRename: (doc: Doc) => void;
  handleSelect: () => void; handleNewSubDoc: () => void;
  level?: number;
}

function DocLinkItem({
  doc, activeDocId, isAdmin, activeStyles, allDocs, renamingId, renameVal,
  setRenameVal, commitRename, deleteDocument, togglePin, toggleFavorite, onRename,
  handleSelect, handleNewSubDoc, level = 0
}: DocLinkProps) {
  const [showMenu, setShowMenu] = useState(false);
  const active = doc.id === activeDocId;
  const isRenaming = renamingId === doc.id;

  const childDocs = allDocs.filter(d => d.parentId === doc.id);
  const hasChildren = childDocs.length > 0;

  const activeLinkStyle = activeStyles.replace('text-', 'text-');

  return (
    <div className="space-y-0.5 mt-0.5">
      <div
        className={cn(
          'group flex items-center justify-between py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer relative',
          active
            ? `bg-primary/10 text-primary font-bold`
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        )}
        style={{ paddingLeft: `${10 + level * 12}px` }}
        onClick={handleSelect}
      >
        {isRenaming ? (
          <input
            autoFocus
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') commitRename(); }}
            onBlur={commitRename}
            onClick={e => e.stopPropagation()}
            className="flex-1 bg-transparent border-b border-primary/50 text-[10px] font-bold focus:outline-none min-w-0 py-0.5 text-foreground"
          />
        ) : (
          <span className="flex-1 truncate select-none text-[10.5px]">{doc.title}</span>
        )}

        {!isRenaming && isAdmin && (
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 ml-2 shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowMenu(o => !o)} className="p-0.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-all">
              <MoreVertical className="w-3 h-3" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-xl shadow-2xl py-1 min-w-[130px] text-popover-foreground">
                  <button onClick={() => { onRename(doc); setShowMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-accent text-foreground transition-all">
                    <Edit3 className="w-3 h-3" /> Rename
                  </button>
                  <button onClick={() => { togglePin(doc.id); setShowMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-accent text-foreground transition-all">
                    <Pin className="w-3 h-3 rotate-45" /> {doc.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button onClick={() => { toggleFavorite(doc.id); setShowMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-accent text-foreground transition-all">
                    <Star className="w-3 h-3" /> {doc.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </button>
                  <div className="border-t border-border/30 mt-1 pt-1">
                    <button onClick={() => { deleteDocument(doc.id); setShowMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-rose-500/10 text-rose-500">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {hasChildren && (
        <div className="space-y-0.5">
          {childDocs.map(child => (
            <DocLinkItem
              key={child.id} doc={child} activeDocId={activeDocId}
              isAdmin={isAdmin} activeStyles={activeStyles}
              allDocs={allDocs} onRename={onRename}
              renamingId={renamingId} renameVal={renameVal}
              setRenameVal={setRenameVal} commitRename={commitRename}
              deleteDocument={deleteDocument} togglePin={togglePin}
              toggleFavorite={toggleFavorite} handleSelect={() => {
                handleSelect();
              }}
              handleNewSubDoc={handleNewSubDoc}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
