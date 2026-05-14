import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
}

interface ProjectStore {
  projects: Project[];
  activeProjectId: string | null;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
}

const uid = () => Math.random().toString(36).slice(2, 11);
const now = new Date().toISOString();

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [
        {
          id: 'p1',
          name: 'Nexus Platform',
          description: 'Core platform documentation and specifications.',
          icon: '🚀',
          color: '#10b981', // emerald-500
          createdAt: now,
        },
        {
          id: 'p2',
          name: 'Summer Camp 2026',
          description: 'Curriculum, planning, and logistics.',
          icon: '🏕️',
          color: '#f59e0b', // amber-500
          createdAt: now,
        }
      ],
      activeProjectId: null,

      createProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        return newProject;
      },

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      })),

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
      })),

      setActiveProject: (id) => set({ activeProjectId: id }),
    }),
    {
      name: 'nexus-projects',
    }
  )
);
