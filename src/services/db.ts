import { Team, Round, Clue, Asset, QuizQuestion, ActivityLog, CreditTransaction, Notification, ProctoringEvent, RoundSubmission, QuizSubmission } from '@/types';
import { mockTeams, mockRounds, mockClues, mockAssets, mockQuizQuestions } from '@/lib/mockData';
import { supabase } from './supabaseClient';

// Keys for localStorage
const KEYS = {
  TEAMS: 'glec_teams',
  ROUNDS: 'glec_rounds',
  CLUES: 'glec_clues',
  ASSETS: 'glec_assets',
  QUIZ_QUESTIONS: 'glec_quiz_questions',
  ACTIVITY_LOGS: 'glec_activity_logs',
  CREDIT_TX: 'glec_credit_tx',
  NOTIFICATIONS: 'glec_notifications',
  PROCTORING_EVENTS: 'glec_proctoring_events',
  SUBMISSIONS: 'glec_round_submissions',
  QUIZ_SUBMISSIONS: 'glec_quiz_submissions',
  GLOBAL_SETTINGS: 'glec_global_settings',
};

const seedInitialData = () => {
  // Populate local if empty
  if (!localStorage.getItem(KEYS.TEAMS)) DB.setTeams(mockTeams);
  if (!localStorage.getItem(KEYS.ROUNDS)) DB.setRounds(mockRounds);
  if (!localStorage.getItem(KEYS.CLUES)) DB.setClues(mockClues);
  if (!localStorage.getItem(KEYS.ASSETS)) DB.setAssets(mockAssets);
  if (!localStorage.getItem(KEYS.QUIZ_QUESTIONS)) DB.setItem(KEYS.QUIZ_QUESTIONS, mockQuizQuestions);
  if (!localStorage.getItem(KEYS.ACTIVITY_LOGS)) DB.setActivityLogs([]);
  if (!localStorage.getItem(KEYS.CREDIT_TX)) DB.setCreditTx([]);
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) DB.setNotifications([]);
  if (!localStorage.getItem(KEYS.PROCTORING_EVENTS)) DB.setProctoringEvents([]);
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) DB.setSubmissions([]);
  if (!localStorage.getItem(KEYS.QUIZ_SUBMISSIONS)) DB.setQuizSubmissions([]);
  if (!localStorage.getItem(KEYS.GLOBAL_SETTINGS)) DB.setItem(KEYS.GLOBAL_SETTINGS, [{ tournamentEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }]);
};

// Initialize DB and sync from Supabase
export const initDB = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Fetch latest global state from Supabase app_state table
    const { data, error } = await supabase.from('app_state').select('*');
    
    if (!error && data && data.length > 0) {
      // Group fragmented keys (e.g. "glec_teams||team-1") back into their parent arrays
      const lists: Record<string, any[]> = {};
      const arrayKeys = Object.values(KEYS);

      data.forEach(row => {
        if (row.key.includes('||')) {
          const [baseKey] = row.key.split('||');
          if (!lists[baseKey]) lists[baseKey] = [];
          lists[baseKey].push(row.data);
        } else if (arrayKeys.includes(row.key)) {
          if (!lists[row.key]) lists[row.key] = [];
          if (Array.isArray(row.data)) {
             lists[row.key].push(...row.data);
          } else {
             lists[row.key].push(row.data);
          }
        } else {
          // Standard generic key (e.g. just a string or object)
          localStorage.setItem(row.key, JSON.stringify(row.data));
        }
      });

      // Deduplicate items by ID and overwrite local storage
      for (const [key, items] of Object.entries(lists)) {
         // Deduplicate items by ID (if they have one), prioritizing newer fragments
         const uniqueMap = new Map();
         items.forEach(item => {
           uniqueMap.set(item.id || Math.random(), item);
         });
         localStorage.setItem(key, JSON.stringify(Array.from(uniqueMap.values())));
      }
      
      console.log("Supabase Cloud DB successfully synced.");
    } else {
      console.log("Cloud DB empty or unreachable, seeding initial data.");
      seedInitialData();
    }
  } catch (err) {
    console.error("Supabase sync failed, falling back to local data:", err);
    seedInitialData();
  }
};

