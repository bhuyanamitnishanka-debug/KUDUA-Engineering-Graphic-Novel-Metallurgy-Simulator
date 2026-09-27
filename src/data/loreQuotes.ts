export interface LoreQuote {
  id: string;
  quote: string;
  speaker: string;
  role: string;
  domain: 'Metallurgy' | 'Robotics' | 'Safety & Ethics' | 'Ancient Wisdom' | 'Cybernetics';
  actReference: string;
  historicalContext?: string;
  accentColor: string;
}

export const LORE_QUOTES: LoreQuote[] = [
  {
    id: 'lq-1',
    quote: 'Zero human entry into splash zones: that is our non-negotiable metric. Automation is not about speed; it is about dignity and life.',
    speaker: 'Plant Director Rao',
    role: 'Tata InnoVerse Operational Lead',
    domain: 'Safety & Ethics',
    actReference: 'Act I: The Crucible of Fire',
    historicalContext: 'Spoken on the 1450°C cast house floor during the initial challenge rollout.',
    accentColor: '#f59e0b'
  },
  {
    id: 'lq-2',
    quote: 'True innovation does not discard history; it gives ancient wisdom digital wings. 3,000-year-old metallurgical cross-links survive where modern ceramics delaminate.',
    speaker: 'Dr. Priya Sharma',
    role: 'Chief Robotics Architect',
    domain: 'Ancient Wisdom',
    actReference: 'Act II: The Kudua Stack & Ancient Wisdom',
    historicalContext: 'Reflecting on the successful synthesis of Vajra-lepa nano-ceramic coatings.',
    accentColor: '#10b981'
  },
  {
    id: 'lq-3',
    quote: 'Precision is not just accuracy; in a steel mill, precision is survival. A millimetric error in a molten torrent yields irreversible destruction.',
    speaker: 'Autonomous CAD Controller',
    role: 'ObjectARX Kinematic Engine',
    domain: 'Robotics',
    actReference: 'Act III: The Gantry Titan & Snake Crawler',
    historicalContext: 'Executing overhead lance plunge trajectory at X=3250mm coordinate envelope.',
    accentColor: '#06b6d4'
  },
  {
    id: 'lq-4',
    quote: 'The earth beneath our feet is both shield and power source. When surface grids fail under intense electromagnetic fury, subterranean galvanic ionic gradients remain untouched.',
    speaker: 'Master Harish',
    role: 'Ancient Metallurgy Historian',
    domain: 'Ancient Wisdom',
    actReference: 'Act IV: Subterranean Guardians',
    historicalContext: 'Inspecting the Agastya sub-surface bio-electrochemical energy storage system.',
    accentColor: '#8b5cf6'
  },
  {
    id: 'lq-5',
    quote: 'Data is the furnace\'s memory. Protected with authenticated cryptography, it ceases to be cold telemetry and becomes our greatest safety asset.',
    speaker: 'Security Daemon',
    role: 'IndustrialDataCipher Kernel',
    domain: 'Cybernetics',
    actReference: 'Act V: The Cybernetic Edge',
    historicalContext: 'Streaming AES-256-GCM encrypted hot metal assay packets to the immutable cloud vault.',
    accentColor: '#6366f1'
  },
  {
    id: 'lq-6',
    quote: 'A steel plant\'s true greatness is never measured solely by the tonnage poured into the ladles, but by the zero-harm return of every single worker home at twilight.',
    speaker: 'Tata InnoVerse Operational Creed',
    role: 'Foundational Charter',
    domain: 'Safety & Ethics',
    actReference: 'Prologue: The Challenge Mandate',
    historicalContext: 'Engraved onto the primary titanium gantry beam overlooking blast furnace hearth 4.',
    accentColor: '#f97316'
  },
  {
    id: 'lq-7',
    quote: 'Vajra-lepa taught us that extreme thermal shock cannot be defeated with brute hardness alone; it yields only to flexible molecular cohesion that breathes with thermal flux.',
    speaker: 'Master Harish',
    role: 'Ancient Metallurgy Historian',
    domain: 'Metallurgy',
    actReference: 'Act II: The Kudua Stack & Ancient Wisdom',
    historicalContext: 'Explaining Sanskrit crucible recipes dating back to the Vedic metallurgical guild.',
    accentColor: '#10b981'
  },
  {
    id: 'lq-8',
    quote: 'Bio-inspired serpentine kinematics negotiate what rigid wheels cannot. Where industrial slag slithers and steel plates buckle, continuous curvature maintains traction.',
    speaker: 'Control Operator Maya',
    role: 'AI Perception & Gaits Engineer',
    domain: 'Robotics',
    actReference: 'Act III: The Gantry Titan & Snake Crawler',
    historicalContext: 'Deploying the multi-link snake robot across 18° sloped metallic floor plates.',
    accentColor: '#06b6d4'
  },
  {
    id: 'lq-9',
    quote: 'The staggered vertical stack traps natural convective buoyancy. Thermodynamics rewards geometry that honors the ascent of heat instead of combating it with external fans.',
    speaker: 'Kudua Staggered Stack Axiom',
    role: 'Thermal Engineering Principle',
    domain: 'Metallurgy',
    actReference: 'Act II: The Kudua Stack & Ancient Wisdom',
    historicalContext: 'Achieving Kudua draft amplification constant K=1.42 without auxiliary fuel consumption.',
    accentColor: '#eab308'
  },
  {
    id: 'lq-10',
    quote: 'In the heart of molten iron at 1450°C, human bravery must give way to cybernetic vigilance. Real courage is engineering systems that spare human flesh.',
    speaker: 'Dr. Priya Sharma',
    role: 'Chief Robotics Architect',
    domain: 'Safety & Ethics',
    actReference: 'Act I: The Crucible of Fire',
    historicalContext: 'Addressing the design symposium before commissioning the automated sampling gantry.',
    accentColor: '#f43f5e'
  },
  {
    id: 'lq-11',
    quote: 'Liquid lithium does not merely endure heat; its latent enthalpy swallows thermal spikes, converting destructive heat flux into electrical charge.',
    speaker: 'Subterranean Vault Engineers',
    role: 'Aerospace Thermal Defense Team',
    domain: 'Metallurgy',
    actReference: 'Act IV: Subterranean Guardians',
    historicalContext: 'Validating the 1200 kWh subterranean BESS against unexpected furnace runner back-splashes.',
    accentColor: '#0ea5e9'
  },
  {
    id: 'lq-12',
    quote: 'When 1450°C metal surges, silence is negligence; millisecond-level telemetry is the heartbeat that guarantees nobody gets hurt.',
    speaker: 'Plant Director Rao',
    role: 'Tata InnoVerse Operational Lead',
    domain: 'Cybernetics',
    actReference: 'Act V: The Cybernetic Edge',
    historicalContext: 'Reviewing automated failover latency under 12 milliseconds during slag obstruction events.',
    accentColor: '#a855f7'
  },
  {
    id: 'lq-13',
    quote: 'A blast furnace shaft is an eternal thermodynamic engine: double-bell hoppers feed sinter from above, while tuyeres blast 1200°C air from below. A furnace can never cool; like a reader\'s unbroken daily streak, uninterrupted continuity is what keeps the crucible alive.',
    speaker: 'Blast Furnace Operations Council',
    role: 'Pyrometallurgical Engineering Lead',
    domain: 'Metallurgy',
    actReference: 'Shaft Furnace & Tuyere Dynamics',
    historicalContext: 'Examining counter-current gas-solid exchange in shaft furnaces and lead-splash condenser off-gas recovery.',
    accentColor: '#f97316'
  }
];

export const getDailyQuote = (date: Date = new Date()): LoreQuote => {
  // Deterministic quote based on calendar day of the year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs(dayOfYear) % LORE_QUOTES.length;
  return LORE_QUOTES[index];
};
