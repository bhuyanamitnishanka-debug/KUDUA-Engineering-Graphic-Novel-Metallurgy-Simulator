import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Bookmark, Sparkles, AlertTriangle, 
  Layers, Shield, Cpu, Play, Pause, GitBranch, ArrowUpRight, 
  BarChart3, PenLine, StickyNote, Trash2, Edit3,
  Volume2, VolumeX, Square, Volume1
} from 'lucide-react';
import { NovelChapter, ComicPanel } from '../types/novel';
import { ComicArtScene } from './ComicArtScene';
import { InteractivePanelHotspots } from './InteractivePanelHotspots';
import { BranchingNarrativeModal } from './BranchingNarrativeModal';
import { PanelAnnotationModal } from './PanelAnnotationModal';
import { usePanelNarrator } from '../hooks/usePanelNarrator';
import { sound } from '../utils/audio';

interface PanelAnnotationRecord {
  text: string;
  updatedAt: number;
}

const ANNOTATIONS_STORAGE_KEY = 'kudua_panel_annotations';

interface GraphicNovelBookProps {
  chapters: NovelChapter[];
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
  currentPanelIndex?: number;
  onSelectPanel?: (index: number) => void;
  onOpenLab: (tab: 'thermal' | 'blueprint' | 'kinematics') => void;
  onNavigateSection?: (section: 'characters' | 'technologies' | 'bts') => void;
  bookmark?: {
    chapterIndex: number;
    panelIndex: number;
    act: string;
    title: string;
  } | null;
  onToggleBookmark?: (chapterIdx: number, panelIdx: number) => void;
  onOpenAnalytics?: () => void;
  isReaderMode?: boolean;
  onToggleReaderMode?: () => void;
}

