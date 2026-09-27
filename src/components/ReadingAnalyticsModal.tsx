import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, 
  RadialBarChart, RadialBar, PolarAngleAxis 
} from 'recharts';
import { 
  Clock, Gauge, Flame, BookOpen, X, RotateCcw, 
  Sparkles, Award, TrendingUp, ShieldCheck,
  Target, Trophy, Sliders, CheckCircle2,
  Lock, Medal, Cpu, Calculator, Zap, Timer, HelpCircle,
  Download, FileJson, Check,
  Quote, Shuffle, Copy, ChevronLeft, ChevronRight,
  Calendar, ChevronDown, ChevronUp, Wind, Activity,
  GraduationCap, AlertCircle, RefreshCw,
  Bell, BellOff, BellRing, Sun, Moon
} from 'lucide-react';
import { 
  ReadingAnalyticsData, 
  getStoredAnalytics, 
  resetStoredAnalytics,
  getStoredWeeklyGoal,
  saveStoredWeeklyGoal,
  getNovelWordMetrics,
  getTodayDateKey,
  getPastDateKey,
  recordDayReadingActivity,
  saveQuizScoreRecord,
  ReadingScheduleConfig,
  SchedulePreset,
  BLAST_FURNACE_SCHEDULE_PRESETS,
  getStoredSchedule,
  saveStoredSchedule,
  requestBrowserNotificationPermission,
  triggerReadingNotification
} from '../utils/analytics';
import { NOVEL_CHAPTERS } from '../data/chaptersData';
import { LORE_QUOTES, getDailyQuote } from '../data/loreQuotes';
import { METALLURGY_QUIZ_CATEGORIES, QuizCategory, QuizQuestion, getQuizRankTitle } from '../data/quizData';
import { sound } from '../utils/audio';

interface ReadingAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  analyticsData?: ReadingAnalyticsData;
  onResetAnalytics?: () => void;
}

const DOMAIN_COLORS = ['#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#ef4444'];

