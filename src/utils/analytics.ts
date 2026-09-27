import { NOVEL_CHAPTERS } from '../data/chaptersData';

export interface ReadingAnalyticsData {
  totalSeconds: number;
  pagesReadCount: number;
  chapterViews: Record<number, number>; // chapter index -> view count
  chapterTimeSeconds: Record<number, number>; // chapter index -> seconds spent
  hotspotsTriggered: number;
  choicesMade: number;
  sessionStartDate: string;
  // Streak tracking fields
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  activeDates: string[];
  // Knowledge check quiz tracking
  quizScores?: Record<string, { score: number; total: number; percentage: number; completedAt: string; rankTitle: string }>;
  bestQuizScore?: number;
}

export const getTodayDateKey = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getPastDateKey = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

const generateDefaultActiveDates = (): string[] => {
  return [
    getPastDateKey(3),
    getPastDateKey(2),
    getPastDateKey(1),
    getTodayDateKey()
  ];
};

const STORAGE_KEY = 'kudua_reading_analytics';

// Initial default data providing realistic baseline telemetry
const DEFAULT_ANALYTICS: ReadingAnalyticsData = {
  totalSeconds: 420, // ~7 minutes
  pagesReadCount: 14,
  chapterViews: {
    0: 8,
    1: 6,
    2: 5,
    3: 4,
    4: 3
  },
  chapterTimeSeconds: {
    0: 130, // 2.1 mins
    1: 105, // 1.7 mins
    2: 85,  // 1.4 mins
    3: 60,  // 1.0 min
    4: 40   // 0.7 min
  },
  hotspotsTriggered: 12,
  choicesMade: 4,
  sessionStartDate: new Date().toISOString(),
  currentStreak: 4,
  bestStreak: 7,
  lastActiveDate: getTodayDateKey(),
  activeDates: generateDefaultActiveDates()
};

export const calculateStreak = (activeDates: string[] = []): { currentStreak: number; bestStreak: number } => {
  if (!activeDates || activeDates.length === 0) {
    return { currentStreak: 1, bestStreak: 1 };
  }

  const uniqueSortedDates = Array.from(new Set(activeDates)).sort();
  const today = getTodayDateKey();
  const yesterday = getPastDateKey(1);

  // Check if active today or yesterday for current streak
  const hasToday = uniqueSortedDates.includes(today);
  const hasYesterday = uniqueSortedDates.includes(yesterday);

  let currentStreak = 0;
  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? new Date(today) : new Date(yesterday);
    currentStreak = 1;

    while (true) {
      const prevDate = new Date(checkDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevKey = prevDate.toISOString().slice(0, 10);
      if (uniqueSortedDates.includes(prevKey)) {
        currentStreak++;
        checkDate = prevDate;
      } else {
        break;
      }
    }
  }

  // Calculate best all-time streak
  let bestStreak = Math.max(1, currentStreak);
  let tempStreak = 1;

  for (let i = 1; i < uniqueSortedDates.length; i++) {
    const prev = new Date(uniqueSortedDates[i - 1]);
    prev.setDate(prev.getDate() + 1);
    const expectedKey = prev.toISOString().slice(0, 10);

    if (uniqueSortedDates[i] === expectedKey) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 1;
    }
  }

  return { 
    currentStreak: Math.max(1, currentStreak), 
    bestStreak: Math.max(bestStreak, currentStreak, 1) 
  };
};

export const getStoredAnalytics = (): ReadingAnalyticsData => {
  if (typeof window === 'undefined') return DEFAULT_ANALYTICS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const activeDates = parsed.activeDates && Array.isArray(parsed.activeDates) && parsed.activeDates.length > 0
        ? parsed.activeDates
        : generateDefaultActiveDates();

      const { currentStreak, bestStreak } = calculateStreak(activeDates);

      return {
        ...DEFAULT_ANALYTICS,
        ...parsed,
        activeDates,
        currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : currentStreak,
        bestStreak: Math.max(parsed.bestStreak || 0, bestStreak, parsed.currentStreak || 0, 1),
        lastActiveDate: parsed.lastActiveDate || getTodayDateKey()
      };
    }
  } catch {
    // Fallback
  }
  return DEFAULT_ANALYTICS;
};

export const recordDayReadingActivity = (): ReadingAnalyticsData => {
  const current = getStoredAnalytics();
  const today = getTodayDateKey();
  const activeDates = Array.from(new Set([...(current.activeDates || []), today]));
  const { currentStreak, bestStreak } = calculateStreak(activeDates);

  const updated: ReadingAnalyticsData = {
    ...current,
    activeDates,
    currentStreak,
    bestStreak: Math.max(current.bestStreak || 0, bestStreak),
    lastActiveDate: today
  };

  saveStoredAnalytics(updated);
  return updated;
};

export const saveQuizScoreRecord = (
  quizId: string, 
  score: number, 
  total: number, 
  rankTitle: string
): ReadingAnalyticsData => {
  const current = getStoredAnalytics();
  const percentage = Math.round((score / Math.max(1, total)) * 100);
  const quizScores = {
    ...(current.quizScores || {}),
    [quizId]: {
      score,
      total,
      percentage,
      completedAt: new Date().toISOString(),
      rankTitle
    }
  };

  const allPercentages = Object.values(quizScores).map(q => q.percentage);
  const bestQuizScore = Math.max(...allPercentages, percentage);

  const updated: ReadingAnalyticsData = {
    ...current,
    quizScores,
    bestQuizScore
  };

  saveStoredAnalytics(updated);
  return updated;
};

export const saveStoredAnalytics = (data: ReadingAnalyticsData): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Fallback
  }
};

export const resetStoredAnalytics = (): ReadingAnalyticsData => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fallback
    }
  }
  return { ...DEFAULT_ANALYTICS };
};

