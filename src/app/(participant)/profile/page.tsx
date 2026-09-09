"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Mail, Target, Award, Key } from 'lucide-react';

export default function ProfilePage() {
  const { team, currentMember } = useAuthStore();

  if (!team) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-glow">TEAM PROFILE</h1>
        <p className="text-foreground/60 mt-1">Manage your team details and view performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/20 bg-white/60">
          <CardHeader className="text-center pb-2">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50 mb-4">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-slate-900">{team.name}</CardTitle>
            <Badge variant={team.isActive ? "success" : "destructive"} className="mt-2 mx-auto">
              {team.isActive ? 'ACTIVE' : 'DISABLED'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center text-sm text-foreground/70">
              <Mail className="w-4 h-4 mr-3" /> {team.email}
            </div>
            <div className="flex items-center text-sm text-foreground/70">
              <Key className="w-4 h-4 mr-3" /> ID: {team.id}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center"><Target className="w-5 h-5 mr-2" /> Overall Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/80 text-center border border-glass-border">
                <p className="text-xs text-foreground/50 uppercase">Score</p>
                <p className="text-2xl font-bold text-primary mt-1">{team.score}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/80 text-center border border-glass-border">
                <p className="text-xs text-foreground/50 uppercase">Rounds</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{team.roundsCompleted}/6</p>
              </div>
              <div className="p-4 rounded-lg bg-white/80 text-center border border-glass-border">
                <p className="text-xs text-foreground/50 uppercase">Quiz</p>
                <p className="text-xl font-bold text-success mt-1">{team.quizScore || 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/80 text-center border border-glass-border">
                <p className="text-xs text-foreground/50 uppercase">Credits</p>
                <p className="text-2xl font-bold text-warning mt-1">{team.credits}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center"><Award className="w-5 h-5 mr-2" /> Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.members.map((member) => (
                  <div key={member.id} className={`flex justify-between items-center p-3 rounded-lg border ${currentMember?.id === member.id ? 'bg-primary/10 border-primary/30' : 'bg-slate-100 border-glass-border'}`}>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center">
                        {member.name}
                        {currentMember?.id === member.id && <Badge variant="outline" className="ml-2 text-[10px] text-primary border-primary">YOU</Badge>}
                      </div>
                      <p className="text-xs text-foreground/50">{member.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
