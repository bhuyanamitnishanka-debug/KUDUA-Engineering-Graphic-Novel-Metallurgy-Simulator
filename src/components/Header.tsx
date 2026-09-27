import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Bookmark, Search, BarChart3, Radio, Flame, Cpu, Wind, Layers, Eye } from 'lucide-react';
import { ReadingMode } from '../types/novel';
import { AmbientSoundscape } from '../utils/audio';
import { AmbientAtmosphereControl } from './AmbientAtmosphereControl';

interface HeaderProps {
  currentMode: ReadingMode;
  onSelectMode: (mode: ReadingMode) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onStartReading: () => void;
  bookmark?: {
    chapterIndex: number;
    panelIndex: number;
    act: string;
    title: string;
  } | null;
  onResumeBookmark?: () => void;
  onOpenSearch?: () => void;
  onOpenAnalytics?: () => void;
  currentSoundscape?: AmbientSoundscape;
  volume?: number;
  onSelectSoundscape?: (soundscape: AmbientSoundscape) => void;
  onVolumeChange?: (vol: number) => void;
  isReaderMode?: boolean;
  onToggleReaderMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleSound,
  onStartReading,
  bookmark,
  onResumeBookmark,
  onOpenSearch,
  onOpenAnalytics,
  currentSoundscape = 'furnace',
  volume = 0.5,
  onSelectSoundscape,
  onVolumeChange,
  isReaderMode = false,
  onToggleReaderMode,
}) => {
  const [isAtmosphereOpen, setIsAtmosphereOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-950/95 backdrop-blur border-b border-stone-800 px-3 sm:px-6 md:px-8 py-3 flex items-center justify-between">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onSelectMode('book')} 
          className="text-xl md:text-2xl font-bold tracking-tight text-amber-500 font-epic hover:text-amber-400 transition-colors whitespace-nowrap text-left"
        >
          KUDUA
        </button>

        {isReaderMode && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950/60 border border-amber-500/40 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Focus Mode</span>
          </span>
        )}
      </div>

      {/* Zone 2: 4-6 clean text navigation links (hidden when in Reader Mode to eliminate distractions) */}
      {!isReaderMode && (
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-400 font-body">
          <button
            onClick={() => onSelectMode('book')}
            className={`transition-colors whitespace-nowrap hover:text-stone-100 ${
              currentMode === 'book' || currentMode === 'webtoon' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Graphic Novel
          </button>
          <button
            onClick={() => onSelectMode('characters')}
            className={`transition-colors whitespace-nowrap hover:text-stone-100 ${
              currentMode === 'characters' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Characters
          </button>
          <button
            onClick={() => onSelectMode('technologies')}
            className={`transition-colors whitespace-nowrap hover:text-stone-100 ${
              currentMode === 'technologies' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Technologies
          </button>
          <button
            onClick={() => onSelectMode('bts')}
            className={`transition-colors whitespace-nowrap hover:text-stone-100 ${
              currentMode === 'bts' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Behind The Scenes
          </button>
          <button
            onClick={() => onSelectMode('blueprint')}
            className={`transition-colors whitespace-nowrap hover:text-stone-100 ${
              currentMode === 'blueprint' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Blueprints
          </button>
          <button
            onClick={() => onSelectMode('thermal')}
            className={`transition-colors whitespace-nowrap hover:text-stone-100 ${
              currentMode === 'thermal' || currentMode === 'kinematics' || currentMode === 'codex' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Engineering Labs
          </button>
        </nav>
      )}

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Reader Mode Toggle */}
        {onToggleReaderMode && (
          <button
            onClick={onToggleReaderMode}
            aria-label={isReaderMode ? 'Exit Reader Mode' : 'Toggle Reader Focus Mode'}
            className={`px-2.5 sm:px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono border shadow-sm ${
              isReaderMode
                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-amber-500/20'
                : 'text-stone-400 hover:text-amber-400 border-stone-800 hover:border-amber-500/50 bg-stone-900/60'
            }`}
            title={isReaderMode ? 'Exit Reader Mode (Esc)' : 'Toggle Reader Mode (Simplified layout & larger typography)'}
          >
            <Eye className={`w-3.5 h-3.5 ${isReaderMode ? 'text-black' : 'text-amber-500'}`} />
            <span className="hidden sm:inline">{isReaderMode ? 'Focus On' : 'Reader Mode'}</span>
          </button>
        )}

        {/* Global Search Button */}
        {onOpenSearch && !isReaderMode && (
          <button
            onClick={onOpenSearch}
            aria-label="Search novel content"
            className="px-2.5 sm:px-3 py-1.5 text-xs text-stone-400 hover:text-amber-400 border border-stone-800 hover:border-amber-500/50 rounded-lg transition-colors flex items-center gap-1.5 font-mono bg-stone-900/60"
            title="Search graphic novel (⌘K or /)"
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline text-[9px] text-stone-500 bg-stone-950 px-1 py-0.2 rounded border border-stone-800">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Reading Analytics Button */}
        {onOpenAnalytics && !isReaderMode && (
          <button
            onClick={onOpenAnalytics}
            aria-label="View Reading Analytics"
            className="px-2.5 sm:px-3 py-1.5 text-xs text-stone-400 hover:text-cyan-400 border border-stone-800 hover:border-cyan-500/50 rounded-lg transition-colors flex items-center gap-1.5 font-mono bg-stone-900/60"
            title="Engineering Reading Analytics (Telemetry & Speed)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Analytics</span>
          </button>
        )}

        {/* Ambient Atmosphere Soundscape Control Button */}
        <button
          onClick={() => setIsAtmosphereOpen(prev => !prev)}
          aria-label="Toggle Ambient Atmosphere Control Panel"
          className={`px-2.5 py-1.5 text-xs border rounded-lg transition-colors flex items-center gap-1.5 font-mono shadow-sm ${
            isAtmosphereOpen
              ? 'bg-amber-500 text-black border-amber-400 font-bold'
              : isMuted || currentSoundscape === 'off'
              ? 'bg-stone-900/60 text-stone-400 border-stone-800 hover:border-stone-700'
              : 'bg-amber-950/30 text-amber-300 border-amber-500/40 hover:border-amber-400'
          }`}
          title="Ambient Atmosphere Soundscapes: Blast Furnace Roar, Laboratory Hum, Ambient Wind"
        >
          {currentSoundscape === 'furnace' && <Flame className={`w-3.5 h-3.5 ${!isMuted ? 'text-amber-500' : 'text-stone-500'}`} />}
          {currentSoundscape === 'lab' && <Cpu className={`w-3.5 h-3.5 ${!isMuted ? 'text-cyan-400' : 'text-stone-500'}`} />}
          {currentSoundscape === 'wind' && <Wind className={`w-3.5 h-3.5 ${!isMuted ? 'text-emerald-400' : 'text-stone-500'}`} />}
          {currentSoundscape === 'vault' && <Layers className={`w-3.5 h-3.5 ${!isMuted ? 'text-purple-400' : 'text-stone-500'}`} />}
          {currentSoundscape === 'off' && <VolumeX className="w-3.5 h-3.5 text-stone-500" />}

          <span className="hidden xl:inline">
            {isMuted ? 'Atmosphere Muted' : currentSoundscape === 'furnace' ? 'Furnace Roar' : currentSoundscape === 'lab' ? 'Lab Hum' : currentSoundscape === 'wind' ? 'Ambient Wind' : currentSoundscape === 'vault' ? 'Vault Drone' : 'Atmosphere'}
          </span>
          <span className="hidden sm:inline xl:hidden">Atmosphere</span>

          {/* Real-time wave animation pulse */}
          {!isMuted && currentSoundscape !== 'off' && (
            <span className="flex items-end gap-0.5 h-2.5 ml-0.5">
              <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse" />
              <span className="w-0.5 h-1.5 bg-amber-400 animate-ping" />
              <span className="w-0.5 h-2 bg-amber-400 animate-pulse" />
            </span>
          )}
        </button>

        {/* Bookmark Resume Action */}
        {bookmark && onResumeBookmark && (
          <button
            onClick={onResumeBookmark}
            aria-label={`Resume reading at ${bookmark.act}, Page ${bookmark.panelIndex + 1}`}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/60 hover:border-amber-400 rounded-lg transition-colors font-comic tracking-wider whitespace-nowrap flex items-center gap-1.5 shadow-sm"
            title={`Resume at ${bookmark.act} (Page ${bookmark.panelIndex + 1})`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Resume</span>
            <span className="text-[10px] opacity-80 font-mono hidden md:inline">· Act {bookmark.chapterIndex + 1}</span>
          </button>
        )}

        {!isReaderMode && (
          <button
            onClick={onStartReading}
            className="px-3 sm:px-4 py-2 text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors font-comic tracking-wider whitespace-nowrap shadow-sm flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Novel</span>
          </button>
        )}
      </div>

      {/* Floating Ambient Atmosphere Control Panel */}
      <AmbientAtmosphereControl
        isOpen={isAtmosphereOpen}
        onClose={() => setIsAtmosphereOpen(false)}
        currentSoundscape={currentSoundscape}
        isMuted={isMuted}
        volume={volume}
        onSelectSoundscape={(soundscape) => {
          if (onSelectSoundscape) onSelectSoundscape(soundscape);
        }}
        onToggleMute={onToggleSound}
        onVolumeChange={(vol) => {
          if (onVolumeChange) onVolumeChange(vol);
        }}
      />
    </header>
  );
};


