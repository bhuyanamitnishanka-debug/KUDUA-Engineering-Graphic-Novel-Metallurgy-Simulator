import { CharacterBio } from '../types/novel';

export const CHARACTERS_DATA: CharacterBio[] = [
  {
    id: 'priya',
    name: 'Dr. Priya Sharma',
    callsign: 'Vector',
    role: 'Chief Robotics Architect',
    department: 'Autonomous Systems & Kinematics Group',
    avatarColor: 'bg-cyan-600',
    background: 'Former senior propulsion robotics researcher with a PhD in Mechatronics and High-Temperature Materials from IIT Madras. Spent 8 years engineering robotic manipulation arms for harsh environments before leading the Kudua autonomous sampling initiative.',
    motivation: 'To eliminate human sacrifice on industrial cast floors. Having witnessed severe burn accidents during manual lance sampling in traditional mills, she vowed to build machines capable of thriving where flesh and bone cannot survive.',
    keyContributions: [
      'Designed the 3.5m overhead planar clearance gantry avoiding sloped floor hazards',
      'Architected the dual-layer fluid jacket (25 L/min water + 350W vortex air purge)',
      'Engineered the fail-safe emergency retract kinematics achieving <3s home park'
    ],
    signatureQuote: 'Precision is not merely an engineering tolerance—at 1450°C, precision is the dividing line between life and catastrophe.',
    stats: {
      robotics: 98,
      metallurgy: 84,
      aiOps: 90,
      safetyLeadership: 94
    }
  },
  {
    id: 'harish',
    name: 'Master Harish',
    callsign: 'Veda-Forge',
    role: 'Ancient Metallurgy Scholar',
    department: 'Archaeometallurgical Heritage & Materials Synthesis',
    avatarColor: 'bg-emerald-600',
    background: 'A 60-year-old scholar of classical Bhartiya metallurgical manuscripts, classical Sanskrit treatises (Rasaratna Samuccaya, Agastya Samhita), and traditional Wootz steel forging lineages in Southern India.',
    motivation: 'To prove that modern aerospace engineering does not render ancient civilizational knowledge obsolete, but rather uncovers the rigorous thermodynamic truth buried within forgotten verses.',
    keyContributions: [
      'Decoded the molecular cross-linking recipe for Vajra-lepa rock-hard nano-ceramic adhesive',
      'Re-engineered the Kudua staggered kiln stack geometry to achieve natural K=1.42 draft velocity',
      'Adapted Bhastrika pulse-jet billows and Vastika passive intra-wall cooling channels'
    ],
    signatureQuote: 'Our ancestors did not work against fire; they learned its breath. When you honor the flame, the furnace yields gold, not ruin.',
    stats: {
      robotics: 62,
      metallurgy: 99,
      aiOps: 70,
      safetyLeadership: 91
    }
  },
  {
    id: 'rao',
    name: 'Vikram Rao',
    callsign: 'Crucible',
    role: 'Tata InnoVerse Operational Lead',
    department: 'Blast Furnace Operations & Plant Transformation',
    avatarColor: 'bg-amber-600',
    background: 'A 28-year veteran of high-output integrated steel plants, having risen from shop-floor apprentice to Plant Director overseeing 4-million-ton blast furnace campaigns.',
    motivation: 'Achieving the elusive "Zero-Harm / Zero-Entry" milestone for his workforce while modernizing legacy furnace infrastructure to meet carbon-neutral and high-yield goals.',
    keyContributions: [
      'Spearheaded the Tata InnoVerse Challenge submissions for Slag Pot Crack Detection and Ladle Scotching',
      'Authorized the live-plant pilot deployment of the Kudua autonomous sampling cell',
      'Championed closed-loop off-gas capture converting 99.4% furnace emissions to synthetic methanol'
    ],
    signatureQuote: 'A successful cast isn’t measured in tonnage alone—it’s measured by every single worker returning home safe at end of shift.',
    stats: {
      robotics: 78,
      metallurgy: 96,
      aiOps: 82,
      safetyLeadership: 100
    }
  },
  {
    id: 'maya',
    name: 'Maya Sen',
    callsign: 'Optic-Eye',
    role: 'AI Perception & Drone Sentinel Lead',
    department: 'Computer Vision & Edge MLOps',
    avatarColor: 'bg-purple-600',
    background: 'Specialist in real-time computer vision in degraded visual environments (smoke, flare, infrared saturation). Previously built autonomous drone inspection platforms for deep underground mining operations.',
    motivation: 'Transforming invisible micro-cracks and dangerous gas pockets into transparent, predictive telemetry before equipment fails.',
    keyContributions: [
      'Trained the YOLO/XGBoost thermal models detecting slag pot fatigue and micro-cracks under 250°C',
      'Developed optical clarity filtering algorithms maintaining 94.8% visibility through dense runner fumes',
      'Designed the autonomous micro-drone flight controller hovering 2.5m above the active lance vector'
    ],
    signatureQuote: 'When human eyes see only blinding white glare, our multispectral sensors isolate every stress gradient with mathematical clarity.',
    stats: {
      robotics: 91,
      metallurgy: 68,
      aiOps: 99,
      safetyLeadership: 85
    }
  },
  {
    id: 'ankit',
    name: 'Ankit Verma',
    callsign: 'Tork',
    role: 'Senior Field Systems & Safety Engineer',
    department: 'Heavy Kinematics & Hydraulic Integration',
    avatarColor: 'bg-red-600',
    background: 'Spent 7 years in heavy aluminized suits manually plunging 10kg lances into molten streams before retraining in industrial PLC automation and robotics telemetry.',
    motivation: 'Ensuring that robotic interfaces are ergonomic, resilient, and bulletproof for the maintenance crews working in the harsh realities of the cast house.',
    keyContributions: [
      'Configured the pneumatic scotching system for torpedo ladles, eliminating pinch points entirely',
      'Calibrated the snake-crawler B-spline spiral-winding gait over metallic vibration dampers',
      'Supervised physical crash-testing and emergency retract overrides under simulated slag jams'
    ],
    signatureQuote: 'I carried that 10kg lance for seven years. I know what 1450°C feels like on your face. This robot isn’t just steel; it’s our salvation.',
    stats: {
      robotics: 88,
      metallurgy: 87,
      aiOps: 75,
      safetyLeadership: 96
    }
  },
  {
    id: 'sentinel',
    name: 'KUDUA-KERNEL v3.0',
    callsign: 'Sentinel',
    role: 'Autonomous Edge Operating System',
    department: 'ObjectARX Kinematic & Telemetry Daemon',
    avatarColor: 'bg-blue-600',
    background: 'Deterministic, low-latency C++ and Python state machine deployed on hardened edge compute nodes adjacent to the furnace foundation.',
    motivation: 'Continuous fail-safe execution: maintaining sub-12ms interlock response and zero data loss under extreme EMI and network severed environments.',
    keyContributions: [
      'Executes the 5-stage kinematic cycle: IDLE → UTILITIES → SAMPLING → RETRACTING → STOP',
      'Enforces AES-256-GCM authenticated encryption on all live telemetry frames',
      'Automates atomic local flash buffering with seamless AWS S3 synchronization daemon'
    ],
    signatureQuote: 'System State: NOMINAL. Interlock Latency: 11.4ms. All telemetry frames cryptographically authenticated.',
    stats: {
      robotics: 100,
      metallurgy: 80,
      aiOps: 98,
      safetyLeadership: 92
    }
  }
];
