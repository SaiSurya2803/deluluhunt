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
};

// Initialize DB and sync from Supabase
export const initDB = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Fetch latest global state from Supabase app_state table
    const { data, error } = await supabase.from('app_state').select('*');
    
    if (!error && data && data.length > 0) {
      // Overwrite local storage with the cloud truth
      data.forEach(row => {
        localStorage.setItem(row.key, JSON.stringify(row.data));
      });
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

export const DB = {
  KEYS,
  init: initDB,
  getItem,
  setItem,
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
};
