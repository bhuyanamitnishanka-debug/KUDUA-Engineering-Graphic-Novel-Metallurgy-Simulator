import { NovelChapter } from '../types/novel';

export const NOVEL_CHAPTERS: NovelChapter[] = [
  {
    id: 1,
    act: "PROLOGUE & ACT I",
    title: "The Crucible of Fire",
    subtitle: "The 1450°C Runner Hazard & The Tata InnoVerse Challenge",
    theme: "Industrial Danger & The Call for Automation",
    summary: "Inside the blast furnace cast house, rivers of molten iron surge at 1450°C. Human operators in bulky aluminized suits brave suffocating radiant heat and explosive splash risks to manually plunge 10kg sampling lances. The Tata InnoVerse challenge sparks a revolution: replace human exposure with zero-harm autonomous robotics.",
    panels: [
      {
        id: "p1-1",
        title: "Cast Floor: The 1450°C Torrent",
        timeCode: "02:14 HRS · RUNNER SECTION 01",
        ambientCondition: "Ambient: 120°C · Molten Stream: 1450°C · Radiant Heat: Fatal",
        narrativeCaption: "For decades, taking the metallurgical pulse of a blast furnace was a grueling baptism of fire. Every cast, human operators walked the narrow metallic catwalks, engulfed in radiant thermal loads.",
        sceneType: "furnace-runner",
        dialogue: [
          {
            speaker: "Plant Director Rao",
            role: "Tata InnoVerse Operational Lead",
            avatarColor: "bg-amber-600",
            text: "Operators are exposed to intense radiant heat and toxic fumes for 2.5 hours every single cast. One splash or lance flashback is catastrophic.",
            type: "speech"
          },
          {
            speaker: "Dr. Priya Sharma",
            role: "Chief Robotics Architect",
            avatarColor: "bg-cyan-600",
            text: "Standard wheeled robots slip on these sloped metallic coverings and melt under 1450°C proximity. We need an entirely new architectural paradigm.",
            type: "speech"
          }
        ],
        soundEffect: "HISS-SHHH!",
        soundEffectColor: "text-amber-500",
        technicalCallouts: [
          { label: "Radiant Exposure", spec: "2.5 Hours / Cast", detail: "Extreme thermal degradation on human and mechanical assets", category: "thermal" },
          { label: "Lance Mass", spec: "10.0 kg Manual Lance", detail: "Heavy manual immersion risking operator fatigue and pinch points", category: "thermal" },
          { label: "Core Metal Temp", spec: "1450.0 °C", detail: "Liquid iron stream flowing into torpedo transfer ladles", category: "thermal" }
        ],
        quote: "Zero human entry into splash zones: that is our non-negotiable metric.",
        annotation: "[1450°C Thermal Gradient]: Baseline radiant heat flux calculated at 142 kW/m² dictates a minimum 3.5m standoff distance for gantry carriages.",
        hotspots: [
          {
            id: 'hs-molten-stream',
            x: 58,
            y: 78,
            title: '1450°C Molten Iron Torrent',
            shortDesc: 'Molten iron stream tapped from blast furnace hearth',
            detail: 'Flows at 1450°C into torpedo transfer rail ladles. Radiant heat flux exceeds 142 kW/m², causing instant third-degree thermal degradation on unprotected materials.',
            formula: 'q_rad = 0.85 · σ · (1723.15⁴ - T_shield⁴)',
            animationType: 'spark-shower',
            techDocRef: 'Tab 1: Section 2 - Problem Context & Safety Hazards'
          },
          {
            id: 'hs-manual-lance',
            x: 51,
            y: 45,
            title: '10.0 kg Manual Sampling Lance',
            shortDesc: 'Archaic manual plunge lance causing extreme fatigue',
            detail: 'Requires operators wearing aluminized suits to stand within 1.5m of the molten torrent for 2.5 hours per cast, creating severe pinch-point and flashback risks.',
            animationType: 'heat-scan',
            techDocRef: 'Tab 1: Section 2 - Extreme Thermal Load (2.5 hrs/cast)'
          },
          {
            id: 'hs-gantry-clearance',
            x: 48,
            y: 20,
            title: 'Overhead 3.5m Structural Rail',
            shortDesc: 'Planar clearance envelope suspended above cat-walks',
            detail: 'Keeps all mechanical actuation entirely clear of sloped floors, slag spatter, and floor transport vehicles.',
            animationType: 'laser-reticle',
            techDocRef: 'Tab 9: 3.5m Clearance Envelope'
          }
        ],
        branchingChoice: {
          id: 'choice-act1',
          prompt: 'The cast runner begins to surge with intense radiant heat (1450°C). How should the engineering team execute initial reconnaissance?',
          options: [
            {
              id: 'c1-drone',
              label: 'Launch Aerial Micro-Drone Sentinel',
              description: 'Deploy the 4K multi-spectral drone hovering 2.5m above the stream to map gas curtains and thermal plumes.',
              systemAction: 'ENGAGE_DRONE_HOVER_2.5M',
              consequenceText: 'The micro-drone delivers 94.8% optical clarity and detects safe O2/CO levels, establishing safe coordinates for the robotic gantry.',
              riskScore: 'Low',
              techFocus: 'Aerial Computer Vision & Gas Sensing'
            },
            {
              id: 'c1-snake',
              label: 'Dispatch Bio-Inspired Snake Crawler',
              description: 'Send the segmented crawler along sloped metallic catwalks using spiral-winding gaits to inspect floor dampers.',
              systemAction: 'DISPATCH_SNAKE_CRAWLER_GAIT',
              consequenceText: 'The snake crawler wraps around metallic vibration dampers with zero slip, inductively drawing power from high-current plant cables.',
              riskScore: 'Low',
              techFocus: 'B-Spline Serpentine Kinematics'
            },
            {
              id: 'c1-direct-gantry',
              label: 'Immediate Heavy Gantry Plunge',
              description: 'Drive the 6-axis gantry directly to X=3250mm without prior aerial reconnaissance.',
              systemAction: 'DIRECT_GANTRY_DEPLOYMENT',
              consequenceText: 'The gantry reaches the target in 5 seconds, but high ambient smoke requires immediate vortex air purge engagement.',
              riskScore: 'Moderate',
              techFocus: 'Heavy Manipulator Velocity'
            }
          ]
        }
      },
      {
        id: "p1-2",
        title: "The Slag Pot & Torpedo Ladle Crisis",
        timeCode: "02:45 HRS · LADLE TRANSFER CORRIDOR",
        ambientCondition: "Slag Surface: 1200°C · Torpedo Speed: 5 km/h",
        narrativeCaption: "The danger expands down the line. Moving torpedo ladles still rely on archaic wooden scotching blocks placed by hand, while slag pots suffer micro-cracks from violent thermal cycling.",
        sceneType: "furnace-runner",
        dialogue: [
          {
            speaker: "Field Engineer Ankit",
            role: "Metallurgical Safety Inspector",
            avatarColor: "bg-red-600",
            text: "Manual scotching puts operators right in the pinch zone of a 400-ton torpedo ladle. And micro-cracks in slag pots are invisible to the naked eye until rupture!",
            type: "speech"
          },
          {
            speaker: "Dr. Priya Sharma",
            role: "Chief Robotics Architect",
            avatarColor: "bg-cyan-600",
            text: "Our proposal merges computer vision crack detection with a self-powered automated scotcher capable of withstanding 250°C continuously.",
            type: "speech"
          }
        ],
        soundEffect: "CLAAANG!",
        soundEffectColor: "text-rose-500",
        technicalCallouts: [
          { label: "Scotching Temp", spec: "Up to 250 °C", detail: "Replacing manual wooden blocks with motorized mechanical locks", category: "modern" },
          { label: "Defect Detection", spec: "Non-Contact AI", detail: "Automated thermal imaging and XGBoost fatigue modeling", category: "modern" }
        ]
      }
    ]
  },
  {
    id: 2,
    act: "ACT II",
    title: "The Ancient Blueprint Awakens",
    subtitle: "Vajra-lepa Coatings & Kudua Thermodynamic Mastery",
    theme: "Ancient Bhartiya Wisdom Reborn in Space-Age Alloys",
    summary: "To withstand conditions that melt conventional steel, the engineering team looks beyond conventional textbooks. Drawing from classical Bhartiya metallurgy, they synthesize the indestructible Vajra-lepa nano-ceramic refractory matrix, the staggered Kudua draft stack, and Bhastrika pulse-jet billows.",
    panels: [
      {
        id: "p2-1",
        title: "Synthesis of Vajra-lepa Refractory",
        timeCode: "04:10 HRS · ADVANCED MATERIALS LAB",
        ambientCondition: "Furnace Chamber: 1600°C Testing Rig",
        narrativeCaption: "In ancient Sanskrit treatises on ironcraft, 'Vajra-lepa' was celebrated as a diamond-hard adhesive barrier impervious to water, fire, and corrosive flux. Re-engineered with modern nano-ceramics, it becomes the ultimate thermal shield.",
        sceneType: "kudua-reactor",
        dialogue: [
          {
            speaker: "Master Harish",
            role: "Ancient Metallurgy Historian",
            avatarColor: "bg-emerald-600",
            text: "Modern refractory bricks crack and delaminate when slag spatters them. But Vajra-lepa creates a molecular chemical cross-link that flexes with thermal shock.",
            type: "speech"
          },
          {
            speaker: "Dr. Priya Sharma",
            role: "Chief Robotics Architect",
            avatarColor: "bg-cyan-600",
            text: "Look at the spectrometer: the dual-layer nano-ceramic bond is holding solid at 1450°C. Delamination probability dropped to near zero!",
            type: "speech"
          }
        ],
        soundEffect: "CRACKLE-FUSE!",
        soundEffectColor: "text-emerald-400",
        technicalCallouts: [
          { label: "Refractory Layer", spec: "Vajra-lepa Matrix", detail: "Rock-hard nano-ceramic barrier resisting corrosive molten slag", category: "ancient" },
          { label: "Hearth Base", spec: "Granite Stone Bed", detail: "Natural quartz crystal structure provides superior ore shock damping", category: "ancient" },
          { label: "Thermal Cycling", spec: "Zero Delamination", detail: "Prevents mechanical fatigue across rapid molten immersion cycles", category: "ancient" }
        ],
        quote: "True innovation does not discard history; it gives ancient wisdom digital wings.",
        hotspots: [
          {
            id: 'hs-vajra-lepa',
            x: 32,
            y: 62,
            title: 'Vajra-lepa Refractory Barrier',
            shortDesc: 'Diamond-hard nano-ceramic molecular cross-link',
            detail: 'Engineered from ancient Sanskrit treatises to prevent mechanical delamination under repeated 1450°C thermal shock cycles.',
            formula: 'σ_thermal = E · α · ΔT / (1 - ν)',
            animationType: 'heat-scan',
            techDocRef: 'Tab 2: Section 2.2 - Ancient Bhartiya Vajra-lepa Integration'
          },
          {
            id: 'hs-granite-bed',
            x: 50,
            y: 86,
            title: 'Precision-Cut Granite Stone Bed',
            shortDesc: 'Quartz crystal shock absorption damping ore drops',
            detail: 'Natural crystalline damping protects the blast furnace foundation during heavy iron ore charging and molten tap surges.',
            animationType: 'pulse-ring',
            techDocRef: 'Tab 2: Section 3 - Granite Stone Bed & Ore Melting Optimization'
          }
        ],
        branchingChoice: {
          id: 'choice-act2',
          prompt: 'Refractory cycling tests show a surge in corrosive slag spatter. How should the team fortify the sampling lance outer shell?',
          options: [
            {
              id: 'c2-vajra',
              label: 'Double-Coat with Vajra-lepa Nano-Ceramics',
              description: 'Apply an additional 15mm cross-linked Vajra-lepa refractory barrier with high emissivity (ε=0.85).',
              systemAction: 'APPLY_VAJRA_LEPA_COAT',
              consequenceText: 'Spectrometry confirms 0% delamination. Outer surface emissivity reaches ε=0.85, reflecting 142 kW/m² radiant heat.',
              riskScore: 'Low',
              techFocus: 'Ancient Ceramic Nanotechnology'
            },
            {
              id: 'c2-water',
              label: 'Increase Water Cooling Flow to 35 L/min',
              description: 'Supercharge the closed-loop water pump to maximize convective thermal extraction.',
              systemAction: 'SUPERCHARGE_COOLING_PUMP',
              consequenceText: 'Thermal dissipation increases, but back-pressure on the 4.2 Bar jacket approaches operating tolerances.',
              riskScore: 'Moderate',
              techFocus: 'Hydraulic Heat Dissipation'
            }
          ]
        }
      },
      {
        id: "p2-2",
        title: "The Kudua Staggered Stack & Closed-Loop Methanol",
        timeCode: "05:22 HRS · REACTOR CORE LEVEL 2",
        ambientCondition: "Stack Height: 18.5m · Natural Draft: 1.42x",
        narrativeCaption: "The 18.5m staggered Kudua vertical stack taps natural buoyancy. Waste heat pre-heats incoming blast air to 600°C, while an integrated off-gas membrane converts carbon monoxide into synthetic methanol.",
        sceneType: "kudua-reactor",
        dialogue: [
          {
            speaker: "Dr. Priya Sharma",
            role: "Chief Robotics Architect",
            avatarColor: "bg-cyan-600",
            text: "Theoretical draft velocity is amplified by the Kudua geometry constant K = 1.42. We recover 600°C air without spending a single watt of auxiliary fuel!",
            type: "speech"
          },
          {
            speaker: "Plant Director Rao",
            role: "Tata InnoVerse Operational Lead",
            avatarColor: "bg-amber-600",
            text: "And the off-gas capture? 99.4% capture rate! Converting furnace emissions into high-yield methanol byproduct.",
            type: "speech"
          }
        ],
        soundEffect: "ROOOOAR!",
        soundEffectColor: "text-amber-400",
        technicalCallouts: [
          { label: "Stack Draft K", spec: "Kudua K = 1.42", detail: "Staggered geometry trapping vertical thermal gradients", category: "ancient" },
          { label: "Preheat Temp", spec: "600.0 °C", detail: "Pre-heating blast air using waste heat alone", category: "thermal" },
          { label: "Gas Capture", spec: "99.4 % Efficiency", detail: "Closed-loop synthesis of industrial methanol byproduct", category: "modern" }
        ]
      }
    ]
  },
  {
    id: 3,
    act: "ACT III",
    title: "The Gantry Titan & Snake Crawler",
    subtitle: "High-Clearance Kinematics & Bio-Inspired Terrains",
    theme: "Precision Kinematics in Extreme Environments",
    summary: "The automated sampling system takes form. An overhead gantry spans 3.5m above the molten runner, housing a multi-axis telescopic lance. On the sloped ground, a segmented snake-inspired crawler negotiates metallic vibration dampers using spiral-winding gaits.",
    panels: [
      {
        id: "p3-1",
        title: "Deployment: 3.5m Planar Clearance Envelope",
        timeCode: "06:15 HRS · GANTRY AXIS X-3250",
        ambientCondition: "Gantry Travel: 3.25m · Insertion Depth: 1.85m",
        narrativeCaption: "Hovering 3.5 meters above the blazing iron river, the motorized overhead gantry aligns with millimetric precision. Its internal cooling jackets circulate 25 L/min of chilled water.",
        sceneType: "gantry-action",
        dialogue: [
          {
            speaker: "Autonomous CAD Controller",
            role: "ObjectARX Kinematic Engine",
            avatarColor: "bg-blue-600",
            text: "Drive Gantry X to 3250.0 mm. Water jacket pressure nominal at 4.2 Bar. Positive air purge engaged at 6.0 Bar.",
            type: "radio"
          },
          {
            speaker: "Dr. Priya Sharma",
            role: "Chief Robotics Architect",
            avatarColor: "bg-cyan-600",
            text: "Commence telescopic Z plunge! Descend 1850 mm into the molten core. 15-second immersion countdown begins.",
            type: "speech"
          }
        ],
        soundEffect: "WHIRRR-CHUNK!",
        soundEffectColor: "text-sky-400",
        technicalCallouts: [
          { label: "Gantry Clearance", spec: "3.5 m Envelope", detail: "Overhead suspension avoiding cluttered floor vehicle traffic", category: "robotic" },
          { label: "Cooling Water", spec: "25 L/min (0.35 kg/s)", detail: "Dual-layer enclosed water jacket surrounding electronic chassis", category: "thermal" },
          { label: "Air Purge", spec: "350 W Extraction", detail: "Vortex pneumatic purge keeping internal bay under 65°C safe limit", category: "thermal" }
        ],
        quote: "Precision is not just accuracy; in a steel mill, precision is survival."
      },
      {
        id: "p3-2",
        title: "The Snake-Crawler on Metallic Slopes",
        timeCode: "06:40 HRS · RUNNER FLOOR DAMPERS",
        ambientCondition: "Surface Slope: 18° · Vibration: 42 Hz",
        narrativeCaption: "Wheeled rovers tip and slide on slag-slicked steel plates. The bio-inspired snake crawler flexes segmented joints, wrapping around structural dampers using continuous B-spline curves.",
        sceneType: "drone-recon",
        dialogue: [
          {
            speaker: "Control Operator Maya",
            role: "AI Perception Engineer",
            avatarColor: "bg-purple-600",
            text: "Snake-Crawler gait locked on spiral-winding mode. Inductive coils are leeching power directly from high-current plant conduits!",
            type: "speech"
          },
          {
            speaker: "Micro-Drone Sentinel",
            role: "Autonomous Aerial Eye",
            avatarColor: "bg-emerald-600",
            text: "Hovering 2.5m above probe vector. Optical clarity score: 94.8%. Ambient fume density below hazard threshold.",
            type: "radio"
          }
        ],
        soundEffect: "ZZZT-SLITHER!",
        soundEffectColor: "text-purple-400",
        technicalCallouts: [
          { label: "Obstacle Traversal", spec: "B-Spline Splines", detail: "Traverses vibration dampers without mechanical fatigue", category: "robotic" },
          { label: "Auxiliary Power", spec: "Inductive Leeching", detail: "Continuous off-grid harvesting from surrounding high-current cables", category: "modern" },
          { label: "Drone Altitude", spec: "2.5 m Above Lance", detail: "Real-time 4K thermal vision and hazardous gas curtain telemetry", category: "robotic" }
        ]
      }
    ]
  },
  {
    id: 4,
    act: "ACT IV",
    title: "Subterranean Guardians & Thermal Balance",
    subtitle: "Agastya Bio-Electrochemical Power & Liquid-Lithium Jackets",
    theme: "Autonomous Off-Grid Energy & Extreme Thermal Defense",
    summary: "When industrial power grids suffer outages or severe EMI interference, the hot metal sampling mission cannot stop. Buried deep beneath the furnace foundations lies the UEPSS—an underground energy reservoir combining ancient Agastya galvanic chemistry with aerospace liquid-lithium thermal jackets.",
    panels: [
      {
        id: "p4-1",
        title: "Sub-Surface Agastya Electrochemical Cells",
        timeCode: "07:15 HRS · SUBTERRANEAN FOUNDATION LEVEL -3",
        ambientCondition: "Depth: 6m Underground · Temperature: 28°C Steady",
        narrativeCaption: "Harnessing the natural ionic soil gradients documented in the ancient Agastya Samhita, the sub-surface galvanic cells generate continuous baseline wattage, insulated from furnace radiant heat.",
        sceneType: "subterranean-vault",
        dialogue: [
          {
            speaker: "Master Harish",
            role: "Ancient Metallurgy Historian",
            avatarColor: "bg-emerald-600",
            text: "Sage Agastya described generation from copper, zinc, and moist earthen electrolytes. Here beneath the mill, the earth provides steady, indestructible power.",
            type: "speech"
          },
          {
            speaker: "Dr. Priya Sharma",
            role: "Chief Robotics Architect",
            avatarColor: "bg-cyan-600",
            text: "Coupled with our 1200 kWh Lead-Sulfur BESS at 820 Volts, the entire robotic gantry operates completely islanded from the external factory grid.",
            type: "speech"
          }
        ],
        soundEffect: "HUMMM-GLOW!",
        soundEffectColor: "text-cyan-400",
        technicalCallouts: [
          { label: "Subterranean BESS", spec: "1200 kWh (820V)", detail: "High-voltage storage protected from ambient furnace heat", category: "modern" },
          { label: "Agastya Generator", spec: "Galvanic Baseline", detail: "Sub-surface soil-electrolyte interaction for zero-connectivity power", category: "ancient" },
          { label: "Liquid-Lithium Jacket", spec: "Surge Absorption", detail: "Thermal harvesting layer converting extreme heat into battery charge", category: "thermal" }
        ],
        quote: "The earth beneath our feet is both shield and power source."
      },
      {
        id: "p4-2",
        title: "The Slag Blockage Interlock Triggered",
        timeCode: "07:48 HRS · RUNNER TROUGH INTERLOCK",
        ambientCondition: "Slag Density Spike: Critical Obstruction",
        narrativeCaption: "A sudden crusted slag raft floats into the immersion path! The sensor array detects resistance. Within 12 milliseconds, the ObjectARX kinematic failsafe trips.",
        sceneType: "gantry-action",
        dialogue: [
          {
            speaker: "Safety Logic Kernel",
            role: "C++ Embedded Controller",
            avatarColor: "bg-rose-600",
            text: "!! ALARM: SLAG_BLOCKAGE_DETECTED !! Halting downward plunge. Executing emergency high-speed retract to HOME (0.0, 0.0)!",
            type: "announcement"
          },
          {
            speaker: "Plant Director Rao",
            role: "Tata InnoVerse Operational Lead",
            avatarColor: "bg-amber-600",
            text: "The robotic lance snapped back to zero in under three seconds. No damage to probe, no downtime. That would have snapped a human operator's arm!",
            type: "speech"
          }
        ],
        soundEffect: "KLAXON-BZZZT!",
        soundEffectColor: "text-red-500",
        technicalCallouts: [
          { label: "Emergency Retract", spec: "< 3.0 Seconds", detail: "Instantaneous CAD mesh coordinate snap to home coordinates", category: "robotic" },
          { label: "Lockout Safe State", spec: "EMERGENCY_STOP", detail: "Prevents accidental re-immersion until manual clearance reset", category: "robotic" },
          { label: "Sensor Longevity", spec: "100% Preserved", detail: "Zero probe loss under violent hydraulic slag surges", category: "modern" }
        ]
      }
    ]
  },
  {
    id: 5,
    act: "ACT V",
    title: "The Cybernetic Edge & Immutable Cloud",
    subtitle: "AES-256-GCM Telemetry & Kubernetes Edge Autoscaling",
    theme: "Zero-Loss Telemetry & Continuous Operational Intelligence",
    summary: "As the sampling sequence completes, encrypted telemetry streams from the edge to the immutable AWS archive. Even if factory WAN uplinks sever under high electromagnetic interference, local flash storage daemons ensure zero data loss.",
    panels: [
      {
        id: "p5-1",
        title: "Authenticated AES-256-GCM Stream Ingest",
        timeCode: "08:02 HRS · SECURE EDGE DAEMON",
        ambientCondition: "Data Encryption: 96-bit Nonce · S3 Bucket: Encrypted",
        narrativeCaption: "Every temperature gradient, chemical assay, and motor torque curve is encrypted on-chip using AES-256-GCM. Corrupted packets or hostile data injection attempts are immediately rejected by cryptographic MAC verification.",
        sceneType: "cyber-core",
        dialogue: [
          {
            speaker: "Security Daemon",
            role: "IndustrialDataCipher Engine",
            avatarColor: "bg-indigo-600",
            text: "Generating 96-bit GCM nonce. Encrypting JSON telemetry payload. MAC authentication tag verified against factory KMS key.",
            type: "radio"
          },
          {
            speaker: "Dr. Priya Sharma",
            role: "Chief Robotics Architect",
            avatarColor: "bg-cyan-600",
            text: "FastAPI v3 is queuing frames to the local flash buffer with atomic .tmp write safeguards. If the cloud link drops, the sync daemon catches up automatically!",
            type: "speech"
          }
        ],
        soundEffect: "CHIP-SYNC!",
        soundEffectColor: "text-indigo-400",
        technicalCallouts: [
          { label: "Encryption Cipher", spec: "AES-256-GCM", detail: "Authenticated encryption preventing tampering across noisy plant RF", category: "modern" },
          { label: "Atomic Storage", spec: "Atomic .tmp Rename", detail: "Zero corrupted frames during unexpected edge node power cutoffs", category: "modern" },
          { label: "Cloud Archive", spec: "AWS S3 + KMS", detail: "Immutable multi-decade metallurgical campaign audit trail", category: "modern" }
        ],
        quote: "Data is the furnace's memory. Protected, it becomes our greatest safety asset."
      },
      {
        id: "p5-2",
        title: "Epilogue: The Modernized Steel Bastion",
        timeCode: "08:30 HRS · TATA INNOVERSE PORTAL",
        ambientCondition: "Status: 100% Human Elimination from Splash Zone",
        narrativeCaption: "The technical proposal stands complete. Nineteen integrated modules weave ancient Bhartiya metallurgical heritage with space-age autonomous robotics, solving Tata InnoVerse's toughest challenges.",
        sceneType: "cyber-core",
        dialogue: [
          {
            speaker: "Plant Director Rao",
            role: "Tata InnoVerse Operational Lead",
            avatarColor: "bg-amber-600",
            text: "Human safety: 100% elimination from splash zones. Response time: under 5 minutes. Inspection OPEX: 30% reduction. The blueprint is a triumph.",
            type: "speech"
          },
          {
            speaker: "Master Harish & Dr. Priya",
            role: "Co-Architects",
            avatarColor: "bg-emerald-600",
            text: "From the furnaces of ancient Bharata to the autonomous smart mills of 2026, the flame burns brighter, cleaner, and safer than ever.",
            type: "speech"
          }
        ],
        soundEffect: "VICTORY-HUM!",
        soundEffectColor: "text-amber-300",
        technicalCallouts: [
          { label: "Human Safety KPI", spec: "100% Elimination", detail: "Zero personnel exposed to molten splashes and toxic fumes", category: "modern" },
          { label: "System Uptime", spec: "> 98% in Harsh Zones", detail: "Resilient operation verified across 300+ simulated casts", category: "modern" },
          { label: "OPEX Savings", spec: "30% Reduction", detail: "Decreased downtime, lower lance wear, and automated maintenance", category: "modern" }
        ]
      }
    ]
  }
];

