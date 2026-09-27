const fs = require('fs');
let txt = fs.readFileSync('src/app/(participant)/rounds/[id]/workspace/page.tsx', 'utf8');

const target = `const rounds = DB.getRounds();
    const updatedRounds = rounds.map(r => r.id === round.id ? { ...r, status: 'COMPLETED' as const } : r);
    DB.setRounds(updatedRounds);
    
    // Save submission to DB
    const submissions = DB.getSubmissions() || [];
    DB.setSubmissions([
      ...submissions,
      {
        id: \`sub-\${Date.now()}\`,
        teamId: team.id,
        roundId: round.id,
        answer: answer,
        submittedAt: new Date().toISOString(),
        status: 'PENDING_REVIEW'
      }
    ]);
    
    // Update team progress (Score will be added by admin later)
    const teams = DB.getTeams();
    const updatedTeam = {
      ...team,
      roundsCompleted: team.roundsCompleted + 1
    };
    DB.setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
    
    // Log
    const logs = DB.getActivityLogs();
    DB.setActivityLogs([
      {
        id: \`log-\${Date.now()}\`,
        teamId: team.id,
        memberId: currentMember.id,
        action: \`Submitted Solution for Round \${round.roundNumber}\`,
        timestamp: new Date().toISOString()
      },
      ...logs
    ]);`;

const rep = `DB.updateItem(DB.KEYS.ROUNDS, { ...round, status: 'COMPLETED' as const });
    
    // Save submission to DB
    DB.updateItem(DB.KEYS.SUBMISSIONS, {
      id: \`sub-\${Date.now()}\`,
      teamId: team.id,
      roundId: round.id,
      answer: answer,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW'
    });
    
    // Update team progress (Score will be added by admin later)
    const updatedTeam = {
      ...team,
      roundsCompleted: team.roundsCompleted + 1
    };
    DB.updateItem(DB.KEYS.TEAMS, updatedTeam);
    
    // Log
    DB.updateItem(DB.KEYS.ACTIVITY_LOGS, {
      id: \`log-\${Date.now()}\`,
      teamId: team.id,
      memberId: currentMember.id,
      action: \`Submitted Solution for Round \${round.roundNumber}\`,
      timestamp: new Date().toISOString()
    });`;

txt = txt.replace(target, rep);
fs.writeFileSync('src/app/(participant)/rounds/[id]/workspace/page.tsx', txt);
