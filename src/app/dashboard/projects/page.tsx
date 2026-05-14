'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Folder, MoreHorizontal, FileText, Trash2, Edit3,
  Search, BookOpen, Calendar, FolderKanban, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProjectStore, Project } from '@/store/useProjectStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const PROJECT_ICONS = ['🚀', '📦', '🏕️', '⚡', '🎯', '🔥', '💡', '🛠️', '📊', '🌱', '🎨', '🔬'];
const PROJECT_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
];

function ProjectModal({ project, onClose }: { project?: Project; onClose: () => void }) {
  const { createProject, updateProject } = useProjectStore();
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [icon, setIcon] = useState(project?.icon || '🚀');
  const [color, setColor] = useState(project?.color || '#6366f1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (project) {
      updateProject(project.id, { name, description, icon, color });
    } else {
      createProject({ name, description, icon, color });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Icon & Color */}
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Icon</label>
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-accent/50 rounded-xl border border-border">
                {PROJECT_ICONS.map(i => (
                  <button
                    key={i} type="button"
                    onClick={() => setIcon(i)}
                    className={cn('w-8 h-8 text-lg rounded-lg flex items-center justify-center transition-all', icon === i ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-accent')}
                  >{i}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Color</label>
              <div className="grid grid-cols-5 gap-1.5 p-2 bg-accent/50 rounded-xl border border-border">
                {PROJECT_COLORS.map(c => (
                  <button
                    key={c} type="button"
                    onClick={() => setColor(c)}
                    className={cn('w-7 h-7 rounded-lg transition-all', color === c ? 'ring-2 ring-offset-2 ring-offset-card ring-white scale-110' : 'hover:scale-105')}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              {/* Preview */}
              <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-xl border border-border">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: color + '30' }}>
                  {icon}
                </div>
                <span className="text-sm font-medium truncate">{name || 'Project Name'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Name *</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Marketing Campaign" className="h-10" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this project about?" className="h-10" />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1">{project ? 'Save Changes' : 'Create Project'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectCard({ project, docCount, onClick, onEdit, onDelete }: {
  project: Project; docCount: number;
  onClick: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
    >
      {/* Color accent */}
      <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ backgroundColor: project.color }} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: project.color + '20' }}>
          {project.icon}
        </div>
        <button
          onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-4 top-14 z-50 bg-card border border-border rounded-xl shadow-2xl py-1 w-40" onClick={e => e.stopPropagation()}>
            <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2">
              <Edit3 className="w-3.5 h-3.5" /> Edit Project
            </button>
            <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-rose-500 flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      <h3 className="text-base font-bold mb-1 truncate">{project.name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{project.description || 'No description'}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="w-3.5 h-3.5" />
          <span className="font-medium">{docCount} docs</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(project.createdAt), 'MMM d')}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, deleteProject } = useProjectStore();
  const { documents } = useDocumentStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | undefined>(undefined);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const getDocCount = (projectId: string) => documents.filter(d => d.projectId === projectId).length;

  return (
    <div className="flex flex-col h-full p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projects · Manage your workspaces</p>
        </div>
        <Button onClick={() => { setEditProject(undefined); setShowModal(true); }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10 bg-accent/30"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <FolderKanban className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">{search ? 'No projects found' : 'No projects yet'}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            {search ? 'Try a different search term.' : 'Create your first project to organize your docs and notes.'}
          </p>
          {!search && <Button onClick={() => setShowModal(true)} className="gap-2"><Plus className="w-4 h-4" /> Create Project</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              docCount={getDocCount(project.id)}
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              onEdit={() => { setEditProject(project); setShowModal(true); }}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
          {/* Create new card */}
          <button
            onClick={() => { setEditProject(undefined); setShowModal(true); }}
            className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all group min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">New Project</span>
          </button>
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editProject}
          onClose={() => { setShowModal(false); setEditProject(undefined); }}
        />
      )}
    </div>
  );
}
