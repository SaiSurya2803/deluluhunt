"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ShieldAlert, 
  Database,
  BarChart,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Team Management', href: '/admin/teams', icon: Users },
  { name: 'Live Proctoring', href: '/admin/proctoring', icon: ShieldAlert },
  { name: 'Content Management', href: '/admin/content', icon: Database },
  { name: 'Leaderboard', href: '/leaderboard', icon: BarChart }, // Links to the same public-ish leaderboard
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 glass-panel z-50 flex items-center justify-between px-4 border-b-0">
        <div className="font-bold text-xl text-glow tracking-widest text-danger">GLEC ADMIN</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-y-0 border-l-0 border-glass-border bg-[#0a0a14] transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-[4px_0_24px_rgba(255,0,85,0.05)]",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-center border-b border-glass-border hidden md:flex text-danger">
          <ShieldAlert className="w-5 h-5 mr-2" />
          <Link href="/admin/dashboard" className="font-bold text-xl tracking-widest">CONTROL PANEL</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                  isActive ? "bg-danger/20 text-danger border border-danger/30" : "text-foreground/70 hover:bg-slate-900/5 hover:text-white"
                )}>
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-glass-border">
          <Button variant="ghost" className="w-full justify-start text-foreground/50 hover:text-white hover:bg-slate-900/5" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Exit Admin
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
