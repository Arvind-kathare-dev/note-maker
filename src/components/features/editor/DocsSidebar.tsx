'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, FileText, FolderOpen, Folder, ChevronRight,
  Star, Pin, MoreVertical, Trash2, Edit3, FolderPlus, X,
  Workflow, BookOpen, Code2, Users2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentStore, Doc, DocFolder } from '@/store/useDocumentStore';
import { Button } from '@/components/ui/button';

export default function DocsSidebar({ onMobileClose }: { onMobileClose?: () => void }) {
  const router = useRouter();
  const { 
    folders, documents, activeDocId, createDocument, createFolder, 
    deleteDocument, deleteFolder, setActiveDoc, togglePin, 
    toggleFavorite, updateDocument 
  } = useDocumentStore();

  const [search, setSearch] = useState('');
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['f1', 'f2', 'f3']));
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const toggle = (id: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const rootFolders = folders.filter(f => !f.parentId);
  const unfiled = documents.filter(d => !d.folderId);
  const pinned = documents.filter(d => d.isPinned);

  const filtered = search
    ? documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
    : null;

  const handleNewDoc = (folderId?: string) => {
    const doc = createDocument(folderId);
    router.push(`/dashboard/documents/${doc.id}`);
    onMobileClose?.();
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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
    }
    setNewFolderMode(false);
  };

  return (
    <div className="w-72 shrink-0 h-full border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Explorer</h2>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setNewFolderMode(true)}
              className="w-8 h-8 rounded-lg hover:bg-accent"
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleNewDoc()}
              className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Quick search..."
            className="w-full bg-accent/50 border border-border rounded-xl pl-9 pr-8 py-2 text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded-md"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin">
        {/* Search results */}
        {filtered ? (
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">{filtered.length} matches</p>
            {filtered.map(doc => (
              <DocItem 
                key={doc.id} 
                doc={doc} 
                allDocs={documents} 
                active={doc.id === activeDocId} 
                onRename={startRename} 
                renamingId={renamingId} 
                renameVal={renameVal} 
                setRenameVal={setRenameVal} 
                commitRename={commitRename} 
                level={0} 
                onMobileClose={onMobileClose} 
              />
            ))}
          </div>
        ) : (
          <>
            {/* Pinned */}
            {pinned.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Pinned</p>
                {pinned.map(doc => (
                  <DocItem 
                    key={doc.id} 
                    doc={doc} 
                    allDocs={documents} 
                    active={doc.id === activeDocId} 
                    onRename={startRename} 
                    renamingId={renamingId} 
                    renameVal={renameVal} 
                    setRenameVal={setRenameVal} 
                    commitRename={commitRename} 
                    level={0} 
                    onMobileClose={onMobileClose} 
                  />
                ))}
              </div>
            )}

            {/* Folders */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Folders</p>
              {rootFolders.map(folder => (
                <FolderSection
                  key={folder.id}
                  folder={folder}
                  allDocs={documents}
                  isOpen={openFolders.has(folder.id)}
                  onToggle={() => toggle(folder.id)}
                  activeDocId={activeDocId}
                  onSelectDoc={(id) => { setActiveDoc(id); router.push(`/dashboard/documents/${id}`); onMobileClose?.(); }}
                  onNewDoc={() => handleNewDoc(folder.id)}
                  onDeleteFolder={() => deleteFolder(folder.id)}
                  onRename={startRename}
                  onDelete={deleteDocument}
                  onPin={togglePin}
                  onFav={toggleFavorite}
                  onNewSubDoc={(parentDoc) => { const newDoc = createDocument(parentDoc.folderId, parentDoc.id, parentDoc.projectId); router.push(`/dashboard/documents/${newDoc.id}`); onMobileClose?.(); }}
                  renamingId={renamingId} renameVal={renameVal} setRenameVal={setRenameVal} commitRename={commitRename}
                  onMobileClose={onMobileClose}
                />
              ))}

              {/* New folder input */}
              {newFolderMode && (
                <div className="px-3 py-1">
                  <input
                    autoFocus
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setNewFolderMode(false); }}
                    onBlur={handleCreateFolder}
                    placeholder="Folder name..."
                    className="w-full bg-accent border border-primary/30 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Unfiled */}
            {unfiled.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Other</p>
                {unfiled.filter(d => !d.parentId).map(doc => (
                  <DocItem 
                    key={doc.id} 
                    doc={doc} 
                    allDocs={documents} 
                    active={doc.id === activeDocId} 
                    onRename={startRename} 
                    renamingId={renamingId} 
                    renameVal={renameVal} 
                    setRenameVal={setRenameVal} 
                    commitRename={commitRename} 
                    level={0} 
                    onMobileClose={onMobileClose} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FolderSection({ folder, allDocs, isOpen, onToggle, activeDocId, onNewDoc, onDeleteFolder, onRename, renamingId, renameVal, setRenameVal, commitRename, onMobileClose }: {
  folder: DocFolder; allDocs: Doc[]; isOpen: boolean; onToggle: () => void;
  activeDocId: string | null; onSelectDoc: (id: string) => void; onNewDoc: () => void; onDeleteFolder: () => void;
  onRename: (d: Doc) => void; onDelete: (id: string) => void; onPin: (id: string) => void; onFav: (id: string) => void; onNewSubDoc: (d: Doc) => void;
  renamingId: string | null; renameVal: string; setRenameVal: (v: string) => void; commitRename: () => void; onMobileClose?: () => void;
}) {
  const rootDocs = allDocs.filter(d => d.folderId === folder.id && !d.parentId);
  
  return (
    <div className="space-y-0.5">
      <div
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-accent cursor-pointer group transition-all",
          isOpen && "bg-accent/30"
        )}
        onClick={onToggle}
      >
        <ChevronRight className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', isOpen && 'rotate-90')} />
        <span className="text-sm shrink-0">{folder.icon || '📁'}</span>
        <span className="text-xs font-bold flex-1 truncate">{folder.name}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onNewDoc(); }} 
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-primary" />
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {rootDocs.length === 0 ? (
              <p className="text-[10px] text-muted-foreground font-bold italic pl-12 py-2">Empty folder</p>
            ) : rootDocs.map(doc => (
              <DocItem 
                key={doc.id} doc={doc} allDocs={allDocs} active={doc.id === activeDocId} 
                onRename={onRename} renamingId={renamingId} renameVal={renameVal} 
                setRenameVal={setRenameVal} commitRename={commitRename} level={1} 
                onMobileClose={onMobileClose} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocItem({ doc, allDocs, active, onRename, level = 0, renamingId, renameVal, setRenameVal, commitRename, onMobileClose }: {
  doc: Doc; allDocs: Doc[]; active: boolean; onRename: (d: Doc) => void; level?: number;
  renamingId: string | null; renameVal: string; setRenameVal: (v: string) => void; commitRename: () => void; onMobileClose?: () => void;
}) {
  const router = useRouter();
  const { activeDocId, setActiveDoc, deleteDocument, togglePin, toggleFavorite, createDocument } = useDocumentStore();
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isRenaming = renamingId === doc.id;
  
  const childDocs = allDocs.filter(d => d.parentId === doc.id);
  const hasChildren = childDocs.length > 0;

  const handleSelect = () => {
    setActiveDoc(doc.id); 
    router.push(`/dashboard/documents/${doc.id}`); 
    onMobileClose?.();
  };

  const handleNewSubDoc = () => {
    const newDoc = createDocument(doc.folderId, doc.id, doc.projectId);
    setExpanded(true);
    router.push(`/dashboard/documents/${newDoc.id}`);
  };

  const categoryIcons = {
    workflow: Workflow,
    note: BookOpen,
    developer: Code2,
    client: Users2
  };

  const CategoryIcon = doc.category ? categoryIcons[doc.category as keyof typeof categoryIcons] : FileText;

  return (
    <div className="space-y-0.5">
      <div
        className={cn(
          'flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer group transition-all relative',
          active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-accent text-muted-foreground hover:text-foreground'
        )}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={handleSelect}
      >
        <div 
          className="w-4 h-4 flex items-center justify-center shrink-0"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {hasChildren && <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-90")} />}
        </div>
        
        {isRenaming ? (
          <input
            autoFocus
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') commitRename(); }}
            onBlur={commitRename}
            onClick={e => e.stopPropagation()}
            className="flex-1 bg-transparent border-b border-primary/50 text-xs font-bold focus:outline-none min-w-0"
          />
        ) : (
          <>
            <CategoryIcon className={cn("w-4 h-4 shrink-0", active ? "text-primary-foreground" : "text-primary/70")} />
            <span className="flex-1 text-xs truncate font-bold">{doc.title}</span>
          </>
        )}
        
        {!isRenaming && (
          <div className="hidden group-hover:flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button onClick={handleNewSubDoc} className="p-1 hover:bg-background/20 rounded-md"><Plus className="w-3.5 h-3.5" /></button>
            <button onClick={() => setShowMenu(o => !o)} className="p-1 hover:bg-background/20 rounded-md"><MoreVertical className="w-3.5 h-3.5" /></button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-2xl py-2 min-w-[160px] animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border mb-1">Actions</div>
                  <button onClick={() => { onRename(doc); setShowMenu(false); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-bold hover:bg-accent transition-all text-foreground">
                    <Edit3 className="w-3.5 h-3.5" /> Rename
                  </button>
                  <button onClick={() => { togglePin(doc.id); setShowMenu(false); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-bold hover:bg-accent transition-all text-foreground">
                    <Pin className="w-3.5 h-3.5" /> {doc.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button onClick={() => { toggleFavorite(doc.id); setShowMenu(false); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-bold hover:bg-accent transition-all text-foreground">
                    <Star className="w-3.5 h-3.5" /> {doc.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </button>
                  <div className="border-t border-border mt-1 pt-1">
                    <button onClick={() => { deleteDocument(doc.id); setShowMenu(false); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-bold hover:bg-rose-500/10 text-rose-500 transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {childDocs.map(child => (
              <DocItem 
                key={child.id} doc={child} allDocs={allDocs} active={child.id === activeDocId} 
                onRename={onRename} renamingId={renamingId} renameVal={renameVal} 
                setRenameVal={setRenameVal} commitRename={commitRename} 
                level={level + 1} onMobileClose={onMobileClose}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