const WEEKLY_GOAL_KEY = 'kudua_weekly_goal_minutes';

export const getStoredWeeklyGoal = (): number => {
  if (typeof window === 'undefined') return 30;
  try {
    const raw = localStorage.getItem(WEEKLY_GOAL_KEY);
    if (raw) {
      const val = parseInt(raw, 10);
      if (!isNaN(val) && val > 0) return val;
    }
  } catch {
    // Fallback
  }
  return 30;
};

export const saveStoredWeeklyGoal = (goalMinutes: number): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WEEKLY_GOAL_KEY, goalMinutes.toString());
  } catch {
    // Fallback
  }
};

export const countWordsInText = (text?: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export interface NovelWordMetrics {
  totalNovelWords: number;
  totalPanelsCount: number;
  avgWordsPerPanel: number;
  chapterWords: { chapterId: number; title: string; words: number }[];
}

export const getNovelWordMetrics = (): NovelWordMetrics => {
  let totalNovelWords = 0;
  let totalPanelsCount = 0;
  const chapterWords = NOVEL_CHAPTERS.map((ch) => {
    let chWords = 0;
    chWords += countWordsInText(ch.title);
    chWords += countWordsInText(ch.subtitle);
    chWords += countWordsInText(ch.theme);
    chWords += countWordsInText(ch.summary);
    totalPanelsCount += ch.panels.length;
    ch.panels.forEach((p) => {
      chWords += countWordsInText(p.title);
      chWords += countWordsInText(p.narrativeCaption);
      chWords += countWordsInText(p.ambientCondition);
      p.dialogue?.forEach((d) => {
        chWords += countWordsInText(d.speaker) + countWordsInText(d.text);
      });
      p.technicalCallouts?.forEach((c) => {
        chWords += countWordsInText(c.label) + countWordsInText(c.spec) + countWordsInText(c.detail);
      });
      if (p.quote) chWords += countWordsInText(p.quote);
      if (p.annotation) chWords += countWordsInText(p.annotation);
      p.hotspots?.forEach((h) => {
        chWords += countWordsInText(h.title) + countWordsInText(h.detail);
      });
      if (p.branchingChoice) {
        chWords += countWordsInText(p.branchingChoice.prompt);
        p.branchingChoice.options.forEach((o) => {
          chWords += countWordsInText(o.label) + countWordsInText(o.description) + countWordsInText(o.consequenceText);
        });
      }
    });
    totalNovelWords += chWords;
    return { chapterId: ch.id, title: ch.title, words: chWords };
  });

  const avgWordsPerPanel = Math.round(totalNovelWords / Math.max(1, totalPanelsCount));
  return { totalNovelWords, totalPanelsCount, avgWordsPerPanel, chapterWords };
};

export interface ReadingScheduleConfig {
  isEnabled: boolean;
  time: string; // "HH:MM", e.g. "19:30"
  label: string; // Shift or custom label
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  durationMinutes: number; // e.g. 15
  notificationType: 'browser' | 'in_app' | 'both';
  soundEnabled: boolean;
  lastNotifiedDate?: string; // YYYY-MM-DD
}

export interface SchedulePreset {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  ancillaryEquip: string;
  iconName: string;
  accentColor: string;
}

export const BLAST_FURNACE_SCHEDULE_PRESETS: SchedulePreset[] = [
  {
    id: 'stockhouse-morning',
    time: '08:00',
    title: 'Morning Stock House & Stoves Shift',
    subtitle: 'Preheat hot blast stoves to 1200°C and prime your mind for the day.',
    ancillaryEquip: 'Hot Blast Stoves & Stock House',
    iconName: 'Sun',
    accentColor: '#f59e0b'
  },
  {
    id: 'bustle-pci-midday',
    time: '13:00',
    title: 'Midday Bustle Pipe & PCI Run',
    subtitle: 'Pulverized coal injection at peak combustion efficiency for a quick chapter read.',
    ancillaryEquip: 'PCI System & Bustle Pipe Tuyeres',
    iconName: 'Flame',
    accentColor: '#06b6d4'
  },
  {
    id: 'torpedo-evening',
    time: '19:30',
    title: 'Evening Torpedo Car & Slag Tap',
    subtitle: 'Taphole discharge into submarine ladles. Wind down with high-temperature lore.',
    ancillaryEquip: 'Torpedo Car & Slag Granulation',
    iconName: 'Activity',
    accentColor: '#f97316'
  },
  {
    id: 'trt-night-vault',
    time: '22:00',
    title: 'Night TRT Turbine & Quiet Hours',
    subtitle: 'Top-pressure recovery turbine running silent. Evening reading reflection.',
    ancillaryEquip: 'Top-Pressure Recovery Turbine (TRT)',
    iconName: 'Moon',
    accentColor: '#8b5cf6'
  }
];

export const DEFAULT_SCHEDULE: ReadingScheduleConfig = {
  isEnabled: true,
  time: '19:30',
  label: 'Evening Torpedo Car & Slag Tap',
  daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Every day
  durationMinutes: 15,
  notificationType: 'both',
  soundEnabled: true,
};

const SCHEDULE_STORAGE_KEY = 'kudua_reading_schedule';

export const getStoredSchedule = (): ReadingScheduleConfig => {
  if (typeof window === 'undefined') return DEFAULT_SCHEDULE;
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SCHEDULE, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SCHEDULE;
};

export const saveStoredSchedule = (config: ReadingScheduleConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(config));
  } catch {}
};

export const requestBrowserNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
};

export const triggerReadingNotification = (
  title: string, 
  body: string, 
  icon?: string
): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'kudua-reading-reminder',
      });
      return true;
    } catch (e) {
      console.warn('Failed to dispatch notification:', e);
      return false;
    }
  }
  return false;
};


