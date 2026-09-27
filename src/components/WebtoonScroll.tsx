import React from 'react';
import { NovelChapter } from '../types/novel';
import { ComicArtScene } from './ComicArtScene';
import { Shield, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface WebtoonScrollProps {
  chapters: NovelChapter[];
  onOpenLab: (tab: 'thermal' | 'blueprint' | 'kinematics') => void;
}

export const WebtoonScroll: React.FC<WebtoonScrollProps> = ({ chapters, onOpenLab }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-16">
      {/* Webtoon Intro Header */}
      <div className="text-center pb-8 border-b border-stone-800">
        <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">
          Scrollable Webtoon Graphic Chronicle
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-epic text-stone-100 mt-2">
          Kudua: The Autonomous Forge
        </h1>
        <p className="text-stone-400 text-sm font-body mt-2 max-w-xl mx-auto">
          Continuous vertical webtoon reading experience through all 5 Acts of the Tata InnoVerse Hot Metal Sampling & Ancient Metallurgy Breakthrough.
        </p>
      </div>

      {/* Chapters Stream */}
      {chapters.map((chapter) => (
        <article key={chapter.id} className="flex flex-col gap-10">
          {/* Chapter Act Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-950 border-2 border-stone-800 flex flex-col gap-2">
            <span className="text-xs font-mono text-amber-500 font-semibold tracking-wider">
              {chapter.act} · CHAPTER #{chapter.id}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-epic text-stone-100">
              {chapter.title}
            </h2>
            <p className="text-sm font-body text-stone-300">
              {chapter.subtitle}
            </p>
            <p className="text-xs font-body text-stone-400 mt-1 italic">
              {chapter.summary}
            </p>
          </div>

          {/* Chapter Panels */}
          {chapter.panels.map((panel) => (
            <div
              key={panel.id}
              className="flex flex-col gap-4 p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-stone-700 transition-colors"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="text-amber-400 font-semibold">{panel.title}</span>
                <span>{panel.timeCode}</span>
              </div>

              {/* Graphic Scene */}
              <div className="relative">
                <ComicArtScene sceneType={panel.sceneType} title={panel.title} />

                {panel.soundEffect && (
                  <button
                    onClick={() => sound.playPneumaticHiss()}
                    className={`absolute -top-3 -right-2 px-3 py-1 bg-stone-950 border-2 border-current rounded font-comic font-black text-lg tracking-wider transform rotate-3 shadow-lg ${
                      panel.soundEffectColor || 'text-amber-400'
                    }`}
                  >
                    {panel.soundEffect}
                  </button>
                )}
              </div>

              {/* Caption */}
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-stone-300 text-sm font-body leading-relaxed">
                {panel.narrativeCaption}
              </div>

              {/* Dialogue */}
              {panel.dialogue && panel.dialogue.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  {panel.dialogue.map((d, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3 rounded-lg bg-stone-950/70 border border-stone-800 text-xs sm:text-sm font-body"
                    >
                      <span className="font-comic font-bold text-amber-400 mr-2">
                        {d.speaker} ({d.role}):
                      </span>
                      <span className="text-stone-300 italic">"{d.text}"</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Callout Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {panel.technicalCallouts.map((tc, tcIdx) => (
                  <div
                    key={tcIdx}
                    className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-stone-400">{tc.label}</span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">{tc.spec}</span>
                    </div>
                    <p className="text-[11px] font-body text-stone-500">
                      {tc.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </article>
      ))}

      {/* End of Webtoon Call to Action */}
      <div className="p-8 rounded-2xl bg-amber-950/20 border border-amber-500/40 text-center flex flex-col items-center gap-4">
        <Sparkles className="w-8 h-8 text-amber-400" />
        <h3 className="text-2xl font-bold font-epic text-stone-100">
          Ready to Explore the CAD Blueprints & Live Physics?
        </h3>
        <p className="text-sm font-body text-stone-400 max-w-lg">
          Dive into the interactive 3.5m clearance gantry blueprint, test the Python thermodynamic simulation, or inspect the C++ ObjectARX state machine.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenLab('blueprint')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-cyan-500/50 text-cyan-400 rounded-lg text-xs font-mono font-semibold"
          >
            Launch CAD Blueprints
          </button>
          <button
            onClick={() => onOpenLab('thermal')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-comic font-bold"
          >
            Run Thermal Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
