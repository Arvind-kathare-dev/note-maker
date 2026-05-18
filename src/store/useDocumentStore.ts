'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DocFolder {
  id: string;
  name: string;
  parentId: string | null;
  projectId: string | null;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface Doc {
  id: string;
  folderId: string | null;
  parentId: string | null;
  projectId: string | null;
  title: string;
  content: string;
  category: 'workflow' | 'note' | 'developer' | 'client';
  emoji?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isPinned: boolean;
  isFavorite: boolean;
  wordCount: number;
  authorName: string;
  authorAvatar?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface DocumentStore {
  folders: DocFolder[];
  documents: Doc[];
  activeDocId: string | null;
  createFolder: (name: string, parentId?: string | null, projectId?: string | null) => DocFolder;
  updateFolder: (id: string, updates: Partial<DocFolder>) => void;
  deleteFolder: (id: string) => void;
  createDocument: (folderId?: string | null, parentId?: string | null, projectId?: string | null, category?: 'workflow' | 'note' | 'developer' | 'client') => Doc;
  updateDocument: (id: string, updates: Partial<Doc>) => void;
  deleteDocument: (id: string) => void;
  setActiveDoc: (id: string | null) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getOrCreateCategoryFolder: (category: 'workflow' | 'note' | 'developer' | 'client', projectId?: string | null) => string;
}

const uid = () => Math.random().toString(36).slice(2, 11);
const now = new Date().toISOString();

const WELCOME = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '📘 Welcome to Nexus Docs' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'A powerful, Wiki.js-inspired documentation editor. Click ' }, { type: 'text', marks: [{ type: 'bold' }], text: 'Edit' }, { type: 'text', text: ' to start writing.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '✨ Features' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Rich Text' }, { type: 'text', text: ' — Bold, Italic, Underline, Strike, Code, Subscript, Superscript' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Typography' }, { type: 'text', text: ' — Font family, font size, text color, text highlight' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Blocks' }, { type: 'text', text: ' — Headings H1–H4, blockquote, code block, divider' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Lists' }, { type: 'text', text: ' — Bullet, Ordered, Task (checkbox) lists' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Media' }, { type: 'text', text: ' — Images, YouTube embeds' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Tables' }, { type: 'text', text: ' — Insert, add/delete rows & columns' }] }] },
    ]},
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🚀 Keyboard Shortcuts' }] },
    { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ctrl+B Bold · Ctrl+I Italic · Ctrl+U Underline · Ctrl+Z Undo · Ctrl+Y Redo · Ctrl+K Link' }] }] },
    { type: 'codeBlock', attrs: { language: 'typescript' }, content: [{ type: 'text', text: '// Markdown is auto-converted!\n## Heading\n**bold** _italic_ `code`\n- bullet list item\n1. ordered list\n> blockquote' }] },
  ],
});

