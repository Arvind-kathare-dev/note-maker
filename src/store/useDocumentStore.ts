import { create } from 'zustand';
import axios from 'axios';
import { useProjectStore } from './useProjectStore';

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
  category: string;
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
  isLoading: boolean;
  error: string | null;
  fetchFolders: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  createFolder: (name: string, parentId?: string | null, projectId?: string | null, customId?: string) => Promise<DocFolder>;
  updateFolder: (id: string, updates: Partial<DocFolder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  createDocument: (folderId?: string | null, parentId?: string | null, projectId?: string | null, category?: string) => Promise<Doc>;
  updateDocument: (id: string, updates: Partial<Doc>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  setActiveDoc: (id: string | null) => void;
  togglePin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getOrCreateCategoryFolder: (category: string, projectId?: string | null) => Promise<string>;
}

const categoryFolderMeta: Record<'teacher' | 'developer' | 'admin' | 'student', { name: string; icon: string }> = {
  teacher: { name: 'Staff SOPs', icon: '👩‍🏫' },
  developer: { name: 'Developer Specs', icon: '⚙️' },
  admin: { name: 'Admin Guidelines', icon: '🔑' },
  student: { name: 'Client Help Manuals', icon: '🎒' },
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  folders: [],
  documents: [],
  activeDocId: null,
  isLoading: false,
  error: null,

  fetchFolders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('/api/folders');
      if (res.data.success) {
        set({ folders: res.data.data, isLoading: false });
      } else {
        set({ error: res.data.error, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('/api/documents');
      if (res.data.success) {
        set({ documents: res.data.data, isLoading: false });
        // Set active document to first in list if none active
        if (res.data.data.length > 0 && !get().activeDocId) {
          set({ activeDocId: res.data.data[0].id });
        }
      } else {
        set({ error: res.data.error, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  getOrCreateCategoryFolder: async (category, projectId = null) => {
    const { folders, createFolder } = get();
    const folderId = `f_${category}_${projectId}`;
    const existing = folders.find(f => f.id === folderId);
    
    if (existing) return existing.id;
    
    const projects = useProjectStore.getState().projects;
    const project = projects.find(p => p.id === projectId);
    const customSection = project?.sections?.find((s: any) => s.id === category);
    
    const metaKey = category as keyof typeof categoryFolderMeta;
    const name = customSection?.label 
      ? `${customSection.label.toUpperCase()} MANUALS`
      : (categoryFolderMeta[metaKey]?.name || (category.toUpperCase() + ' MANUALS'));
      
    const icon = categoryFolderMeta[metaKey]?.icon || '📁';
    
    const created = await createFolder(name, null, projectId, folderId);
    return created.id;
  },

  createFolder: async (name, parentId = null, projectId = null, customId) => {
    set({ isLoading: true, error: null });
    try {
      const idVal = customId || Math.random().toString(36).slice(2, 11);
      const res = await axios.post('/api/folders', {
        id: idVal,
        name,
        parentId,
        projectId,
        icon: '📁',
        color: ''
      });
      if (res.data.success) {
        const newFolder = res.data.data;
        set((state) => ({
          folders: [...state.folders, newFolder],
          isLoading: false
        }));
        return newFolder;
      } else {
        throw new Error(res.data.error);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateFolder: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`/api/folders/${id}`, updates);
      if (res.data.success) {
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? res.data.data : f)),
          isLoading: false
        }));
      } else {
        throw new Error(res.data.error);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteFolder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete(`/api/folders/${id}`);
      if (res.data.success) {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          documents: state.documents.map((d) => (d.folderId === id ? { ...d, folderId: null } : d)),
          isLoading: false
        }));
      } else {
        throw new Error(res.data.error);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createDocument: async (folderId = null, parentId = null, projectId = null, category = 'teacher') => {
    set({ isLoading: true, error: null });
    try {
      const { getOrCreateCategoryFolder } = get();
      const targetFolderId = folderId ?? await getOrCreateCategoryFolder(category, projectId);
      
      const customId = Math.random().toString(36).slice(2, 11);
      const res = await axios.post('/api/documents', {
        id: customId,
        folderId: targetFolderId,
        parentId,
        projectId,
        title: 'Untitled Document',
        content: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }),
        category,
        emoji: '📄',
        tags: [],
        status: 'draft',
        isPinned: false,
        isFavorite: false,
        wordCount: 0,
        authorName: 'Little Seeds Support',
        authorAvatar: 'https://i.pravatar.cc/150?u=1',
        version: 1
      });

      if (res.data.success) {
        const doc = res.data.data;
        set((state) => ({
          documents: [doc, ...state.documents],
          activeDocId: doc.id,
          isLoading: false
        }));
        return doc;
      } else {
        throw new Error(res.data.error);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateDocument: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`/api/documents/${id}`, updates);
      if (res.data.success) {
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? res.data.data : d)),
          isLoading: false
        }));
      } else {
        throw new Error(res.data.error);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete(`/api/documents/${id}`);
      if (res.data.success) {
        const { documents, activeDocId } = get();
        
        // Locally identify children deleted recursively by the backend to sync client state
        const getChildren = (pId: string): string[] => {
          const children = documents.filter(d => d.parentId === pId).map(d => d.id);
          return [...children, ...children.flatMap(getChildren)];
        };
        const idsToDelete = [id, ...getChildren(id)];
        
        const remaining = documents.filter(d => !idsToDelete.includes(d.id));
        set({
          documents: remaining,
          activeDocId: idsToDelete.includes(activeDocId || '') ? (remaining[0]?.id ?? null) : activeDocId,
          isLoading: false
        });
      } else {
        throw new Error(res.data.error);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  setActiveDoc: (id) => set({ activeDocId: id }),

  togglePin: async (id) => {
    const { documents, updateDocument } = get();
    const doc = documents.find(d => d.id === id);
    if (doc) {
      await updateDocument(id, { isPinned: !doc.isPinned });
    }
  },

  toggleFavorite: async (id) => {
    const { documents, updateDocument } = get();
    const doc = documents.find(d => d.id === id);
    if (doc) {
      await updateDocument(id, { isFavorite: !doc.isFavorite });
    }
  }
}));
