import React, { useRef, useEffect } from 'react';
import { 
  Flame, Cpu, Wind, Layers, Volume2, VolumeX, 
  X, Radio, Sparkles, Check, Sliders 
} from 'lucide-react';
import { AmbientSoundscape, sound } from '../utils/audio';

interface AmbientAtmosphereControlProps {
  isOpen: boolean;
  onClose: () => void;
  currentSoundscape: AmbientSoundscape;
  isMuted: boolean;
  volume: number;
  onSelectSoundscape: (soundscape: AmbientSoundscape) => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
}

interface SoundscapeOption {
  id: AmbientSoundscape;
  title: string;
  subtitle: string;
  spec: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBorder: string;
  activeBg: string;
  recommendedLab: string;
}

const SOUNDSCAPES: SoundscapeOption[] = [
  {
    id: 'furnace',
    title: 'Blast Furnace Roar',
    subtitle: '1450°C Molten Iron & Blower Jets',
    spec: 'Dual 52Hz/78Hz drone + 190Hz turbulent draft',
    icon: Flame,
    color: 'text-amber-500',
    activeBorder: 'border-amber-500',
    activeBg: 'bg-amber-950/30',
    recommendedLab: 'Recommended: Thermal Engine Simulator'
  },
  {
    id: 'lab',
    title: 'Laboratory Hum',
    subtitle: 'Cleanroom Telemetry & Sensor Arrays',
    spec: '60Hz/120Hz mains hum + 1800Hz clean HVAC',
    icon: Cpu,
    color: 'text-cyan-400',
    activeBorder: 'border-cyan-500',
    activeBg: 'bg-cyan-950/30',
    recommendedLab: 'Recommended: CAD Blueprints & Codex'
  },
  {
    id: 'wind',
    title: 'Ambient Wind',
    subtitle: 'Kudua Stack Convective Air Draft',
    spec: 'LFO-modulated 0.12Hz sweeping convective draft',
    icon: Wind,
    color: 'text-emerald-400',
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-950/30',
    recommendedLab: 'Recommended: Kudua Stack & Aerial Drone'
  },
  {
    id: 'vault',
    title: 'Subterranean Vault',
    subtitle: 'UEPSS Soil Electrochemical Drone',
    spec: '42Hz ultra-low foundation grounding resonance',
    icon: Layers,
    color: 'text-purple-400',
    activeBorder: 'border-purple-500',
    activeBg: 'bg-purple-950/30',
    recommendedLab: 'Recommended: Agastya Battery Vault'
  },
  {
    id: 'off',
    title: 'Mute Atmosphere',
    subtitle: 'Zero background soundscape',
    spec: 'Audio synthesizer paused',
    icon: VolumeX,
    color: 'text-stone-400',
    activeBorder: 'border-stone-600',
    activeBg: 'bg-stone-900',
    recommendedLab: 'Silent focus reading'
  }
];

export const AmbientAtmosphereControl: React.FC<AmbientAtmosphereControlProps> = ({
  isOpen,
  onClose,
  currentSoundscape,
  isMuted,
  volume,
  onSelectSoundscape,
  onToggleMute,
  onVolumeChange
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-end p-3 sm:p-6 sm:pt-16">
      <div 
        ref={panelRef}
        className="w-full max-w-sm sm:max-w-md bg-stone-950 border-2 border-stone-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 relative text-stone-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/50 border border-amber-500/40 flex items-center justify-center text-amber-500">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-comic text-stone-100 tracking-wide">
                Ambient Atmosphere
              </h3>
              <p className="text-[11px] font-mono text-stone-400">
                Procedural Web Audio Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClank();
                onToggleMute();
              }}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1 ${
                isMuted 
                  ? 'bg-rose-950/40 border-rose-600/60 text-rose-300' 
                  : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
              }`}
              title={isMuted ? 'Unmute Atmosphere' : 'Mute Atmosphere'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer Bar */}
        <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 4 Animated EQ frequency bands */}
            <div className="flex items-end gap-1 h-4">
              <span className={`w-1 rounded-full bg-amber-500 transition-all ${
                !isMuted && currentSoundscape !== 'off' ? 'h-4 animate-pulse' : 'h-1.5 opacity-30'
              }`} />
              <span className={`w-1 rounded-full bg-amber-400 transition-all ${
                !isMuted && currentSoundscape !== 'off' ? 'h-3 animate-ping' : 'h-1.5 opacity-30'
              }`} />
              <span className={`w-1 rounded-full bg-cyan-400 transition-all ${
                !isMuted && currentSoundscape !== 'off' ? 'h-4 animate-pulse' : 'h-1.5 opacity-30'
              }`} />
              <span className={`w-1 rounded-full bg-emerald-400 transition-all ${
                !isMuted && currentSoundscape !== 'off' ? 'h-2 animate-bounce' : 'h-1.5 opacity-30'
              }`} />
            </div>
            <span className="text-xs font-mono text-stone-300">
              {isMuted || currentSoundscape === 'off' ? (
                <span className="text-stone-500">Audio Muted / Idle</span>
              ) : (
                <span className="text-amber-400 font-semibold">Active: {SOUNDSCAPES.find(s => s.id === currentSoundscape)?.title}</span>
              )}
            </span>
          </div>

          <span className="text-[10px] font-mono text-cyan-400/80">
            0-Lag Synthesis
          </span>
        </div>

        {/* Master Atmosphere Volume Slider */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-stone-900/50 border border-stone-800">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-stone-400" />
              <span>Atmosphere Intensity</span>
            </span>
            <span className="font-bold text-amber-400 tabular-nums">
              {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer appearance-none"
          />
        </div>

        {/* Soundscape Options List */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
          {SOUNDSCAPES.map((option) => {
            const isSelected = currentSoundscape === option.id;
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                onClick={() => {
                  sound.playClank();
                  onSelectSoundscape(option.id);
                }}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? `${option.activeBg} ${option.activeBorder} ring-2 ring-amber-400/10 shadow-lg`
                    : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg bg-stone-950 border border-stone-800 shrink-0 ${option.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold font-comic text-stone-100 truncate">
                        {option.title}
                      </span>
                      {isSelected && (
                        <span className="p-0.5 rounded-full bg-amber-500 text-black">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-body text-stone-400 mt-0.5 truncate">
                      {option.subtitle}
                    </p>
                    <p className="text-[10px] font-mono text-cyan-400/90 mt-1">
                      {option.spec}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lab Immersion Advice Footer */}
        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[10px] font-mono text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Toggles in real-time during Thermal & CAD simulations</span>
          </span>
        </div>
      </div>
    </div>
  );
};
