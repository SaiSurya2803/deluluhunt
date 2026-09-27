const fs = require('fs');
let txt = fs.readFileSync('src/app/(participant)/rounds/[id]/page.tsx', 'utf8');

const target = `const rounds = DB.getRounds();
      const updatedRounds = rounds.map(r => r.id === round.id ? { ...r, status: 'IN_PROGRESS' as const } : r);
      DB.setRounds(updatedRounds);
      
      const logs = DB.getActivityLogs();
      DB.setActivityLogs([
        {
          id: \`log-\${Date.now()}\`,
          teamId: team.id,
          memberId: currentMember.id,
          action: \`Started Round \${round.roundNumber}\`,
          timestamp: new Date().toISOString()
        },
        ...logs
      ]);`;

const replacement = `DB.updateItem(DB.KEYS.ROUNDS, { ...round, status: 'IN_PROGRESS' as const });
      DB.updateItem(DB.KEYS.ACTIVITY_LOGS, {
        id: \`log-\${Date.now()}\`,
        teamId: team.id,
        memberId: currentMember.id,
        action: \`Started Round \${round.roundNumber}\`,
        timestamp: new Date().toISOString()
      });`;

txt = txt.replace(target, replacement);
fs.writeFileSync('src/app/(participant)/rounds/[id]/page.tsx', txt);
