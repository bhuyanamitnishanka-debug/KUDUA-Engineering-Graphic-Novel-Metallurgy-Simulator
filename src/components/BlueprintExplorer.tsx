import React, { useState } from 'react';
import { Layers, Crosshair, ZoomIn, ZoomOut, RotateCcw, Shield, Info, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface BlueprintHotspot {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  category: 'structural' | 'thermal' | 'sensors' | 'subterranean';
  spec: string;
  description: string;
  engineeringFormula?: string;
}

const BLUEPRINT_HOTSPOTS: BlueprintHotspot[] = [
  {
    id: 'gantry',
    name: '3.5m Overhead Clearance Planar Envelope',
    x: 62,
    y: 18,
    category: 'structural',
    spec: '3.5m Clearance · 5000mm X-Travel',
    description: 'Suspended crane rail system providing 3.5m clearance above sloped metal runner floors, completely out of reach of heavy floor transport vehicles.',
    engineeringFormula: 'Envelope = [X: 0..5000mm, Y: 0..3000mm, Z: 0..2200mm]'
  },
  {
    id: 'carousel',
    name: 'Automated Carousel Magazine',
    x: 78,
    y: 24,
    category: 'structural',
    spec: '10 Single-Use Immersion Probes',
    description: 'Motorized magazine storing 10 ceramic-coated single-use optical & chemical temperature probes for hands-free autonomous cycling.',
  },
  {
    id: 'lance-arm',
    name: 'Fixed-Base Multi-Axis Manipulator & Probe',
    x: 54,
    y: 35,
    category: 'structural',
    spec: '6-Axis Industrial Arm · Heat-Resistant Alloys',
    description: 'Telescopic Z-axis probe plunge mechanism descending 1.85m directly into the molten iron stream under real-time trajectory control.',
    engineeringFormula: 'Kinematic Plunge: Z_target = 1850mm (0.1s steps)'
  },
  {
    id: 'water-jacket',
    name: 'Aerogel & Water-Cooled Fluid Jacket',
    x: 52,
    y: 45,
    category: 'thermal',
    spec: '25 L/min Flow · 4.2 Bar Pressure',
    description: 'Closed-loop fluid cooling jacket surrounding delicate electronics bay, dissipating intense convective heat from 1450°C iron.',
    engineeringFormula: 'q_water = m_dot * Cp * delta_T * 0.42'
  },
  {
    id: 'air-purge',
    name: 'Compressed Air Dust Vortex Tube Purge',
    x: 66,
    y: 48,
    category: 'thermal',
    spec: '350W Heat Extraction · 6.5 Bar',
    description: 'High-pressure air purge creating a positive outward pressure barrier, preventing abrasive conductive graphite dust and noxious fumes from entering.',
    engineeringFormula: 'air_purge = min(350W, q_conductive_leak)'
  },
  {
    id: 'kudua-stack',
    name: 'Ancient Kudua Staggered Draft Stack',
    x: 22,
    y: 38,
    category: 'thermal',
    spec: '18.5m Vertical Height · Draft K = 1.42',
    description: 'Staggered vertical kiln geometry adapted from ancient Bhartiya metallurgy. Traps thermal gradients and naturally accelerates draft without external pumps.',
    engineeringFormula: 'v_draft = sqrt(2 * g * H * (T - T0) / T0) * 1.42'
  },
  {
    id: 'preheat-air',
    name: 'Waste Heat Pre-Heating Channel (600°C)',
    x: 35,
    y: 32,
    category: 'thermal',
    spec: 'Preheat Air: 600°C Max',
    description: 'Directs escaping flue energy back into combustion zones, dramatically cutting fuel requirements while generating methanol byproduct.',
    engineeringFormula: 'CO + 2H2 -> CH3OH (99.4% off-gas capture)'
  },
  {
    id: 'bess-subterranean',
    name: 'Subterranean BESS & Agastya Cells',
    x: 14,
    y: 65,
    category: 'subterranean',
    spec: '1200 kWh · 820V Pack · Agastya Galvanic Soil',
    description: 'Underground energy reservoir combining moist soil-electrolyte galvanic interaction with heavy Lead-Sulfur & Liquid-Lithium surge absorption.',
  },
  {
    id: 'runner-trough',
    name: 'BF Runner Trough & Molten Tapping Zone',
    x: 68,
    y: 72,
    category: 'sensors',
    spec: '1450°C Molten Stream · Sloped Catwalks',
    description: 'The active metallurgical river where iron is tapped from the blast furnace hearth into torpedo transfer rail cars.',
  },
  {
    id: 'drone-sentinel',
    name: 'Surveillance Micro-Drone & CV Edge Sensors',
    x: 82,
    y: 52,
    category: 'sensors',
    spec: '2.5m Hover Vector · 94.8% Clarity',
    description: 'Airborne sentinel tracking optical smoke density, O2/CO gas curtains, and real-time slag pot micro-crack formation using computer vision.',
    engineeringFormula: 'Clarity = (fume_density > 0.8) ? 35.2 : 94.8'
  },
  {
    id: 'emergency-panel',
    name: 'Emergency Retract & Lockout Control',
    x: 52,
    y: 84,
    category: 'structural',
    spec: 'Instant <3s Retract · Lockout State Machine',
    description: 'Hardware interlock tripping rapid retraction to HOME (0,0) if slag blockage, pressure drop, or water cooling interruption occurs.',
  }
];

export const BlueprintExplorer: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<BlueprintHotspot>(BLUEPRINT_HOTSPOTS[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'structural' | 'thermal' | 'sensors' | 'subterranean'>('all');
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredHotspots = activeFilter === 'all' 
    ? BLUEPRINT_HOTSPOTS 
    : BLUEPRINT_HOTSPOTS.filter(h => h.category === activeFilter);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Blueprint Title & Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <span>AUTODESK OBJECTARX CAD ENGINE</span>
            <span>·</span>
            <span>REFERENCE DWG #BF-2026-A1</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-epic text-stone-100 mt-1">
            Ancient Blast Furnace & Kudua Runner Blueprint
          </h1>
          <p className="text-xs sm:text-sm font-body text-stone-400 mt-1">
            Interactive engineering schematic based on Pages 110 & 112 of the Technical Specification Report.
          </p>
        </div>

        {/* Filter Buttons & Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
            {(['all', 'structural', 'thermal', 'sensors', 'subterranean'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  sound.playClank();
                  setActiveFilter(filter);
                }}
                className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-1">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
              className="p-1.5 text-stone-400 hover:text-cyan-400 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 text-stone-400 hover:text-cyan-400 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-stone-400 hover:text-cyan-400 rounded"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main CAD Interactive Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CAD Canvas (Left / Top 8 cols) */}
        <div className="lg:col-span-8 bg-stone-950 rounded-2xl border-2 border-stone-800 p-2 sm:p-4 overflow-hidden relative shadow-2xl">
          {/* Blueprint Grid Lines & Header Plate */}
          <div className="absolute inset-0 blueprint-grid opacity-35 pointer-events-none" />

          {/* Blueprint Title Block (CAD border style) */}
          <div className="absolute top-4 left-4 z-10 p-2.5 bg-stone-900/90 border border-cyan-500/40 rounded text-xs font-mono text-cyan-400">
            <div className="font-bold text-stone-100">KUDUA BLAST FURNACE RUNNER</div>
            <div className="text-[10px] text-stone-400">SCALE: 1:50 · CLEARANCE ENVELOPE: 3.5m</div>
          </div>

          <div 
            className="w-full relative transition-transform duration-200 origin-center min-h-[460px] sm:min-h-[520px] flex items-center justify-center select-none"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* SVG Engineering Diagram */}
            <svg viewBox="0 0 1000 620" className="w-full h-auto max-h-[580px]">
              {/* Floor and Foundation */}
              <rect x="50" y="440" width="900" height="150" fill="#14110e" stroke="#292524" strokeWidth="2" />
              <line x1="50" y1="440" x2="950" y2="440" stroke="#78716c" strokeWidth="3" />
              
              {/* Kudua Stack Tower (Left Side) */}
              <polygon points="120,440 240,440 220,160 140,160" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points="140,160 220,160 210,80 150,80" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              {/* Staggered Kudua rings */}
              <ellipse cx="180" cy="160" rx="40" ry="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse cx="180" cy="240" rx="48" ry="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse cx="180" cy="330" rx="55" ry="16" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Molten Glow inside Kudua Base */}
              <ellipse cx="180" cy="420" rx="45" ry="15" fill="#f59e0b" fillOpacity="0.8" className="animate-pulse" />

              {/* 3.5m Planar Clearance Envelope Box */}
              <rect x="420" y="80" width="480" height="240" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
              <text x="440" y="105" fill="#38bdf8" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
                3.5m OVERHEAD CLEARANCE PLANAR ZONE
              </text>

              {/* Heavy Gantry Rails */}
              <rect x="400" y="120" width="520" height="28" fill="#1e293b" stroke="#0284c7" strokeWidth="2" rx="4" />
              <line x1="400" y1="134" x2="920" y2="134" stroke="#38bdf8" strokeWidth="2" />

              {/* Robotic Manipulator Base & Carriage */}
              <rect x="580" y="148" width="130" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="6" />
              <text x="595" y="175" fill="#f8fafc" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">CARRIAGE X</text>
              <text x="595" y="195" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">POS: 3250mm</text>

              {/* Telescopic Lance Arm (Z-Axis) */}
              <rect x="635" y="208" width="20" height="180" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
              {/* Protective Fluid Jacket */}
              <rect x="625" y="230" width="40" height="90" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" rx="4" opacity="0.85" />
              {/* Lance Probe Tip near Runner */}
              <polygon points="635,388 655,388 645,418" fill="#f59e0b" stroke="#dc2626" strokeWidth="2" />
              <circle cx="645" cy="415" r="16" fill="#f59e0b" fillOpacity="0.4" className="animate-ping" />

              {/* Automated Carousel Magazine */}
              <circle cx="820" cy="180" r="45" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="820" cy="180" r="12" fill="#0ea5e9" />
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                <circle 
                  key={i}
                  cx={820 + 30 * Math.cos(deg * Math.PI / 180)} 
                  cy={180 + 30 * Math.sin(deg * Math.PI / 180)} 
                  r="4" 
                  fill="#f59e0b" 
                />
              ))}
              <text x="760" y="240" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">10-PROBE CAROUSEL</text>

              {/* BF Runner Trough & Molten Metal Stream */}
              <polygon points="460,420 920,380 940,460 480,500" fill="#ea580c" stroke="#dc2626" strokeWidth="2" />
              <line x1="480" y1="430" x2="910" y2="395" stroke="#fef08a" strokeWidth="6" strokeLinecap="round" />
              <line x1="500" y1="450" x2="900" y2="415" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              <text x="700" y="475" fill="#fef08a" fontSize="13" fontFamily="Chakra Petch" fontWeight="bold">
                MOLTEN IRON STREAM (1450°C)
              </text>

              {/* Sloped Floor Plates */}
              <polygon points="340,480 440,430 460,490 360,540" fill="#292524" stroke="#57534e" strokeWidth="2" />
              <text x="350" y="520" fill="#a8a29e" fontSize="10" fontFamily="JetBrains Mono">SLOPED CATWALK</text>

              {/* Subterranean BESS Pack (Underground) */}
              <rect x="70" y="480" width="220" height="100" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" />
              <text x="85" y="505" fill="#34d399" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                SUBTERRANEAN BESS (1200 kWh)
              </text>
              <text x="85" y="525" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                AGASTYA GALVANIC CELLS · 820V
              </text>
              <line x1="70" y1="540" x2="290" y2="540" stroke="#334155" strokeWidth="1" />
              <text x="85" y="560" fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono">
                LIQUID-LITHIUM THERMAL JACKET
              </text>

              {/* Micro-Drone Recon Unit */}
              <g transform="translate(850, 310)">
                <ellipse rx="24" ry="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="-30" y1="0" x2="30" y2="0" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx="-25" cy="0" r="6" fill="#38bdf8" />
                <circle cx="25" cy="0" r="6" fill="#38bdf8" />
                <text x="-40" y="24" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">DRONE #4</text>
              </g>

              {/* Dimension Reference Lines */}
              <line x1="420" y1="70" x2="900" y2="70" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="630" y="65" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                ↔ 5000mm LONG TRAVEL AXIS (X)
              </text>
              <line x1="390" y1="120" x2="390" y2="420" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="350" y="270" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" transform="rotate(-90 350 270)" textAnchor="middle">
                ↕ 2200mm INSERTION (Z)
              </text>

              {/* Render Hotspot Pins */}
              {filteredHotspots.map((hotspot) => {
                const isSelected = selectedHotspot.id === hotspot.id;
                const pinX = hotspot.x * 10;
                const pinY = hotspot.y * 6.2;
                return (
                  <g
                    key={hotspot.id}
                    onClick={() => {
                      sound.playClank();
                      setSelectedHotspot(hotspot);
                    }}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={pinX}
                      cy={pinY}
                      r={isSelected ? 16 : 11}
                      fill={isSelected ? '#f59e0b' : '#0284c7'}
                      fillOpacity={isSelected ? 0.9 : 0.8}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all"
                    />
                    <circle
                      cx={pinX}
                      cy={pinY}
                      r={isSelected ? 26 : 18}
                      fill="none"
                      stroke={isSelected ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                    <text
                      x={pinX}
                      y={pinY + 4}
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {hotspot.category === 'thermal' ? 'T' : hotspot.category === 'structural' ? 'S' : hotspot.category === 'sensors' ? 'V' : 'E'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Component Inspection Card (Right 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-stone-900 border-2 border-stone-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                {selectedHotspot.category} SUBSYSTEM
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-950 text-stone-400 border border-stone-800">
                ACTIVE FOCUS
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-epic text-stone-100">
              {selectedHotspot.name}
            </h2>

            <div className="p-3 bg-stone-950 rounded-xl border border-cyan-500/30 font-mono text-xs text-cyan-300">
              {selectedHotspot.spec}
            </div>

            <p className="text-sm font-body text-stone-300 leading-relaxed">
              {selectedHotspot.description}
            </p>

            {selectedHotspot.engineeringFormula && (
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 flex flex-col gap-1">
                <span className="text-[11px] font-mono text-amber-500 uppercase tracking-wider">
                  Thermodynamic / Kinematic Equation:
                </span>
                <code className="text-xs font-mono text-amber-300 break-all">
                  {selectedHotspot.engineeringFormula}
                </code>
              </div>
            )}

            {/* Quick Component Directory */}
            <div className="pt-4 border-t border-stone-800">
              <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                Click Component Hotspots:
              </span>
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                {BLUEPRINT_HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      sound.playClank();
                      setSelectedHotspot(h);
                    }}
                    className={`p-2 rounded text-left text-xs font-body transition-colors flex items-center justify-between ${
                      selectedHotspot.id === h.id
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40 font-semibold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                    }`}
                  >
                    <span className="truncate">{h.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
