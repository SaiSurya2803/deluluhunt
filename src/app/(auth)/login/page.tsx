"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { DB } from '@/services/db';
import { useAuthStore } from '@/store/useAuthStore';
import { Team } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const adminLogin = useAuthStore(state => state.adminLogin);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [step, setStep] = useState<'CREDENTIALS' | 'MEMBER_SELECTION'>('CREDENTIALS');
  const [authenticatedTeam, setAuthenticatedTeam] = useState<Team | null>(null);

  useEffect(() => {
    DB.init();
  }, []);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin backdoor for demo
    if (email === 'admin@innovatex.com' && password === 'admin') {
      adminLogin();
      router.push('/admin');
      return;
    }

    const teams = DB.getTeams();
    const team = teams.find(t => t.email === email && t.password === password);

    if (!team) {
      setError('Invalid email or password');
      return;
    }
    if (!team.isActive) {
      setError('Team account is disabled');
      return;
    }

    setAuthenticatedTeam(team);
    setStep('MEMBER_SELECTION');
  };

  const handleMemberSelect = (memberId: string) => {
    if (!authenticatedTeam) return;
    const member = authenticatedTeam.members.find(m => m.id === memberId);
    if (!member) return;

    // Log the login activity
    const logs = DB.getActivityLogs();
    DB.setActivityLogs([
      {
        id: `log-${Date.now()}`,
        teamId: authenticatedTeam.id,
        memberId: member.id,
        action: 'Logged in',
        timestamp: new Date().toISOString()
      },
      ...logs
    ]);

    login(authenticatedTeam, member);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === 'CREDENTIALS' ? 'TEAM LOGIN' : 'WHO ARE YOU ACCESSING AS?'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'CREDENTIALS' ? 'Access your challenge workspace.' : 'Select your profile to continue.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'CREDENTIALS' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <Input required type="email" placeholder="Team Email ID" value={email} onChange={e => setEmail(e.target.value)} />
              <Input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              {error && <p className="text-danger text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full">VERIFY TEAM</Button>
            </form>
          )}

          {step === 'MEMBER_SELECTION' && authenticatedTeam && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-primary font-mono text-sm">Welcome back,</p>
                <p className="text-xl font-bold text-slate-900">{authenticatedTeam.name}</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {authenticatedTeam.members.map(member => (
                  <Button 
                    key={member.id} 
                    variant="outline" 
                    className="h-14 justify-between px-6"
                    onClick={() => handleMemberSelect(member.id)}
                  >
                    <span>{member.name}</span>
                    <span className="text-xs opacity-50">{member.role.replace('_', ' ')}</span>
                  </Button>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4" onClick={() => setStep('CREDENTIALS')}>
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
        {step === 'CREDENTIALS' && (
          <CardFooter className="justify-center border-t border-glass-border pt-4">
            <p className="text-sm text-foreground/70">
              Not registered? <Link href="/register" className="text-primary hover:underline">Register team</Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
