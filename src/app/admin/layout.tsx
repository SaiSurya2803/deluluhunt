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
  { name: 'Quiz Management', href: '/admin/quiz', icon: ShieldAlert },
  { name: 'Quiz Submissions', href: '/admin/quiz-submissions', icon: Database },
  { name: 'Rounds Management', href: '/admin/content', icon: Database },
  { name: 'Clues Management', href: '/admin/clues', icon: Database },
  { name: 'Assets Management', href: '/admin/assets', icon: Database },
  { name: 'Grading & Submissions', href: '/admin/submissions', icon: ShieldAlert }, // Could use CheckCircle or similar
  { name: 'Leaderboard', href: '/admin/leaderboard', icon: BarChart },
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
    <div className="flex h-screen bg-slate-800 overflow-hidden text-white font-sans">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-slate-900 z-50 flex items-center justify-between px-4 border-b border-slate-700 shadow-sm">
        <div className="font-bold text-lg tracking-wider text-danger flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2" /> ADMIN
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-lg md:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-center border-b border-slate-700 hidden md:flex text-danger bg-slate-800/50">
          <ShieldAlert className="w-5 h-5 mr-2" />
          <Link href="/admin/dashboard" className="font-bold text-lg tracking-wider">CONTROL PANEL</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Management</div>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium",
                  isActive 
                    ? "bg-danger/10 text-danger" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-danger" : "text-slate-400")} />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-danger hover:bg-danger/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0 bg-slate-800/50">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