export const GraphicNovelBook: React.FC<GraphicNovelBookProps> = ({
  chapters,
  currentChapterIndex,
  onSelectChapter,
  currentPanelIndex: externalPanelIndex,
  onSelectPanel,
  onOpenLab,
  onNavigateSection,
  bookmark,
  onToggleBookmark,
  onOpenAnalytics,
  isReaderMode = false,
  onToggleReaderMode,
}) => {
  const [internalPanelIndex, setInternalPanelIndex] = useState(0);
  const currentPanelIndex = externalPanelIndex !== undefined ? externalPanelIndex : internalPanelIndex;
  
  const setCurrentPanelIndex = (newIdx: number | ((prev: number) => number)) => {
    const val = typeof newIdx === 'function' ? newIdx(currentPanelIndex) : newIdx;
    if (onSelectPanel) {
      onSelectPanel(val);
    } else {
      setInternalPanelIndex(val);
    }
  };

  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [activeChoiceModal, setActiveChoiceModal] = useState<boolean>(false);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  // LocalStorage-backed Panel Annotations
  const [annotations, setAnnotations] = useState<Record<string, PanelAnnotationRecord>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(ANNOTATIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const chapter = chapters[currentChapterIndex] || chapters[0];
  const totalPanels = chapter.panels.length;
  const panel = chapter.panels[currentPanelIndex] || chapter.panels[0];

  const panelKey = `${currentChapterIndex}_${currentPanelIndex}`;
  const currentAnnotation = annotations[panelKey] || (panel.annotation ? { text: panel.annotation, updatedAt: 0 } : null);

  // Web Speech API Panel Narrator
  const narrator = usePanelNarrator(panel, chapter, currentPanelIndex);

  const handleToggleNarrator = () => {
    sound.playPneumaticHiss();
    narrator.togglePlayPause();
  };

  const handleStopNarrator = () => {
    sound.playPneumaticHiss();
    narrator.stopNarration();
  };

  const handleCycleNarratorSpeed = () => {
    sound.playClank();
    narrator.cycleSpeed();
  };

  const handleOpenNotes = () => {
    sound.playClank();
    setIsNotesOpen(true);
  };

  const handleSaveNote = (text: string) => {
    sound.playPneumaticHiss();
    const trimmed = text.trim();
    const next = { ...annotations };
    if (trimmed) {
      next[panelKey] = {
        text: trimmed,
        updatedAt: Date.now()
      };
    } else {
      delete next[panelKey];
    }
    setAnnotations(next);
    try {
      localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Fallback
    }
    setIsNotesOpen(false);
  };

  const handleDeleteNote = () => {
    sound.playPneumaticHiss();
    const next = { ...annotations };
    delete next[panelKey];
    setAnnotations(next);
    try {
      localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Fallback
    }
    setIsNotesOpen(false);
  };

  const isCurrentPageBookmarked = bookmark?.chapterIndex === currentChapterIndex && bookmark?.panelIndex === currentPanelIndex;

  const handleBookmarkClick = () => {
    sound.playClank();
    if (onToggleBookmark) {
      onToggleBookmark(currentChapterIndex, currentPanelIndex);
    }
  };

  const handlePrevPage = () => {
    sound.playPageFlip();
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1);
    } else if (currentChapterIndex > 0) {
      onSelectChapter(currentChapterIndex - 1);
      setCurrentPanelIndex(chapters[currentChapterIndex - 1].panels.length - 1);
    }
  };

  const handleNextPage = () => {
    sound.playPageFlip();
    if (currentPanelIndex < totalPanels - 1) {
      setCurrentPanelIndex(currentPanelIndex + 1);
    } else if (currentChapterIndex < chapters.length - 1) {
      onSelectChapter(currentChapterIndex + 1);
      setCurrentPanelIndex(0);
    }
  };

  const toggleAutoPlay = () => {
    if (!isPlayingAuto) {
      sound.playClank();
      setIsPlayingAuto(true);
      const interval = setInterval(() => {
        setCurrentPanelIndex((prev) => {
          if (prev < totalPanels - 1) {
            sound.playPageFlip();
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsPlayingAuto(false);
            return prev;
          }
        });
      }, 7000);
    } else {
      setIsPlayingAuto(false);
    }
  };

  const currentChoice = panel.branchingChoice;
  const chosenOptionId = currentChoice ? selectedChoices[currentChoice.id] : undefined;
  const chosenOption = currentChoice?.options.find(o => o.id === chosenOptionId);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-10 flex flex-col items-center">
      {/* Reader Mode Focus Mode Indicator Banner */}
      {isReaderMode && (
        <div className="w-full mb-3 px-4 py-2.5 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs font-mono text-amber-300 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold tracking-wider">READER FOCUS MODE ACTIVE</span>
            <span className="text-stone-500 hidden sm:inline">·</span>
            <span className="text-stone-400 hidden sm:inline">Distraction-Free Layout · Enhanced Typography Scale</span>
          </div>
          {onToggleReaderMode && (
            <button
              onClick={onToggleReaderMode}
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors"
            >
              Exit Focus (Esc)
            </button>
          )}
        </div>
      )}

      {/* Chapter Selection Ribbon */}
      <div className={`w-full flex items-center justify-between gap-3 overflow-x-auto pb-4 mb-4 border-b border-stone-800 ${
        isReaderMode ? 'opacity-90' : ''
      }`}>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                sound.playPageFlip();
                onSelectChapter(idx);
                setCurrentPanelIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-comic uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                currentChapterIndex === idx
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <span>Act {idx + 1}</span>
              <span className="hidden sm:inline opacity-75">· {ch.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Reading Controls with Narrator, Bookmark, Analytics & Notes Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Web Speech API Narrator Controls */}
          {narrator.isSupported && (
            <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg p-0.5 shadow-sm">
              <button
                onClick={handleToggleNarrator}
                className={`px-2.5 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 transition-all ${
                  narrator.isSpeaking && !narrator.isPaused
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : narrator.isPaused
                    ? 'bg-amber-950/70 text-amber-300 border border-amber-500/50'
                    : 'text-stone-300 hover:text-amber-400 hover:bg-stone-800'
                }`}
                title={
                  !narrator.isSpeaking
                    ? 'Listen to voice-over narration of this panel (Web Speech API)'
                    : narrator.isPaused
                    ? 'Resume voice-over narration'
                    : 'Pause voice-over narration'
                }
              >
                {narrator.isSpeaking && !narrator.isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Pause</span>
                    <span className="flex items-center gap-0.5 ml-0.5">
                      <span className="w-1 h-2.5 bg-black animate-pulse rounded-full" />
                      <span className="w-1 h-3.5 bg-black animate-bounce rounded-full" />
                      <span className="w-1 h-2 bg-black animate-pulse rounded-full" />
                    </span>
                  </>
                ) : narrator.isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="hidden sm:inline">Resume</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Narrator</span>
                    <span className="sm:hidden">Voice</span>
                  </>
                )}
              </button>

              {narrator.isSpeaking && (
                <button
                  onClick={handleStopNarrator}
                  className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-md transition-colors"
                  title="Stop Narration"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              )}

              {/* Speed Adjustment Control */}
              <button
                onClick={handleCycleNarratorSpeed}
                className="px-2 py-1 text-[11px] font-mono text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded-md transition-colors border-l border-stone-800"
                title={`Narration Speed: ${narrator.speed}x (Click to cycle)`}
              >
                {narrator.speed}x
              </button>
            </div>
          )}

          {/* Notes & Annotations Button */}
          <button
            onClick={handleOpenNotes}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${
              currentAnnotation
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/50 hover:bg-amber-900/60 shadow-sm'
                : 'bg-stone-900 text-stone-300 border-stone-700 hover:text-amber-400 hover:border-amber-500/50'
            }`}
            title={currentAnnotation ? 'View or Edit Panel Notes (1 Note)' : 'Add Technical Annotation or Note to this panel'}
          >
            <PenLine className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Notes</span>
            {currentAnnotation && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {onOpenAnalytics && (
            <button
              onClick={() => {
                sound.playClank();
                onOpenAnalytics();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-stone-700 bg-stone-900 text-stone-300 hover:text-cyan-400 hover:border-cyan-500/50 flex items-center gap-1.5 transition-colors"
              title="View Reading Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          )}

          <button
            onClick={handleBookmarkClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${
              isCurrentPageBookmarked
                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-300 border-stone-700 hover:text-amber-400 hover:border-amber-500/50'
            }`}
            title={isCurrentPageBookmarked ? "Bookmarked (Click to remove)" : "Bookmark this Page"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isCurrentPageBookmarked ? 'fill-black' : ''}`} />
            <span>{isCurrentPageBookmarked ? 'Bookmarked' : 'Bookmark Page'}</span>
          </button>

          <button
            onClick={toggleAutoPlay}
            className="px-3 py-1.5 rounded-lg text-xs font-mono border border-stone-700 bg-stone-900 text-stone-300 hover:text-amber-400 hover:border-amber-500/50 flex items-center gap-1.5 transition-colors"
          >
            {isPlayingAuto ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-amber-500" />}
            <span className="hidden sm:inline">{isPlayingAuto ? 'Pause Autoplay' : 'Autoplay'}</span>
          </button>
        </div>
      </div>

      {/* Physical Book Cover / Spread Frame */}
      <div className="w-full bg-stone-900/90 rounded-2xl border-4 border-stone-800 book-shadow p-3 sm:p-6 md:p-8 relative overflow-hidden">
        {/* Leather Binding Spine Effect (Left Side) */}
        <div className="absolute left-0 top-0 bottom-0 w-3 md:w-5 bg-gradient-to-r from-stone-950 via-stone-800 to-stone-900 border-r border-amber-900/40 z-20 pointer-events-none hidden sm:block" />

        {/* Book Header Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-stone-800/80">
          <div>
            <div className="text-xs font-mono uppercase text-amber-500/90 tracking-widest flex items-center gap-2">
              <span>{chapter.act}</span>
              <span>/</span>
              <span>ISSUE #{chapter.id} OF 5</span>
              <span>/</span>
              <span className="text-stone-400">{panel.timeCode}</span>
            </div>
            <h1 className={`font-bold font-epic text-stone-100 tracking-tight mt-1 transition-all ${
              isReaderMode ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-2xl sm:text-3xl md:text-4xl'
            }`}>
              {chapter.title}
            </h1>
            <p className={`font-body text-stone-400 mt-1 max-w-3xl transition-all ${
              isReaderMode ? 'text-sm sm:text-base md:text-lg text-stone-300' : 'text-xs sm:text-sm'
            }`}>
              {chapter.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentPageBookmarked && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                <Bookmark className="w-3 h-3 fill-amber-400" />
                <span>Saved Bookmark</span>
              </span>
            )}
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-stone-950 border border-stone-800 text-stone-300">
              Panel {currentPanelIndex + 1} / {totalPanels}
            </span>
          </div>
        </div>

        {/* 2-Column Comic Book Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Comic Art, Interactive Hotspots & Sound Effect */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Visual Panel with Interactive Hotspot Overlay */}
            <div className="relative group">
              <ComicArtScene sceneType={panel.sceneType} title={panel.title} />

              {/* Interactive Panel Hotspots with click animations */}
              <InteractivePanelHotspots 
                hotspots={panel.hotspots} 
                onOpenTechDoc={() => onNavigateSection && onNavigateSection('technologies')}
              />

              {/* Sound Effect Sticker */}
              {panel.soundEffect && (
                <div 
                  onClick={() => sound.playPneumaticHiss()} 
                  className={`absolute -top-3 -right-2 sm:top-4 sm:right-4 z-10 px-4 py-2 bg-stone-950/95 border-2 border-current rounded-lg font-comic font-black text-lg sm:text-2xl tracking-wider transform rotate-3 hover:scale-110 active:scale-95 transition-transform cursor-pointer shadow-xl ${panel.soundEffectColor || 'text-amber-400'}`}
                >
                  {panel.soundEffect}
                </div>
              )}

              {/* Quick Jump to Interactive Physics / CAD */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                <button
                  onClick={() => onOpenLab('blueprint')}
                  className="px-2.5 py-1 bg-stone-950/90 hover:bg-stone-900 border border-cyan-500/40 text-cyan-400 rounded text-xs font-mono flex items-center gap-1.5 transition-colors backdrop-blur-sm"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>CAD View</span>
                </button>
                <button
                  onClick={() => onOpenLab('thermal')}
                  className="px-2.5 py-1 bg-stone-950/90 hover:bg-stone-900 border border-amber-500/40 text-amber-400 rounded text-xs font-mono flex items-center gap-1.5 transition-colors backdrop-blur-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Thermal Lab</span>
                </button>
              </div>
            </div>

            {/* Environmental Conditions Strip */}
            <div className={`p-3 bg-stone-950 rounded-xl border border-stone-800 font-mono text-stone-400 flex flex-wrap items-center justify-between gap-2 ${
              isReaderMode ? 'text-sm' : 'text-xs'
            }`}>
              <span className="text-amber-500 font-semibold">{panel.ambientCondition}</span>
              <span className="text-stone-500">Autonomous Metallurgy Rig · Kudua Core</span>
            </div>

            {/* Branching Narrative Choice Bar (If Available on Panel) */}
            {currentChoice && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-stone-950 via-amber-950/30 to-stone-950 border border-amber-500/50 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    <GitBranch className="w-4 h-4" />
                    <span>Tactical Decision Point</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClank();
                      setActiveChoiceModal(true);
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-comic font-bold transition-colors shadow-sm"
                  >
                    {chosenOptionId ? 'Change Directive' : 'Choose Directive'}
                  </button>
                </div>

                <p className={`font-body text-stone-300 ${isReaderMode ? 'text-sm' : 'text-xs'}`}>
                  {currentChoice.prompt}
                </p>

                {chosenOption && (
                  <div className="p-2.5 bg-stone-900/90 rounded-lg border border-amber-500/40 text-xs font-body text-emerald-300 flex items-start gap-2">
                    <span className="font-comic font-bold text-amber-400 shrink-0">Executed: {chosenOption.label}</span>
                    <span className="italic">— "{chosenOption.consequenceText}"</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Narrative Prose, Speech Bubbles, and Technical Callouts */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Comic Narrative Caption Box */}
            <div className={`border-l-4 border-amber-500 rounded-r-xl border-t border-b border-r border-stone-800 font-body transition-all ${
              isReaderMode 
                ? 'p-5 sm:p-7 bg-stone-950/95 text-stone-100 text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose shadow-2xl' 
                : 'p-4 bg-amber-950/20 text-stone-200 text-sm leading-relaxed'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">
                    Narrative Log
                  </span>

                  {narrator.isSupported && (
                    <button
                      onClick={handleToggleNarrator}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                        narrator.isSpeaking && !narrator.isPaused
                          ? 'bg-amber-500 text-black font-bold animate-pulse shadow-sm'
                          : narrator.isPaused
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 border border-stone-800'
                      }`}
                      title={
                        !narrator.isSpeaking
                          ? 'Listen to voice-over narration (Web Speech API)'
                          : narrator.isPaused
                          ? 'Resume narration'
                          : 'Pause narration'
                      }
                    >
                      {narrator.isSpeaking && !narrator.isPaused ? (
                        <>
                          <Pause className="w-2.5 h-2.5 fill-current" />
                          <span>Narrating ({narrator.speed}x)</span>
                        </>
                      ) : narrator.isPaused ? (
                        <>
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-2.5 h-2.5 text-amber-400" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <button
                  onClick={handleOpenNotes}
                  className="text-[11px] font-mono text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                  title="Add or view technical notes for this panel"
                >
                  <PenLine className="w-3 h-3 text-amber-500" />
                  <span>{currentAnnotation ? 'Edit Note' : '+ Note'}</span>
                </button>
              </div>

              <p className={`first-letter:font-epic first-letter:font-bold first-letter:text-amber-500 first-letter:float-left first-letter:mr-2 ${
                isReaderMode ? 'first-letter:text-4xl sm:first-letter:text-5xl' : 'first-letter:text-3xl'
              }`}>
                {panel.narrativeCaption}
              </p>
            </div>

            {/* Optional Panel Annotation Card */}
            {currentAnnotation && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-950/20 border-2 border-amber-500/40 shadow-lg flex flex-col gap-2 relative animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                    <StickyNote className="w-3.5 h-3.5" />
                    <span>Panel Annotation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleOpenNotes}
                      className="px-2 py-0.5 rounded text-[11px] font-mono text-stone-300 hover:text-amber-300 bg-stone-900 border border-stone-800 hover:border-amber-500/50 flex items-center gap-1 transition-colors"
                      title="Edit Annotation"
                    >
                      <Edit3 className="w-3 h-3 text-amber-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDeleteNote}
                      className="p-1 rounded text-stone-500 hover:text-rose-400 transition-colors"
                      title="Delete Annotation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className={`font-mono text-amber-100/90 whitespace-pre-wrap leading-relaxed bg-stone-950/80 p-3 rounded-lg border border-amber-900/30 ${
                  isReaderMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                }`}>
                  {currentAnnotation.text}
                </p>
              </div>
            )}

            {/* Dynamic Dialogue Speech Bubbles */}
            {panel.dialogue && panel.dialogue.length > 0 && (
              <div className="flex flex-col gap-3">
                {panel.dialogue.map((d, dIdx) => (
                  <div
                    key={dIdx}
                    className={`rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 transition-colors relative ${
                      isReaderMode ? 'p-4 sm:p-5' : 'p-3.5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${d.avatarColor}`} />
                        <span className={`font-comic font-bold tracking-wide ${
                          isReaderMode ? 'text-sm sm:text-base text-amber-400' : 'text-xs text-stone-200'
                        }`}>
                          {d.speaker}
                        </span>
                      </div>
                      <span className={`font-mono text-stone-500 ${isReaderMode ? 'text-xs' : 'text-[11px]'}`}>{d.role}</span>
                    </div>
                    <p className={`font-body italic leading-relaxed ${
                      isReaderMode ? 'text-sm sm:text-base md:text-lg text-stone-100' : 'text-xs sm:text-sm text-stone-300'
                    }`}>
                      "{d.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Technical Callout Specifications (From Document) */}
            <div className={`bg-stone-950/80 rounded-xl border border-stone-800 ${isReaderMode ? 'p-5' : 'p-4'}`}>
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Verified Engineering Specs</span>
                </span>
                {onNavigateSection && (
                  <button
                    onClick={() => onNavigateSection('technologies')}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-body"
                  >
                    <span>Full Specs</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {panel.technicalCallouts.map((tc, tcIdx) => (
                  <div
                    key={tcIdx}
                    className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-stone-400 font-body">{tc.label}</span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">{tc.spec}</span>
                    </div>
                    <p className={`font-body leading-tight ${isReaderMode ? 'text-xs text-stone-400' : 'text-[11px] text-stone-500'}`}>
                      {tc.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Act Quote Banner */}
            {panel.quote && (
              <div className={`p-3 bg-gradient-to-r from-amber-950/30 to-transparent border-l-2 border-amber-400 font-body italic text-amber-300 ${
                isReaderMode ? 'text-sm' : 'text-xs'
              }`}>
                “{panel.quote}”
              </div>
            )}
          </div>
        </div>

        {/* Turn Page Controls */}
        <div className={`mt-8 pt-4 border-t border-stone-800 flex items-center justify-between ${
          isReaderMode ? 'pb-2' : ''
        }`}>
          <button
            onClick={handlePrevPage}
            disabled={currentChapterIndex === 0 && currentPanelIndex === 0}
            className={`rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 disabled:opacity-40 disabled:pointer-events-none font-comic tracking-wider flex items-center gap-2 transition-colors ${
              isReaderMode ? 'px-6 py-3 text-sm font-bold' : 'px-4 py-2 text-xs'
            }`}
          >
            <ChevronLeft className={isReaderMode ? "w-5 h-5" : "w-4 h-4"} />
            <span>Previous Page</span>
          </button>

          {/* Panel Dots */}
          <div className="flex items-center gap-2">
            {chapter.panels.map((_, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  sound.playPageFlip();
                  setCurrentPanelIndex(pIdx);
                }}
                className={`rounded-full transition-all ${
                  isReaderMode ? 'w-3 h-3' : 'w-2.5 h-2.5'
                } ${
                  currentPanelIndex === pIdx
                    ? 'w-7 bg-amber-500'
                    : 'bg-stone-700 hover:bg-stone-500'
                }`}
                aria-label={`Go to panel ${pIdx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentChapterIndex === chapters.length - 1 && currentPanelIndex === totalPanels - 1}
            className={`rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-comic font-bold tracking-wider flex items-center gap-2 transition-colors shadow-md shadow-amber-500/20 ${
              isReaderMode ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'
            }`}
          >
            <span>Next Page</span>
            <ChevronRight className={isReaderMode ? "w-5 h-5" : "w-4 h-4"} />
          </button>
        </div>
      </div>

      {/* Branching Narrative Choice Modal */}
      {activeChoiceModal && currentChoice && (
        <BranchingNarrativeModal
          choice={currentChoice}
          selectedOptionId={chosenOptionId}
          onSelectOption={(optId) => {
            setSelectedChoices(prev => ({ ...prev, [currentChoice.id]: optId }));
          }}
          onClose={() => setActiveChoiceModal(false)}
        />
      )}

      {/* Floating Panel Annotation Modal */}
      <PanelAnnotationModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        actTitle={chapter.act}
        pageNumber={currentPanelIndex + 1}
        initialText={currentAnnotation?.text || ''}
        updatedAt={currentAnnotation?.updatedAt}
        onSave={handleSaveNote}
        onDelete={currentAnnotation ? handleDeleteNote : undefined}
      />
    </div>
  );
};

