import React, { useState } from 'react';
import { CHARACTERS_DATA } from '../data/charactersData';
import { CharacterBio } from '../types/novel';
import { Shield, Sparkles, User, Award, Quote, CheckCircle2, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface CharactersSectionProps {
  onReadChapterWithCharacter?: (chapterIdx: number) => void;
}

export const CharactersSection: React.FC<CharactersSectionProps> = ({ onReadChapterWithCharacter }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterBio>(CHARACTERS_DATA[0]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
          <span>DRAMATIS PERSONAE</span>
          <span>·</span>
          <span>OPERATIONAL DOSSIERS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-epic text-stone-100">
          Key Personnel & Autonomous Entities
        </h1>
        <p className="text-xs sm:text-sm font-body text-stone-400 max-w-3xl">
          The multidisciplinary pioneers bridging ancient Sanskrit metallurgical heritage with aerospace robotics and computer vision at the Tata InnoVerse blast furnace.
        </p>
      </div>

      {/* Main Grid: Selector Column & Detail Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Character Selector List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          {CHARACTERS_DATA.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            return (
              <button
                key={char.id}
                onClick={() => {
                  sound.playClank();
                  setSelectedCharacter(char);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-comic font-bold text-sm shadow-md ${char.avatarColor}`}>
                    {char.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold font-comic text-stone-100 group-hover:text-amber-400 transition-colors">
                      {char.name}
                    </div>
                    <div className="text-[11px] font-mono text-stone-400">
                      Callsign: <span className="text-amber-400 font-semibold">{char.callsign}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'text-stone-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Character Dossier (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-stone-900/90 border-2 border-stone-800 shadow-2xl">
          {/* Top Dossier Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-comic font-black text-2xl shadow-xl ${selectedCharacter.avatarColor}`}>
                {selectedCharacter.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-mono text-amber-500 tracking-wider uppercase block">
                  {selectedCharacter.department}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-epic text-stone-100">
                  {selectedCharacter.name}
                </h2>
                <div className="text-xs font-mono text-cyan-400 mt-0.5">
                  Role: {selectedCharacter.role} · Callsign: <span className="text-amber-400 font-bold">{selectedCharacter.callsign}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Quote Plaque */}
          <div className="p-4 bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl border-t border-b border-r border-stone-800 flex items-start gap-3">
            <Quote className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-body italic text-stone-200 leading-relaxed">
              "{selectedCharacter.signatureQuote}"
            </p>
          </div>

          {/* Background & Personal Motivation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase text-stone-400 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" /> Professional Background
              </span>
              <p className="text-xs font-body text-stone-300 leading-relaxed">
                {selectedCharacter.background}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase text-stone-400 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" /> Core Driver & Motivation
              </span>
              <p className="text-xs font-body text-stone-300 leading-relaxed">
                {selectedCharacter.motivation}
              </p>
            </div>
          </div>

          {/* Key Contributions */}
          <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-amber-500 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Key Architectural Contributions</span>
            </span>
            <ul className="flex flex-col gap-2">
              {selectedCharacter.keyContributions.map((kc, idx) => (
                <li key={idx} className="text-xs sm:text-sm font-body text-stone-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>{kc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Ratings Matrix */}
          <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-stone-400 font-semibold">
              Operational Competencies
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">Robotics & Manipulator Kinematics</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{selectedCharacter.stats.robotics}%</span>
                </div>
                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.robotics}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">High-Temp Metallurgy & Refractories</span>
                  <span className="text-amber-400 font-bold tabular-nums">{selectedCharacter.stats.metallurgy}%</span>
                </div>
                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.metallurgy}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">AI Perception & Computer Vision</span>
                  <span className="text-purple-400 font-bold tabular-nums">{selectedCharacter.stats.aiOps}%</span>
                </div>
                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.aiOps}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">Safety Governance & Zero-Harm</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{selectedCharacter.stats.safetyLeadership}%</span>
                </div>
                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.safetyLeadership}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
