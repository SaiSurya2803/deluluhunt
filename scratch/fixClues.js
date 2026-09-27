const fs = require('fs');
let txt = fs.readFileSync('src/app/(participant)/clues/page.tsx', 'utf8');

const target1 = `const logs = DB.getActivityLogs();
      DB.setActivityLogs([
        {
          id: \`log-\${Date.now()}\`,
          teamId: team.id,
          memberId: currentMember.id,
          action: \`Purchased Clue for Round \${rounds[clue.roundId]?.roundNumber} (-\${clue.cost} credits)\`,
          timestamp: new Date().toISOString()
        },
        ...logs
      ]);`;
const rep1 = `DB.updateItem(DB.KEYS.ACTIVITY_LOGS, {
        id: \`log-\${Date.now()}\`,
        teamId: team.id,
        memberId: currentMember.id,
        action: \`Purchased Clue for Round \${rounds[clue.roundId]?.roundNumber} (-\${clue.cost} credits)\`,
        timestamp: new Date().toISOString()
      });`;

txt = txt.replace(target1, rep1);
fs.writeFileSync('src/app/(participant)/clues/page.tsx', txt);
