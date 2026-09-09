import { Team, Round, Clue, Asset, QuizQuestion, ActivityLog, CreditTransaction, Notification, ProctoringEvent, RoundSubmission, QuizSubmission } from '@/types';
import { mockTeams, mockRounds, mockClues, mockAssets, mockQuizQuestions } from '@/lib/mockData';

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

// Initialize DB if empty
export const initDB = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(KEYS.TEAMS)) {
    localStorage.setItem(KEYS.TEAMS, JSON.stringify(mockTeams));
  }
  if (!localStorage.getItem(KEYS.ROUNDS)) {
    localStorage.setItem(KEYS.ROUNDS, JSON.stringify(mockRounds));
  }
  if (!localStorage.getItem(KEYS.CLUES)) {
    localStorage.setItem(KEYS.CLUES, JSON.stringify(mockClues));
  }
  if (!localStorage.getItem(KEYS.ASSETS)) {
    localStorage.setItem(KEYS.ASSETS, JSON.stringify(mockAssets));
  }
  if (!localStorage.getItem(KEYS.QUIZ_QUESTIONS)) {
    localStorage.setItem(KEYS.QUIZ_QUESTIONS, JSON.stringify(mockQuizQuestions));
  }
  if (!localStorage.getItem(KEYS.ACTIVITY_LOGS)) {
    localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.CREDIT_TX)) {
    localStorage.setItem(KEYS.CREDIT_TX, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.PROCTORING_EVENTS)) {
    localStorage.setItem(KEYS.PROCTORING_EVENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.QUIZ_SUBMISSIONS)) {
    localStorage.setItem(KEYS.QUIZ_SUBMISSIONS, JSON.stringify([]));
  }
};

// Generic read/write operations
export const getItem = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setItem = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
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
