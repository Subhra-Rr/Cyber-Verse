import { useState, useEffect } from 'react';
import { UserProgress, Achievement } from '../types';

const STORAGE_KEY = 'cyberverse_progress';

const initialProgress: UserProgress = {
  completedLessons: [],
  completedQuizzes: [],
  completedLabs: [],
  score: 0,
  streak: 0,
  lastActive: '',
  bookmarks: [],
  favorites: [],
  achievements: [],
  activityLog: {}
};

export const defaultAchievements: Achievement[] = [
  { id: 'first_steps', title: 'First Steps', description: 'Log in to CyberVerse for the first time.', icon: 'Flag', category: 'onboarding' },
  { id: 'net_master', title: 'Packet Sniffer', description: 'Complete the Networking and Packet Analysis module.', icon: 'Network', category: 'networking' },
  { id: 'crypto_cracker', title: 'Code Cracker', description: 'Complete the Cryptography and Encryption module.', icon: 'ShieldAlert', category: 'cryptography' },
  { id: 'linux_sysadmin', title: 'Terminal Wizard', description: 'Complete the Linux Fundamentals module.', icon: 'Terminal', category: 'terminal' },
  { id: 'first_flag', title: 'Captured First Flag', description: 'Successfully solve your first Interactive Lab challenge.', icon: 'Trophy', category: 'ctf' },
  { id: 'cyber_hero', title: 'Master Defensive Guard', description: 'Earn a total score of 500+ points on the platform.', icon: 'Sparkles', category: 'master' }
];

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all keys exist
        setProgress({
          ...initialProgress,
          ...parsed,
          activityLog: parsed.activityLog || {}
        });
      } catch (e) {
        setProgress(initialProgress);
      }
    } else {
      // First login onboarding achievements
      const today = new Date().toISOString().split('T')[0];
      const starterProgress: UserProgress = {
        ...initialProgress,
        achievements: ['first_steps'],
        lastActive: today,
        streak: 1,
        activityLog: { [today]: 1 }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starterProgress));
      setProgress(starterProgress);
    }
  }, []);

  const saveProgress = (updated: UserProgress) => {
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Mark lesson as complete
  const completeLesson = (lessonId: string) => {
    if (progress.completedLessons.includes(lessonId)) return;
    const today = new Date().toISOString().split('T')[0];
    const activity = { ...progress.activityLog };
    activity[today] = (activity[today] || 0) + 1;

    const updated = {
      ...progress,
      completedLessons: [...progress.completedLessons, lessonId],
      score: progress.score + 10,
      activityLog: activity
    };

    // Check score achievement
    checkAchievements(updated);
  };

  // Mark quiz as complete
  const completeQuiz = (moduleId: string) => {
    if (progress.completedQuizzes.includes(moduleId)) return;
    const today = new Date().toISOString().split('T')[0];
    const activity = { ...progress.activityLog };
    activity[today] = (activity[today] || 0) + 1;

    const updated = {
      ...progress,
      completedQuizzes: [...progress.completedQuizzes, moduleId],
      score: progress.score + 40,
      activityLog: activity
    };

    // Module completion check for specific achievements
    if (moduleId === 'networking') updated.achievements = Array.from(new Set([...updated.achievements, 'net_master']));
    if (moduleId === 'cryptography') updated.achievements = Array.from(new Set([...updated.achievements, 'crypto_cracker']));
    if (moduleId === 'linux') updated.achievements = Array.from(new Set([...updated.achievements, 'linux_sysadmin']));

    checkAchievements(updated);
  };

  // Mark lab as complete
  const completeLab = (labId: string, points: number) => {
    if (progress.completedLabs.includes(labId)) return;
    const today = new Date().toISOString().split('T')[0];
    const activity = { ...progress.activityLog };
    activity[today] = (activity[today] || 0) + 1;

    const updated = {
      ...progress,
      completedLabs: [...progress.completedLabs, labId],
      score: progress.score + points,
      activityLog: activity
    };

    // Achievements for labs
    updated.achievements = Array.from(new Set([...updated.achievements, 'first_flag']));

    checkAchievements(updated);
  };

  const toggleBookmark = (id: string) => {
    const isBookmarked = progress.bookmarks.includes(id);
    const updated = {
      ...progress,
      bookmarks: isBookmarked
        ? progress.bookmarks.filter((b) => b !== id)
        : [...progress.bookmarks, id]
    };
    saveProgress(updated);
  };

  const checkAchievements = (current: UserProgress) => {
    const achievements = [...current.achievements];
    if (current.score >= 500 && !achievements.includes('cyber_hero')) {
      achievements.push('cyber_hero');
    }
    saveProgress({
      ...current,
      achievements
    });
  };

  return {
    progress,
    completeLesson,
    completeQuiz,
    completeLab,
    toggleBookmark,
    achievementsList: defaultAchievements.map((ach) => ({
      ...ach,
      unlockedAt: progress.achievements.includes(ach.id) ? 'Unlocked' : undefined
    }))
  };
}