export const TECHNICAL_MODULES_16 = [
  { id: 1, title: "Site Survey & Infrastructure", category: "Foundation", summary: "Mapping torpedo ladle tracks and wheel positions to accommodate varying scotching requirements." },
  { id: 2, title: "Sensor Fusion", category: "Foundation", summary: "Integrating pyrometers, LiDAR, and thermal imaging for a unified environment view." },
  { id: 3, title: "Communication Layer", category: "Foundation", summary: "Redundant industrial 5G/Wi-Fi 6 mesh and LoRaWAN backbones in high-EMI steel zones." },
  { id: 4, title: "Automated Scotching", category: "Foundation", summary: "Self-powered remotely operated system deploying scotch blocks on torpedo ladles up to 250°C." },
  { id: 5, title: "Data Pipeline Architecture", category: "AI & Data", summary: "Scalable S3-based ingestion engine with atomic edge disk buffering." },
  { id: 6, title: "GenAI Diagnostic Assistant", category: "AI & Data", summary: "RAG-based knowledge base for maintenance engineers to query plant manuals and fault logs." },
  { id: 7, title: "Crack Detection Models", category: "AI & Data", summary: "Deep learning models identifying thermal cycling micro-stress in slag pots." },
  { id: 8, title: "Predictive Maintenance", category: "AI & Data", summary: "Time-series forecasting (ARIMA/Prophet) to predict component fatigue and lance wear." },
  { id: 9, title: "PLC/SCADA Integration", category: "Control", summary: "Seamless real-time handshake between robotic controllers and existing plant management." },
  { id: 10, title: "Human-Machine Interface", category: "Control", summary: "Power BI and WebGL dashboards visualizing real-time cast health and thermal profiles." },
  { id: 11, title: "Fail-Safe Mechanisms", category: "Control", summary: "Automated emergency retraction in <3s with state-machine lockout safeguards." },
  { id: 12, title: "Power Management (UEPSS)", category: "Control", summary: "Subterranean Agastya bio-electrochemical cells and 1200 kWh Lead-Sulfur BESS." },
  { id: 13, title: "Regulatory Compliance", category: "Governance", summary: "Alignment with ISO 9001/45001, GDPR data governance, and industrial metallurgy standards." },
  { id: 14, title: "Risk Assessment", category: "Governance", summary: "Mitigation strategies for 1450°C heat, dust, and electrical interference." },
  { id: 15, title: "Implementation Roadmap", category: "Governance", summary: "Phased 4-stage deployment: CFD simulation -> Prototype -> Mesh -> Full rollout." },
  { id: 16, title: "ROI & Sustainability", category: "Governance", summary: "Elimination of human injury, 30% OPEX cut, and closed-loop methanol byproduct generation." }
];

