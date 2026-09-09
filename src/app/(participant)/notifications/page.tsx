"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { Notification } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { team } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (team) {
      const allNotifs = DB.getNotifications();
      const teamNotifs = allNotifs
        .filter(n => n.teamId === team.id || n.teamId === 'ALL')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Generate some mock notifications if none exist
      if (teamNotifs.length === 0) {
        const mockNotifs: Notification[] = [
          { id: `n-1`, teamId: team.id, title: 'Welcome to Innovatex Delulu Hunt', message: 'Get ready for the ultimate 6-round challenge.', type: 'INFO', isRead: false, createdAt: new Date().toISOString() },
          { id: `n-2`, teamId: 'ALL', title: 'Round 1 Unlocked', message: 'Round 1 is now available for all teams.', type: 'SUCCESS', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        ];
        DB.setNotifications([...allNotifs, ...mockNotifs]);
        setNotifications(mockNotifs);
      } else {
        setNotifications(teamNotifs);
      }
    }
  }, [team]);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    
    // Update DB
    const allNotifs = DB.getNotifications();
    DB.setNotifications(allNotifs.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    
    const allNotifs = DB.getNotifications();
    DB.setNotifications(allNotifs.map(n => 
      (n.teamId === team?.id || n.teamId === 'ALL') ? { ...n, isRead: true } : n
    ));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <CheckCircle className="w-6 h-6 text-success" />;
      case 'WARNING': return <AlertTriangle className="w-6 h-6 text-warning" />;
      case 'ERROR': return <XCircle className="w-6 h-6 text-danger" />;
      default: return <Info className="w-6 h-6 text-primary" />;
    }
  };

  if (!team) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-end border-b border-glass-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" /> NOTIFICATIONS
          </h1>
          <p className="text-foreground/60 mt-1">Stay updated with event announcements and alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-xl text-foreground/50">
            You're all caught up!
          </div>
        ) : (
          notifications.map(notif => (
            <Card key={notif.id} className={cn("transition-colors", notif.isRead ? "opacity-70 border-transparent bg-slate-900/20" : "border-primary/20 bg-primary/5")}>
              <CardContent className="p-4 flex gap-4 items-start">
                <div className="mt-1 shrink-0">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={cn("font-bold", notif.isRead ? "text-foreground/80" : "text-white")}>{notif.title}</h3>
                    <span className="text-xs text-foreground/50">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-foreground/70 mt-1">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <Button variant="ghost" size="icon" onClick={() => markAsRead(notif.id)} className="shrink-0 h-8 w-8 text-foreground/50 hover:text-white">
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
