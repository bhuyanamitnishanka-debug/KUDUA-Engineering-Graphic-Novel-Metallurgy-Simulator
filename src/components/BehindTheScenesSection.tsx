import React, { useState } from 'react';
import { BTS_DATA, STORYBOARD_STEPS } from '../data/btsData';
import { Sparkles, Layers, Palette, Cpu, Film, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

export const BehindTheScenesSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [artMode, setArtMode] = useState<'ink' | 'cad' | 'sketch'>('ink');

  const currentStep = STORYBOARD_STEPS.find(s => s.step === activeStep) || STORYBOARD_STEPS[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
          <span>CREATIVE & SCIENTIFIC ARCHIVE</span>
          <span>·</span>
          <span>MAKING OF KUDUA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-epic text-stone-100">
          Behind the Scenes: Concept Art, Storyboards & Physics
        </h1>
        <p className="text-xs sm:text-sm font-body text-stone-400 max-w-3xl">
          An intimate look inside the multi-disciplinary pipeline transforming raw metallurgical patents and thermodynamic differential equations into an interactive graphic novel book.
        </p>
      </div>

      {/* Interactive Storyboard Stepper */}
      <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 border-2 border-stone-800 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
              The 4-Stage Development Pipeline
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-epic text-stone-100 mt-0.5">
              Interactive Storyboard Deconstruction
            </h2>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-950 border border-stone-800 rounded-xl">
            {STORYBOARD_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  sound.playClank();
                  setActiveStep(s.step);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  activeStep === s.step
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
                }`}
              >
                Stage {s.step}
              </button>
            ))}
          </div>
        </div>

        {/* Active Stage Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-stone-950 rounded-xl border border-stone-800">
          <div className="md:col-span-8 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-comic font-black text-sm">
                0{currentStep.step}
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-comic text-stone-100">
                  {currentStep.title}
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  Focal Scope: {currentStep.focus}
                </span>
              </div>
            </div>

            <p className="text-sm font-body text-stone-300 leading-relaxed">
              {currentStep.description}
            </p>

            <div className="p-3 bg-stone-900 rounded-lg border border-stone-800/80 text-xs font-mono text-stone-400">
              <span className="text-amber-400 font-bold block mb-0.5">Visual Language & Assets:</span>
              {currentStep.aesthetic}
            </div>
          </div>

          {/* Visual State Mockup */}
          <div className="md:col-span-4 p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center min-h-[160px] text-center">
            {currentStep.step === 1 && (
              <div className="flex flex-col items-center gap-2">
                <Compass className="w-8 h-8 text-amber-500 animate-spin-slow" />
                <span className="text-xs font-mono text-stone-300">Patent & CFD Boundary Audit</span>
                <span className="text-[10px] font-mono text-stone-500">1450°C Molten Steel Analysis</span>
              </div>
            )}
            {currentStep.step === 2 && (
              <div className="flex flex-col items-center gap-2">
                <Layers className="w-8 h-8 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-stone-300">ObjectARX Vector Wireframes</span>
                <span className="text-[10px] font-mono text-stone-500">3.5m Clearance & Kinematics</span>
              </div>
            )}
            {currentStep.step === 3 && (
              <div className="flex flex-col items-center gap-2">
                <Palette className="w-8 h-8 text-orange-500" />
                <span className="text-xs font-mono text-stone-300">Comic Inking & Halftone Shaders</span>
                <span className="text-[10px] font-mono text-stone-500">High-Contrast Noir Metallurgy</span>
              </div>
            )}
            {currentStep.step === 4 && (
              <div className="flex flex-col items-center gap-2">
                <Cpu className="w-8 h-8 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-stone-300">Live Mathematical Telemetry</span>
                <span className="text-[10px] font-mono text-stone-500">NumPy & Web Audio Binding</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Visual Art Mode Explorer */}
      <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 border-2 border-stone-800 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Art Direction & Rendering Shaders
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-epic text-stone-100 mt-0.5">
              Interactive Visual Pipeline Inspector
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-950 border border-stone-800 rounded-xl">
            <button
              onClick={() => { sound.playClank(); setArtMode('ink'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                artMode === 'ink'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
              }`}
            >
              Full Inked Comic
            </button>
            <button
              onClick={() => { sound.playClank(); setArtMode('cad'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                artMode === 'cad'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
              }`}
            >
              CAD Blueprint
            </button>
            <button
              onClick={() => { sound.playClank(); setArtMode('sketch'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                artMode === 'sketch'
                  ? 'bg-stone-200 text-black font-bold'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
              }`}
            >
              Draft Wireframe
            </button>
          </div>
        </div>

        {/* Dynamic Art Mode Viewport */}
        <div className={`w-full h-64 sm:h-80 rounded-xl overflow-hidden relative border-2 transition-all flex items-center justify-center ${
          artMode === 'ink'
            ? 'bg-stone-950 border-amber-500/80'
            : artMode === 'cad'
            ? 'bg-[#081325] border-cyan-500/80 blueprint-grid'
            : 'bg-stone-900 border-stone-600'
        }`}>
          {/* SVG Visual Demonstrating the Art Filter */}
          <svg viewBox="0 0 600 240" className="w-full h-full max-h-72">
            {artMode === 'ink' && (
              <>
                <rect width="600" height="240" fill="#0c0a09" />
                <path d="M 50 180 Q 200 130 350 150 T 550 120" stroke="#f59e0b" strokeWidth="24" strokeLinecap="round" />
                <path d="M 60 180 Q 200 135 350 155 T 540 125" stroke="#fef08a" strokeWidth="8" strokeLinecap="round" />
                <rect x="240" y="40" width="120" height="50" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" rx="4" />
                <line x1="300" y1="90" x2="300" y2="150" stroke="#e2e8f0" strokeWidth="8" />
                <text x="300" y="70" fill="#f8fafc" fontSize="12" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle">
                  INKED GANTRY ROBOT
                </text>
                <circle cx="300" cy="150" r="14" fill="#f59e0b" fillOpacity="0.5" className="animate-ping" />
              </>
            )}

            {artMode === 'cad' && (
              <>
                <rect width="600" height="240" fill="#081325" />
                <line x1="50" y1="40" x2="550" y2="40" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 3" />
                <line x1="50" y1="200" x2="550" y2="200" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 3" />
                <rect x="240" y="50" width="120" height="40" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <line x1="300" y1="90" x2="300" y2="180" stroke="#38bdf8" strokeWidth="2" />
                <text x="300" y="75" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  OBJECTARX MESH: 3.5m
                </text>
                <text x="300" y="140" fill="#0ea5e9" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                  Z-AXIS INTERPOLATION
                </text>
              </>
            )}

            {artMode === 'sketch' && (
              <>
                <rect width="600" height="240" fill="#1c1917" />
                <path d="M 50 180 Q 200 130 350 150 T 550 120" fill="none" stroke="#78716c" strokeWidth="3" strokeDasharray="8 4" />
                <rect x="240" y="50" width="120" height="40" fill="none" stroke="#a8a29e" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="300" y1="90" x2="300" y2="180" stroke="#a8a29e" strokeWidth="2" strokeDasharray="4 2" />
                <text x="300" y="75" fill="#d6d3d1" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  PENCIL THUMBNAIL LAYOUT
                </text>
              </>
            )}
          </svg>

          <div className="absolute bottom-3 left-3 bg-stone-950/90 border border-stone-800 px-3 py-1 rounded text-xs font-mono text-stone-300">
            Active Mode: {artMode === 'ink' ? 'Final Inked Graphic Novel' : artMode === 'cad' ? 'Vector CAD Engine Blueprint' : 'Conceptual Storyboard Wireframe'}
          </div>
        </div>
      </div>

      {/* BTS Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BTS_DATA.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-bold uppercase">{item.category}</span>
                <span className="text-stone-500">KUDUA ARCHIVE</span>
              </div>
              <h3 className="text-xl font-bold font-epic text-stone-100">
                {item.title}
              </h3>
              <p className="text-xs font-body text-stone-300 leading-relaxed">
                {item.description}
              </p>

              <ul className="flex flex-col gap-2 mt-2">
                {item.details.map((detail, dIdx) => (
                  <li key={dIdx} className="text-xs font-body text-stone-400 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {item.specs && (
              <div className="p-2.5 bg-stone-950 rounded-lg border border-stone-800/80 font-mono text-[11px] text-cyan-300">
                {item.specs}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
