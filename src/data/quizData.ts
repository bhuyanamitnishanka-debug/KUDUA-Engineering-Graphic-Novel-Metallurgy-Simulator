export interface QuizQuestion {
  id: string;
  actRef: string;
  topic: 'Thermodynamics' | 'Ancient Metallurgy' | 'Robotics & Kinematics' | 'Flux & Slag Chemistry' | 'Cybernetics';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
  explanation: string;
  schematicRef?: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  accentColor: string;
  questions: QuizQuestion[];
}

export const METALLURGY_QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'blast-furnace-physics',
    title: 'Blast Furnace & Tuyere Thermodynamics',
    description: 'Bellows airflow, 1450°C molten runners, limestone fluxing, and taphole slag separation.',
    iconName: 'Flame',
    accentColor: '#f59e0b',
    questions: [
      {
        id: 'bf-q1',
        actRef: 'Act I & Historical Cam Bellows',
        topic: 'Thermodynamics',
        question: 'In both historical waterwheel-driven furnaces and modern blast furnaces, what is the primary thermodynamic function of the tuyere?',
        options: [
          { id: 'a', text: 'To collect molten iron tapping from the bottom hearth' },
          { id: 'b', text: 'To inject forced blast air directly into the combustion zone to generate reducing carbon monoxide' },
          { id: 'c', text: 'To filter volatile lead and zinc before the washing tower' },
          { id: 'd', text: 'To mechanically damp vibrations from descending iron ore charges' }
        ],
        correctAnswerId: 'b',
        explanation: 'Tuyeres are precision refractory nozzles that deliver forced air (historically via waterwheel-driven cam bellows, and modernly via centrifugal blowers at 1200°C) into the hearth raceway, driving C + O₂ → CO₂ and CO₂ + C → 2CO for rapid ore reduction.',
        schematicRef: 'Historical Cam-Bellows & Tuyere Inflow'
      },
      {
        id: 'bf-q2',
        actRef: 'Act I: The Crucible of Fire',
        topic: 'Thermodynamics',
        question: 'Why is manual hot metal sampling in the 1450°C cast house runner classified as a non-negotiable safety hazard by Tata InnoVerse?',
        options: [
          { id: 'a', text: 'Molten iron freezes instantly upon contact with air, destroying the probes' },
          { id: 'b', text: 'Radiant heat flux reaches 142 kW/m² with fatal splash risks and 2.5 hours of human exposure per cast' },
          { id: 'c', text: 'Waterwheel cams cannot reach the necessary RPM to cool human suits' },
          { id: 'd', text: 'Sampling lances absorb iron and alter the blast furnace chemical grade' }
        ],
        correctAnswerId: 'b',
        explanation: 'At 1450°C, radiant heat flux exceeds 142 kW/m². Human operators standing 1.5m away for 2.5 hours per cast face severe dehydration, flash thermal burns, and catastrophic molten splash hazards.',
        schematicRef: 'Act I Hot Metal Runner'
      },
      {
        id: 'bf-q3',
        actRef: 'Hearth Chemistry & Slag Separation',
        topic: 'Flux & Slag Chemistry',
        question: 'Why are limestone and flux charged alongside iron ore and coke into the top charging hole?',
        options: [
          { id: 'a', text: 'To lower the melting point of coke so it ignites without oxygen' },
          { id: 'b', text: 'To combine with silica and alumina impurities, forming a low-density liquid slag that floats atop molten iron' },
          { id: 'c', text: 'To prevent water from the leat channel from leaking into the tuyere' },
          { id: 'd', text: 'To coat the inner brick lining with metallic zinc' }
        ],
        correctAnswerId: 'b',
        explanation: 'Limestone (CaCO₃) calcines into CaO, reacting with acidic gangue (SiO₂, Al₂O₃) to create molten calcium-silicate slag. Because slag has a lower density than liquid iron, it floats on top and can be safely tapped to dumps.',
        schematicRef: 'Charge Hole & Slag Trough'
      },
      {
        id: 'bf-q4',
        actRef: 'Historical Blast Furnaces',
        topic: 'Thermodynamics',
        question: 'In historical ironworks, what was the "pig bed" into which molten iron from the taphole flowed?',
        options: [
          { id: 'a', text: 'A cooling water chamber that quenched iron into dust' },
          { id: 'b', text: 'A sand mold bed with a central runner feeding smaller ingots resembling nursing piglets' },
          { id: 'c', text: 'A ceramic crucible used exclusively for jewelry casting' },
          { id: 'd', text: 'An off-gas washing chamber for lead-zinc separation' }
        ],
        correctAnswerId: 'b',
        explanation: 'The taphole released liquid iron down a main sand trench ("the sow"), branching into parallel lateral sand molds ("the pigs"), giving cast crude iron its historic name: "pig iron".',
        schematicRef: 'Pig Bed & Taphole'
      }
    ]
  },
  {
    id: 'ancient-metallurgy-nanotech',
    title: 'Ancient Metallurgy & Vajra-Lepa Nanomaterials',
    description: 'Vedic Sanskrit crucible formulations, Vajra-lepa cross-linking, and Agastya galvanic cells.',
    iconName: 'Sparkles',
    accentColor: '#10b981',
    questions: [
      {
        id: 'an-q1',
        actRef: 'Act II: Synthesis of Vajra-lepa',
        topic: 'Ancient Metallurgy',
        question: 'What unique mechanical advantage does the re-engineered Vajra-lepa ceramic coating provide over conventional refractory bricks?',
        options: [
          { id: 'a', text: 'It completely dissolves upon contact with slag to cool the lance' },
          { id: 'b', text: 'It forms a flexible molecular cross-link that resists catastrophic delamination under rapid 1450°C thermal shocks' },
          { id: 'c', text: 'It converts liquid iron directly into gaseous vapor' },
          { id: 'd', text: 'It eliminates the need for water cooling jackets entirely' }
        ],
        correctAnswerId: 'b',
        explanation: 'Standard refractory ceramics suffer brittle thermal fatigue and spalling when plunged into 1450°C iron. Vajra-lepa nano-ceramics utilize covalent chemical cross-links that accommodate thermal expansion without cracking.',
        schematicRef: 'Act II Vajra-Lepa Matrix'
      },
      {
        id: 'an-q2',
        actRef: 'Act IV: Subterranean Guardians',
        topic: 'Ancient Metallurgy',
        question: 'How does the subterranean Agastya bio-electrochemical power vault keep the autonomous gantry energized when the factory grid drops?',
        options: [
          { id: 'a', text: 'By combusting methane generated by the furnace slag' },
          { id: 'b', text: 'By tapping natural ionic soil-moisture gradients paired with copper-zinc galvanic chemistry documented in the Agastya Samhita' },
          { id: 'c', text: 'By utilizing nuclear isotopic decay batteries' },
          { id: 'd', text: 'By transmitting electrical microwaves from overhead drones' }
        ],
        correctAnswerId: 'b',
        explanation: 'The Agastya Samhita records galvanic cells using copper, zinc, and moist earthen electrolytes. Combined with an 820V Lead-Sulfur BESS, it provides islanded, indestructible baseline power immune to plant-wide blackout surges.',
        schematicRef: 'Act IV Subterranean Vault'
      },
      {
        id: 'an-q3',
        actRef: 'Act II: The Kudua Staggered Stack',
        topic: 'Thermodynamics',
        question: 'What is the Kudua Staggered Stack constant K = 1.42, and how does it optimize thermal efficiency?',
        options: [
          { id: 'a', text: 'It amplifies natural chimney draft velocity to preheat blast air to 600°C without auxiliary fuel' },
          { id: 'b', text: 'It multiplies the mass of liquid iron produced per taphole cycle' },
          { id: 'c', text: 'It reduces gantry travel distance by exactly 42%' },
          { id: 'd', text: 'It replaces water cooling jackets with liquid zinc' }
        ],
        correctAnswerId: 'a',
        explanation: 'By designing the 18.5m vertical stack with staggered geometry, natural convective buoyancy is magnified by K = 1.42, preheating incoming blast air to 600°C and saving megawatts of auxiliary heating power.',
        schematicRef: 'Act II Kudua Stack'
      }
    ]
  },
  {
    id: 'robotics-kinematics-edge',
    title: 'Autonomous Robotics & Kinematics',
    description: 'ObjectARX CAD envelopes, snake crawler B-spline curves, and millisecond fail-safes.',
    iconName: 'Cpu',
    accentColor: '#06b6d4',
    questions: [
      {
        id: 'rb-q1',
        actRef: 'Act III: The Gantry Titan',
        topic: 'Robotics & Kinematics',
        question: 'Why is the autonomous sampling robot suspended from an overhead 3.5m gantry rather than deployed on a wheeled ground chassis?',
        options: [
          { id: 'a', text: 'Wheeled robots would be crushed by the overhead water channel' },
          { id: 'b', text: 'Cast house floors are cluttered with 18° sloped metallic plates, molten splashes, and mobile ladles' },
          { id: 'c', text: 'Overhead gantries do not require electrical wiring' },
          { id: 'd', text: 'Wheeled rovers cannot carry sensors weighing more than 1 kg' }
        ],
        correctAnswerId: 'b',
        explanation: 'Floor vehicles slip on slag-slicked steel plates, interfere with heavy torpedo rail cars, and operate directly in the 142 kW/m² radiant splash zone. An overhead 3.5m clearance keeps the primary kinematic drive insulated and unobstructed.',
        schematicRef: 'Act III Gantry Rail'
      },
      {
        id: 'rb-q2',
        actRef: 'Act IV: Slag Blockage Interlock',
        topic: 'Robotics & Kinematics',
        question: 'When the telescopic plunge lance detects a floating slag raft during immersion, what failsafe response occurs?',
        options: [
          { id: 'a', text: 'The robot increases downward torque to punch through the obstruction' },
          { id: 'b', text: 'The controller trips an emergency interlock within 12ms and snaps back to home position in under 3 seconds' },
          { id: 'c', text: 'The drone drops liquid lead onto the slag to dissolve it' },
          { id: 'd', text: 'The plant shuts down all blast furnace tuyeres immediately' }
        ],
        correctAnswerId: 'b',
        explanation: 'Punching into solid slag would bend the telescopic plunge rod. The embedded controller detects resistance within 12 milliseconds and executes an automated rapid retract (< 3s) to prevent catastrophic mechanical failure.',
        schematicRef: 'Act IV Emergency Retract'
      },
      {
        id: 'rb-q3',
        actRef: 'Act V: The Cybernetic Edge',
        topic: 'Cybernetics',
        question: 'How does the Kudua edge telemetry architecture ensure zero data loss during severe electromagnetic plant noise?',
        options: [
          { id: 'a', text: 'By discarding unauthenticated packets and relying on manual pencil logs' },
          { id: 'b', text: 'By writing frames atomically to local flash storage with AES-256-GCM authenticated tags prior to cloud sync' },
          { id: 'c', text: 'By transmitting via unencrypted AM radio frequencies' },
          { id: 'd', text: 'By disabling telemetry during molten tapping' }
        ],
        correctAnswerId: 'b',
        explanation: 'Local daemons queue temperature and chemical assays using atomic .tmp-to-final renames with AES-256-GCM encryption, guaranteeing integrity even if electrical brownouts or RF interference disrupt cloud connectivity.',
        schematicRef: 'Act V Secure Edge Daemon'
      }
    ]
  }
];

export interface QuizScoreRecord {
  quizId: string;
  categoryTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  rankTitle: string;
}

export const getQuizRankTitle = (percentage: number): { rank: string; badgeColor: string; description: string } => {
  if (percentage === 100) {
    return {
      rank: 'Chief Pyrometallurgist & Robotics Master',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-400',
      description: 'Flawless comprehension of blast furnace thermodynamics, ancient metallurgy, and autonomous robotics.'
    };
  } else if (percentage >= 75) {
    return {
      rank: 'Senior Cast House Operator',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-400',
      description: 'Strong technical mastery of 1450°C runner dynamics, tuyere injection, and fail-safe automation.'
    };
  } else if (percentage >= 50) {
    return {
      rank: 'Junior Furnace Technician',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-400',
      description: 'Solid foundational awareness; review the graphic novel Acts to solidify advanced nanomaterial concepts.'
    };
  } else {
    return {
      rank: 'Apprentice Smelter',
      badgeColor: 'text-stone-300 bg-stone-800 border-stone-600',
      description: 'Initiate your metallurgical training by exploring the interactive hotspot diagrams across Acts I through V.'
    };
  }
};
