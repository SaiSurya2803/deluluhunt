import { Team, Round, Clue, Asset, QuizQuestion } from '@/types';

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Team Alpha',
    email: 'alpha@innovatex.com',
    password: 'password123',
    members: [
      { id: 'm-1-1', name: 'Alice', role: 'TEAM_LEADER' },
      { id: 'm-1-2', name: 'Bob', role: 'MEMBER_2' },
    ],
    credits: 50,
    score: 920,
    roundsCompleted: 5,
    quizStatus: 'COMPLETED',
    quizScore: 85,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-2',
    name: 'Team Nova',
    email: 'nova@innovatex.com',
    password: 'password123',
    members: [
      { id: 'm-2-1', name: 'Charlie', role: 'TEAM_LEADER' },
    ],
    credits: 40,
    score: 870,
    roundsCompleted: 4,
    quizStatus: 'PENDING',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-3',
    name: 'Team Phoenix',
    email: 'phoenix@innovatex.com',
    password: 'password123',
    members: [
      { id: 'm-3-1', name: 'Diana', role: 'TEAM_LEADER' },
      { id: 'm-3-2', name: 'Eve', role: 'MEMBER_2' },
      { id: 'm-3-3', name: 'Frank', role: 'MEMBER_3' },
      { id: 'm-3-4', name: 'Grace', role: 'MEMBER_4' },
    ],
    credits: 20,
    score: 820,
    roundsCompleted: 4,
    quizStatus: 'ACTIVE',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockRounds: Round[] = [
  {
    id: 'r1',
    roundNumber: 1,
    title: 'Fix The Code',
    description: 'Teams get code with mistakes in it and must find and correct them to make it run properly. A friendly warm-up round for all years.',
    objective: 'Find and fix all syntax and logic errors to output the correct result.',
    rules: ['Code must compile without errors', 'Final output must match the exact expected format'],
    timeLimit: 50,
    maxScore: 100,
    status: 'UNLOCKED',
  },
  {
    id: 'r2',
    roundNumber: 2,
    title: 'Crack The Message',
    description: 'Teams receive a message written in a simple code (letters swapped, numbers standing for letters, etc.) and must decode it to find their next step.',
    objective: 'Successfully decrypt the secret message.',
    rules: ['Only standard decryption methods are allowed', 'Submit the exact decoded string'],
    timeLimit: 50,
    maxScore: 100,
    status: 'LOCKED',
  },
  {
    id: 'r3',
    roundNumber: 3,
    title: 'Build Something Small',
    description: 'Teams are given a small spec — e.g. "build a working login form" — and must build a basic working version in a short window. Judged on function, not looks.',
    objective: 'Build a functional prototype matching the specification.',
    rules: ['Functionality over design', 'Must meet all basic criteria in the spec'],
    timeLimit: 70,
    maxScore: 150,
    status: 'LOCKED',
  },
  {
    id: 'r4',
    roundNumber: 4,
    title: 'Use AI The Smart Way',
    description: 'Teams must use an AI tool correctly to reach a target result — fixing a bad question, or solving a small data problem. Tests smart AI use, not just raw coding.',
    objective: 'Prompt engineer or utilize AI to solve the given scenario.',
    rules: ['Include your prompt history in the submission', 'Target result must be perfectly accurate'],
    timeLimit: 50,
    maxScore: 150,
    status: 'LOCKED',
  },
  {
    id: 'r5',
    roundNumber: 5,
    title: 'Find The Hidden Clue',
    description: 'A safe, practice website or file has something hidden inside it. Teams must find it — the "beginner cybersecurity" round, always a crowd favourite.',
    objective: 'Locate the hidden flag within the provided asset.',
    rules: ['Do not use disruptive scanning tools', 'Submit the exact flag string'],
    timeLimit: 70,
    maxScore: 200,
    status: 'LOCKED',
  },
  {
    id: 'r6',
    roundNumber: 6,
    title: 'Final Challenge',
    description: 'Teams get a real-world problem statement, quickly sketch or build a basic solution, and pitch it to judges in two minutes. The big finish.',
    objective: 'Create a minimum viable solution and pitch it.',
    rules: ['2 minute strict pitch limit', 'Solution must address the core problem'],
    timeLimit: 90,
    maxScore: 300,
    status: 'LOCKED',
  }
];

export const mockClues: Clue[] = [
  { id: 'c1', roundId: 'r1', content: 'Check line 42 for a missing semicolon, and review the loop condition.', cost: 10, isUnlocked: false, isFree: false },
  { id: 'c2', roundId: 'r2', content: 'This looks like a Caesar cipher with a shift of +5.', cost: 10, isUnlocked: false, isFree: false },
  { id: 'c3', roundId: 'r3', content: 'Focus on the form validation logic first, CSS can wait.', cost: 15, isUnlocked: false, isFree: false },
  { id: 'c4', roundId: 'r4', content: 'Try asking the AI to act as a strict data parser.', cost: 15, isUnlocked: false, isFree: false },
  { id: 'c5', roundId: 'r5', content: 'Inspect the source code of the webpage, specifically hidden input fields.', cost: 20, isUnlocked: false, isFree: false },
  { id: 'c6', roundId: 'r6', content: 'Focus your pitch on the scalability of your approach.', cost: 20, isUnlocked: false, isFree: false },
];

export const mockAssets: Asset[] = [];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q-1',
    text: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctOptionIndex: 2,
  },
  {
    id: 'q-2',
    text: 'Which HTTP status code represents a "Not Found" error?',
    options: ['200', '401', '403', '404'],
    correctOptionIndex: 3,
  },
  {
    id: 'q-3',
    text: 'In Docker, what command is used to list all running containers?',
    options: ['docker ps', 'docker run', 'docker list', 'docker containers'],
    correctOptionIndex: 0,
  },
  // Add more as needed
];
