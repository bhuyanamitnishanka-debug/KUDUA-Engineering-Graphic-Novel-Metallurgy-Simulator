import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GraphicNovelBook } from './components/GraphicNovelBook';
import { WebtoonScroll } from './components/WebtoonScroll';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { ThermalEngineSimulator } from './components/ThermalEngineSimulator';
import { KinematicStateSimulator } from './components/KinematicStateSimulator';
import { EngineeringCodex } from './components/EngineeringCodex';
import { CharactersSection } from './components/CharactersSection';
import { TechDeepDiveSection } from './components/TechDeepDiveSection';
import { BehindTheScenesSection } from './components/BehindTheScenesSection';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ReadingAnalyticsModal } from './components/ReadingAnalyticsModal';
import { NOVEL_CHAPTERS } from './data/chaptersData';
import { ReadingMode } from './types/novel';
import { sound, AmbientSoundscape } from './utils/audio';
import { getStoredAnalytics, saveStoredAnalytics, ReadingAnalyticsData } from './utils/analytics';
import { BookOpen, Layers, Flame, Cpu, Shield, Users, Wrench, Film, Sparkles } from 'lucide-react';

interface BookmarkData {
  chapterIndex: number;
  panelIndex: number;
  act: string;
  title: string;
  timestamp: number;
}

const BOOKMARK_STORAGE_KEY = 'kudua_novel_bookmark';