export const ANCIENT_MODERN_MATRIX = [
  {
    ancientTech: "Vajra-lepa Diamond Adhesive",
    source: "Ancient Sanskrit Metallurgical Treatises",
    modernImplementation: "Dual-Layer Nano-Ceramic Refractory Coating",
    benefit: "Prevents delamination under 1450°C thermal cycling and slag corrosion"
  },
  {
    ancientTech: "Kudua Staggered Stack Geometry",
    source: "Traditional South Asian Smelting Kilns",
    modernImplementation: "18.5m Aerodynamic Buoyancy Draft Channel (K=1.42)",
    benefit: "Preheats combustion air to 600°C without auxiliary fuel, trapping heat gradients"
  },
  {
    ancientTech: "Bhastrika (High-Frequency Billows)",
    source: "Vedic Blacksmith Forges",
    modernImplementation: "Pulse-Jet Oxygen Delivery & Vortex Air Purge (350W)",
    benefit: "Supplies precise stoichiometric blast and shields internal electronics from heat"
  },
  {
    ancientTech: "Vastika Passive Ventilation",
    source: "Traditional Furnace Flue Architecture",
    modernImplementation: "Intra-Wall Dynamic Airflow & Water Jackets (25 L/min)",
    benefit: "Passive cooling keeping sensor core below 65°C critical threshold"
  },
  {
    ancientTech: "Granite Hearth Bed",
    source: "Classical Indian Crucible Furnaces",
    modernImplementation: "Precision-Cut Granite Impact & Damping Platform",
    benefit: "Natural quartz crystal structure absorbs ore drop kinetic shock, protecting foundations"
  },
  {
    ancientTech: "Agastya Samhita Galvanic Generation",
    source: "Agastya Electrochemical Manuscripts",
    modernImplementation: "Subterranean Galvanic Soil-Electrolyte Energy Harvester",
    benefit: "Continuous baseline off-grid power independent of factory grid outages"
  }
];
