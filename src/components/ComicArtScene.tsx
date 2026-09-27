import React from 'react';

interface ComicArtSceneProps {
  sceneType: 'furnace-runner' | 'kudua-reactor' | 'gantry-action' | 'subterranean-vault' | 'drone-recon' | 'cyber-core';
  title: string;
}

export const ComicArtScene: React.FC<ComicArtSceneProps> = ({ sceneType, title }) => {
  return (
    <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden bg-stone-950 border-2 border-stone-800 shadow-2xl select-none">
      {/* Halftone & Blueprint Grid Texture */}
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 halftone-dots opacity-25 pointer-events-none" />

      {/* Dynamic Animated Vector Art Scene */}
      {sceneType === 'furnace-runner' && (
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="moltenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="40%" stopColor="#c2410c" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="90%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </linearGradient>
            <filter id="heatHaze">
              <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Industrial Cast House Background */}
          <rect width="800" height="450" fill="#0c0a09" />
          
          {/* Iron Girders and Roof Truss */}
          <line x1="0" y1="60" x2="800" y2="60" stroke="#292524" strokeWidth="6" />
          <line x1="0" y1="120" x2="800" y2="120" stroke="#1c1917" strokeWidth="4" />
          <line x1="120" y1="0" x2="120" y2="350" stroke="#292524" strokeWidth="8" />
          <line x1="680" y1="0" x2="680" y2="350" stroke="#292524" strokeWidth="8" />
          <line x1="120" y1="60" x2="280" y2="120" stroke="#292524" strokeWidth="3" />
          <line x1="280" y1="60" x2="440" y2="120" stroke="#292524" strokeWidth="3" />
          <line x1="440" y1="60" x2="600" y2="120" stroke="#292524" strokeWidth="3" />

          {/* Radiant Heat Glow Fill */}
          <rect y="160" width="800" height="290" fill="url(#glowGrad)" />

          {/* Sloped Metallic Runner Plates */}
          <polygon points="0,320 800,280 800,450 0,450" fill="#1c1917" />
          <polygon points="40,335 760,295 760,450 40,450" fill="#292524" stroke="#44403c" strokeWidth="2" />

          {/* Molten Metal Runner Trough */}
          <path d="M 60 400 Q 250 360 400 350 T 780 320 L 780 430 Q 500 450 60 450 Z" fill="url(#moltenGrad)" />
          
          {/* Molten Stream Core Ripples */}
          <path d="M 100 410 Q 300 375 450 365 T 750 335" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <path d="M 120 425 Q 320 395 500 380 T 730 350" stroke="#fef08a" strokeWidth="7" strokeLinecap="round" opacity="0.7" />

          {/* Spark Particles (Animated in SVG) */}
          <circle cx="280" cy="340" r="3" fill="#fef08a" className="animate-ping" style={{ animationDuration: '2s' }} />
          <circle cx="450" cy="330" r="2.5" fill="#f59e0b" className="animate-pulse" style={{ animationDuration: '1.2s' }} />
          <circle cx="580" cy="310" r="3.5" fill="#fef08a" className="animate-ping" style={{ animationDuration: '1.6s' }} />
          <circle cx="340" cy="315" r="2" fill="#fff" className="animate-pulse" />

          {/* Overhead Gantry Rail (3.5m Planar Clearance) */}
          <rect x="220" y="70" width="380" height="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
          <line x1="220" y1="85" x2="600" y2="85" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
          
          {/* Motorized Gantry Carriage */}
          <rect x="360" y="90" width="100" height="45" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" rx="4" />
          <circle cx="390" cy="112" r="6" fill="#38bdf8" />
          <circle cx="430" cy="112" r="6" fill="#38bdf8" />

          {/* Telescopic Z-Axis Probe Lance Extends Towards Stream */}
          <line x1="410" y1="135" x2="410" y2="340" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
          <line x1="410" y1="135" x2="410" y2="250" stroke="#0284c7" strokeWidth="12" strokeLinecap="round" />
          <rect x="402" y="240" width="16" height="30" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          
          {/* Sensor Tip in Radiant Proximity */}
          <polygon points="405,335 415,335 410,355" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="410" cy="350" r="14" fill="#f59e0b" fillOpacity="0.4" className="animate-ping" />

          {/* Laser Guide Line & Dimension Callouts */}
          <line x1="410" y1="140" x2="410" y2="345" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
          <text x="425" y="200" fill="#38bdf8" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">Z = 1850mm</text>
          <text x="480" y="85" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">GANTRY X: 3250mm</text>

          {/* Extreme Heat Callout Badge */}
          <g transform="translate(620, 260)">
            <rect x="0" y="0" width="150" height="42" fill="#450a0a" stroke="#ef4444" strokeWidth="2" rx="6" />
            <text x="14" y="24" fill="#fee2e2" fontSize="13" fontFamily="Chakra Petch" fontWeight="bold">🔥 CORE 1450°C</text>
          </g>
        </svg>
      )}

      {sceneType === 'kudua-reactor' && (
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="stackGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="45%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Deep Blueprint Background */}
          <rect width="800" height="450" fill="#080e1a" />

          {/* Kudua 18.5m Towering Stack Geometry */}
          {/* Staggered Vertical Levels */}
          <polygon points="300,50 500,50 530,120 270,120" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="350" y="90" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">STACK LEVEL 3 (EXHAUST)</text>

          <polygon points="260,130 540,130 570,220 230,220" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
          <text x="330" y="180" fill="#f8fafc" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">KUDUA STAGGERED LEVEL 2</text>
          
          <polygon points="220,230 580,230 620,360 180,360" fill="url(#stackGrad)" stroke="#f59e0b" strokeWidth="3" />
          <text x="320" y="300" fill="#fef08a" fontSize="14" fontFamily="Chakra Petch" fontWeight="bold">HEARTH ZONE (1450°C)</text>

          {/* Granite Bed Foundation Base */}
          <rect x="140" y="360" width="520" height="50" fill="#292524" stroke="#78716c" strokeWidth="3" />
          <line x1="140" y1="385" x2="660" y2="385" stroke="#57534e" strokeWidth="2" strokeDasharray="10 5" />
          <text x="280" y="395" fill="#d6d3d1" fontSize="12" fontFamily="JetBrains Mono">PRECISION-CUT GRANITE STONE BED</text>

          {/* Cutaway: Vajra-lepa Diamond Adhesive Layer */}
          <path d="M 235 240 L 235 350 L 260 350 L 260 240 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <path d="M 545 240 L 545 350 L 570 350 L 570 240 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          
          {/* Hot Core Embers */}
          <ellipse cx="400" cy="330" rx="110" ry="25" fill="url(#flameGrad)" className="animate-pulse" />

          {/* Bhastrika Pulse-Jet Billow Ducts */}
          <path d="M 120 270 L 220 280 L 220 300 L 120 290 Z" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 680 270 L 580 280 L 580 300 L 680 290 Z" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <text x="40" y="285" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">BHASTRIKA JET</text>
          <text x="690" y="285" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">O2 PULSE</text>

          {/* Methanol Synthesis Condenser Tube */}
          <path d="M 515 90 Q 640 100 650 180 T 670 340" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray="8 4" />
          <rect x="630" y="340" width="130" height="40" fill="#064e3b" stroke="#10b981" strokeWidth="2" rx="4" />
          <text x="640" y="365" fill="#a7f3d0" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">CH3OH METHANOL</text>

          {/* Vajra-lepa Technical Annotation Callout */}
          <g transform="translate(40, 110)">
            <rect x="0" y="0" width="190" height="60" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" rx="6" />
            <text x="12" y="22" fill="#e0f2fe" fontSize="12" fontFamily="Chakra Petch" fontWeight="bold">VAJRA-LEPA BARRIER</text>
            <text x="12" y="40" fill="#7dd3fc" fontSize="10" fontFamily="JetBrains Mono">Rock-hard Nano-Ceramic</text>
            <text x="12" y="52" fill="#7dd3fc" fontSize="10" fontFamily="JetBrains Mono">Zero Delamination @ 1450°C</text>
            <line x1="190" y1="30" x2="245" y2="260" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        </svg>
      )}

      {sceneType === 'gantry-action' && (
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          {/* Blueprint Kinematic Stage */}
          <rect width="800" height="450" fill="#0a101f" />

          {/* Heavy Overhead Structural Gantry Truss */}
          <rect x="50" y="40" width="700" height="50" fill="#1e293b" stroke="#0ea5e9" strokeWidth="3" />
          <line x1="50" y1="65" x2="750" y2="65" stroke="#38bdf8" strokeWidth="2" />
          
          {/* Linear Rail Bearings */}
          <circle cx="100" cy="65" r="8" fill="#38bdf8" />
          <circle cx="250" cy="65" r="8" fill="#38bdf8" />
          <circle cx="550" cy="65" r="8" fill="#38bdf8" />
          <circle cx="700" cy="65" r="8" fill="#38bdf8" />

          {/* Multi-Axis Robotic Carriage Block */}
          <rect x="330" y="70" width="160" height="90" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" rx="6" />
          <text x="350" y="105" fill="#f8fafc" fontSize="13" fontFamily="Chakra Petch" fontWeight="bold">6-AXIS CARRIAGE</text>
          <text x="355" y="125" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">VEL: 0.45 m/s</text>

          {/* Dual-Layer Enclosed Cooling Fluid Jackets */}
          <rect x="370" y="160" width="80" height="150" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" rx="4" />
          <text x="375" y="180" fill="#e0f2fe" fontSize="10" fontFamily="JetBrains Mono">WATER 25L/m</text>
          <text x="375" y="195" fill="#e0f2fe" fontSize="10" fontFamily="JetBrains Mono">AIR 350W</text>

          {/* Telescopic Carbon-Ceramic Lance Plunging Down */}
          <rect x="395" y="210" width="30" height="180" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
          <polygon points="395,390 425,390 410,420" fill="#f59e0b" stroke="#ea580c" strokeWidth="2" />

          {/* Heat Extraction Vortex Lines */}
          <path d="M 370 230 Q 330 250 310 300" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 4" />
          <path d="M 450 230 Q 490 250 510 300" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 4" />
          <text x="210" y="280" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">VORTEX PURGE (6.0 BAR)</text>
          <text x="520" y="280" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">WATER RETURN @ 34°C</text>

          {/* Molten Surface at bottom */}
          <rect y="400" width="800" height="50" fill="#ea580c" />
          <line x1="0" y1="400" x2="800" y2="400" stroke="#fef08a" strokeWidth="4" />

          {/* Emergency Retract Trajectory Indicator */}
          <path d="M 410 380 L 410 165" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
          <polygon points="405,175 415,175 410,160" fill="#ef4444" />
          <text x="425" y="320" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">EMERGENCY RETRACT (&lt;3s)</text>
        </svg>
      )}

      {sceneType === 'subterranean-vault' && (
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          {/* Earth & Geological Cross Section */}
          <rect width="800" height="450" fill="#14110e" />

          {/* Cast House Floor Line */}
          <rect y="0" width="800" height="60" fill="#292524" />
          <line x1="0" y1="60" x2="800" y2="60" stroke="#78716c" strokeWidth="4" />
          <text x="40" y="40" fill="#e7e5e4" fontSize="13" fontFamily="Chakra Petch" fontWeight="bold">CAST HOUSE SURFACE (120°C RADIANT ENVIRONMENT)</text>

          {/* Subterranean Depth Levels */}
          <line x1="0" y1="160" x2="800" y2="160" stroke="#44403c" strokeWidth="2" strokeDasharray="8 6" />
          <text x="40" y="150" fill="#a8a29e" fontSize="11" fontFamily="JetBrains Mono">LEVEL -1: THERMAL BUFFER BED</text>
          
          <line x1="0" y1="280" x2="800" y2="280" stroke="#44403c" strokeWidth="2" strokeDasharray="8 6" />
          <text x="40" y="270" fill="#a8a29e" fontSize="11" fontFamily="JetBrains Mono">LEVEL -2: AGASTYA GALVANIC STRATA (MOIST SOIL ELECTROLYTES)</text>

          {/* Agastya Galvanic Soil Generators */}
          <g transform="translate(100, 300)">
            <rect x="0" y="0" width="120" height="110" fill="#1c1917" stroke="#10b981" strokeWidth="2" rx="4" />
            <line x1="20" y1="20" x2="20" y2="90" stroke="#f59e0b" strokeWidth="6" />
            <line x1="60" y1="20" x2="60" y2="90" stroke="#0ea5e9" strokeWidth="6" />
            <line x1="100" y1="20" x2="100" y2="90" stroke="#f59e0b" strokeWidth="6" />
            <text x="12" y="105" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">AGASTYA CELL 01</text>
          </g>

          <g transform="translate(260, 300)">
            <rect x="0" y="0" width="120" height="110" fill="#1c1917" stroke="#10b981" strokeWidth="2" rx="4" />
            <line x1="20" y1="20" x2="20" y2="90" stroke="#f59e0b" strokeWidth="6" />
            <line x1="60" y1="20" x2="60" y2="90" stroke="#0ea5e9" strokeWidth="6" />
            <line x1="100" y1="20" x2="100" y2="90" stroke="#f59e0b" strokeWidth="6" />
            <text x="12" y="105" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">AGASTYA CELL 02</text>
          </g>

          {/* Subterranean BESS Pack Rack (1200 kWh / 820V) */}
          <g transform="translate(480, 180)">
            <rect x="0" y="0" width="260" height="230" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" rx="8" />
            <text x="20" y="30" fill="#f8fafc" fontSize="13" fontFamily="Chakra Petch" fontWeight="bold">1200 kWh HYBRID BESS</text>
            <text x="20" y="50" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">VOLTAGE: 820 V · LEAD-SULFUR</text>
            
            {/* Battery Module Shelves */}
            <rect x="20" y="65" width="220" height="35" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="3" />
            <rect x="20" y="115" width="220" height="35" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="3" />
            <rect x="20" y="165" width="220" height="35" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="3" />
            
            {/* Energy flow indicator */}
            <circle cx="215" cy="82" r="6" fill="#10b981" className="animate-pulse" />
            <circle cx="215" cy="132" r="6" fill="#10b981" className="animate-pulse" />
            <circle cx="215" cy="182" r="6" fill="#10b981" className="animate-pulse" />
          </g>

          {/* Power Feed Conduits to Surface Gantry */}
          <path d="M 610 180 L 610 60" stroke="#eab308" strokeWidth="6" strokeDasharray="12 6" />
          <text x="625" y="120" fill="#fef08a" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">OFF-GRID BUS (820V)</text>
        </svg>
      )}

      {sceneType === 'drone-recon' && (
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          {/* Drone First-Person Thermal HUD View */}
          <rect width="800" height="450" fill="#050a12" />

          {/* Thermal Camera Heat Gradient View of Floor */}
          <ellipse cx="400" cy="270" rx="340" ry="140" fill="#450a0a" opacity="0.8" />
          <ellipse cx="400" cy="280" rx="220" ry="90" fill="#991b1b" opacity="0.85" />
          <ellipse cx="400" cy="290" rx="140" ry="50" fill="#ea580c" opacity="0.9" />
          <ellipse cx="400" cy="295" rx="70" ry="25" fill="#fef08a" opacity="0.95" />

          {/* Snake-Crawler Traversal Path on Ground */}
          <path d="M 220 330 Q 300 290 380 320 T 540 290" fill="none" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" />
          <circle cx="540" cy="290" r="10" fill="#c084fc" stroke="#581c87" strokeWidth="2" />
          <text x="560" y="295" fill="#d8b4fe" fontSize="12" fontFamily="JetBrains Mono">SNAKE CRAWLER #01</text>

          {/* Drone Targeting Crosshairs & HUD Elements */}
          <circle cx="400" cy="225" r="90" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="10 5" />
          <circle cx="400" cy="225" r="4" fill="#38bdf8" />
          <line x1="280" y1="225" x2="380" y2="225" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="420" y1="225" x2="520" y2="225" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="400" y1="105" x2="400" y2="205" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="400" y1="245" x2="400" y2="345" stroke="#0ea5e9" strokeWidth="2" />

          {/* HUD Telemetry Overlays */}
          <g transform="translate(40, 40)">
            <rect width="220" height="90" fill="#0f172a" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1.5" rx="6" />
            <text x="14" y="25" fill="#38bdf8" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">AIRBORNE DRONE #04</text>
            <text x="14" y="45" fill="#f8fafc" fontSize="11" fontFamily="JetBrains Mono">ALTITUDE: 2.50m HOVER</text>
            <text x="14" y="65" fill="#4ade80" fontSize="11" fontFamily="JetBrains Mono">VISIBILITY: 94.8% OPTICAL</text>
            <text x="14" y="80" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono">GAS: HAZARD CLEAR (O2 / CO)</text>
          </g>

          <g transform="translate(540, 40)">
            <rect width="220" height="90" fill="#0f172a" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="1.5" rx="6" />
            <text x="14" y="25" fill="#f59e0b" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">LADLE CRACK SENSOR</text>
            <text x="14" y="45" fill="#f8fafc" fontSize="11" fontFamily="JetBrains Mono">SLAG POT SURFACE: 238°C</text>
            <text x="14" y="65" fill="#4ade80" fontSize="11" fontFamily="JetBrains Mono">STRUCTURAL FATIGUE: 0.02%</text>
            <text x="14" y="80" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono">CRACKS DETECTED: 0 [PASS]</text>
          </g>
        </svg>
      )}

      {sceneType === 'cyber-core' && (
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          {/* Cybernetic Edge & Cloud Architecture */}
          <rect width="800" height="450" fill="#070b14" />

          {/* Central Crypto Core Node */}
          <g transform="translate(400, 225)">
            <circle r="75" fill="#0f172a" stroke="#6366f1" strokeWidth="3" />
            <circle r="95" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="12 6" className="animate-spin" style={{ animationDuration: '24s' }} />
            <text x="-48" y="-10" fill="#e0e7ff" fontSize="12" fontFamily="Chakra Petch" fontWeight="bold">AES-256-GCM</text>
            <text x="-52" y="10" fill="#818cf8" fontSize="10" fontFamily="JetBrains Mono">96-BIT NONCE</text>
            <text x="-40" y="30" fill="#34d399" fontSize="11" fontFamily="JetBrains Mono">AUTHENTIC</text>
          </g>

          {/* Live Edge Node (FastAPI / MQTT) */}
          <g transform="translate(100, 160)">
            <rect width="180" height="130" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" rx="8" />
            <text x="14" y="28" fill="#38bdf8" fontSize="12" fontFamily="Chakra Petch" fontWeight="bold">FASTAPI v3 EDGE</text>
            <text x="14" y="50" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">PAHO MQTT v2.0</text>
            <text x="14" y="70" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">ATOMIC .TMP WRITE</text>
            <text x="14" y="90" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">PORT: 8080 / HEALTH</text>
            <text x="14" y="112" fill="#4ade80" fontSize="11" fontFamily="JetBrains Mono">STATUS: GREEN</text>
          </g>

          {/* Immutable AWS Cloud Archive */}
          <g transform="translate(540, 160)">
            <rect width="180" height="130" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" rx="8" />
            <text x="14" y="28" fill="#fbbf24" fontSize="12" fontFamily="Chakra Petch" fontWeight="bold">AWS S3 IMMUTABLE</text>
            <text x="14" y="50" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">KMS CMK ROTATION</text>
            <text x="14" y="70" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">GLACIER 90-DAY TIER</text>
            <text x="14" y="90" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">TLS 1.2+ ENFORCED</text>
            <text x="14" y="112" fill="#34d399" fontSize="11" fontFamily="JetBrains Mono">AUDIT PROOF</text>
          </g>

          {/* Ingest Packet Streams */}
          <path d="M 280 225 L 325 225" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 4" />
          <path d="M 475 225 L 540 225" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6 4" />
          
          <text x="270" y="195" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">LOCAL BUS</text>
          <text x="470" y="195" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">WAN SYNC</text>

          {/* Kubernetes HPA Auto-scaler indicator at bottom */}
          <g transform="translate(240, 360)">
            <rect width="320" height="50" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" rx="6" />
            <text x="18" y="30" fill="#c7d2fe" fontSize="12" fontFamily="JetBrains Mono">K8S HPA: 3 MIN → 15 MAX REPLICAS</text>
          </g>
        </svg>
      )}

      {/* Comic Book Panel Title Plate */}
      <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-sm border-2 border-stone-700 px-3 py-1 rounded text-xs font-comic font-bold text-amber-400 tracking-wider shadow-md">
        {title}
      </div>
    </div>
  );
};
