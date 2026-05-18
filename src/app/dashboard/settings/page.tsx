'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Check, 
  Save, 
  Moon, 
  Sun, 
  Layout, 
  Type,
  AlertCircle,
  X,
  KeyRound,
  Laptop,
  ArrowLeft,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/useThemeStore';

type Tab = 'profile' | 'preferences' | 'security';

export default function SettingsPage() {
  const { user, updateProfile, updatePreferences, isLoading } = useAuthStore();
  const { setMode, setAccentColor, setFontFamily: setThemeFontFamily } = useThemeStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const router = useRouter();

  // Profile fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  // Preference fields state
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [sidebarLayout, setSidebarLayout] = useState<'default' | 'compact'>('default');
  const [fontFamily, setFontFamily] = useState<'Inter' | 'Outfit' | 'Roboto'>('Inter');
  const [accentColor, setAccentColorState] = useState<'blue' | 'purple' | 'green' | 'amber' | 'rose' | 'slate'>('blue');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize state from authenticated user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');

      if (user.preferences) {
        setTheme(user.preferences.theme || 'dark');
        setSidebarLayout(user.preferences.sidebarLayout || 'default');
        setFontFamily(user.preferences.fontFamily || 'Inter');
        setAccentColorState(user.preferences.accentColor || 'blue');
      }
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(name, email, avatar);
      showToast('Profile updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePreferences({ theme, sidebarLayout, fontFamily, accentColor });
      
      // Instantly apply theme preferences globally to the application in real-time
      setMode(theme);
      setAccentColor(accentColor);
      setThemeFontFamily(fontFamily.toLowerCase() as any);

      showToast('Preferences updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update preferences', 'error');
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All fields are required', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    // Simulation
    showToast('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 lg:px-8 space-y-8 text-foreground">
      
      {/* Back Button & Header */}
      <div className="space-y-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight font-outfit uppercase">Account & Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your public identity, application preferences, and security access.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
            { id: 'security', label: 'Security & Access', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-left transition-all cursor-pointer border",
                  active 
                    ? "bg-primary/10 border-primary/25 text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-muted-foreground")} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="md:col-span-3">
          <div className="bg-card border border-border p-8 rounded-3xl shadow-xl min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.form
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleProfileSubmit}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold font-outfit border-b border-border pb-4">Personal Information</h2>
                  
                  {/* Avatar Preview & URL */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full border border-border overflow-hidden bg-accent/40 shrink-0">
                      {avatar ? (
                        <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-outfit text-3xl font-black text-muted-foreground">
                          {name ? name.charAt(0) : '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avatar URL</label>
                      <input
                        type="url"
                        value={avatar}
                        onChange={e => setAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full h-10 px-4 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="w-full h-10 px-4 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@veloc.com"
                        required
                        className="w-full h-10 px-4 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Role</label>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wide">
                      {user?.role || 'CLIENT'}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic mt-1">Contact your master administrator to adjust access levels.</p>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/10"
                    >
                      <Save className="w-4 h-4" />
                      Save Profile
                    </button>
                  </div>
                </motion.form>
              )}

              {activeTab === 'preferences' && (
                <motion.form
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handlePreferencesSubmit}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-bold font-outfit border-b border-border pb-4">Personal Preferences</h2>

                  {/* Theme selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <Moon className="w-4 h-4" />
                      Theme Customization
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'dark', label: 'Dark Mode', icon: Moon },
                        { id: 'light', label: 'Light Mode', icon: Sun },
                        { id: 'system', label: 'System Default', icon: Laptop },
                      ].map(item => {
                        const Icon = item.icon;
                        const selected = theme === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setTheme(item.id as any)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-center cursor-pointer",
                              selected 
                                ? "bg-primary/10 border-primary/30 text-primary" 
                                : "bg-background border-border hover:bg-accent/40"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accent Color selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <Palette className="w-4 h-4" />
                      Accent Color Theme
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { id: 'blue', color: 'bg-blue-500', name: 'Blue' },
                        { id: 'purple', color: 'bg-purple-500', name: 'Purple' },
                        { id: 'green', color: 'bg-emerald-500', name: 'Green' },
                        { id: 'amber', color: 'bg-amber-500', name: 'Amber' },
                        { id: 'rose', color: 'bg-rose-500', name: 'Rose' },
                        { id: 'slate', color: 'bg-slate-400', name: 'Slate' },
                      ].map(item => {
                        const selected = accentColor === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setAccentColorState(item.id as any)}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center cursor-pointer relative gap-1.5",
                              selected 
                                ? "bg-primary/10 border-primary/30 text-primary" 
                                : "bg-background border-border hover:bg-accent/40"
                            )}
                          >
                            <div className={cn("w-6 h-6 rounded-full", item.color)} />
                            <span className="text-[9px] font-black uppercase tracking-wider">{item.name}</span>
                            {selected && (
                              <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-primary-foreground stroke-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sidebar Layout */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <Layout className="w-4 h-4" />
                      Sidebar Layout
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'default', label: 'Expanded Sidebar', desc: 'Standard display showing full titles and folders.' },
                        { id: 'compact', label: 'Compact Sidebar', desc: 'Saves horizontal space using icon-only representations.' },
                      ].map(item => {
                        const selected = sidebarLayout === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSidebarLayout(item.id as any)}
                            className={cn(
                              "p-4 rounded-xl border transition-all text-left cursor-pointer flex flex-col gap-1.5",
                              selected 
                                ? "bg-primary/10 border-primary/30 text-primary" 
                                : "bg-background border-border hover:bg-accent/40"
                            )}
                          >
                            <span className={cn("text-[10px] font-black uppercase tracking-wider", selected ? "text-primary" : "text-foreground")}>{item.label}</span>
                            <span className="text-[10px] text-muted-foreground font-medium leading-relaxed">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Family selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <Type className="w-4 h-4" />
                      Global Workspace Font
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'Inter', label: 'Inter Sans', desc: 'Geometric, highly readable modern sans.' },
                        { id: 'Outfit', label: 'Outfit Display', desc: 'Elegant, modern display with warm characteristics.' },
                        { id: 'Roboto', label: 'Roboto Classic', desc: 'Clean, neutral neo-grotesque standard.' },
                      ].map(item => {
                        const selected = fontFamily === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFontFamily(item.id as any)}
                            className={cn(
                              "p-4 rounded-xl border transition-all text-left cursor-pointer flex flex-col gap-1.5",
                              selected 
                                ? "bg-primary/10 border-primary/30 text-primary" 
                                : "bg-background border-border hover:bg-accent/40"
                            )}
                            style={{ fontFamily: item.id }}
                          >
                            <span className={cn("text-xs font-black tracking-wide", selected ? "text-primary" : "text-foreground")}>{item.label}</span>
                            <span className="text-[9px] text-muted-foreground font-medium leading-relaxed">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/10"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </motion.form>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Password change form */}
                  <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    <h2 className="text-xl font-bold font-outfit border-b border-border pb-4">Security & Authorization</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 px-4 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 px-4 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 px-4 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-primary/10"
                      >
                        <KeyRound className="w-4 h-4" />
                        Update Password
                      </button>
                    </div>
                  </form>

                  {/* Active sessions list */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">Active Sessions</h3>
                    <div className="border border-border rounded-2xl overflow-hidden bg-background">
                      {[
                        { device: 'Chrome on Windows', ip: '103.241.12.98', status: 'Current Session', time: 'Active now' },
                        { device: 'Safari on iPhone 15', ip: '202.89.34.120', status: 'Trusted Device', time: '2 hours ago' },
                      ].map((sess, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border-b border-border/50 last:border-0 hover:bg-accent/20 transition-all">
                          <div className="flex items-center gap-3">
                            <Laptop className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-bold text-foreground">{sess.device}</p>
                              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{sess.ip} • {sess.time}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                            sess.status === 'Current Session' 
                              ? "bg-primary/10 text-primary border border-primary/20" 
                              : "bg-muted text-muted-foreground border border-border"
                          )}>
                            {sess.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed top-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl backdrop-blur-md shadow-2xl max-w-sm border",
              toast.type === 'success' 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-red-950/80 border-red-500/35 text-red-100"
            )}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <div className="flex-1 text-xs font-bold">
              {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              className={cn(
                "p-0.5 rounded-lg transition-colors cursor-pointer shrink-0",
                toast.type === 'success' ? "text-primary hover:text-primary/80" : "text-red-400 hover:text-red-200"
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
