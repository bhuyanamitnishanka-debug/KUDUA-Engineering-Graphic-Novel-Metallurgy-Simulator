export interface ComicDialogue {
  speaker: string;
  role: string;
  avatarColor: string;
  text: string;
  type: 'speech' | 'thought' | 'radio' | 'announcement';
}

export interface TechnicalCallout {
  label: string;
  spec: string;
  detail: string;
  category: 'ancient' | 'modern' | 'robotic' | 'thermal';
}

export interface PanelHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  shortDesc: string;
  detail: string;
  formula?: string;
  animationType: 'pulse-ring' | 'heat-scan' | 'laser-reticle' | 'pneumatic-burst' | 'spark-shower';
  techDocRef?: string;
}

export interface NarrativeChoice {
  id: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    description: string;
    systemAction: string;
    consequenceText: string;
    riskScore: 'Low' | 'Moderate' | 'High';
    techFocus: string;
  }[];
}

export interface ComicPanel {
  id: string;
  title: string;
  timeCode: string;
  ambientCondition: string;
  narrativeCaption: string;
  sceneType: 'furnace-runner' | 'kudua-reactor' | 'gantry-action' | 'subterranean-vault' | 'drone-recon' | 'cyber-core';
  dialogue?: ComicDialogue[];
  soundEffect?: string;
  soundEffectColor?: string;
  technicalCallouts: TechnicalCallout[];
  quote?: string;
  hotspots?: PanelHotspot[];
  branchingChoice?: NarrativeChoice;
  annotation?: string;
}

export interface NovelChapter {
  id: number;
  act: string;
  title: string;
  subtitle: string;
  theme: string;
  summary: string;
  panels: ComicPanel[];
}

export interface CharacterBio {
  id: string;
  name: string;
  callsign: string;
  role: string;
  department: string;
  avatarColor: string;
  background: string;
  motivation: string;
  keyContributions: string[];
  signatureQuote: string;
  stats: {
    robotics: number;
    metallurgy: number;
    aiOps: number;
    safetyLeadership: number;
  };
}

export interface TechDeepDive {
  id: string;
  title: string;
  ancientHeritage: string;
  modernApplication: string;
  category: 'Materials' | 'Thermodynamics' | 'Kinematics' | 'Energy' | 'Perception';
  summary: string;
  physicalPrinciples: string[];
  equations: {
    formula: string;
    explanation: string;
  }[];
  specSheet: {
    label: string;
    value: string;
  }[];
  industrialSafetyImpact: string;
}

export interface BTSItem {
  id: string;
  title: string;
  category: 'Concept Art' | 'Storyboards' | 'Animation Pipeline' | 'Real Engineering';
  description: string;
  details: string[];
  specs?: string;
}

export type ReadingMode = 'book' | 'webtoon' | 'blueprint' | 'thermal' | 'kinematics' | 'codex' | 'characters' | 'technologies' | 'bts';

