'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Plus, FileText, Folder, Search, MoreHorizontal, ArrowLeft,
  Trash2, Edit3, BookOpen, Code2, Workflow, Users2, Star, Clock,
  ChevronRight, FolderPlus, StickyNote, X, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/store/useProjectStore';
import { useDocumentStore, Doc } from '@/store/useDocumentStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

type Tab = 'docs' | 'notes' | 'recent';

const DOC_CATEGORY_META = {
  workflow: { label: 'Workflow', icon: Workflow, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  note: { label: 'Note', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  developer: { label: 'Developer', icon: Code2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  client: { label: 'Client', icon: Users2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

function DocCard({ doc, onDelete }: { doc: Doc; onDelete: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = DOC_CATEGORY_META[doc.category];
  const Icon = meta.icon;

  return (
    <div
      onClick={() => router.push(`/dashboard/documents/${doc.id}`)}
      className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', meta.bg)}>
          {doc.emoji ? (
            <span className="text-lg">{doc.emoji}</span>
          ) : (
            <Icon className={cn('w-4 h-4', meta.color)} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{doc.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className={cn('text-[9px] uppercase px-1.5 py-0 border-0', meta.bg, meta.color)}>
              {meta.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{doc.wordCount} words</span>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="opacity-0 group-hover:opacity-100 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-all"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-2 top-10 z-50 bg-card border border-border rounded-xl shadow-2xl py-1 w-36" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => { router.push(`/dashboard/documents/${doc.id}`); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-xs hover:bg-accent flex items-center gap-2"
          >
            <Edit3 className="w-3 h-3" /> Open
          </button>
          <button
            onClick={() => { onDelete(); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-xs hover:bg-accent text-rose-500 flex items-center gap-2"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/50">
        <span className={cn('text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
          doc.status === 'published' ? 'text-emerald-600 bg-emerald-500/10' :
          doc.status === 'archived' ? 'text-muted-foreground bg-accent' :
          'text-amber-600 bg-amber-500/10'
        )}>{doc.status}</span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(doc.updatedAt), 'MMM d')}
        </span>
      </div>
    </div>
  );
}

function FolderSection({ folder, docs, projectId, onCreateDoc, onDeleteDoc }: {
  folder: { id: string; name: string; icon?: string };
  docs: Doc[];
  projectId: string;
  onCreateDoc: (folderId: string) => void;
  onDeleteDoc: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-90')} />
        <span>{folder.icon}</span>
        <span className="flex-1 text-left">{folder.name}</span>
        <span className="text-[10px] font-normal text-muted-foreground/60">{docs.length}</span>
        <Plus
          className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
          onClick={e => { e.stopPropagation(); onCreateDoc(folder.id); }}
        />
      </button>
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-3">
          {docs.map(doc => (
            <DocCard key={doc.id} doc={doc} onDelete={() => onDeleteDoc(doc.id)} />
          ))}
          <button
            onClick={() => onCreateDoc(folder.id)}
            className="border border-dashed border-border rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all text-sm min-h-[80px]"
          >
            <Plus className="w-4 h-4" /> Add Doc
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { projects } = useProjectStore();
  const { documents, folders, createDocument, deleteDocument, createFolder } = useDocumentStore();
  const [tab, setTab] = useState<Tab>('docs');
  const [search, setSearch] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);

  const project = projects.find(p => p.id === id);
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
          <Folder className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold mb-2">Project Not Found</h3>
        <p className="text-sm text-muted-foreground mb-6">This project may have been deleted.</p>
        <Button onClick={() => router.push('/dashboard/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
        </Button>
      </div>
    );
  }

  const projectDocs = documents.filter(d => d.projectId === id);
  const projectFolders = folders.filter(f => f.projectId === id);
  const notesDocs = projectDocs.filter(d => d.category === 'note');
  const nonNoteDocs = projectDocs.filter(d => d.category !== 'note');
  const recentDocs = [...projectDocs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 6);

  const filteredDocs = nonNoteDocs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  const filteredNotes = notesDocs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreateDoc = (folderId?: string | null, category: 'workflow' | 'note' | 'developer' | 'client' = 'workflow') => {
    const doc = createDocument(folderId ?? null, null, id, category);
    router.push(`/dashboard/documents/${doc.id}`);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim(), null, id);
    setNewFolderName('');
    setShowFolderInput(false);
  };

  const unfoldered = filteredDocs.filter(d => !d.folderId || !projectFolders.find(f => f.id === d.folderId));

  return (
    <div className="flex flex-col h-full p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => router.push('/dashboard/projects')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: project.color + '25' }}>
            {project.icon}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{project.name}</h1>
            {project.description && <p className="text-xs text-muted-foreground truncate">{project.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button variant="outline" size="sm" onClick={() => handleCreateDoc(null, 'note')} className="gap-2">
            <StickyNote className="w-3.5 h-3.5" /> New Note
          </Button>
          <Button size="sm" onClick={() => handleCreateDoc(null, 'workflow')} className="gap-2">
            <Plus className="w-3.5 h-3.5" /> New Doc
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Docs', value: projectDocs.length, icon: FileText, color: 'text-primary' },
          { label: 'Notes', value: notesDocs.length, icon: StickyNote, color: 'text-purple-500' },
          { label: 'Folders', value: projectFolders.length, icon: Folder, color: 'text-amber-500' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Icon className={cn('w-4 h-4', stat.color)} />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-accent/50 rounded-xl border border-border mb-6 w-fit">
        {([
          { id: 'docs', label: 'Documents', icon: FileText },
          { id: 'notes', label: 'Notes', icon: StickyNote },
          { id: 'recent', label: 'Recent', icon: Clock },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              tab === t.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${tab}...`}
          className="pl-9 h-9 bg-accent/30"
        />
      </div>

      {/* DOCS TAB */}
      {tab === 'docs' && (
        <div className="space-y-6 flex-1">
          {/* Folder creation */}
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex-1">Folders & Documents</p>
            {showFolderInput ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder="Folder name..."
                  className="h-7 text-xs w-40"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setShowFolderInput(false); }}
                />
                <Button size="sm" className="h-7 px-2 text-xs" onClick={handleCreateFolder}>Add</Button>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setShowFolderInput(false)}><X className="w-3.5 h-3.5" /></Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={() => setShowFolderInput(true)}>
                <FolderPlus className="w-3.5 h-3.5" /> New Folder
              </Button>
            )}
          </div>

          {projectFolders.map(folder => {
            const folderDocs = filteredDocs.filter(d => d.folderId === folder.id);
            return (
              <FolderSection
                key={folder.id}
                folder={folder}
                docs={folderDocs}
                projectId={id}
                onCreateDoc={folderId => handleCreateDoc(folderId)}
                onDeleteDoc={deleteDocument}
              />
            );
          })}

          {/* Unfoldered docs */}
          {unfoldered.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                <span>Unsorted</span>
                <span className="text-[10px] font-normal ml-auto">{unfoldered.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unfoldered.map(doc => (
                  <DocCard key={doc.id} doc={doc} onDelete={() => deleteDocument(doc.id)} />
                ))}
              </div>
            </div>
          )}

          {filteredDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-bold mb-2">{search ? 'No docs match your search' : 'No documents yet'}</h3>
              <p className="text-sm text-muted-foreground mb-5">
                {search ? 'Try a different keyword.' : 'Create your first document for this project.'}
              </p>
              {!search && (
                <Button className="gap-2" onClick={() => handleCreateDoc(null, 'workflow')}>
                  <Plus className="w-4 h-4" /> Create Document
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* NOTES TAB */}
      {tab === 'notes' && (
        <div className="flex-1">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                <StickyNote className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-base font-bold mb-2">{search ? 'No notes found' : 'No notes yet'}</h3>
              <p className="text-sm text-muted-foreground mb-5">Quick notes and meeting logs for this project.</p>
              {!search && (
                <Button className="gap-2" onClick={() => handleCreateDoc(null, 'note')}>
                  <Plus className="w-4 h-4" /> New Note
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNotes.map(doc => (
                <DocCard key={doc.id} doc={doc} onDelete={() => deleteDocument(doc.id)} />
              ))}
              <button
                onClick={() => handleCreateDoc(null, 'note')}
                className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-purple-500/50 hover:text-purple-500 transition-all min-h-[100px]"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">New Note</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* RECENT TAB */}
      {tab === 'recent' && (
        <div className="flex-1">
          {recentDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="w-10 h-10 text-muted-foreground mb-4" />
              <h3 className="font-bold mb-2">No recent activity</h3>
              <p className="text-sm text-muted-foreground">Docs you edit will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentDocs.map(doc => (
                <DocCard key={doc.id} doc={doc} onDelete={() => deleteDocument(doc.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