// Generic read operation (always synchronous, instant from memory/localstorage)
export const getItem = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Generic write operation (synchronous to local, async to cloud)
export const setItem = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  
  // 1. Instant UI update via localStorage
  localStorage.setItem(key, JSON.stringify(data));
  
  // 2. Background cloud sync to Supabase
  supabase.from('app_state').upsert({ key: key, data: data }, { onConflict: 'key' })
    .then(({ error }) => {
       if (error) console.error("Cloud sync error for", key, error);
    });
};

// Atomic update for single items (prevents JSON array race conditions)
export const updateItem = <T extends { id?: string }>(key: string, item: T): void => {
  if (typeof window === 'undefined') return;
  const list = getItem<T>(key);
  
  // If item doesn't have an ID, generate a temporary one for the key
  const itemId = item.id || `temp-${Date.now()}`;
  
  const index = list.findIndex(i => i.id === item.id);
  if (index > -1 && item.id) {
    list[index] = item;
  } else {
    list.push(item);
  }
  
  // Update local UI state
  localStorage.setItem(key, JSON.stringify(list));
  
  // Background atomic cloud sync using a unique fragmented key
  supabase.from('app_state').upsert({ key: `${key}||${itemId}`, data: item }, { onConflict: 'key' })
    .then(({ error }) => {
       if (error) console.error("Cloud atomic sync error for", key, error);
    });
};

export const DB = {
  KEYS,
  init: initDB,
  getItem,
  setItem,
  updateItem,
  getTeams: () => getItem<Team>(KEYS.TEAMS),
  setTeams: (teams: Team[]) => setItem(KEYS.TEAMS, teams),
  
  getRounds: () => getItem<Round>(KEYS.ROUNDS),
  setRounds: (rounds: Round[]) => setItem(KEYS.ROUNDS, rounds),
  
  getClues: () => getItem<Clue>(KEYS.CLUES),
  setClues: (clues: Clue[]) => setItem(KEYS.CLUES, clues),
  
  getAssets: () => getItem<Asset>(KEYS.ASSETS),
  setAssets: (assets: Asset[]) => setItem(KEYS.ASSETS, assets),
  
  getActivityLogs: () => getItem<ActivityLog>(KEYS.ACTIVITY_LOGS),
  setActivityLogs: (logs: ActivityLog[]) => setItem(KEYS.ACTIVITY_LOGS, logs),
  
  getCreditTx: () => getItem<CreditTransaction>(KEYS.CREDIT_TX),
  setCreditTx: (txs: CreditTransaction[]) => setItem(KEYS.CREDIT_TX, txs),
  
  getNotifications: () => getItem<Notification>(KEYS.NOTIFICATIONS),
  setNotifications: (notifs: Notification[]) => setItem(KEYS.NOTIFICATIONS, notifs),
  
  getProctoringEvents: () => getItem<ProctoringEvent>(KEYS.PROCTORING_EVENTS),
  setProctoringEvents: (events: ProctoringEvent[]) => setItem(KEYS.PROCTORING_EVENTS, events),

  getSubmissions: () => getItem<RoundSubmission>(KEYS.SUBMISSIONS),
  setSubmissions: (subs: RoundSubmission[]) => setItem(KEYS.SUBMISSIONS, subs),

  getQuizSubmissions: () => getItem<QuizSubmission>(KEYS.QUIZ_SUBMISSIONS),
  setQuizSubmissions: (subs: QuizSubmission[]) => setItem(KEYS.QUIZ_SUBMISSIONS, subs),

  getGlobalSettings: () => {
    const settings = getItem<any>(KEYS.GLOBAL_SETTINGS);
    const defaults = { 
      tournamentEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      eventDate: "OCT 28 2026",
      venue: "INNOVATEX HQ",
      registrationUrl: "/register",
      rulesText: "Welcome to Delulu Hunt. Strategy and intellect are your best weapons.\n\n1. No unauthorized access.\n2. Do not share flags with other teams.\n3. The judges' decision is final."
    };
    return settings[0] || defaults;
  },
  setGlobalSettings: (settings: any) => setItem(KEYS.GLOBAL_SETTINGS, [settings]),
};
