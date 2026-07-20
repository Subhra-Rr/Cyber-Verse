/**
 * CyberVerse Learning Platform Type Definitions
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or structured explanation
  visualizationId?: string; // Links to interactive visuals
}

export type QuestionType = 'mcq' | 'matching' | 'fill-blank' | 'drag-drop';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Used for MCQ
  correctAnswer: string | string[]; // Can be string or array of correct order
  explanation: string;
  matchingPairs?: { left: string; right: string }[]; // For matching type
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface ExternalResource {
  title: string;
  platform: string;
  url: string;
  description: string;
  isFree: boolean;
  type: 'course' | 'sandbox' | 'certification' | 'tool';
}

export interface Module {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g., "45 mins"
  icon: string; // Lucide icon identifier
  lessons: Lesson[];
  quiz: Quiz;
  simulatorId?: string; // Direct link to primary simulator for this module
  tags: string[];
  externalResources?: ExternalResource[];
}

export interface Lab {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  vulnerabilityDescription: string;
  hints: string[];
  flag: string; // CTF Flag e.g., FLAG{...}
  points: number;
  completed?: boolean;
}

export interface UserProgress {
  completedLessons: string[]; // Lesson IDs
  completedQuizzes: string[]; // Module IDs
  completedLabs: string[]; // Lab IDs
  score: number;
  streak: number;
  lastActive: string; // YYYY-MM-DD
  bookmarks: string[]; // Module/Lab IDs
  favorites: string[]; // Module/Lab IDs
  achievements: string[]; // Achievement IDs
  activityLog: { [date: string]: number }; // Heatmap data: date string -> count
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'onboarding' | 'networking' | 'cryptography' | 'terminal' | 'ctf' | 'master';
}
