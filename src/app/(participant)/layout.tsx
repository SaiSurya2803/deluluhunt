"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Swords, 
  BrainCircuit, 
  Trophy, 
  Folder, 
  Key, 
  Coins, 
  Users, 
  Activity, 
  Bell, 
  ShieldQuestion, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rounds', href: '/rounds', icon: Swords },
  { name: 'Quiz Round', href: '/quiz/intro', icon: BrainCircuit },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Assets', href: '/assets', icon: Folder },
  { name: 'Clues', href: '/clues', icon: Key },
  { name: 'Credits', href: '/credits', icon: Coins },
  { name: 'Team Profile', href: '/profile', icon: Users },
  { name: 'Team Activity', href: '/activity', icon: Activity },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Rules & Help', href: '/rules', icon: ShieldQuestion },
];

export default function ParticipantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, team, currentMember, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !team || !currentMember) {
      router.push('/login');
    }
  }, [isAuthenticated, team, currentMember, router]);

  if (!isAuthenticated || !team) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 glass-panel z-50 flex items-center justify-between px-4 border-b-0">
        <div className="flex items-center">
          <img src="/logo.png" alt="INNOVATEX" className="h-8 w-auto object-contain" />
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 glass-panel border-r border-y-0 border-l-0 border-glass-border transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-center border-b border-glass-border hidden md:flex">
          <Link href="/dashboard" className="flex items-center justify-center w-full h-full">
            <img src="/logo.png" alt="INNOVATEX" className="h-10 w-auto object-contain" />
          </Link>
        </div>
        
        <div className="p-4 border-b border-glass-border">
          <div className="text-xs text-foreground/50 uppercase mb-1">Current Team</div>
          <div className="font-semibold text-slate-900 truncate">{team.name}</div>
          <div className="text-xs text-primary mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            {currentMember?.name}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive ? "bg-primary/20 text-primary border border-primary/30" : "text-foreground/70 hover:bg-glass-bg hover:text-slate-900"
                )}>
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-glass-border">
          <Button variant="ghost" className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
