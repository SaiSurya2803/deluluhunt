export type Role = 'ADMIN' | 'TEAM_LEADER' | 'MEMBER_2' | 'MEMBER_3' | 'MEMBER_4';

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
}

export interface Team {
  id: string;
  name: string;
  email: string;
  password?: string;
  members: TeamMember[];
  credits: number;
  score: number;
  roundsCompleted: number;
  quizStatus: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  quizScore?: number;
  quizTrustScore?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Round {
  id: string;
  roundNumber: number;
  title: string;
  description: string;
  objective: string;
  rules: string[];
  timeLimit?: number; // in minutes
  maxScore: number;
  status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface Clue {
  id: string;
  roundId: string;
  content: string;
  cost: number;
  isUnlocked: boolean;
  isFree: boolean;
}

export interface Asset {
  id: string;
  roundId: string;
  name: string;
  type: 'PDF' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'DATASET' | 'LINK';
  url: string;
  description?: string;
  isLocked: boolean;
}

export interface ActivityLog {
  id: string;
  teamId: string;
  memberId?: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface CreditTransaction {
  id: string;
  teamId: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  timestamp: string;
  roundId?: string;
}

export interface Notification {
  id: string;
  teamId: string | 'ALL';
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  timer?: number; // Time to answer this specific question in seconds
  points?: number; // Points awarded for this question
}

export interface ProctoringEvent {
  id: string;
  teamId: string;
  memberId: string;
  event: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
  status: 'UNREVIEWED' | 'REVIEWED' | 'FLAGGED';
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  score: number;
  roundsCompleted: number;
  quizScore: number;
  creditsUsed: number;
  completionTime: number; // total time in seconds
}

export interface RoundSubmission {
  id: string;
  teamId: string;
  roundId: string;
  answer: string;
  submittedAt: string;
  score?: number; // Admin assigns this
  status: 'PENDING_REVIEW' | 'GRADED';
}

export interface QuizSubmission {
  id: string;
  teamId: string;
  answers: Record<string, number>;
  timeTaken: Record<string, number>;
  submittedAt: string;
  totalScore: number;
}