const categoryFolderMeta: Record<'workflow' | 'note' | 'developer' | 'client', { name: string; icon: string }> = {
  workflow: { name: 'Workflow Docs', icon: '📋' },
  note: { name: 'Meeting Notes', icon: '📝' },
  developer: { name: 'Developer Docs', icon: '⚙️' },
  client: { name: 'Client Documents', icon: '👥' },
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      folders: [
        { id: 'f1', name: 'Getting Started', parentId: null, projectId: null, icon: '🚀', color: '#6366f1', createdAt: now },
        { id: 'f2', name: 'Technical Docs', parentId: null, projectId: 'p1', icon: '⚙️', color: '#22c55e', createdAt: now },
        { id: 'f3', name: 'SOPs & Policies', parentId: null, projectId: null, icon: '📋', color: '#f59e0b', createdAt: now },
      ],
      documents: [
        { id: 'd1', folderId: 'f1', parentId: null, projectId: null, title: 'Welcome to Nexus Docs', content: WELCOME, category: 'workflow', emoji: '📘', tags: ['intro', 'guide'], status: 'published', isPinned: true, isFavorite: false, wordCount: 120, authorName: 'John Doe', authorAvatar: 'https://i.pravatar.cc/150?u=1', version: 1, createdAt: now, updatedAt: now },
        { id: 'd2', folderId: 'f2', parentId: null, projectId: 'p1', title: 'Architecture Overview', content: JSON.stringify({ type: 'doc', content: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Architecture Overview' }] }, { type: 'paragraph', content: [{ type: 'text', text: 'High-level architecture of the Nexus platform.' }] }] }), category: 'developer', emoji: '🏗️', tags: ['architecture'], status: 'published', isPinned: false, isFavorite: true, wordCount: 340, authorName: 'John Doe', authorAvatar: 'https://i.pravatar.cc/150?u=1', version: 3, createdAt: now, updatedAt: now },
        { id: 'd2_1', folderId: 'f2', parentId: 'd2', projectId: 'p1', title: 'Database Schema', content: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Sub-page detailing the database schema.' }] }] }), category: 'developer', emoji: '🗄️', tags: ['db'], status: 'draft', isPinned: false, isFavorite: false, wordCount: 45, authorName: 'John Doe', authorAvatar: 'https://i.pravatar.cc/150?u=1', version: 1, createdAt: now, updatedAt: now },
        { id: 'd3', folderId: 'f3', parentId: null, projectId: null, title: 'Employee Onboarding SOP', content: JSON.stringify({ type: 'doc', content: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Employee Onboarding SOP' }] }, { type: 'paragraph', content: [{ type: 'text', text: 'Standard operating procedure for onboarding.' }] }] }), category: 'workflow', emoji: '👋', tags: ['hr', 'sop'], status: 'draft', isPinned: false, isFavorite: false, wordCount: 89, authorName: 'Jane Smith', authorAvatar: 'https://i.pravatar.cc/150?u=2', version: 1, createdAt: now, updatedAt: now },
        { id: 'd4', folderId: null, parentId: null, projectId: null, title: 'Quick Notes', content: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Personal scratchpad...' }] }] }), category: 'note', emoji: '📝', tags: ['personal'], status: 'draft', isPinned: true, isFavorite: true, wordCount: 15, authorName: 'John Doe', authorAvatar: 'https://i.pravatar.cc/150?u=1', version: 1, createdAt: now, updatedAt: now },
      ],
      activeDocId: 'd1',

      getOrCreateCategoryFolder: (category: 'workflow' | 'note' | 'developer' | 'client', projectId: string | null = null) => {
        const { folders, createFolder } = get();
        const folderName = categoryFolderMeta[category].name;
        const existing = folders.find(f => f.name === folderName && f.projectId === projectId);
        
        if (existing) return existing.id;
        
        const newFolder = createFolder(folderName, null, projectId);
        set(s => ({
          folders: s.folders.map(f => f.id === newFolder.id ? { ...f, icon: categoryFolderMeta[category].icon } : f)
        }));
        return newFolder.id;
      },

      createFolder: (name, parentId = null, projectId = null) => {
        const folder: DocFolder = { id: uid(), name, parentId: parentId ?? null, projectId: projectId ?? null, icon: '📁', createdAt: new Date().toISOString() };
        set(s => ({ folders: [...s.folders, folder] }));
        return folder;
      },
      updateFolder: (id, updates) => set(s => ({ folders: s.folders.map(f => f.id === id ? { ...f, ...updates } : f) })),
      deleteFolder: (id) => set(s => ({ folders: s.folders.filter(f => f.id !== id), documents: s.documents.map(d => d.folderId === id ? { ...d, folderId: null } : d) })),

      createDocument: (folderId = null, parentId = null, projectId = null, category: 'workflow' | 'note' | 'developer' | 'client' = 'note') => {
        const { getOrCreateCategoryFolder } = get();
        const targetFolderId = folderId ?? getOrCreateCategoryFolder(category, projectId);
        
        const doc: Doc = { id: uid(), folderId: targetFolderId, parentId: parentId ?? null, projectId: projectId ?? null, title: 'Untitled Document', content: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }), category, emoji: '📄', tags: [], status: 'draft', isPinned: false, isFavorite: false, wordCount: 0, authorName: 'John Doe', authorAvatar: 'https://i.pravatar.cc/150?u=1', version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set(s => ({ documents: [doc, ...s.documents], activeDocId: doc.id }));
        return doc;
      },
      updateDocument: (id, updates) => set(s => ({ documents: s.documents.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d) })),
      deleteDocument: (id) => {
        const { documents, activeDocId } = get();
        
        // Find all nested children recursively
        const getChildren = (parentId: string): string[] => {
          const children = documents.filter(d => d.parentId === parentId).map(d => d.id);
          return [...children, ...children.flatMap(getChildren)];
        };
        const idsToDelete = [id, ...getChildren(id)];
        
        const remaining = documents.filter(d => !idsToDelete.includes(d.id));
        set({ documents: remaining, activeDocId: idsToDelete.includes(activeDocId || '') ? (remaining[0]?.id ?? null) : activeDocId });
      },
      setActiveDoc: (id) => set({ activeDocId: id }),
      togglePin: (id: string) => set(s => ({ documents: s.documents.map(d => d.id === id ? { ...d, isPinned: !d.isPinned } : d) })),
      toggleFavorite: (id) => set(s => ({ documents: s.documents.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d) })),
    }),
    { name: 'nexus-documents' }
  )
);