export default function App() {
  const [currentMode, setCurrentMode] = useState<ReadingMode>('book');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<ReadingAnalyticsData>(getStoredAnalytics());
  const [currentSoundscape, setCurrentSoundscape] = useState<AmbientSoundscape>('furnace');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.5);
  const [isReaderMode, setIsReaderMode] = useState<boolean>(false);

  // Track active reading time when in 'book' mode
  useEffect(() => {
    if (currentMode !== 'book') return;

    const timer = setInterval(() => {
      setAnalyticsData((prev) => {
        const nextSeconds = prev.totalSeconds + 5;
        const nextChapterTime = {
          ...prev.chapterTimeSeconds,
          [currentChapterIndex]: (prev.chapterTimeSeconds[currentChapterIndex] || 0) + 5
        };
        const updated = {
          ...prev,
          totalSeconds: nextSeconds,
          chapterTimeSeconds: nextChapterTime
        };
        saveStoredAnalytics(updated);
        return updated;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [currentMode, currentChapterIndex]);

  // Track chapter/page views on change
  useEffect(() => {
    if (currentMode === 'book') {
      setAnalyticsData((prev) => {
        const updated = {
          ...prev,
          pagesReadCount: prev.pagesReadCount + 1,
          chapterViews: {
            ...prev.chapterViews,
            [currentChapterIndex]: (prev.chapterViews[currentChapterIndex] || 0) + 1
          }
        };
        saveStoredAnalytics(updated);
        return updated;
      });
    }
  }, [currentChapterIndex, currentPanelIndex, currentMode]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K / Slash / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc exits reader mode
      if (e.key === 'Escape' && isReaderMode) {
        setIsReaderMode(false);
      }
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // Pressing '/' when not in input
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReaderMode]);

  // Load existing bookmark from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (saved) {
        const parsed: BookmarkData = JSON.parse(saved);
        if (
          typeof parsed.chapterIndex === 'number' &&
          typeof parsed.panelIndex === 'number' &&
          parsed.chapterIndex >= 0 &&
          parsed.chapterIndex < NOVEL_CHAPTERS.length
        ) {
          setBookmark(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Initialize forge ambient hum on user first interaction
  useEffect(() => {
    const handleFirstClick = () => {
      sound.startAtmosphere(currentSoundscape);
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => {
      window.removeEventListener('click', handleFirstClick);
      sound.stopAmbientForge();
    };
  }, [currentSoundscape]);

  const handleToggleSound = () => {
    const newMuted = sound.toggleMute();
    setIsMuted(newMuted);
  };

  const handleSelectSoundscape = (soundscape: AmbientSoundscape) => {
    setCurrentSoundscape(soundscape);
    sound.setSoundscape(soundscape);
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    sound.setVolume(vol);
  };

  const handleStartReading = () => {
    sound.playPageFlip();
    setCurrentMode('book');
    setCurrentChapterIndex(0);
    setCurrentPanelIndex(0);
  };

  const handleResumeBookmark = () => {
    if (!bookmark) return;
    sound.playPageFlip();
    const chIdx = Math.max(0, Math.min(bookmark.chapterIndex, NOVEL_CHAPTERS.length - 1));
    const maxPanels = NOVEL_CHAPTERS[chIdx].panels.length;
    const pnlIdx = Math.max(0, Math.min(bookmark.panelIndex, maxPanels - 1));

    setCurrentChapterIndex(chIdx);
    setCurrentPanelIndex(pnlIdx);
    setCurrentMode('book');
  };

  const handleToggleBookmark = (chapterIdx: number, panelIdx: number) => {
    // If already bookmarked at this position, clear it
    if (bookmark?.chapterIndex === chapterIdx && bookmark?.panelIndex === panelIdx) {
      setBookmark(null);
      try {
        localStorage.removeItem(BOOKMARK_STORAGE_KEY);
      } catch {
        // Fallback
      }
    } else {
      const ch = NOVEL_CHAPTERS[chapterIdx] || NOVEL_CHAPTERS[0];
      const newBookmark: BookmarkData = {
        chapterIndex: chapterIdx,
        panelIndex: panelIdx,
        act: ch.act,
        title: ch.title,
        timestamp: Date.now(),
      };
      setBookmark(newBookmark);
      try {
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(newBookmark));
      } catch {
        // Fallback
      }
    }
  };

  const handleOpenLab = (tab: 'thermal' | 'blueprint' | 'kinematics') => {
    sound.playClank();
    setCurrentMode(tab);
    // Immersion pairing for lab simulations
    if (tab === 'thermal' && currentSoundscape !== 'furnace') {
      handleSelectSoundscape('furnace');
    } else if (tab === 'blueprint' && currentSoundscape === 'furnace') {
      handleSelectSoundscape('lab');
    }
  };

  const handleNavigateSection = (section: 'characters' | 'technologies' | 'bts') => {
    sound.playPageFlip();
    setCurrentMode(section);
  };

  // Cumulative Reading Progress Calculations for 'book' mode
  const totalAllPanels = NOVEL_CHAPTERS.reduce((acc, ch) => acc + ch.panels.length, 0);
  let elapsedPanels = 0;
  for (let i = 0; i < currentChapterIndex; i++) {
    elapsedPanels += NOVEL_CHAPTERS[i].panels.length;
  }
  elapsedPanels += (currentPanelIndex + 1);

  const progressPercent = Math.min(100, Math.round((elapsedPanels / totalAllPanels) * 100));
  const activeChapter = NOVEL_CHAPTERS[currentChapterIndex] || NOVEL_CHAPTERS[0];
  const totalPanelsInChapter = activeChapter.panels.length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-body selection:bg-amber-500 selection:text-black">
      {/* Viewport-Top Reading Progress Bar in Book Mode */}
      {currentMode === 'book' && (
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Graphic Novel Reading Progress"
          className="sticky top-0 z-50 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 shadow-lg"
        >
          {/* Animated Glowing Progress Track */}
          <div className="w-full h-1 sm:h-1.5 bg-stone-900 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 transition-all duration-300 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Glowing Leading Edge Sparkle */}
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white opacity-90 shadow-[0_0_12px_#f59e0b] animate-pulse" />
            </div>
          </div>

          {/* Micro-Telemetry Reading Status Bar */}
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-[11px] font-mono select-none">
            <div className="flex items-center gap-2 text-stone-300 truncate">
              <span className="text-amber-500 font-bold uppercase tracking-wider">
                {activeChapter.act}
              </span>
              <span className="text-stone-600 hidden xs:inline">·</span>
              <span className="truncate text-stone-300 hidden sm:inline">
                {activeChapter.title}
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-cyan-400 font-semibold tabular-nums">
                Page {currentPanelIndex + 1} of {totalPanelsInChapter}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Interactive Quick Step Indicators across all acts */}
              <div className="hidden md:flex items-center gap-1">
                {NOVEL_CHAPTERS.map((ch, cIdx) => (
                  <div key={ch.id} className="flex items-center gap-0.5">
                    {ch.panels.map((_, pIdx) => {
                      const isPassed = cIdx < currentChapterIndex || (cIdx === currentChapterIndex && pIdx <= currentPanelIndex);
                      const isCurrent = cIdx === currentChapterIndex && pIdx === currentPanelIndex;
                      return (
                        <button
                          key={pIdx}
                          onClick={() => {
                            sound.playPageFlip();
                            setCurrentChapterIndex(cIdx);
                            setCurrentPanelIndex(pIdx);
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-400 ring-2 ring-amber-400/40 scale-125'
                              : isPassed
                              ? 'bg-amber-600/70 hover:bg-amber-400'
                              : 'bg-stone-800 hover:bg-stone-600'
                          }`}
                          title={`${ch.act} - Page ${pIdx + 1}`}
                          aria-label={`Jump to ${ch.act} Page ${pIdx + 1}`}
                        />
                      );
                    })}
                    {cIdx < NOVEL_CHAPTERS.length - 1 && <span className="w-1 text-stone-700 text-[8px] mx-0.5">|</span>}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-stone-400">
                <span className="text-stone-500 hidden sm:inline">Chronicle:</span>
                <span className="font-bold text-amber-400 tabular-nums">
                  {progressPercent}%
                </span>
                <span className="text-[10px] text-stone-500 tabular-nums hidden xs:inline">
                  ({elapsedPanels}/{totalAllPanels} pgs)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Contract (1 row, 3 zones) */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          sound.playPageFlip();
          setCurrentMode(mode);
        }}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onStartReading={handleStartReading}
        bookmark={bookmark}
        onResumeBookmark={handleResumeBookmark}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        currentSoundscape={currentSoundscape}
        volume={ambientVolume}
        onSelectSoundscape={handleSelectSoundscape}
        onVolumeChange={handleVolumeChange}
        isReaderMode={isReaderMode}
        onToggleReaderMode={() => setIsReaderMode(prev => !prev)}
      />

      {/* Hero Marquee & Reading Mode Selector (Suppressed in Reader Focus Mode) */}
      {!isReaderMode && (
        <div className="w-full bg-gradient-to-b from-stone-900/60 to-transparent border-b border-stone-800/80 px-4 py-8 md:py-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
                <span>Tata InnoVerse 2026 Engineering Chronicle</span>
                <span>·</span>
                <span>Autonomous Metallurgy</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-epic text-stone-100 tracking-tight text-balance">
                Kudua: The Autonomous Forge
              </h1>
              <p className="text-sm md:text-base font-body text-stone-300 leading-relaxed">
                An engineering graphic novel blending 3,000-year-old Bhartiya metallurgical wisdom with space-age autonomous robotics to eliminate human peril in 1450°C blast furnaces.
              </p>
            </div>

            {/* Quick Jump Mode Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => { sound.playPageFlip(); setCurrentMode('book'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-comic font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  currentMode === 'book'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Graphic Novel</span>
              </button>

              <button
                onClick={() => { sound.playPageFlip(); setCurrentMode('characters'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-comic font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  currentMode === 'characters'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Characters</span>
              </button>

              <button
                onClick={() => { sound.playPageFlip(); setCurrentMode('technologies'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-comic font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  currentMode === 'technologies'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Technologies</span>
              </button>

              <button
                onClick={() => { sound.playPageFlip(); setCurrentMode('bts'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-comic font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  currentMode === 'bts'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Behind The Scenes</span>
              </button>

              <button
                onClick={() => { sound.playClank(); setCurrentMode('blueprint'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-comic font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  currentMode === 'blueprint'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>CAD Blueprints</span>
              </button>

              <button
                onClick={() => { sound.playClank(); setCurrentMode('thermal'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-comic font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  currentMode === 'thermal'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Thermal Lab</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className={`flex-1 w-full ${isReaderMode ? 'pb-8 pt-4' : 'pb-16'}`}>
        {currentMode === 'book' && (
          <GraphicNovelBook
            chapters={NOVEL_CHAPTERS}
            currentChapterIndex={currentChapterIndex}
            onSelectChapter={(idx) => {
              setCurrentChapterIndex(idx);
              setCurrentPanelIndex(0);
            }}
            currentPanelIndex={currentPanelIndex}
            onSelectPanel={setCurrentPanelIndex}
            onOpenLab={handleOpenLab}
            onNavigateSection={handleNavigateSection}
            bookmark={bookmark}
            onToggleBookmark={handleToggleBookmark}
            onOpenAnalytics={() => setIsAnalyticsOpen(true)}
            isReaderMode={isReaderMode}
            onToggleReaderMode={() => setIsReaderMode(prev => !prev)}
          />
        )}

        {currentMode === 'webtoon' && (
          <WebtoonScroll
            chapters={NOVEL_CHAPTERS}
            onOpenLab={handleOpenLab}
          />
        )}

        {currentMode === 'characters' && (
          <CharactersSection
            onReadChapterWithCharacter={(cIdx) => {
              setCurrentChapterIndex(cIdx);
              setCurrentMode('book');
            }}
          />
        )}

        {currentMode === 'technologies' && (
          <TechDeepDiveSection />
        )}

        {currentMode === 'bts' && (
          <BehindTheScenesSection />
        )}

        {currentMode === 'blueprint' && (
          <BlueprintExplorer />
        )}

        {currentMode === 'thermal' && (
          <ThermalEngineSimulator />
        )}

        {currentMode === 'kinematics' && (
          <KinematicStateSimulator />
        )}

        {currentMode === 'codex' && (
          <EngineeringCodex />
        )}
      </main>

      {/* Institutional Editorial Footer (Suppressed in Reader Focus Mode) */}
      {!isReaderMode && (
        <footer className="w-full bg-stone-950 border-t border-stone-800/80 px-6 py-10 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500 font-mono">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="font-bold text-stone-300 font-epic text-sm">
                Kudua Autonomous Metallurgical Sampling & Monitoring System
              </span>
              <span>
                Synthesized from 117-Page Tata InnoVerse Technical Proposal & Blueprint Archive
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => { sound.playPageFlip(); setCurrentMode('characters'); }}
                className="hover:text-amber-400 transition-colors"
              >
                Characters
              </button>
              <button
                onClick={() => { sound.playPageFlip(); setCurrentMode('technologies'); }}
                className="hover:text-amber-400 transition-colors"
              >
                Technologies
              </button>
              <button
                onClick={() => { sound.playPageFlip(); setCurrentMode('bts'); }}
                className="hover:text-amber-400 transition-colors"
              >
                Behind The Scenes
              </button>
              <button
                onClick={() => { sound.playClank(); setCurrentMode('blueprint'); }}
                className="hover:text-amber-400 transition-colors"
              >
                CAD Schematics
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Global Search Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateChapter={(chapterIdx, panelIdx) => {
          setCurrentChapterIndex(chapterIdx);
          setCurrentPanelIndex(panelIdx);
          setCurrentMode('book');
        }}
        onNavigateSection={(section) => {
          setCurrentMode(section);
        }}
      />

      {/* Engineering Reading Analytics Modal */}
      <ReadingAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        analyticsData={analyticsData}
        onResetAnalytics={() => setAnalyticsData(getStoredAnalytics())}
      />
    </div>
  );
}
