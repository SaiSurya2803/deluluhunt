"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { Team } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Mail } from 'lucide-react';

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    setTeams(DB.getTeams());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      const updatedTeams = teams.filter(t => t.id !== id);
      DB.setTeams(updatedTeams);
      setTeams(updatedTeams);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      
      const newTeams: Team[] = [];
      
      // Skip header row if it exists (assuming first row is header if it contains 'email' or 'team')
      let startIndex = 0;
      if (rows[0].toLowerCase().includes('team') || rows[0].toLowerCase().includes('email')) {
        startIndex = 1;
      }

      for (let i = startIndex; i < rows.length; i++) {
        // Handle basic CSV parsing (comma separated, might fail on quoted commas but sufficient for basic demo)
        const cols = rows[i].split(',').map(c => c.trim());
        if (cols.length < 3) continue; // Need at least Team Name, Email, Password

        const teamName = cols[0];
        const email = cols[1];
        const password = cols[2];
        const m1 = cols[3];
        const m2 = cols[4];
        const m3 = cols[5];
        const m4 = cols[6];

        const members = [];
        if (m1) members.push({ id: `m-${Date.now()}-${i}-1`, name: m1, role: 'TEAM_LEADER' as any });
        if (m2) members.push({ id: `m-${Date.now()}-${i}-2`, name: m2, role: 'MEMBER_2' as any });
        if (m3) members.push({ id: `m-${Date.now()}-${i}-3`, name: m3, role: 'MEMBER_3' as any });
        if (m4) members.push({ id: `m-${Date.now()}-${i}-4`, name: m4, role: 'MEMBER_4' as any });

        // If no members specified in CSV, fallback to team name
        if (members.length === 0) {
          members.push({ id: `m-${Date.now()}-${i}-1`, name: `${teamName} Leader`, role: 'TEAM_LEADER' as any });
        }

        newTeams.push({
          id: `t-${Date.now()}-${i}`,
          name: teamName,
          email: email,
          password: password,
          members: members,
          score: 0,
          roundsCompleted: 0,
          quizStatus: 'PENDING',
          credits: 50,
          isActive: true,
          createdAt: new Date().toISOString()
        });
      }

      if (newTeams.length > 0) {
        const updatedTeams = [...teams, ...newTeams];
        DB.setTeams(updatedTeams);
        setTeams(updatedTeams);
        alert(`Successfully imported ${newTeams.length} teams!`);
      } else {
        alert("No valid team data found in CSV.");
      }
      
      // Reset input
      if (event.target) event.target.value = '';
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const templateContent = "Team Name, Email, Password, Member 1 Name (Leader), Member 2 Name, Member 3 Name, Member 4 Name\nSample Team, sample@innovatex.com, samplepass123, John Doe, Jane Smith, Alex, Sam\nSolo Team, solo@innovatex.com, pass456, Emily,,,";
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'innovatex_teams_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSetGlobalCredits = () => {
    const amountStr = prompt("Enter the starting credits amount for ALL teams:");
    if (amountStr === null) return;
    
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount < 0) {
      alert("Invalid credit amount");
      return;
    }
    
    if (confirm(`Are you sure you want to reset ALL teams to ${amount} credits?`)) {
      const updatedTeams = teams.map(t => ({ ...t, credits: amount }));
      DB.setTeams(updatedTeams);
      setTeams(updatedTeams);
      alert(`All teams have been updated to ${amount} credits.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-danger text-glow tracking-tight">TEAM MANAGEMENT</h1>
          <p className="text-slate-400 mt-1">Manage registered teams and their access.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleSetGlobalCredits}
            className="bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            Initialize Credits
          </button>
          <button 
            onClick={downloadTemplate}
            className="bg-slate-900 border border-slate-600 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Template
          </button>
          <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import CSV
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      <Card className="border-slate-700 shadow-sm bg-slate-900 overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Team Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Total Score</th>
                <th className="px-6 py-4">Quiz Score</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">AI Trust Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team.id} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{team.name}</td>
                  <td className="px-6 py-4 text-slate-300">{team.email}</td>
                  <td className="px-6 py-4">{team.members.length} / 4</td>
                  <td className="px-6 py-4 text-primary font-bold">{team.score + (team.quizScore || 0)}</td>
                  <td className="px-6 py-4 text-primary">{team.quizScore !== undefined ? team.quizScore : 'N/A'}</td>
                  <td className="px-6 py-4 text-white font-mono">{team.credits}</td>
                  <td className="px-6 py-4">
                    {team.quizTrustScore !== undefined ? (
                      <Badge variant={team.quizTrustScore > 70 ? 'success' : team.quizTrustScore > 40 ? 'warning' : 'destructive'}>
                        {team.quizTrustScore}%
                      </Badge>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={team.isActive ? "success" : "destructive"}>
                      {team.isActive ? 'ACTIVE' : 'DISABLED'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(team.id)}
                      className="text-xs text-danger hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
