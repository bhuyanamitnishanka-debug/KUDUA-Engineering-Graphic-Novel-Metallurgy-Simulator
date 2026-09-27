import { TechDeepDive } from '../types/novel';

export const TECHNOLOGIES_DATA: TechDeepDive[] = [
  {
    id: 'vajra-lepa',
    title: 'Vajra-lepa Diamond Adhesive & Nano-Ceramic Refractory',
    ancientHeritage: 'Sanskrit texts (Rasaratna Samuccaya & Varahamihira’s Brihat Samhita) documenting indestructible organic-mineral binders resistant to boiling acids, salts, and high-heat furnaces.',
    modernApplication: 'Advanced refractory coating bonding nano-ceramic barriers to industrial blast furnace runners and robotic lance shafts.',
    category: 'Materials',
    summary: 'Conventional alumina-silica refractory bricks suffer severe mechanical delamination and thermal shock cracks when spattered with 1450°C iron and corrosive basic slag. Vajra-lepa reformulates this with a nano-ceramic cross-linked composite that matches the thermal expansion coefficient of high-alloy steels, eliminating spallation.',
    physicalPrinciples: [
      'Molecular cross-linking preventing chemical attack from aggressive FeO-SiO2-CaO liquid slags',
      'High thermal emissivity (ε = 0.85) reflecting ambient infrared back into the melt stream',
      'Interfacial shear strength exceeding 180 MPa under cyclic thermal stress (ambient to 1450°C)'
    ],
    equations: [
      {
        formula: 'σ_thermal = E · α · ΔT / (1 - ν)',
        explanation: 'Thermal stress calculation: engineered expansion coefficient α ensures zero mechanical failure during immersion shock.'
      },
      {
        formula: 'q_rad = ε · σ · A · (T_molten⁴ - T_shield⁴)',
        explanation: 'Stefan-Boltzmann radiant heat influx reflected by the high-emissivity ceramic outer boundary.'
      }
    ],
    specSheet: [
      { label: 'Max Operating Temp', value: '1650 °C Continuous' },
      { label: 'Thermal Emissivity (ε)', value: '0.85' },
      { label: 'Adhesive Shear Bond', value: '185 MPa' },
      { label: 'Delamination Cycles', value: '> 1,200 Immersion Cycles' }
    ],
    industrialSafetyImpact: 'Eliminates structural furnace wall blowouts and protects robotic sensor chassis from radiant burn-through.'
  },
  {
    id: 'kudua-stack',
    title: 'Kudua Staggered Draft Stack & Closed-Loop Methanol',
    ancientHeritage: 'Classical South Asian tiered clay kiln stacking (Kudua) creating differential atmospheric pressure zones to draw air naturally without artificial blowers.',
    modernApplication: '18.5m vertical stack structure trapping vertical thermal gradients, pre-heating blast air to 600°C, and recycling CO/H2 off-gases.',
    category: 'Thermodynamics',
    summary: 'The Kudua geometry utilizes staggered concentric rings that trap buoyant hot gases, creating a self-sustaining natural draft velocity amplified by a factor of K = 1.42. By pre-heating incoming air to 600°C via waste heat alone, fuel demand drops drastically, while 99.4% of greenhouse off-gases are channeled into direct stoichiometric methanol synthesis.',
    physicalPrinciples: [
      'Natural draft buoyancy acceleration using staggered aerodynamic constriction orifices',
      'Waste-heat preheating of combustion air up to 600°C without auxiliary electric heaters',
      'Direct stoichiometric catalytic synthesis converting furnace off-gas (CO + 2H2) into industrial liquid methanol'
    ],
    equations: [
      {
        formula: 'v_draft = sqrt(2 · g · H · (T_core - T_0) / T_0) · K_kudua',
        explanation: 'Enhanced natural draft velocity where H = 18.5m and K_kudua = 1.42.'
      },
      {
        formula: 'CO + 2 H₂  →  CH₃OH   (ΔH° = -90.7 kJ/mol)',
        explanation: 'Closed-loop chemical conversion of captured carbon monoxide into value-added methanol fuel.'
      }
    ],
    specSheet: [
      { label: 'Stack Height', value: '18.5 Meters' },
      { label: 'Kudua Draft Constant', value: 'K = 1.42' },
      { label: 'Preheat Air Temperature', value: '600.0 °C' },
      { label: 'Off-Gas Capture Efficiency', value: '99.4 %' }
    ],
    industrialSafetyImpact: 'Dramatically reduces toxic carbon monoxide plume venting around the plant, meeting zero-emission compliance.'
  },
  {
    id: 'gantry-kinematics',
    title: 'Overhead 3.5m Planar Gantry & Dual-Layer Fluid Jacket',
    ancientHeritage: 'Bhastrika (continuous high-frequency bellows) and Vastika (intra-structure dynamic cooling channels).',
    modernApplication: 'Heavy-duty 6-axis overhead manipulator suspended 3.5m above the molten runner, featuring 25 L/min water jacket and 350W vortex air purge.',
    category: 'Kinematics',
    summary: 'To navigate around erratic plant vehicle movement and sloped runner cat-walks, the manipulator hangs from an overhead clearance envelope. The central sensor core is kept under 65°C using a dual-layer cooling system: chilled water at 4.2 Bar and a high-velocity compressed air vortex creating positive internal pressure.',
    physicalPrinciples: [
      'Overhead suspension eliminates floor obstruction hazards and vehicle collision risks',
      'Differential resistance convective water cooling dissipating up to 142 kW radiant heat',
      'Vortex compressed air purge generating positive internal bay pressure against conductive dust'
    ],
    equations: [
      {
        formula: 'q_water = m_dot · C_p · max(0, T_shield - T_water_in) · η',
        explanation: 'Convective water heat extraction preventing initial step 0 temperature crash.'
      },
      {
        formula: 'air_purge = min(350W, q_conductive_leak + 0.5 · (T_internal - 298.15))',
        explanation: 'Bounded vortex air purge equation guaranteeing no unphysical drops below room temperature.'
      }
    ],
    specSheet: [
      { label: 'Clearance Envelope', value: '3.5 Meters Overhead' },
      { label: 'Gantry X-Travel', value: '0.0 to 5000.0 mm (Target: 3250mm)' },
      { label: 'Telescopic Z-Depth', value: '0.0 to 2200.0 mm (Target: 1850mm)' },
      { label: 'Cooling Water Flow', value: '25 L/min (~0.35 kg/s) @ 4.2 Bar' },
      { label: 'Air Purge Capacity', value: '350 Watts @ 6.0 Bar' }
    ],
    industrialSafetyImpact: '100% elimination of operators entering the radiant splash zone with 10kg manual lances.'
  },
  {
    id: 'snake-crawler',
    title: 'Bio-Inspired Snake Crawler & B-Spline Obstacle Traversal',
    ancientHeritage: 'Biomimetic serpentine movement principles for fluid negotiation of hazardous irregular surfaces.',
    modernApplication: 'Segmented multi-link robotic crawler with spiral-winding gait for sloped metallic runner floor traversal.',
    category: 'Kinematics',
    summary: 'Standard wheeled or tracked rovers suffer catastrophic slip on sloped, slag-dusted steel runner covers. The segmented snake crawler wraps around structural vibration dampers using continuous B-spline curves, maintaining constant multi-point traction while inductively drawing power from surrounding high-current cables.',
    physicalPrinciples: [
      'Spiral-winding gait providing 3× higher contact traction over sloped metallic plates',
      'Continuous B-spline curvature smoothing motor torque and avoiding mechanical fatigue',
      'Electromagnetic induction coils harvesting auxiliary power directly from 10kA factory busbars'
    ],
    equations: [
      {
        formula: 'P(t) = ∑ B_i,p(t) · P_i',
        explanation: 'B-spline parametric path interpolation calculating smooth joint angle transitions over structural obstacles.'
      },
      {
        formula: 'V_induced = -N · dΦ/dt',
        explanation: 'Faraday inductive power leeching from high-current plant corridors for indefinite operation.'
      }
    ],
    specSheet: [
      { label: 'Joint Segments', value: '12 Hermetically Sealed Articulations' },
      { label: 'Traversable Slope', value: 'Up to 35° Incline on Slick Steel' },
      { label: 'Auxiliary Power', value: 'Inductive Contactless Harvesting' },
      { label: 'Inspection Speed', value: '300% (3×) Efficiency vs Manual Patrol' }
    ],
    industrialSafetyImpact: 'Replaces dangerous manual inspector foot patrols across hot, vibration-prone catwalks.'
  },
  {
    id: 'uepss-energy',
    title: 'Subterranean UEPSS & Agastya Bio-Electrochemical Power',
    ancientHeritage: 'Agastya Samhita manuscripts describing electric potential generated by copper-zinc couples embedded in moist earthen electrolytes (Mitra-Varuna generators).',
    modernApplication: 'Deep foundation energy storage combining subterranean galvanic soil cells with 1200 kWh Lead-Sulfur BESS and liquid-lithium heat harvesters.',
    category: 'Energy',
    summary: 'The Underground Electric Power Storage System (UEPSS) resides 6 meters beneath the furnace foundation, shielded from ambient 120°C air. Galvanic soil-electrolyte interactions provide uninterrupted baseline power, while a 1200 kWh Lead-Sulfur battery pack at 820V handles high-torque robotic plunge surges. Integrated liquid-lithium jackets absorb furnace ground heat.',
    physicalPrinciples: [
      'Galvanic baseline generation independent of external factory power grid outages',
      'Underground thermal insulation maintaining cells at steady 28°C despite surface inferno',
      'Liquid-lithium thermoelectric harvesting capturing ground heat dissipation'
    ],
    equations: [
      {
        formula: 'I_cell = (P_demand · 1000) / V_pack',
        explanation: 'Current draw computation: for 85.5 kW load at 820V, draw is 104.3 Amperes.'
      },
      {
        formula: 'T_cell = T_ambient + (I² · R_internal · 0.045)',
        explanation: 'Battery cell thermal calculation with internal resistance R = 0.012 Ohms.'
      }
    ],
    specSheet: [
      { label: 'BESS Capacity', value: '1200 kWh Total (980 kWh Baseline Reserve)' },
      { label: 'System Pack Voltage', value: '820.0 Volts DC' },
      { label: 'Internal Resistance', value: '0.012 Ohms' },
      { label: 'Cooling Solenoid Trigger', value: '> 42.0 °C' }
    ],
    industrialSafetyImpact: 'Ensures robotic sampling lances never lose power mid-immersion during sudden blackout events.'
  },
  {
    id: 'cv-crack-scotching',
    title: 'Computer Vision Slag Pot Crack Detection & Automated Scotching',
    ancientHeritage: 'Traditional acoustic resonance and thermal cooling gradient inspection of wootz crucibles.',
    modernApplication: 'Non-contact high-speed infrared camera arrays paired with XGBoost fatigue models, and self-powered 250°C motorized scotch blocks.',
    category: 'Perception',
    summary: 'Directly addresses two urgent Tata InnoVerse challenges: (1) detecting micro-cracks in 1200°C slag pots caused by cyclic thermal stresses before rupture, and (2) remotely deploying mechanical scotch blocks beneath 400-ton torpedo ladles on slippery tracks, eliminating manual pinch points entirely.',
    physicalPrinciples: [
      'High-speed thermal differential imaging separating ambient heat plumes from surface fractures',
      'XGBoost ML classification trained on thermal gradient history and mechanical strain data',
      'SHAP explainability engine providing auditable inspection decisions for plant compliance'
    ],
    equations: [
      {
        formula: 'ϕ_i = ∑ [ |S|!(|F| - |S| - 1)! / |F|! ] · [ f(S ∪ {i}) - f(S) ]',
        explanation: 'SHAP value attribution verifying which thermal gradient feature triggered crack identification.'
      },
      {
        formula: 'F_scotch = μ · N_ladle · cos(θ)',
        explanation: 'Pneumatic mechanical wedge holding force exceeding 180 kN on 18° track inclines.'
      }
    ],
    specSheet: [
      { label: 'Max Sensor Environment', value: 'Up to 250 °C Dust & Sparks' },
      { label: 'Crack Detection Latency', value: '< 5 Minutes Non-Contact' },
      { label: 'Scotching Deployment', value: 'Remote Motorized Pneumatic Wedge' },
      { label: 'Audit Trail', value: 'Immutable S3 Video & Telemetry Log' }
    ],
    industrialSafetyImpact: 'Prevents catastrophic liquid slag pot spills and completely eliminates operator crush injuries near torpedo ladles.'
  }
];
