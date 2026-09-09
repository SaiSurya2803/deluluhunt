"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { DB } from '@/services/db';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    teamName: '',
    email: '',
    password: '',
    confirmPassword: '',
    leaderName: '',
    member2Name: '',
    member3Name: '',
    member4Name: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const teams = DB.getTeams();
    if (teams.some(t => t.email === formData.email || t.name === formData.teamName)) {
      setError('Team name or email already exists');
      return;
    }

    const members: { id: string; name: string; role: any }[] = [
      { id: `m-${Date.now()}-1`, name: formData.leaderName, role: 'TEAM_LEADER' }
    ];
    if (formData.member2Name) members.push({ id: `m-${Date.now()}-2`, name: formData.member2Name, role: 'MEMBER_2' });
    if (formData.member3Name) members.push({ id: `m-${Date.now()}-3`, name: formData.member3Name, role: 'MEMBER_3' });
    if (formData.member4Name) members.push({ id: `m-${Date.now()}-4`, name: formData.member4Name, role: 'MEMBER_4' });


    const newTeam = {
      id: `t-${Date.now()}`,
      name: formData.teamName,
      email: formData.email,
      password: formData.password,
      members,
      credits: 50,
      score: 0,
      roundsCompleted: 0,
      quizStatus: 'PENDING' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    DB.setTeams([...teams, newTeam]);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center">TEAM REGISTRATION</CardTitle>
          <CardDescription className="text-center">Register your squad for the ultimate challenge.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">Team Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input required name="teamName" placeholder="Team Name" value={formData.teamName} onChange={handleChange} />
                <Input required type="email" name="email" placeholder="Team Email ID" value={formData.email} onChange={handleChange} />
                <Input required type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <Input required type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">Team Members (Max 4)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input required name="leaderName" placeholder="Team Leader Name *" value={formData.leaderName} onChange={handleChange} />
                <Input name="member2Name" placeholder="Member 2 Name (Optional)" value={formData.member2Name} onChange={handleChange} />
                <Input name="member3Name" placeholder="Member 3 Name (Optional)" value={formData.member3Name} onChange={handleChange} />
                <Input name="member4Name" placeholder="Member 4 Name (Optional)" value={formData.member4Name} onChange={handleChange} />
              </div>
            </div>

            {error && <p className="text-danger text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full">REGISTER TEAM</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-glass-border pt-4">
          <p className="text-sm text-foreground/70">
            Already registered? <Link href="/login" className="text-primary hover:underline">Login here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