export const ReadingAnalyticsModal: React.FC<ReadingAnalyticsModalProps> = ({
  isOpen,
  onClose,
  analyticsData: propData,
  onResetAnalytics
}) => {
  const [data, setData] = useState<ReadingAnalyticsData>(propData || getStoredAnalytics());
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState<number>(getStoredWeeklyGoal());
  const [milestoneFilter, setMilestoneFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const [showShaftSchematic, setShowShaftSchematic] = useState(false);

  // Quotes of the Day State
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(() => {
    const daily = getDailyQuote();
    const idx = LORE_QUOTES.findIndex(q => q.id === daily.id);
    return idx >= 0 ? idx : 0;
  });
  const [isQuoteCopied, setIsQuoteCopied] = useState(false);

  // Knowledge Check Quiz State
  const [activeQuizCategory, setActiveQuizCategory] = useState<QuizCategory | null>(null);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number>(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizUserAnswers, setQuizUserAnswers] = useState<Record<string, string>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Reading Schedule & Notifications State
  const [schedule, setSchedule] = useState<ReadingScheduleConfig>(getStoredSchedule());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [testNotificationFeedback, setTestNotificationFeedback] = useState<string | null>(null);
  const [showAncillaryBlueprint, setShowAncillaryBlueprint] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const refreshed = recordDayReadingActivity();
      setData(propData ? { ...propData, currentStreak: refreshed.currentStreak, bestStreak: refreshed.bestStreak, activeDates: refreshed.activeDates } : refreshed);
      setWeeklyGoalMinutes(getStoredWeeklyGoal());
      setSchedule(getStoredSchedule());
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
      // Refresh daily quote on open
      const daily = getDailyQuote();
      const idx = LORE_QUOTES.findIndex(q => q.id === daily.id);
      if (idx >= 0) setCurrentQuoteIndex(idx);
    }
  }, [isOpen, propData]);

  // Schedule Reminder Monitoring Interval
  useEffect(() => {
    if (!schedule.isEnabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentDay = now.getDay();
      if (!schedule.daysOfWeek.includes(currentDay)) return;

      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().slice(0, 10);

      if (currentTimeStr === schedule.time && schedule.lastNotifiedDate !== todayDateStr) {
        if (schedule.notificationType === 'browser' || schedule.notificationType === 'both') {
          triggerReadingNotification(
            '🔥 Tata InnoVerse: Scheduled Reading Shift!',
            `Time for your ${schedule.label} (${schedule.durationMinutes} mins). Keep your blast furnace streak blazing!`
          );
        }
        if (schedule.soundEnabled) {
          sound.playClank();
        }
        const updated: ReadingScheduleConfig = { ...schedule, lastNotifiedDate: todayDateStr };
        setSchedule(updated);
        saveStoredSchedule(updated);
      }
    };

    const interval = setInterval(checkReminder, 15000);
    return () => clearInterval(interval);
  }, [schedule]);

  if (!isOpen) return null;

  // Streak Tracking Metrics
  const currentStreak = typeof data.currentStreak === 'number' ? data.currentStreak : 4;
  const bestStreak = Math.max(typeof data.bestStreak === 'number' ? data.bestStreak : 7, currentStreak);
  const todayKey = getTodayDateKey();
  const isActiveToday = (data.activeDates || []).includes(todayKey);

  // Generate 7-day rolling window for visual day tracker
  const rollingDays = Array.from({ length: 7 }).map((_, i) => {
    const daysAgo = 6 - i;
    const dateKey = getPastDateKey(daysAgo);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const isToday = daysAgo === 0;
    const isActive = (data.activeDates || []).includes(dateKey) || (isToday && isActiveToday);
    return {
      dateKey,
      dayName,
      dayNum,
      isToday,
      isActive
    };
  });

  const getStreakFlameTier = (streakDays: number) => {
    if (streakDays >= 14) {
      return {
        title: 'Crucible Eternal',
        subtitle: '14+ Days Blast Master',
        desc: 'Continuous operational mastery. The hearth burns with unbreakable thermodynamic power.',
        color: 'text-amber-300',
        badgeBg: 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20',
        borderCol: 'border-amber-400',
        flameIntensity: 'animate-pulse text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]'
      };
    } else if (streakDays >= 6) {
      return {
        title: '1450°C Molten Core',
        subtitle: '6-13 Days Molten Stream',
        desc: 'Furnace hearth fully tapped. Molten iron torrents flow without interruption.',
        color: 'text-orange-400',
        badgeBg: 'bg-orange-950/60',
        borderCol: 'border-orange-500/50',
        flameIntensity: 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]'
      };
    } else if (streakDays >= 3) {
      return {
        title: 'Tuyere Blast Flame',
        subtitle: '3-5 Days Continuous Hot Blast',
        desc: '1200°C preheated air blast active across all hearth tuyeres.',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-950/60',
        borderCol: 'border-amber-500/50',
        flameIntensity: 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
      };
    } else {
      return {
        title: 'Spark Ignition',
        subtitle: '1-2 Days Hearth Kindle',
        desc: 'Hearth heating up. Return tomorrow to build your blast furnace streak!',
        color: 'text-yellow-400',
        badgeBg: 'bg-yellow-950/40',
        borderCol: 'border-yellow-600/40',
        flameIntensity: 'text-yellow-400'
      };
    }
  };

  const streakTier = getStreakFlameTier(currentStreak);

  // Format Total Seconds to readable string
  const totalMins = Math.floor(data.totalSeconds / 60);
  const totalSecs = data.totalSeconds % 60;
  const formattedTime = totalMins > 0 
    ? `${totalMins}m ${totalSecs}s` 
    : `${totalSecs}s`;

  // Weekly Goal calculations
  const actualMinutes = Number((data.totalSeconds / 60).toFixed(1));
  const goalProgressPercent = Math.min(100, Math.round((actualMinutes / Math.max(1, weeklyGoalMinutes)) * 100));
  const isGoalReached = actualMinutes >= weeklyGoalMinutes;
  const remainingMinutes = Math.max(0, Number((weeklyGoalMinutes - actualMinutes).toFixed(1)));

  const circularProgressData = [
    {
      name: 'Weekly Reading Goal',
      value: goalProgressPercent,
      fill: isGoalReached ? '#10b981' : '#f59e0b',
    }
  ];

  const handleUpdateGoal = (mins: number) => {
    sound.playClank();
    const clamped = Math.max(5, Math.min(600, mins));
    setWeeklyGoalMinutes(clamped);
    saveStoredWeeklyGoal(clamped);
  };

  // Dynamic Novel Word Count & Real-Time WPM Calculations
  const wordMetrics = getNovelWordMetrics();
  const totalNovelWords = wordMetrics.totalNovelWords;
  const avgWordsPerPanel = wordMetrics.avgWordsPerPanel;

  // Real-time estimated words read by the reader based on novel corpus structure
  const estimatedWordsRead = Math.min(totalNovelWords, Math.max(1, Math.round(data.pagesReadCount * avgWordsPerPanel)));
  const readingTimeMinutes = Math.max(0.2, data.totalSeconds / 60);
  const realTimeWpm = Math.max(1, Math.round(estimatedWordsRead / readingTimeMinutes));
  const averageWpm = realTimeWpm;
  const pagesPerMin = ((data.pagesReadCount / readingTimeMinutes)).toFixed(1);
  const novelReadPercent = Math.min(100, Math.round((estimatedWordsRead / Math.max(1, totalNovelWords)) * 100));

  // Time remaining to complete the entire graphic novel at current reading pace
  const remainingNovelWords = Math.max(0, totalNovelWords - estimatedWordsRead);
  const estimatedMinutesRemaining = Math.max(0.1, Number((remainingNovelWords / Math.max(1, realTimeWpm)).toFixed(1)));
  const totalFinishTimeMinutes = Number((totalNovelWords / Math.max(1, realTimeWpm)).toFixed(1));

  // Interactive Target WPM Simulator State
  const [calculatorTargetWpm, setCalculatorTargetWpm] = useState<number>(200);
  const simulatedTotalFinishMinutes = Number((totalNovelWords / Math.max(1, calculatorTargetWpm)).toFixed(1));
  const simulatedActMinutes = Number(((totalNovelWords / 5) / Math.max(1, calculatorTargetWpm)).toFixed(1));
  const simulatedPanelSeconds = Math.round((avgWordsPerPanel / Math.max(1, calculatorTargetWpm)) * 60);
  const velocityDeltaPercent = Math.round(((realTimeWpm - calculatorTargetWpm) / Math.max(1, calculatorTargetWpm)) * 100);

  // Efficiency Tier Evaluation based on reader's real-time velocity
  const getEfficiencyTier = (wpm: number) => {
    if (wpm < 130) {
      return {
        name: 'Deep Technical Analysis',
        level: 'Meticulous Cadence',
        score: 'Thorough',
        description: 'Deep engagement with thermodynamic formulas, ceramic microstructure specs, and CAD tolerances.',
        badgeCol: 'bg-sky-950/70 text-sky-300 border-sky-500/40',
        accentCol: 'text-sky-400',
        barCol: 'bg-sky-500',
        recommendation: 'Exceptional technical focus for engineering research and metallurgical blueprints.'
      };
    } else if (wpm <= 200) {
      return {
        name: 'Optimal Narrative & Technical Immersion',
        level: 'Gold Standard Pace',
        score: 'Optimal',
        description: 'Harmonious balance between narrative dialogue, dramatic scene immersion, and engineering comprehension.',
        badgeCol: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
        accentCol: 'text-emerald-400',
        barCol: 'bg-emerald-500',
        recommendation: 'Ideal reading speed for experiencing the full graphic novel without missing crucial details.'
      };
    } else if (wpm <= 280) {
      return {
        name: 'High-Efficiency Operational Reading',
        level: 'Accelerated Velocity',
        score: 'High Efficiency',
        description: 'Rapid cognitive assimilation of tactical choices, runner hazards, and autonomous robot directives.',
        badgeCol: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
        accentCol: 'text-amber-400',
        barCol: 'bg-amber-500',
        recommendation: 'Strong operational review speed for fast situational awareness and decision verification.'
      };
    } else {
      return {
        name: 'Rapid Tactical Reconnaissance',
        level: 'Maximum Scan Velocity',
        score: 'Rapid Recon',
        description: 'High-velocity page scanning, immediate hotspot location, and quick reference review.',
        badgeCol: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
        accentCol: 'text-purple-400',
        barCol: 'bg-purple-500',
        recommendation: 'Optimized for quick schematic lookup and chapter referencing.'
      };
    }
  };

  const currentEfficiency = getEfficiencyTier(realTimeWpm);

  // Identify Most Viewed Chapter
  let mostViewedIndex = 0;
  let maxViews = -1;
  Object.entries(data.chapterViews).forEach(([idx, views]) => {
    if (views > maxViews) {
      maxViews = views;
      mostViewedIndex = Number(idx);
    }
  });

  const mostViewedChapter = NOVEL_CHAPTERS[mostViewedIndex] || NOVEL_CHAPTERS[0];

  // Recharts Data Prep: Chapter Time Breakdown (Bar Chart)
  const chapterBarData = NOVEL_CHAPTERS.map((ch, idx) => {
    const seconds = data.chapterTimeSeconds[idx] || 0;
    const views = data.chapterViews[idx] || 0;
    return {
      act: `Act ${ch.id}`,
      name: ch.title.split(' ')[0],
      minutes: Number((seconds / 60).toFixed(1)),
      seconds,
      views
    };
  });

  // Recharts Data Prep: Technical Focus Domain Share (Pie Chart)
  const domainShareData = [
    { name: '1450°C Furnace Hazards', value: data.chapterTimeSeconds[0] || 45 },
    { name: 'Vajra-lepa & Kudua Stack', value: data.chapterTimeSeconds[1] || 40 },
    { name: 'Gantry Kinematics', value: data.chapterTimeSeconds[2] || 35 },
    { name: 'Subterranean BESS', value: data.chapterTimeSeconds[3] || 30 },
    { name: 'Cybernetic Telemetry', value: data.chapterTimeSeconds[4] || 25 }
  ];

  // Recharts Data Prep: Cumulative Reading Velocity Trend (Area Chart)
  const velocityData = [
    { page: 'Pg 1', words: Math.round(averageWpm * 0.4), speed: averageWpm - 15 },
    { page: 'Pg 3', words: Math.round(averageWpm * 1.1), speed: averageWpm - 5 },
    { page: 'Pg 6', words: Math.round(averageWpm * 2.2), speed: averageWpm + 10 },
    { page: 'Pg 9', words: Math.round(averageWpm * 3.4), speed: averageWpm + 8 },
    { page: 'Pg 12', words: Math.round(averageWpm * 4.6), speed: averageWpm + 18 },
    { page: 'Current', words: estimatedWordsRead, speed: averageWpm }
  ];

  // Number of chapters explored or studied
  const chaptersExploredCount = NOVEL_CHAPTERS.filter((_, idx) => (data.chapterViews[idx] || 0) > 0 || (data.chapterTimeSeconds[idx] || 0) >= 15).length;

  interface MilestoneItem {
    id: string;
    title: string;
    description: string;
    requirement: string;
    progressPercent: number;
    progressText: string;
    isUnlocked: boolean;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    icon: React.ReactNode;
    tierColor: string;
    badgeBg: string;
    borderCol: string;
  }

  const milestones: MilestoneItem[] = [
    {
      id: 'm1',
      title: 'Metallurgy Novice',
      description: 'Initiate your operational study through the 1450°C blast furnace runner hazard.',
      requirement: 'Read for 1+ minute or complete 1 Act',
      progressPercent: Math.min(100, Math.round(Math.max((actualMinutes / 1) * 100, (chaptersExploredCount / 1) * 100))),
      progressText: actualMinutes >= 1 || chaptersExploredCount >= 1 ? '100%' : `${Math.round(actualMinutes * 60)}s / 60s`,
      isUnlocked: actualMinutes >= 1 || chaptersExploredCount >= 1,
      tier: 'bronze',
      icon: <BookOpen className="w-5 h-5 text-amber-500" />,
      tierColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/40',
      borderCol: 'border-amber-600/40',
    },
    {
      id: 'm2',
      title: 'Runner Field Scout',
      description: 'Actively navigate pages and investigate critical metallurgical hotspots.',
      requirement: 'Turn 5+ pages or inspect 2+ hotspots',
      progressPercent: Math.min(100, Math.round(Math.max((data.pagesReadCount / 5) * 100, (data.hotspotsTriggered / 2) * 100))),
      progressText: `${Math.max(data.pagesReadCount, data.hotspotsTriggered * 2.5)} / 5 pts`,
      isUnlocked: data.pagesReadCount >= 5 || data.hotspotsTriggered >= 2,
      tier: 'bronze',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      tierColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/30',
      borderCol: 'border-amber-500/40',
    },
    {
      id: 'm3',
      title: 'Vajra-Lepa Scholar',
      description: 'Synthesize 3,000-year-old Bhartiya metallurgical wisdom with high-temperature ceramic robotics.',
      requirement: 'Explore 3+ Acts & read for 4+ minutes',
      progressPercent: Math.min(100, Math.round(((Math.min(3, chaptersExploredCount) / 3) * 0.5 + (Math.min(4, actualMinutes) / 4) * 0.5) * 100)),
      progressText: `${chaptersExploredCount}/3 Acts · ${actualMinutes}/4m`,
      isUnlocked: chaptersExploredCount >= 3 && actualMinutes >= 4,
      tier: 'silver',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      tierColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-950/40',
      borderCol: 'border-cyan-500/40',
    },
    {
      id: 'm4',
      title: 'Blast Furnace Expert',
      description: 'Master full cast house operational cycle, gantry kinematics, and automated lance immersion.',
      requirement: 'Complete all 5 Acts & read for 10+ minutes',
      progressPercent: Math.min(100, Math.round(((Math.min(5, chaptersExploredCount) / 5) * 0.5 + (Math.min(10, actualMinutes) / 10) * 0.5) * 100)),
      progressText: `${chaptersExploredCount}/5 Acts · ${actualMinutes}/10m`,
      isUnlocked: chaptersExploredCount >= 5 && actualMinutes >= 10,
      tier: 'gold',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      tierColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/50',
      borderCol: 'border-amber-400/60',
    },
    {
      id: 'm5',
      title: 'Autonomous Systems Master',
      description: 'Execute tactical command decisions and inspect deep engineering telemetry.',
      requirement: 'Make 2+ narrative choices & trigger 6+ hotspots',
      progressPercent: Math.min(100, Math.round(((Math.min(2, data.choicesMade) / 2) * 0.5 + (Math.min(6, data.hotspotsTriggered) / 6) * 0.5) * 100)),
      progressText: `${data.choicesMade}/2 choices · ${data.hotspotsTriggered}/6 spots`,
      isUnlocked: data.choicesMade >= 2 && data.hotspotsTriggered >= 6,
      tier: 'gold',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      tierColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/40',
      borderCol: 'border-emerald-500/40',
    },
    {
      id: 'm6',
      title: 'Grand Metallurgist & Innovator',
      description: 'Attain the pinnacle of zero-harm blast furnace automation in the Tata InnoVerse chronicle.',
      requirement: 'Accumulate 20+ reading minutes & complete all 5 Acts',
      progressPercent: Math.min(100, Math.round(((Math.min(20, actualMinutes) / 20) * 0.5 + (Math.min(5, chaptersExploredCount) / 5) * 0.5) * 100)),
      progressText: `${actualMinutes}/20m · ${chaptersExploredCount}/5 Acts`,
      isUnlocked: actualMinutes >= 20 && chaptersExploredCount >= 5,
      tier: 'platinum',
      icon: <Trophy className="w-5 h-5 text-amber-300" />,
      tierColor: 'text-amber-300',
      badgeBg: 'bg-gradient-to-br from-amber-950/60 via-purple-950/30 to-stone-900',
      borderCol: 'border-amber-400',
    },
  ];

  const unlockedCount = milestones.filter(m => m.isUnlocked).length;
  const filteredMilestones = milestones.filter(m => {
    if (milestoneFilter === 'unlocked') return m.isUnlocked;
    if (milestoneFilter === 'locked') return !m.isUnlocked;
    return true;
  });

  const handleReset = () => {
    sound.playPneumaticHiss();
    const fresh = resetStoredAnalytics();
    setData(fresh);
    if (onResetAnalytics) onResetAnalytics();
  };

  const handleExportChronicle = () => {
    sound.playPneumaticHiss();

    // Retrieve user-written panel annotations if present
    let userAnnotations: Record<string, any> = {};
    if (typeof window !== 'undefined') {
      try {
        const rawNotes = localStorage.getItem('kudua_panel_annotations');
        if (rawNotes) userAnnotations = JSON.parse(rawNotes);
      } catch {
        // Fallback
      }
    }

    const exportPayload = {
      app: 'KUDUA: The 1450°C Autonomous Crucible',
      subhead: 'A Graphic Engineering Novel of Blast Furnace Robotics & Ancient Metallurgy',
      exportTimestamp: Date.now(),
      exportDate: new Date().toISOString(),
      sessionStartDate: data.sessionStartDate,
      readingSummary: {
        totalReadingTimeSeconds: data.totalSeconds,
        formattedReadingTime: formattedTime,
        activeReadingMinutes: actualMinutes,
        pagesReadCount: data.pagesReadCount,
        wordsReadCount: estimatedWordsRead,
        totalNovelWords: totalNovelWords,
        novelCompletionPercentage: novelReadPercent,
        measuredVelocityWpm: realTimeWpm,
        readingEfficiencyRating: currentEfficiency.name,
        readingEfficiencyLevel: currentEfficiency.level,
        readingEfficiencyDescription: currentEfficiency.description,
        hotspotsInspected: data.hotspotsTriggered,
        narrativeChoicesExecuted: data.choicesMade,
        weeklyGoalTargetMinutes: weeklyGoalMinutes,
        weeklyGoalProgressPercent: goalProgressPercent,
        isWeeklyGoalAchieved: isGoalReached,
      },
      milestonesSummary: {
        unlockedCount,
        totalMilestones: milestones.length,
        badges: milestones.map((m) => ({
          id: m.id,
          title: m.title,
          tier: m.tier,
          requirement: m.requirement,
          isUnlocked: m.isUnlocked,
          progressText: m.progressText,
          description: m.description,
        })),
      },
      chapterTelemetry: NOVEL_CHAPTERS.map((ch, idx) => ({
        chapterId: ch.id,
        act: ch.act,
        title: ch.title,
        secondsSpent: data.chapterTimeSeconds[idx] || 0,
        minutesSpent: Number(((data.chapterTimeSeconds[idx] || 0) / 60).toFixed(1)),
        viewCount: data.chapterViews[idx] || 0,
        panelsInChapter: ch.panels.length,
        wordsInChapter: wordMetrics.chapterWords[idx]?.words || 0,
      })),
      userPanelAnnotations: {
        notesCount: Object.keys(userAnnotations).length,
        notes: userAnnotations,
      },
      readingStreak: {
        currentStreakDays: currentStreak,
        bestStreakRecordDays: bestStreak,
        flameThermalTier: streakTier.title,
        isActiveToday,
        lastActiveDate: data.lastActiveDate,
        totalActiveDaysLogged: data.activeDates?.length || 1,
      },
      quoteOfTheDay: LORE_QUOTES[currentQuoteIndex] || LORE_QUOTES[0],
      knowledgeCheckTelemetry: {
        completedQuizzesCount: Object.keys(data.quizScores || {}).length,
        bestQuizScorePercentage: data.bestQuizScore || 0,
        quizScores: data.quizScores || {},
      },
      readingSchedule: {
        isEnabled: schedule.isEnabled,
        time: schedule.time,
        label: schedule.label,
        durationMinutes: schedule.durationMinutes,
        daysOfWeek: schedule.daysOfWeek,
        notificationPermission,
        notificationType: schedule.notificationType,
      },
      rawTelemetry: data,
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.download = `kudua-chronicle-stats-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExportSuccess(true);
    setTimeout(() => setIsExportSuccess(false), 3500);
  };

  const activeQuote = LORE_QUOTES[currentQuoteIndex] || LORE_QUOTES[0];

  const handleRandomQuote = () => {
    sound.playClank();
    let nextIdx = Math.floor(Math.random() * LORE_QUOTES.length);
    if (nextIdx === currentQuoteIndex && LORE_QUOTES.length > 1) {
      nextIdx = (nextIdx + 1) % LORE_QUOTES.length;
    }
    setCurrentQuoteIndex(nextIdx);
  };

  const handleNextQuote = () => {
    sound.playPageFlip();
    setCurrentQuoteIndex((prev) => (prev + 1) % LORE_QUOTES.length);
  };

  const handlePrevQuote = () => {
    sound.playPageFlip();
    setCurrentQuoteIndex((prev) => (prev - 1 + LORE_QUOTES.length) % LORE_QUOTES.length);
  };

  const handleCopyQuote = () => {
    sound.playPneumaticHiss();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`"${activeQuote.quote}" — ${activeQuote.speaker} (${activeQuote.role}, ${activeQuote.actReference})`);
    }
    setIsQuoteCopied(true);
    setTimeout(() => setIsQuoteCopied(false), 2500);
  };

  // Knowledge Check Quiz Handlers
  const handleStartQuiz = (category: QuizCategory) => {
    sound.playClank();
    setActiveQuizCategory(category);
    setCurrentQuizQuestionIndex(0);
    setSelectedAnswerId(null);
    setIsAnswerSubmitted(false);
    setQuizUserAnswers({});
    setIsQuizCompleted(false);
  };

  const handleSelectAnswer = (optionId: string) => {
    if (isAnswerSubmitted) return;
    sound.playPageFlip();
    setSelectedAnswerId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswerId || !activeQuizCategory) return;
    const currentQ = activeQuizCategory.questions[currentQuizQuestionIndex];
    const isCorrect = selectedAnswerId === currentQ.correctAnswerId;
    if (isCorrect) {
      sound.playClank();
    } else {
      sound.playPneumaticHiss();
    }
    setIsAnswerSubmitted(true);
    setQuizUserAnswers(prev => ({ ...prev, [currentQ.id]: selectedAnswerId }));
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuizCategory) return;
    sound.playPageFlip();
    if (currentQuizQuestionIndex + 1 < activeQuizCategory.questions.length) {
      setCurrentQuizQuestionIndex(prev => prev + 1);
      setSelectedAnswerId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate score and complete
      let correctCount = 0;
      activeQuizCategory.questions.forEach(q => {
        const userChoice = quizUserAnswers[q.id] || (q.id === activeQuizCategory.questions[currentQuizQuestionIndex].id ? selectedAnswerId : null);
        if (userChoice === q.correctAnswerId) correctCount++;
      });
      const pct = Math.round((correctCount / activeQuizCategory.questions.length) * 100);
      const rankInfo = getQuizRankTitle(pct);

      const updated = saveQuizScoreRecord(activeQuizCategory.id, correctCount, activeQuizCategory.questions.length, rankInfo.rank);
      setData(updated);
      setIsQuizCompleted(true);
      if (pct >= 75) sound.playClank();
    }
  };

  const handleExitQuiz = () => {
    sound.playPageFlip();
    setActiveQuizCategory(null);
    setIsQuizCompleted(false);
  };

  // Reading Schedule Handlers
  const handleRequestNotificationPermission = async () => {
    sound.playClank();
    const perm = await requestBrowserNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      triggerReadingNotification(
        '🔥 Notifications Enabled: Tata InnoVerse Reminders',
        'Hot blast stoves preheated to 1200°C! You will receive daily reading reminders at your scheduled shift.'
      );
      setTestNotificationFeedback('Browser notifications granted! Test alert dispatched.');
      setTimeout(() => setTestNotificationFeedback(null), 3500);
    } else if (perm === 'denied') {
      setTestNotificationFeedback('Browser notifications blocked in settings. In-app alerts remain active.');
      setTimeout(() => setTestNotificationFeedback(null), 4000);
    }
  };

  const handleTestNotification = () => {
    sound.playPneumaticHiss();
    const success = triggerReadingNotification(
      '🔥 Scheduled Reading Alert: ' + schedule.label,
      `Your scheduled ${schedule.durationMinutes}-minute reading session is starting! Hot blast stoves at 1200°C.`
    );
    if (schedule.soundEnabled) sound.playClank();

    if (success) {
      setTestNotificationFeedback('Browser push notification sent!');
    } else {
      setTestNotificationFeedback('Alert triggered in-app (Browser permission: ' + notificationPermission + ')');
    }
    setTimeout(() => setTestNotificationFeedback(null), 3500);
  };

  const handleUpdateSchedule = (updates: Partial<ReadingScheduleConfig>) => {
    sound.playPageFlip();
    const updated = { ...schedule, ...updates };
    setSchedule(updated);
    saveStoredSchedule(updated);
  };

  const handleSelectPreset = (preset: SchedulePreset) => {
    sound.playClank();
    handleUpdateSchedule({
      time: preset.time,
      label: preset.title,
    });
  };

  const handleToggleDay = (dayIndex: number) => {
    sound.playPageFlip();
    const exists = schedule.daysOfWeek.includes(dayIndex);
    let newDays: number[];
    if (exists) {
      if (schedule.daysOfWeek.length === 1) return; // Keep at least one day
      newDays = schedule.daysOfWeek.filter((d) => d !== dayIndex);
    } else {
      newDays = [...schedule.daysOfWeek, dayIndex].sort();
    }
    handleUpdateSchedule({ daysOfWeek: newDays });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-stone-950 border-2 border-stone-800 rounded-2xl shadow-2xl p-5 sm:p-8 flex flex-col gap-6 my-auto max-h-[92vh] overflow-y-auto relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold tracking-widest">
              <TrendingUp className="w-4 h-4" />
              <span>READER METRICS & TELEMETRY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-epic text-stone-100 mt-1">
              Engineering Reading Analytics
            </h2>
            <p className="text-xs sm:text-sm font-body text-stone-400 mt-0.5">
              Live engagement analytics, velocity tracking, and technical chapter focus across the Kudua graphic novel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChronicle}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm ${
                isExportSuccess
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-300 hover:text-amber-400 hover:border-amber-500/50'
              }`}
              title="Export personal reading chronicle & stats as JSON"
            >
              {isExportSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>Chronicle Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Export Stats (JSON)</span>
                  <span className="sm:hidden">Export</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Core Telemetry Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total Reading Time */}
          <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono mb-2">
              <span>Total Reading Time</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {formattedTime}
            </span>
            <span className="text-[11px] font-body text-stone-500 mt-1">
              Active novel immersion
            </span>
          </div>

          {/* Real-Time Reading Velocity */}
          <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono mb-2">
              <span>Real-Time Velocity</span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                {realTimeWpm}
              </span>
              <span className="text-xs font-mono text-stone-400">WPM</span>
            </div>
            <span className="text-[11px] font-body text-stone-500 mt-1">
              {estimatedWordsRead.toLocaleString()} / {totalNovelWords.toLocaleString()} words ({novelReadPercent}%)
            </span>
          </div>

          {/* Reading Streak Card */}
          <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono mb-2">
              <span>Reading Streak</span>
              <Flame className={`w-4 h-4 ${streakTier.flameIntensity}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-orange-400 tabular-nums">
                {currentStreak}
              </span>
              <span className="text-xs font-mono text-stone-400">Days</span>
            </div>
            <span className="text-[11px] font-body text-stone-400 truncate mt-1 flex items-center justify-between">
              <span>Best: <strong className="text-amber-400 font-mono font-bold">{bestStreak}d</strong></span>
              <span className={`font-mono text-[10px] font-bold ${streakTier.color}`}>{streakTier.title}</span>
            </span>
          </div>

          {/* Pages Explored & Interactions */}
          <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono mb-2">
              <span>Interactions</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {data.hotspotsTriggered}
            </span>
            <span className="text-[11px] font-body text-stone-500 mt-1">
              {data.pagesReadCount} pages flipped · {data.choicesMade} decisions
            </span>
          </div>
        </div>

        {/* Reading Streak Tracker & Thermal Consistency Card */}
        <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border-2 border-stone-800 flex flex-col gap-5 relative overflow-hidden">
          {/* Subtle Ambient Background Glow matching flame */}
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Flame className={`w-5 h-5 ${streakTier.flameIntensity}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold font-comic text-stone-100">
                    Reading Streak & Blast Furnace Thermal Consistency
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-bold ${streakTier.badgeBg} ${streakTier.color} ${streakTier.borderCol} flex items-center gap-1`}>
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>{streakTier.title}</span>
                  </span>
                </div>
                <p className="text-xs font-body text-stone-400">
                  Daily immersion prevents hearth freezing—unbroken streaks reflect continuous metallurgical discipline.
                </p>
              </div>
            </div>

            {/* Blueprint Explainer Toggle */}
            <button
              onClick={() => {
                sound.playClank();
                setShowShaftSchematic(prev => !prev);
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors self-stretch sm:self-auto justify-center"
              title="Explore Shaft Furnace & Condenser Engineering Anatomy"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>{showShaftSchematic ? 'Hide Furnace Anatomy' : 'Shaft Furnace Anatomy'}</span>
              {showShaftSchematic ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Main Streak Stats & 7-Day Rolling Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
            {/* Left: Streak Stat Badges (5 cols) */}
            <div className="md:col-span-5 flex items-center gap-4 p-4 bg-stone-950/80 rounded-xl border border-stone-800">
              <div className="flex flex-col items-center justify-center p-3 bg-stone-900/90 rounded-xl border border-stone-800/80 min-w-[90px] text-center">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Current</span>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-3xl font-bold font-mono text-orange-400 tabular-nums">
                    {currentStreak}
                  </span>
                  <span className="text-xs font-mono text-stone-400">Days</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Active Today</span>
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>All-Time Best: <strong className="text-amber-400 font-bold font-mono">{bestStreak} Days</strong></span>
                </div>
                <p className="text-xs font-body text-stone-300">
                  {streakTier.desc}
                </p>
                <span className="text-[10px] font-mono text-stone-500">
                  Tier: <strong className={streakTier.color}>{streakTier.subtitle}</strong>
                </span>
              </div>
            </div>

            {/* Right: 7-Day Rolling Calendar Strip (7 cols) */}
            <div className="md:col-span-7 flex flex-col gap-2 p-4 bg-stone-950/80 rounded-xl border border-stone-800">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>7-Day Furnace Combustion Tracker</span>
                </span>
                <span className="text-[10px] text-stone-500">
                  {currentStreak >= 7 ? '7/7 Complete 🔥' : `${currentStreak} of 7 Days Active`}
                </span>
              </div>

              {/* Day Capsules Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {rollingDays.map((day) => (
                  <div
                    key={day.dateKey}
                    className={`flex flex-col items-center justify-between py-2 px-1 rounded-lg border text-center transition-all ${
                      day.isToday
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/10'
                        : day.isActive
                        ? 'bg-stone-900/90 border-orange-500/30'
                        : 'bg-stone-950/60 border-stone-800/80 opacity-60'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-stone-400 uppercase">
                      {day.dayName}
                    </span>
                    <span className={`text-xs font-mono font-bold my-1 ${
                      day.isToday ? 'text-amber-300' : 'text-stone-300'
                    }`}>
                      {day.dayNum}
                    </span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {day.isActive ? (
                        <Flame className={`w-4 h-4 ${day.isToday ? 'text-amber-400 animate-pulse' : 'text-orange-400'}`} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                      )}
                    </div>
                    {day.isToday && (
                      <span className="text-[8px] font-mono uppercase bg-amber-500 text-black font-bold px-1 rounded-sm mt-0.5">
                        Today
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expandable Technical Blast Furnace Shaft & Condenser Anatomy (from schematic) */}
          {showShaftSchematic && (
            <div className="p-4 sm:p-5 bg-stone-950/95 rounded-xl border border-amber-500/30 flex flex-col gap-4 relative z-10 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold font-comic text-stone-100">
                    Technical Blueprint: Shaft Furnace & Lead-Splash Condenser Cycle
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 border border-stone-800 text-amber-400">
                  Imperial Smelting Process (ISP) Telemetry
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-amber-400 font-bold text-[11px] uppercase">1. Charge Hoppers</span>
                  <p className="text-[11px] font-body text-stone-300">
                    Double-bell charge hoppers and bucket feed coke & sinter from above while maintaining continuous gas seals against furnace backpressures.
                  </p>
                </div>

                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-cyan-400 font-bold text-[11px] uppercase">2. Preheater & Tuyeres</span>
                  <p className="text-[11px] font-body text-stone-300">
                    Centrifugal blowers force high-volume air through preheaters into the hot blast main, feeding 1100°C–1250°C blast nozzles into the combustion raceway.
                  </p>
                </div>

                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-orange-400 font-bold text-[11px] uppercase">3. Hearth Taphole & Slag</span>
                  <p className="text-[11px] font-body text-stone-300">
                    Molten metal and slag tap continuously from the hearth bottom at 1450°C into slag dumps and transfer ladles to prevent lethal hearth solidification.
                  </p>
                </div>

                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-emerald-400 font-bold text-[11px] uppercase">4. Lead-Splash Condenser</span>
                  <p className="text-[11px] font-body text-stone-300">
                    High-speed rotors spin in liquid lead to shock-cool volatile metal vapors out of the off-gas stream before sending gases to the washing tower.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-body text-stone-300 flex items-start gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-300 font-comic">The Metallurgical Continuity Principle:</strong> A blast furnace shaft can never pause its thermal cycle; letting the hearth freeze requires months of catastrophic jackhammering. Maintaining your unbroken daily reading streak guarantees complete mastery without cognitive stagnation!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reading Schedule & Blast Furnace Shift Reminders */}
        <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border-2 border-stone-800 flex flex-col gap-5 relative overflow-hidden">
          {/* Subtle Ambient Background Highlight */}
          <div className="absolute -left-10 -bottom-10 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <BellRing className={`w-5 h-5 ${schedule.isEnabled ? 'animate-bounce text-amber-400' : 'text-stone-500'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold font-comic text-stone-100">
                    Reading Schedule & Daily Shift Reminders
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-bold flex items-center gap-1 ${
                    schedule.isEnabled
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                      : 'bg-stone-950 text-stone-500 border-stone-800'
                  }`}>
                    {schedule.isEnabled ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Schedule Active</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-3 h-3" />
                        <span>Reminders Paused</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs font-body text-stone-400">
                  Configure scheduled reading alerts with browser push notifications to keep your streak burning.
                </p>
              </div>
            </div>

            {/* Quick Actions & Master Toggle */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <button
                onClick={() => {
                  sound.playClank();
                  setShowAncillaryBlueprint(prev => !prev);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="View Blast Furnace Ancillary Equipment Schematics"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{showAncillaryBlueprint ? 'Hide Ancillary Cycles' : 'Ancillary Cycles'}</span>
                {showAncillaryBlueprint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleUpdateSchedule({ isEnabled: !schedule.isEnabled })}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  schedule.isEnabled
                    ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-400 shadow-md'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                {schedule.isEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                <span>{schedule.isEnabled ? 'Alerts ON' : 'Alerts OFF'}</span>
              </button>
            </div>
          </div>

          {/* Test Notification Feedback Toast */}
          {testNotificationFeedback && (
            <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/60 text-xs font-mono text-amber-200 flex items-center justify-between animate-in fade-in duration-150 relative z-10">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{testNotificationFeedback}</span>
              </div>
              <button
                onClick={() => setTestNotificationFeedback(null)}
                className="p-1 text-amber-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
            {/* Left: Schedule Configuration Form (6 cols) */}
            <div className="lg:col-span-6 p-4 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-mono uppercase text-stone-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scheduled Reading Window</span>
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  {schedule.durationMinutes} min session
                </span>
              </div>

              {/* Time Picker and Shift Label */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5 flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-stone-400">
                    Daily Alert Time
                  </label>
                  <input
                    type="time"
                    value={schedule.time}
                    onChange={(e) => handleUpdateSchedule({ time: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-base font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-7 flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-stone-400">
                    Shift Designation / Label
                  </label>
                  <input
                    type="text"
                    value={schedule.label}
                    onChange={(e) => handleUpdateSchedule({ label: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs font-body text-stone-200 focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Evening Torpedo Car Shift"
                  />
                </div>
              </div>

              {/* Day of Week Selector */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase text-stone-400">
                    Repeat Days of Week
                  </label>
                  <span className="text-[10px] font-mono text-stone-500">
                    {schedule.daysOfWeek.length === 7 ? 'Every Day' : `${schedule.daysOfWeek.length} days / week`}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
                    const isSelected = schedule.daysOfWeek.includes(idx);
                    return (
                      <button
                        key={dayName}
                        onClick={() => handleToggleDay(idx)}
                        className={`py-1.5 rounded-lg border text-center font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                            : 'bg-stone-900/60 text-stone-500 border-stone-800 hover:text-stone-300'
                        }`}
                        title={`Toggle ${dayName}`}
                      >
                        {dayName.slice(0, 1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Duration Selector */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[10px] font-mono uppercase text-stone-400">
                  Target Immersion Time
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[10, 15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleUpdateSchedule({ durationMinutes: mins })}
                      className={`py-1 rounded-lg border text-center font-mono text-xs transition-all ${
                        schedule.durationMinutes === mins
                          ? 'bg-stone-800 text-cyan-300 border-cyan-500/50 font-bold'
                          : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Browser Permission & Test Action Strip */}
              <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {notificationPermission === 'granted' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Push Enabled</span>
                    </span>
                  ) : notificationPermission === 'denied' ? (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Push Blocked in Browser</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleRequestNotificationPermission}
                      className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                    >
                      <Bell className="w-3 h-3 text-amber-400" />
                      <span>Allow Browser Push</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleTestNotification}
                  className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                  title="Test notification alert immediately"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Test Alert</span>
                </button>
              </div>
            </div>

            {/* Right: Blast Furnace Shift Presets (6 cols) */}
            <div className="lg:col-span-6 p-4 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-mono uppercase text-stone-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ancillary Shift Presets</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  Tap to Apply
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BLAST_FURNACE_SCHEDULE_PRESETS.map((preset) => {
                  const isCurrent = schedule.time === preset.time;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 select-none group ${
                        isCurrent
                          ? 'bg-stone-900 border-amber-500/80 shadow-md shadow-amber-500/10'
                          : 'bg-stone-900/50 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {preset.time}
                          </span>
                          <span 
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold border"
                            style={{
                              backgroundColor: `${preset.accentColor}18`,
                              borderColor: `${preset.accentColor}40`,
                              color: preset.accentColor
                            }}
                          >
                            {preset.ancillaryEquip.split('&')[0]}
                          </span>
                        </div>

                        <h5 className="font-comic font-bold text-xs text-stone-200 group-hover:text-amber-400 transition-colors">
                          {preset.title}
                        </h5>
                        <p className="text-[11px] font-body text-stone-400 mt-0.5 leading-snug line-clamp-2">
                          {preset.subtitle}
                        </p>
                      </div>

                      <div className="pt-1 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-stone-500">Preset Slot</span>
                        <span className={`font-bold ${isCurrent ? 'text-amber-400' : 'text-stone-400 group-hover:text-stone-200'}`}>
                          {isCurrent ? 'Active Setting' : 'Select →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] font-body text-stone-500 italic pt-1">
                Tip: Browser notifications will fire automatically when your scheduled shift arrives while your device or tab is open.
              </p>
            </div>
          </div>

          {/* Expandable Ancillary Equipment Technical Guide (from uploaded schematic) */}
          {showAncillaryBlueprint && (
            <div className="p-4 sm:p-5 bg-stone-950/95 rounded-xl border border-cyan-500/30 flex flex-col gap-4 relative z-10 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold font-comic text-stone-100">
                    Ancillary Operations Blueprint: Blast Furnace Integrated Plant Cycle
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 border border-stone-800 text-cyan-400">
                  Tata InnoVerse Plant Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-amber-400 font-bold text-[11px] uppercase">1. Stock House & Stoves</span>
                  <p className="text-[11px] font-body text-stone-300">
                    Weighs coke, sinter, and iron ore; hot blast stoves cycle combustion and blast phases to sustain continuous 1200°C air injection.
                  </p>
                </div>

                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-cyan-400 font-bold text-[11px] uppercase">2. PCI & Bustle Pipe</span>
                  <p className="text-[11px] font-body text-stone-300">
                    Pulverized coal injection reduces coke consumption by 30%, while the circular bustle pipe ensures uniform hot blast to all hearth tuyeres.
                  </p>
                </div>

                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-orange-400 font-bold text-[11px] uppercase">3. Torpedo Car & Slag</span>
                  <p className="text-[11px] font-body text-stone-300">
                    Heavy refractory submarine torpedo ladles ferry 1450°C iron to converters, while molten slag is water-quenched into high-strength cement.
                  </p>
                </div>

                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <span className="text-emerald-400 font-bold text-[11px] uppercase">4. TRT Power Recovery</span>
                  <p className="text-[11px] font-body text-stone-300">
                    Top-pressure recovery turbines (TRT) and Venturi scrubbers clean dirty off-gas and generate clean electricity from furnace backpressure.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-body text-stone-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-cyan-300 font-comic">The Scheduled Cycle Principle:</strong> Blast furnace ancillary systems run on meticulous cyclic shifts—stoves must reverse precisely on schedule, and torpedo cars must align with taphole timings. Maintaining a scheduled reading routine creates the same uninterrupted engineering momentum!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* WPM Calculator & Real-Time Reading Efficiency Card */}
        <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border-2 border-stone-800 flex flex-col gap-6 relative overflow-hidden">
          {/* Subtle Ambient Background Highlight */}
          <div className="absolute -left-10 -top-10 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold font-comic text-stone-100">
                    Real-Time Reading Efficiency & WPM Calculator
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold hidden md:inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>Live Corpus Analysis</span>
                  </span>
                </div>
                <p className="text-xs font-body text-stone-400">
                  Calculates real-time reading velocity from active time, total novel words ({totalNovelWords.toLocaleString()} words), and estimated absorption.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-stone-950 border border-stone-800 text-stone-300">
                Corpus: <strong className="text-amber-400 font-bold">{totalNovelWords.toLocaleString()}</strong> words
              </span>
            </div>
          </div>

          {/* Two-Column Grid: Left (Real-Time Telemetry & Gauge) | Right (Interactive Simulator) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            {/* Left Column: Live Reading Efficiency Gauge (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-stone-400 font-semibold tracking-wider">
                      Measured Reading Cadence:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border font-bold ${currentEfficiency.badgeCol}`}>
                      {currentEfficiency.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">
                    Rating: <span className="text-stone-300 font-semibold">{currentEfficiency.level}</span>
                  </span>
                </div>

                {/* Big WPM Readout & Summary */}
                <div className="flex items-baseline gap-3 my-1">
                  <span className={`text-4xl sm:text-5xl font-bold font-mono tabular-nums ${currentEfficiency.accentCol}`}>
                    {realTimeWpm}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-mono font-bold text-stone-300 uppercase tracking-wider">Words Per Minute</span>
                    <span className="text-xs font-body text-stone-500">
                      Based on {estimatedWordsRead.toLocaleString()} words absorbed over {formattedTime}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-body text-stone-300 leading-relaxed italic bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                  "{currentEfficiency.description}"
                </p>

                {/* Visual Reading Velocity Spectrum Gauge */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>Reading Velocity Spectrum</span>
                    <span className={`font-bold ${currentEfficiency.accentCol}`}>{realTimeWpm} WPM</span>
                  </div>

                  {/* 4 Spectrum Zones */}
                  <div className="grid grid-cols-4 gap-1.5 h-3">
                    <div 
                      className={`rounded-l-sm transition-all ${
                        realTimeWpm < 130 
                          ? 'bg-sky-500 shadow-md shadow-sky-500/40' 
                          : 'bg-stone-800 opacity-60'
                      }`} 
                      title="Deep Technical Analysis (< 130 WPM)"
                    />
                    <div 
                      className={`transition-all ${
                        realTimeWpm >= 130 && realTimeWpm <= 200 
                          ? 'bg-emerald-500 shadow-md shadow-emerald-500/40' 
                          : 'bg-stone-800 opacity-60'
                      }`} 
                      title="Optimal Immersion (130 - 200 WPM)"
                    />
                    <div 
                      className={`transition-all ${
                        realTimeWpm > 200 && realTimeWpm <= 280 
                          ? 'bg-amber-500 shadow-md shadow-amber-500/40' 
                          : 'bg-stone-800 opacity-60'
                      }`} 
                      title="High Efficiency (201 - 280 WPM)"
                    />
                    <div 
                      className={`rounded-r-sm transition-all ${
                        realTimeWpm > 280 
                          ? 'bg-purple-500 shadow-md shadow-purple-500/40' 
                          : 'bg-stone-800 opacity-60'
                      }`} 
                      title="Rapid Reconnaissance (> 280 WPM)"
                    />
                  </div>

                  <div className="grid grid-cols-4 text-[10px] font-mono text-stone-500 pt-0.5">
                    <span className="truncate">&lt; 130 Deep</span>
                    <span className="text-center truncate">130-200 Optimal</span>
                    <span className="text-center truncate">201-280 High</span>
                    <span className="text-right truncate">&gt; 280 Recon</span>
                  </div>
                </div>
              </div>

              {/* 4 Micro Telemetry KPI Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 flex flex-col">
                  <span className="text-stone-500 text-[10px] uppercase">Words Absorbed</span>
                  <span className="text-stone-200 font-bold text-sm mt-0.5 tabular-nums">
                    {estimatedWordsRead.toLocaleString()}
                  </span>
                  <span className="text-stone-500 text-[10px]">{novelReadPercent}% of corpus</span>
                </div>

                <div className="p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 flex flex-col">
                  <span className="text-stone-500 text-[10px] uppercase">Remaining Words</span>
                  <span className="text-amber-400 font-bold text-sm mt-0.5 tabular-nums">
                    {remainingNovelWords.toLocaleString()}
                  </span>
                  <span className="text-stone-500 text-[10px]">{100 - novelReadPercent}% to read</span>
                </div>

                <div className="p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 flex flex-col">
                  <span className="text-stone-500 text-[10px] uppercase">Est. Time Left</span>
                  <span className="text-cyan-400 font-bold text-sm mt-0.5 tabular-nums">
                    {estimatedMinutesRemaining}m
                  </span>
                  <span className="text-stone-500 text-[10px]">at current pace</span>
                </div>

                <div className="p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 flex flex-col">
                  <span className="text-stone-500 text-[10px] uppercase">Full Novel Finish</span>
                  <span className="text-emerald-400 font-bold text-sm mt-0.5 tabular-nums">
                    {totalFinishTimeMinutes}m
                  </span>
                  <span className="text-stone-500 text-[10px]">complete read</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Velocity & Finish-Time Simulator (5 cols) */}
            <div className="lg:col-span-5 p-4 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-800">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Velocity Simulator</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                    {calculatorTargetWpm} WPM
                  </span>
                </div>

                {/* Slider Control */}
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>Simulated Speed:</span>
                    <span className="text-amber-300 font-bold tabular-nums">{calculatorTargetWpm} WPM</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="360"
                    step="10"
                    value={calculatorTargetWpm}
                    onChange={(e) => {
                      setCalculatorTargetWpm(parseInt(e.target.value, 10));
                    }}
                    className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-stone-600">
                    <span>80 WPM</span>
                    <span>180 WPM</span>
                    <span>270 WPM</span>
                    <span>360 WPM</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {[
                    { label: 'Deep', wpm: 120 },
                    { label: 'Optimal', wpm: 180 },
                    { label: 'Fast', wpm: 240 },
                    { label: 'Recon', wpm: 300 }
                  ].map((preset) => (
                    <button
                      key={preset.wpm}
                      onClick={() => {
                        sound.playClank();
                        setCalculatorTargetWpm(preset.wpm);
                      }}
                      className={`py-1 px-1.5 rounded text-[11px] font-mono border transition-all truncate text-center ${
                        calculatorTargetWpm === preset.wpm
                          ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                          : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700 hover:text-white'
                      }`}
                    >
                      {preset.wpm} ({preset.label})
                    </button>
                  ))}
                </div>

                {/* Calculation Outputs */}
                <div className="flex flex-col gap-2 bg-stone-900/70 p-3 rounded-lg border border-stone-800/80 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Full Novel Finish Time:</span>
                    <span className="font-bold text-amber-400 tabular-nums">
                      ~{simulatedTotalFinishMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Avg Time Per Act (5 Acts):</span>
                    <span className="font-bold text-stone-200 tabular-nums">
                      ~{simulatedActMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Avg Time Per Panel Spread:</span>
                    <span className="font-bold text-stone-200 tabular-nums">
                      ~{simulatedPanelSeconds} sec
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison with Reader's Actual Velocity */}
              <div className="p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 text-[11px] font-mono flex items-center justify-between">
                <span className="text-stone-400">Pace Comparison:</span>
                <span className={`font-bold tabular-nums ${
                  velocityDeltaPercent > 0 
                    ? 'text-cyan-400' 
                    : velocityDeltaPercent < 0 
                    ? 'text-amber-400' 
                    : 'text-emerald-400'
                }`}>
                  {velocityDeltaPercent > 0 
                    ? `+${velocityDeltaPercent}% faster than live pace` 
                    : velocityDeltaPercent < 0 
                    ? `${velocityDeltaPercent}% slower than live pace` 
                    : 'Matches your exact live velocity'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border-2 border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Ambient Background Highlight */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Recharts Circular Progress Indicator */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="72%"
                  outerRadius="100%"
                  barSize={12}
                  data={circularProgressData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: '#292524' }}
                    dataKey="value"
                    cornerRadius={8}
                  />
                </RadialBarChart>
              </ResponsiveContainer>

              {/* Centered Percentage & Progress Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
                <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
                  isGoalReached ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {goalProgressPercent}%
                </span>
                <span className="text-[10px] font-mono text-stone-400 mt-0.5">
                  {actualMinutes}m / {weeklyGoalMinutes}m
                </span>
              </div>
            </div>

            {/* Middle: Goal Info & Progress Context */}
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                  Weekly Reading Goal
                </span>
                {isGoalReached && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 flex items-center gap-1 font-semibold">
                    <Trophy className="w-3 h-3 text-emerald-400" />
                    <span>Goal Met!</span>
                  </span>
                )}
              </div>

              <h4 className="text-lg font-bold font-comic text-stone-100">
                {isGoalReached 
                  ? 'Target Achieved! 🏆' 
                  : `${remainingMinutes} minutes remaining this week`}
              </h4>

              <p className="text-xs font-body text-stone-400 max-w-sm">
                {isGoalReached 
                  ? 'Outstanding metallurgical study discipline! You have exceeded your weekly reading target.'
                  : `You have completed ${actualMinutes} minutes out of your ${weeklyGoalMinutes}-minute weekly target.`}
              </p>

              {/* Status Bar */}
              <div className="w-full bg-stone-950 rounded-full h-2 mt-1 border border-stone-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    isGoalReached ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                  }`}
                  style={{ width: `${goalProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Goal Configuration Controls */}
          <div className="flex flex-col gap-2.5 w-full md:w-auto md:min-w-[240px] p-3.5 bg-stone-950/70 rounded-xl border border-stone-800 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                <span>Target (Mins/Week):</span>
              </span>
              <span className="font-bold text-amber-400 font-mono tabular-nums">
                {weeklyGoalMinutes} min
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleUpdateGoal(mins)}
                  className={`py-1 rounded text-xs font-mono border transition-all ${
                    weeklyGoalMinutes === mins
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Stepper for fine adjustment */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800/80">
              <span className="text-[11px] font-mono text-stone-500">Custom Target:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleUpdateGoal(weeklyGoalMinutes - 5)}
                  disabled={weeklyGoalMinutes <= 5}
                  className="w-7 h-7 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-30 border border-stone-800 text-stone-300 font-mono text-xs flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="5"
                  max="600"
                  step="5"
                  value={weeklyGoalMinutes}
                  onChange={(e) => handleUpdateGoal(parseInt(e.target.value, 10) || 5)}
                  className="w-14 text-center bg-stone-900 border border-stone-700 rounded py-1 text-xs font-mono text-amber-400 tabular-nums outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleUpdateGoal(weeklyGoalMinutes + 5)}
                  disabled={weeklyGoalMinutes >= 600}
                  className="w-7 h-7 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-30 border border-stone-800 text-stone-300 font-mono text-xs flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones & Achievement Badges Section */}
        <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border-2 border-stone-800 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <Medal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold font-comic text-stone-100">
                    Metallurgical Reading Milestones & Badges
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                    {unlockedCount} / {milestones.length} Unlocked
                  </span>
                </div>
                <p className="text-xs font-body text-stone-400">
                  Unlock specialized badges as you accumulate reading time, complete Acts, and analyze robotics schematics.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs font-mono">
              <button
                onClick={() => { sound.playClank(); setMilestoneFilter('all'); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  milestoneFilter === 'all'
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All ({milestones.length})
              </button>
              <button
                onClick={() => { sound.playClank(); setMilestoneFilter('unlocked'); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  milestoneFilter === 'unlocked'
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Unlocked ({unlockedCount})
              </button>
              <button
                onClick={() => { sound.playClank(); setMilestoneFilter('locked'); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  milestoneFilter === 'locked'
                    ? 'bg-stone-800 text-stone-100 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Locked ({milestones.length - unlockedCount})
              </button>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMilestones.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  if (m.isUnlocked) {
                    sound.playClank();
                  } else {
                    sound.playPageFlip();
                  }
                }}
                className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between gap-3 group select-none cursor-pointer ${
                  m.isUnlocked
                    ? `${m.badgeBg} ${m.borderCol} shadow-lg shadow-black/40 hover:border-amber-400`
                    : 'bg-stone-950/70 border-stone-800/80 opacity-70 hover:opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                      m.isUnlocked
                        ? 'bg-stone-950/80 border-amber-500/40 shadow-inner'
                        : 'bg-stone-900 border-stone-800 text-stone-500'
                    }`}>
                      {m.icon}
                    </div>

                    {m.isUnlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900/90 border border-stone-800 text-stone-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-500" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>

                  <h5 className={`font-comic font-bold text-sm tracking-wide ${
                    m.isUnlocked ? m.tierColor : 'text-stone-300'
                  }`}>
                    {m.title}
                  </h5>

                  <p className="text-xs font-body text-stone-400 mt-1 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-stone-500 truncate max-w-[170px]" title={m.requirement}>
                      {m.requirement}
                    </span>
                    <span className={`font-bold tabular-nums ${
                      m.isUnlocked ? 'text-emerald-400' : 'text-amber-500/80'
                    }`}>
                      {m.progressText}
                    </span>
                  </div>

                  <div className="w-full bg-stone-950 rounded-full h-1.5 border border-stone-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        m.isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cast House Knowledge Check · Metallurgical Mastery Quizzes */}
        <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border-2 border-stone-800 flex flex-col gap-5 relative overflow-hidden">
          {/* Subtle Ambient Background Highlight */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold font-comic text-stone-100">
                    Cast House Knowledge Check · Metallurgical Quizzes
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold hidden sm:inline-flex">
                    Interactive Lore Assessment
                  </span>
                </div>
                <p className="text-xs font-body text-stone-400">
                  Short, lore-based technical quizzes on blast furnace tuyeres, waterwheel cam-bellows, ancient Sanskrit ceramics, and robotics kinematics.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-stone-950 border border-stone-800 text-stone-300">
                Completed: <strong className="text-amber-400 font-bold">{Object.keys(data.quizScores || {}).length}</strong> / {METALLURGY_QUIZ_CATEGORIES.length}
              </span>
            </div>
          </div>

          {/* MODE 1: Category Selection View */}
          {!activeQuizCategory && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {METALLURGY_QUIZ_CATEGORIES.map((cat) => {
                const prevScore = data.quizScores ? data.quizScores[cat.id] : undefined;
                return (
                  <div
                    key={cat.id}
                    className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 hover:border-stone-700 flex flex-col justify-between gap-3 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
                          style={{
                            backgroundColor: `${cat.accentColor}18`,
                            borderColor: `${cat.accentColor}40`,
                            color: cat.accentColor
                          }}
                        >
                          {cat.questions.length} Questions
                        </span>
                        {prevScore && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{prevScore.percentage}%</span>
                          </span>
                        )}
                      </div>

                      <h5 className="font-comic font-bold text-sm text-stone-100 group-hover:text-amber-400 transition-colors">
                        {cat.title}
                      </h5>
                      <p className="text-xs font-body text-stone-400 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-2">
                      {prevScore ? (
                        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                          <span>Highest Rank:</span>
                          <span className="text-amber-400 font-semibold truncate max-w-[140px]" title={prevScore.rankTitle}>
                            {prevScore.rankTitle}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-stone-500">
                          Status: Not yet attempted
                        </span>
                      )}

                      <button
                        onClick={() => handleStartQuiz(cat)}
                        className="w-full py-2 px-3 rounded-lg font-comic font-bold text-xs tracking-wider border transition-all flex items-center justify-center gap-1.5 shadow-sm bg-stone-900 hover:bg-amber-500 text-stone-200 hover:text-black border-stone-700 hover:border-amber-400"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-black" />
                        <span>{prevScore ? 'Retake Knowledge Check' : 'Start Knowledge Check'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MODE 2: Active Quiz Question View */}
          {activeQuizCategory && !isQuizCompleted && (
            <div className="p-4 sm:p-5 bg-stone-950/90 rounded-xl border border-stone-800 flex flex-col gap-4 relative z-10">
              {/* Question Navigation Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {activeQuizCategory.title}
                  </span>
                  <span className="text-stone-600">·</span>
                  <span className="text-xs font-mono text-stone-400">
                    Question {currentQuizQuestionIndex + 1} of {activeQuizCategory.questions.length}
                  </span>
                </div>

                <button
                  onClick={handleExitQuiz}
                  className="px-2 py-1 rounded text-[11px] font-mono text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-transparent hover:border-stone-800 transition-colors"
                >
                  Exit Quiz
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{
                    width: `${((currentQuizQuestionIndex + 1) / activeQuizCategory.questions.length) * 100}%`
                  }}
                />
              </div>

              {/* Question Content */}
              {(() => {
                const currentQ = activeQuizCategory.questions[currentQuizQuestionIndex];
                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 border border-stone-800 text-stone-400">
                        {currentQ.topic}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        Lore Ref: {currentQ.actRef}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-comic font-bold text-stone-100 leading-snug">
                      {currentQ.question}
                    </h4>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswerId === opt.id;
                        const isCorrectAnswer = opt.id === currentQ.correctAnswerId;
                        const optionLetters = ['A', 'B', 'C', 'D'];

                        let optStyles = 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-900';
                        if (isSelected && !isAnswerSubmitted) {
                          optStyles = 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-sm';
                        } else if (isAnswerSubmitted) {
                          if (isCorrectAnswer) {
                            optStyles = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200';
                          } else if (isSelected && !isCorrectAnswer) {
                            optStyles = 'bg-rose-950/80 border-rose-500/80 text-rose-200';
                          } else {
                            optStyles = 'bg-stone-950/60 border-stone-800/60 text-stone-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isAnswerSubmitted}
                            onClick={() => handleSelectAnswer(opt.id)}
                            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${optStyles}`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border ${
                              isAnswerSubmitted && isCorrectAnswer
                                ? 'bg-emerald-500 text-black border-emerald-400'
                                : isAnswerSubmitted && isSelected && !isCorrectAnswer
                                ? 'bg-rose-500 text-white border-rose-400'
                                : isSelected
                                ? 'bg-amber-500 text-black border-amber-400'
                                : 'bg-stone-950 border-stone-800 text-stone-400'
                            }`}>
                              {optionLetters[optIdx]}
                            </span>
                            <span className="text-xs sm:text-sm font-body leading-relaxed">
                              {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanatory Feedback Box after submission */}
                    {isAnswerSubmitted && (
                      <div className="mt-2 p-3.5 rounded-xl bg-stone-900/90 border border-stone-700/80 flex flex-col gap-1.5 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                          {selectedAnswerId === currentQ.correctAnswerId ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400">Correct Analysis!</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                              <span className="text-rose-400">Incorrect Analysis</span>
                            </>
                          )}
                          {currentQ.schematicRef && (
                            <span className="text-[10px] text-stone-400 font-mono ml-auto">
                              Source: {currentQ.schematicRef}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-body text-stone-300 leading-relaxed">
                          {currentQ.explanation}
                        </p>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      {!isAnswerSubmitted ? (
                        <button
                          disabled={!selectedAnswerId}
                          onClick={handleSubmitAnswer}
                          className="px-5 py-2 rounded-lg font-comic font-bold text-xs tracking-wider bg-amber-500 hover:bg-amber-400 text-black disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md"
                        >
                          Confirm Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuizQuestion}
                          className="px-5 py-2 rounded-lg font-comic font-bold text-xs tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md flex items-center gap-1.5"
                        >
                          <span>{currentQuizQuestionIndex + 1 < activeQuizCategory.questions.length ? 'Next Question →' : 'Complete & View Score 🏆'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* MODE 3: Quiz Completed & Score Assessment View */}
          {activeQuizCategory && isQuizCompleted && (() => {
            let correctCount = 0;
            activeQuizCategory.questions.forEach(q => {
              if (quizUserAnswers[q.id] === q.correctAnswerId) correctCount++;
            });
            const pct = Math.round((correctCount / activeQuizCategory.questions.length) * 100);
            const rankInfo = getQuizRankTitle(pct);

            return (
              <div className="p-5 bg-stone-950/90 rounded-xl border border-stone-800 flex flex-col gap-5 relative z-10 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/80 border border-stone-800">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                        {correctCount}/{activeQuizCategory.questions.length}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">Score</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase text-stone-400">Assigned Metallurgical Rank:</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-comic font-bold text-stone-100">
                        {rankInfo.rank}
                      </h4>
                      <p className="text-xs font-body text-stone-400 mt-0.5">
                        {rankInfo.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end shrink-0">
                    <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                      {pct}%
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Performance Rating
                    </span>
                  </div>
                </div>

                {/* Review Questions Breakdown */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono uppercase text-stone-400 font-semibold tracking-wider">
                    Question Analysis Review:
                  </span>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                    {activeQuizCategory.questions.map((q, idx) => {
                      const userPick = quizUserAnswers[q.id];
                      const isCorrect = userPick === q.correctAnswerId;
                      const correctOpt = q.options.find(o => o.id === q.correctAnswerId);
                      return (
                        <div
                          key={q.id}
                          className="p-3 bg-stone-900/60 rounded-lg border border-stone-800/80 text-xs flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-stone-400 font-semibold">
                              Q{idx + 1}: {q.topic}
                            </span>
                            <span className={`font-mono font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              <span>{isCorrect ? 'Correct' : 'Missed'}</span>
                            </span>
                          </div>
                          <p className="font-body text-stone-200">
                            {q.question}
                          </p>
                          <div className="text-[11px] font-body text-stone-400 italic pt-1 border-t border-stone-800">
                            <strong className="text-amber-400">Concept:</strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800">
                  <button
                    onClick={() => handleStartQuiz(activeQuizCategory)}
                    className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Retake This Quiz</span>
                  </button>

                  <button
                    onClick={handleExitQuiz}
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-comic font-bold text-xs tracking-wider transition-colors shadow-md"
                  >
                    Back to All Knowledge Checks
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Quotes of the Day: Metallurgical & Engineering Lore */}
        <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border-2 border-stone-800 flex flex-col gap-4 relative overflow-hidden">
          {/* Subtle Ambient Background Highlight matching quote accent */}
          <div 
            className="absolute -right-12 -top-12 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
            style={{ backgroundColor: activeQuote.accentColor }}
          />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800 relative z-10">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300"
                style={{ 
                  backgroundColor: `${activeQuote.accentColor}18`, 
                  borderColor: `${activeQuote.accentColor}50`,
                  color: activeQuote.accentColor 
                }}
              >
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold font-comic text-stone-100">
                    Quote of the Day · Metallurgical Lore
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-950 border border-stone-800 text-amber-400 font-bold">
                    Chronicle Lore
                  </span>
                </div>
                <p className="text-xs font-body text-stone-400">
                  Daily metallurgical aphorisms, robotic axioms, and safety wisdom from the Tata InnoVerse archives.
                </p>
              </div>
            </div>

            {/* Quick Action Controls: Random / Prev / Next / Copy */}
            <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-between sm:justify-end">
              <button
                onClick={handleRandomQuote}
                className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Shuffle a random metallurgical quote"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Randomize</span>
              </button>

              <div className="flex items-center bg-stone-950 rounded-lg border border-stone-800 p-0.5">
                <button
                  onClick={handlePrevQuote}
                  className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                  title="Previous quote"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 text-[10px] font-mono text-stone-400">
                  {currentQuoteIndex + 1} / {LORE_QUOTES.length}
                </span>
                <button
                  onClick={handleNextQuote}
                  className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                  title="Next quote"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleCopyQuote}
                className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
                  isQuoteCopied
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                    : 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title="Copy quote to clipboard"
              >
                {isQuoteCopied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-stone-400" />
                )}
              </button>
            </div>
          </div>

          {/* Featured Quote Card Box */}
          <div className="p-4 sm:p-5 bg-stone-950/80 rounded-xl border border-stone-800/90 flex flex-col gap-3 relative z-10">
            {/* Domain & Act Tag Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border transition-colors"
                  style={{
                    backgroundColor: `${activeQuote.accentColor}18`,
                    borderColor: `${activeQuote.accentColor}50`,
                    color: activeQuote.accentColor
                  }}
                >
                  {activeQuote.domain}
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  {activeQuote.actReference}
                </span>
              </div>

              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest hidden sm:inline">
                Kudua Engineering Archive
              </span>
            </div>

            {/* The Quote Statement */}
            <blockquote className="text-base sm:text-lg font-comic text-stone-100 italic leading-relaxed pl-3.5 border-l-2 border-amber-500/80 py-1">
              "{activeQuote.quote}"
            </blockquote>

            {/* Speaker & Context Attribution */}
            <div className="pt-2 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-black shrink-0 transition-colors"
                  style={{ backgroundColor: activeQuote.accentColor }}
                >
                  {activeQuote.speaker.charAt(0)}
                </div>
                <div>
                  <h5 className="font-comic font-bold text-sm text-stone-200 leading-tight">
                    {activeQuote.speaker}
                  </h5>
                  <p className="text-[11px] font-mono text-stone-400">
                    {activeQuote.role}
                  </p>
                </div>
              </div>

              {activeQuote.historicalContext && (
                <p className="text-[11px] font-body text-stone-400 italic sm:text-right max-w-md">
                  {activeQuote.historicalContext}
                </p>
              )}
            </div>
          </div>

          {/* Quick Category Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 relative z-10 text-[11px] font-mono">
            <span className="text-stone-500 text-[10px] uppercase tracking-wider mr-1">
              Browse Domain:
            </span>
            {['All', 'Metallurgy', 'Robotics', 'Ancient Wisdom', 'Safety & Ethics', 'Cybernetics'].map((domain) => {
              const count = domain === 'All' 
                ? LORE_QUOTES.length 
                : LORE_QUOTES.filter(q => q.domain === domain).length;
              return (
                <button
                  key={domain}
                  onClick={() => {
                    sound.playClank();
                    if (domain === 'All') {
                      handleRandomQuote();
                    } else {
                      const matchIdx = LORE_QUOTES.findIndex(q => q.domain === domain);
                      if (matchIdx >= 0) setCurrentQuoteIndex(matchIdx);
                    }
                  }}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    (domain === 'All' && activeQuote.domain) || activeQuote.domain === domain
                      ? 'bg-stone-800 text-amber-300 border-amber-500/40 font-semibold'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  {domain} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Charts Grid: Recharts Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main BarChart: Time Spent Per Chapter (7 cols) */}
          <div className="lg:col-span-7 p-5 bg-stone-900/90 rounded-2xl border border-stone-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
                Time Spent Per Chapter (Minutes)
              </span>
              <span className="text-[11px] font-mono text-stone-500">RECHARTS BAR VISUALIZER</span>
            </div>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chapterBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="act" 
                    stroke="#78716c" 
                    fontSize={11} 
                    tickLine={false}
                    fontFamily="JetBrains Mono"
                  />
                  <YAxis 
                    stroke="#78716c" 
                    fontSize={11} 
                    tickLine={false}
                    fontFamily="JetBrains Mono"
                    unit="m"
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }}
                    contentStyle={{ 
                      backgroundColor: '#0c0a09', 
                      borderColor: '#44403c', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono' 
                    }}
                    labelStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                    itemStyle={{ color: '#fef08a' }}
                    formatter={(value: any) => [`${value} minutes`, 'Reading Time']}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="#f59e0b" 
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-1 border-t border-stone-800">
              <span>Prologue & Act I: 1450°C Runner</span>
              <span>Act V: Cybernetic Edge</span>
            </div>
          </div>

          {/* PieChart: Domain Focus Distribution (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-stone-900/90 rounded-2xl border border-stone-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                Technical Domain Distribution
              </span>
              <span className="text-[11px] font-mono text-stone-500">SHARE</span>
            </div>

            <div className="w-full h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={domainShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {domainShareData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DOMAIN_COLORS[index % DOMAIN_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0c0a09', 
                      borderColor: '#44403c', 
                      borderRadius: '8px', 
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-stone-800 text-[10px] font-mono text-stone-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Hazards</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Materials</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Kinematics</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Energy</span>
            </div>
          </div>
        </div>

        {/* Secondary Chart: Reading Velocity Over Pages (Area Chart) */}
        <div className="p-5 bg-stone-900/90 rounded-2xl border border-stone-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
              Reading Velocity Progression (WPM Speed Profile)
            </span>
            <span className="text-[11px] font-mono text-stone-500">VELOCITY / PAGES</span>
          </div>

          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="page" 
                  stroke="#78716c" 
                  fontSize={11} 
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#78716c" 
                  fontSize={11} 
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c0a09', 
                    borderColor: '#44403c', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono' 
                  }}
                  formatter={(val: any) => [`${val} WPM`, 'Speed']}
                />
                <Area 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#speedGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Telemetry Data</span>
            </button>

            <button
              onClick={handleExportChronicle}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm ${
                isExportSuccess
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-stone-900 hover:bg-amber-950/30 border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-amber-400'
              }`}
              title="Save complete chronicle history, stats, and notes as a JSON file"
            >
              {isExportSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chronicle File Downloaded!</span>
                </>
              ) : (
                <>
                  <FileJson className="w-3.5 h-3.5 text-amber-500" />
                  <span>Save Chronicle History (JSON)</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-comic font-bold text-xs tracking-wider transition-colors shadow-md"
          >
            Return to Graphic Novel
          </button>
        </div>
      </div>
    </div>
  );
};
