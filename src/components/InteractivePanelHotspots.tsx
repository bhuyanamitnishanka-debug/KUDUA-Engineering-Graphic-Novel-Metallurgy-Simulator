import React, { useState } from 'react';
import { PanelHotspot } from '../types/novel';
import { Crosshair, Info, Sparkles, AlertCircle, ArrowUpRight, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface InteractivePanelHotspotsProps {
  hotspots?: PanelHotspot[];
  onOpenTechDoc?: (techRef: string) => void;
}

export const InteractivePanelHotspots: React.FC<InteractivePanelHotspotsProps> = ({
  hotspots,
  onOpenTechDoc,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<PanelHotspot | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  if (!hotspots || hotspots.length === 0) return null;

  const handleHotspotClick = (hs: PanelHotspot) => {
    setActiveHotspot(hs);
    setAnimatingId(hs.id);

    // Audio trigger based on animation type
    if (hs.animationType === 'pneumatic-burst') {
      sound.playPneumaticHiss();
    } else if (hs.animationType === 'spark-shower') {
      sound.playAlarm();
    } else {
      sound.playClank();
    }

    setTimeout(() => {
      setAnimatingId(null);
    }, 1200);
  };

  return (
    <>
      {/* Hotspot Markers on Canvas */}
      {hotspots.map((hs) => {
        const isSelected = activeHotspot?.id === hs.id;
        const isTriggered = animatingId === hs.id;

        return (
          <div
            key={hs.id}
            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleHotspotClick(hs);
            }}
          >
            {/* Animation burst on click/hover */}
            {isTriggered && (
              <div className="absolute inset-0 -m-4 pointer-events-none flex items-center justify-center">
                {hs.animationType === 'spark-shower' && (
                  <span className="w-16 h-16 rounded-full bg-amber-500/40 border-2 border-amber-400 animate-ping" />
                )}
                {hs.animationType === 'pneumatic-burst' && (
                  <span className="w-20 h-20 rounded-full border-2 border-cyan-400 opacity-80 animate-ping" />
                )}
                {hs.animationType === 'laser-reticle' && (
                  <span className="w-14 h-14 rounded-full border-2 border-rose-500 animate-pulse" />
                )}
                {hs.animationType === 'heat-scan' && (
                  <span className="w-16 h-16 rounded-full bg-orange-600/30 border border-orange-500 animate-ping" />
                )}
              </div>
            )}

            {/* Target Pin Marker */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-amber-500 text-black scale-110 shadow-lg shadow-amber-500/40 ring-4 ring-amber-400/30'
                  : 'bg-stone-900/90 text-cyan-400 border border-cyan-500/50 hover:border-amber-400 hover:text-amber-400 hover:scale-105'
              }`}
              title={hs.title}
            >
              <Crosshair className="w-4 h-4 animate-spin-slow" />
            </div>

            {/* Floating Quick Tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
              <div className="px-2.5 py-1 bg-stone-950/95 border border-amber-500/40 rounded text-[11px] font-mono text-amber-300 whitespace-nowrap shadow-xl">
                {hs.title}
              </div>
            </div>
          </div>
        );
      })}

      {/* Active Hotspot Detail Card Modal / Popover */}
      {activeHotspot && (
        <div 
          onClick={() => setActiveHotspot(null)}
          className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-stone-950 border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl relative flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-amber-500 tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Engineering Hotspot Inspection</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-epic text-stone-100 mt-0.5">
                {activeHotspot.title}
              </h4>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">
                {activeHotspot.shortDesc}
              </p>
            </div>

            {/* Body */}
            <p className="text-xs font-body text-stone-300 leading-relaxed">
              {activeHotspot.detail}
            </p>

            {/* Formula / Spec */}
            {activeHotspot.formula && (
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 font-mono text-xs text-amber-300">
                <span className="text-[10px] text-stone-500 block mb-0.5 uppercase">Thermodynamic Law:</span>
                <code>{activeHotspot.formula}</code>
              </div>
            )}

            {/* Reference Source */}
            {activeHotspot.techDocRef && (
              <div className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                <span>Doc Source:</span>
                <span className="text-stone-400">{activeHotspot.techDocRef}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
              <button
                onClick={() => {
                  sound.playPneumaticHiss();
                  handleHotspotClick(activeHotspot);
                }}
                className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono text-[11px] transition-colors"
              >
                Replay Animation
              </button>

              {onOpenTechDoc && (
                <button
                  onClick={() => onOpenTechDoc(activeHotspot.title)}
                  className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-comic font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Read Tech Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
