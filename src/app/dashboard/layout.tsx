'use client';

import Sidebar from '@/components/shared/Sidebar';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useZenStore } from '@/store/useZenStore';
import { useEffect } from 'react';
import axios from 'axios';
import { useProjectStore } from '@/store/useProjectStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { isZenMode } = useZenStore();
  const { fetchProjects } = useProjectStore();
  const { fetchFolders, fetchDocuments } = useDocumentStore();
  const router = useRouter();

  useEffect(() => {
    // Read directly from localStorage to prevent Next.js/Zustand hydration lag redirecting the user
    const savedAuth = typeof window !== 'undefined' ? localStorage.getItem('nexus-auth') : null;
    let hasAuth = false;
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.state?.isAuthenticated && parsed.state?.user) {
          hasAuth = true;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!isAuthenticated && !hasAuth) {
      router.replace('/login');
      return;
    }

    const initializeDatabaseAndStores = async () => {
      try {
        // Load live MongoDB entries directly into Zustand stores
        await fetchProjects();
        await fetchFolders();
        await fetchDocuments();
      } catch (error) {
        console.error('Failed to initialize database stores:', error);
      }
    };

    initializeDatabaseAndStores();
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {!isZenMode && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-w-0">
        {!isZenMode && (
          <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex-1 max-w-xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Workspace</span>
                <span className="text-border">/</span>
                <span className="text-foreground font-medium">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-border">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Online</span>
              </div>

              <button className="w-10 h-10 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-accent transition-all border border-border/50 cursor-pointer">
                  <span className="text-sm font-semibold hidden md:block">{user?.name}</span>
                  <Avatar className="w-8 h-8 ring-2 ring-background">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={() => router.push('/dashboard/settings')} 
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => router.push('/dashboard/settings')} 
                    className="cursor-pointer"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={() => {
                      logout();
                    }} 
                    className="cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-500/10"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-background/50 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
