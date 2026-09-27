import React, { useState } from 'react';
import { TECHNOLOGIES_DATA } from '../data/technologiesData';
import { TechDeepDive } from '../types/novel';
import { Shield, Sparkles, Cpu, Flame, Layers, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

export const TechDeepDiveSection: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechDeepDive>(TECHNOLOGIES_DATA[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Materials', 'Thermodynamics', 'Kinematics', 'Energy', 'Perception'];

  const filteredTechs = activeCategory === 'All'
    ? TECHNOLOGIES_DATA
    : TECHNOLOGIES_DATA.filter(t => t.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <span>ENGINEERING DOSSIER & FEASIBILITY ANALYSIS</span>
          <span>·</span>
          <span>SYSTEM SPECIFICATIONS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-epic text-stone-100">
          Engineered Technologies & Physical Laws
        </h1>
        <p className="text-xs sm:text-sm font-body text-stone-400 max-w-3xl">
          Comprehensive breakdown of the six core architectural innovations that enable 24/7 continuous autonomous sampling in 1450°C blast furnace corridors.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800/60">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClank();
              setActiveCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Layout: Left Selector & Right Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Selector Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {filteredTechs.map((tech) => {
            const isSelected = selectedTech.id === tech.id;
            return (
              <div
                key={tech.id}
                onClick={() => {
                  sound.playPneumaticHiss();
                  setSelectedTech(tech);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500 ring-2 ring-cyan-400/20 shadow-xl'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold uppercase">{tech.category}</span>
                  <span className="text-stone-500">SPEC #2026</span>
                </div>
                <h3 className="text-sm font-bold font-comic text-stone-100">
                  {tech.title}
                </h3>
                <p className="text-xs font-body text-stone-400 line-clamp-2">
                  {tech.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Technology Breakdown (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-stone-900/90 border-2 border-stone-800 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col gap-1.5 pb-4 border-b border-stone-800">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              {selectedTech.category} · Core Architecture Specification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-epic text-stone-100">
              {selectedTech.title}
            </h2>
          </div>

          {/* Ancient Heritage vs Modern Application Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 flex flex-col gap-1.5">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                Classical Bhartiya Heritage
              </span>
              <p className="text-xs font-body text-stone-300 leading-relaxed">
                {selectedTech.ancientHeritage}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex flex-col gap-1.5">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Aerospace & Robotic Modernization
              </span>
              <p className="text-xs font-body text-stone-300 leading-relaxed">
                {selectedTech.modernApplication}
              </p>
            </div>
          </div>

          {/* Architectural Summary */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-sm font-body text-stone-300 leading-relaxed">
            {selectedTech.summary}
          </div>

          {/* Technical Spec Sheet Grid */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono uppercase text-stone-400 tracking-wider font-semibold">
              Verified Technical Performance Sheet
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedTech.specSheet.map((spec, sIdx) => (
                <div key={sIdx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-stone-400">{spec.label}</span>
                  <span className="text-sm font-mono font-bold text-amber-400 tabular-nums mt-1">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Physics & Mathematical Equations */}
          <div className="flex flex-col gap-3 p-5 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Governing Differential Equations & Physics Models</span>
            </span>

            <div className="flex flex-col gap-3">
              {selectedTech.equations.map((eq, eIdx) => (
                <div key={eIdx} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex flex-col gap-1">
                  <code className="text-xs sm:text-sm font-mono text-amber-300 font-bold">
                    {eq.formula}
                  </code>
                  <p className="text-xs font-body text-stone-400">
                    {eq.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Principles List */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-stone-400 tracking-wider font-semibold">
              Thermodynamic & Mechanical Principles
            </span>
            <ul className="flex flex-col gap-2">
              {selectedTech.physicalPrinciples.map((principle, pIdx) => (
                <li key={pIdx} className="text-xs sm:text-sm font-body text-stone-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Industrial Safety Impact */}
          <div className="p-4 bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl border-t border-b border-r border-stone-800 text-xs sm:text-sm font-body text-stone-200">
            <strong className="text-emerald-400 font-comic uppercase block mb-1">
              Industrial Safety & Zero-Harm Impact:
            </strong>
            {selectedTech.industrialSafetyImpact}
          </div>
        </div>
      </div>
    </div>
  );
};
