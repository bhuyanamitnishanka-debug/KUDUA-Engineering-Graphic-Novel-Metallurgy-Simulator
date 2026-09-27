import { BTSItem } from '../types/novel';

export const BTS_DATA: BTSItem[] = [
  {
    id: 'concept-art',
    title: 'From Technical Specification to Graphic Novel Concept Art',
    category: 'Concept Art',
    description: 'Translating dense 117-page metallurgical whitepapers into high-impact graphic novel storytelling requires capturing the visceral sensory intensity of the steel mill while preserving every millimeter of mathematical rigor.',
    details: [
      'Early thumbnails focused on capturing the colossal scale of the 18.5m Kudua stack and the 3.5m overhead clearance envelope.',
      'Color keys were calibrated around molten iron glowing at 1450°C (#ea580c to #fef08a) contrasted against deep industrial slate (#0c0a09).',
      'Blueprint grid lines and halftone dots were incorporated directly into the panel artwork to honor AutoCAD ObjectARX mechanical drawings.',
      'Ancient Bhartiya motifs (Vajra-lepa cross-hatching, Agastya galvanic layers) were rendered with clean technical precision rather than fantasy tropes.'
    ],
    specs: 'Resolution: Vector Infinite Zoom · Color System: 60% Dark Slate / 30% Blueprint Cyan / 10% Molten Ember'
  },
  {
    id: 'storyboards',
    title: 'The 5-Act Narrative Architecture & Storyboards',
    category: 'Storyboards',
    description: 'The story was structured in classical 5-Act graphic novel format, mirroring the actual physical sequence of a blast furnace cast cycle.',
    details: [
      'Act I (Prologue): Establishes the real-world human stakes—operators braving 2.5 hours of suffocating heat and toxic fumes in aluminized suits.',
      'Act II: The breakthrough discovery—unearthing ancient Sanskrit metallurgy to solve modern refractory delamination.',
      'Act III: The physical deployment—the 3.5m gantry and the bio-inspired snake crawler moving into the hot zone.',
      'Act IV: Crisis and fail-safe—a sudden slag blockage tests the sub-3-second emergency retract state machine.',
      'Act V: Epilogue—the cybernetic cloud pipeline encrypts telemetry, proving 100% human elimination from splash zones.'
    ],
    specs: 'Total Panels: 10 Core Spreads · 5 Narrative Choice Divergences · 22 Interactive Hotspots'
  },
  {
    id: 'animation-pipeline',
    title: 'Pure Vector & Procedural Web Audio Engine',
    category: 'Animation Pipeline',
    description: 'How the interactive animations, SVG filters, and audio sound effects were engineered without bloated video files or external audio dependencies.',
    details: [
      'Dynamic SVG Waveforms: Molten stream ripples and convective air purges are animated using SVG vector paths and CSS cubic-bezier curves.',
      'Heat Haze Turbulence: Generated using SVG feTurbulence and feDisplacementMap filter primitives to simulate the shimmering optical distortion of 1450°C air.',
      'Web Audio Procedural Synth: Created a zero-dependency sound synthesizer using the Web Audio API. Filters white noise through bandpass and highpass nodes to simulate page turns, pneumatic bursts, and a 55Hz molten forge hum.',
      'Compositor-Only Motion: All interactive transitions animate strictly transform, opacity, and filter properties for smooth 60fps rendering.'
    ],
    specs: 'Latency: < 12ms · Zero External Media Files · 100% CSS/SVG/WebAudio Implementation'
  },
  {
    id: 'real-engineering',
    title: 'Real-World Engineering Principles Behind the Novel',
    category: 'Real Engineering',
    description: 'Every plot point, dialog exchange, and mechanical specification in the graphic novel comes directly from rigorous thermodynamic and software engineering.',
    details: [
      'Stefan-Boltzmann Radiation: q_rad = ε·σ·A·(T_molten⁴ - T_shield⁴) with emissivity ε = 0.85.',
      'Corrected Differential Water Cooling: Based on current shield temperature delta, resolving the Step 0 temperature crash bug identified in the original Python code.',
      'Bounded Vortex Air Purge: Ensured air extraction cannot exceed available conductive heat leak, preventing unphysical drops below ambient.',
      'Atomic Disk Failover: The FastAPI edge daemon writes to .tmp files before calling os.replace, ensuring zero corrupted JSON frames during network brownouts.',
      'C++ State Machine Lockout: The ObjectARX controller rejects any subsequent sampling attempts while in EMERGENCY_STOP until an explicit SYSTEM_RESET signal is verified.'
    ],
    specs: 'Standards: ISO 9001/45001 · AES-256-GCM · Paho-MQTT v2.0 · Kubernetes HPA v2'
  }
];

export const STORYBOARD_STEPS = [
  {
    step: 1,
    title: 'Technical Problem Definition',
    focus: 'Tata InnoVerse Challenge Brief',
    description: 'Analyzing the physical hazards: 10kg lances, 1450°C molten stream, 2.5 hours exposure per cast, sloped metallic floors.',
    aesthetic: 'Archival data dossier, risk assessment matrix, thermal injury statistics.'
  },
  {
    step: 2,
    title: 'CAD Kinematic Wireframe',
    focus: 'AutoCAD ObjectARX Modeling',
    description: 'Determining the 3.5m clearance envelope, 5000mm X-rail, and 1850mm telescopic Z-insertion coordinates.',
    aesthetic: 'Vector blueprint lines, Cartesian millimeter axes, limit switch bounding boxes.'
  },
  {
    step: 3,
    title: 'Graphic Novel Inking & World-Building',
    focus: 'Cinematic Comic Inking',
    description: 'Infusing industrial brutality with dramatic high-contrast ink lines, speech bubbles, and pop-out sound effect stickers.',
    aesthetic: 'Deep black shadows, halftone dot gradients, molten ember glowing paths.'
  },
  {
    step: 4,
    title: 'Interactive Physics & Telemetry Binding',
    focus: 'Live Simulation Integration',
    description: 'Connecting the visual panel directly to the thermodynamic differential equations and interactive hotspot popups.',
    aesthetic: 'Clickable crosshairs, real-time temperature telemetry, audible pneumatic hisses.'
  }
];
