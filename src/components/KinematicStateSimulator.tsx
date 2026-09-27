import React, { useState, useEffect, useRef } from 'react';
import { Play, AlertOctagon, RotateCcw, ShieldAlert, Cpu, CheckCircle2, Sliders } from 'lucide-react';
import { sound } from '../utils/audio';

type SystemState = 'IDLE' | 'UTILITIES_ACTIVE' | 'SAMPLING_IN_PROGRESS' | 'RETRACTING' | 'EMERGENCY_STOP';

interface LogLine {
  id: string;
  time: string;
  text: string;
  type: 'info' | 'warn' | 'alarm' | 'sync' | 'step';
}

export const KinematicStateSimulator: React.FC = () => {
  const [state, setState] = useState<SystemState>('IDLE');
  const [gantryX, setGantryX] = useState(0.0);
  const [telescopicZ, setTelescopicZ] = useState(0.0);
  const [waterValveOpen, setWaterValveOpen] = useState(false);
  const [airValveOpen, setAirValveOpen] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([
    { id: '1', time: '00:00.00', text: '[CAD SIMULATOR LOG] Autonomous Sampling Engine initialized in IDLE state.', type: 'info' },
    { id: '2', time: '00:00.01', text: '[KINEMATICS] Gantry Long Travel (X): 0.00 mm (Limit: 5000.00 mm)', type: 'sync' },
    { id: '3', time: '00:00.02', text: '[KINEMATICS] Telescopic Probe (Z): 0.00 mm (Limit: 2200.00 mm)', type: 'sync' }
  ]);
  const [isAutomating, setIsAutomating] = useState(false);
  const timeoutIds = useRef<number[]>([]);

  const addLog = (text: string, type: 'info' | 'warn' | 'alarm' | 'sync' | 'step') => {
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
    setLogs((prev) => [...prev.slice(-35), { id: Math.random().toString(), time: timeStr, text, type }]);
  };

  const clearAllTimeouts = () => {
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  // Trigger Autonomous Cast Cycle
  const runAutonomousCastCycle = () => {
    if (state === 'EMERGENCY_STOP') {
      sound.playAlarm();
      addLog('[WARN] Cannot initiate sampling cycle: System in EMERGENCY_STOP lockout.', 'warn');
      return;
    }
    if (isAutomating) return;

    clearAllTimeouts();
    setIsAutomating(true);
    sound.playClank();
    addLog('>> Action Triggered. Source: AUTONOMOUS SCHEDULER (CAST_CYCLE_READY)', 'step');

    // Step 1: Engage utilities
    const t1 = window.setTimeout(() => {
      sound.playPneumaticHiss();
      setWaterValveOpen(true);
      setAirValveOpen(true);
      setState('UTILITIES_ACTIVE');
      addLog('-> UTILITY SYNC: Cooling Water engaged at 4.2 Bar.', 'sync');
      addLog('-> UTILITY SYNC: Positive Pressure Air Purge engaged at 6.0 Bar.', 'sync');
    }, 400);

    // Step 2: Drive Gantry X to 3250 mm
    const t2 = window.setTimeout(() => {
      setState('SAMPLING_IN_PROGRESS');
      addLog('-> Step 2: Driving Gantry over target sampling point (3.25m travel)...', 'step');
      
      const steps = 5;
      const targetX = 3250.0;
      for (let i = 1; i <= steps; i++) {
        const subT = window.setTimeout(() => {
          const currentX = Math.round((targetX / steps) * i);
          setGantryX(currentX);
          addLog(`[CAD_MESH_SYNC] Gantry Long Travel (X) -> ${currentX.toFixed(2)} mm`, 'sync');
        }, i * 350);
        timeoutIds.current.push(subT);
      }
    }, 1200);

    // Step 3: Descend probe Z to 1850 mm
    const t3 = window.setTimeout(() => {
      addLog('-> Step 3: Descending probe to sample depth (1.85m depth)...', 'step');
      const steps = 5;
      const targetZ = 1850.0;
      for (let i = 1; i <= steps; i++) {
        const subT = window.setTimeout(() => {
          const currentZ = Math.round((targetZ / steps) * i);
          setTelescopicZ(currentZ);
          addLog(`[CAD_MESH_SYNC] Probe Insertion Z Axis -> ${currentZ.toFixed(2)} mm`, 'sync');
        }, i * 350);
        timeoutIds.current.push(subT);
      }
    }, 3200);

    // Immersion active
    const t4 = window.setTimeout(() => {
      sound.playClank();
      addLog('[STATUS] Probe fully immersed. Sampling and temperature logging active.', 'info');
    }, 5200);

    // Step 4: Retract Sequence
    const t5 = window.setTimeout(() => {
      setState('RETRACTING');
      addLog('-> Step 4: Commencing smooth retract sequence to home...', 'step');
      setTelescopicZ(0.0);
      setGantryX(0.0);
      addLog('[CAD_MESH_SYNC] Probe Insertion Z Axis -> 0.00 mm (RETRACTED)', 'sync');
      addLog('[CAD_MESH_SYNC] Gantry Long Travel (X) -> 0.00 mm (PARKED)', 'sync');
    }, 7200);

    // Step 5: Post-cycle utility shutdown
    const t6 = window.setTimeout(() => {
      sound.playPneumaticHiss();
      setWaterValveOpen(false);
      setAirValveOpen(false);
      setState('IDLE');
      setIsAutomating(false);
      addLog('-> UTILITY SYNC: Utilities closed down to standby eco-flow mode.', 'sync');
      addLog('>> Cast Sampling Cycle Finished Successfully. Return to IDLE.', 'info');
    }, 8500);

    timeoutIds.current.push(t1, t2, t3, t4, t5, t6);
  };

  // Immediate Slag Blockage Emergency Retract (Test Case B)
  const triggerSlagBlockageEmergency = () => {
    clearAllTimeouts();
    setIsAutomating(false);
    sound.playAlarm();
    setState('EMERGENCY_STOP');
    setWaterValveOpen(false);
    setAirValveOpen(false);
    setTelescopicZ(0.0);
    setGantryX(0.0);

    addLog('!! [ALARM] CRITICAL FAULT: SLAG_BLOCKAGE_DETECTED !!', 'alarm');
    addLog('!! EXECUTING RAPID EMERGENCY RETRACT TO PROTECT SENSOR HEAD !!', 'alarm');
    addLog('[CAD_MESH_SYNC] Probe Insertion Z Axis -> 0.00 mm (HOME)', 'sync');
    addLog('[CAD_MESH_SYNC] Gantry Long Travel (X) -> 0.00 mm (PARKED)', 'sync');
    addLog('[LOCKOUT] System placed in EMERGENCY_STOP lockout. Reset signal required.', 'warn');
  };

  // Reset Lockout
  const handleSystemReset = () => {
    clearAllTimeouts();
    sound.playClank();
    setState('IDLE');
    setIsAutomating(false);
    setGantryX(0.0);
    setTelescopicZ(0.0);
    setWaterValveOpen(false);
    setAirValveOpen(false);
    addLog('>> Emergency override cleared. System returned to IDLE state.', 'info');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <span>C++ OBJECTARX CORE ENGINE</span>
            <span>·</span>
            <span>STATE MACHINE & INTERLOCK TEST RIG</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-epic text-stone-100 mt-1">
            Gantry Kinematics & State Machine
          </h1>
          <p className="text-xs sm:text-sm font-body text-stone-400 mt-1">
            Real-time execution of the C++ state machine, utility valves (4.2 & 6.0 Bar), and the slag blockage emergency retract failsafe.
          </p>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-400">Current State:</span>
          <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider ${
            state === 'EMERGENCY_STOP'
              ? 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse'
              : state === 'SAMPLING_IN_PROGRESS'
              ? 'bg-amber-950 text-amber-300 border border-amber-600'
              : state === 'UTILITIES_ACTIVE' || state === 'RETRACTING'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-600'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
          }`}>
            {state}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive 2D Coordinate Kinematics Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 bg-stone-950 rounded-2xl border-2 border-stone-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                CAD Coordinate Space (Gantry X: 5.0m · Probe Z: 2.2m)
              </span>
              <span className="text-[10px] font-mono text-stone-500">AUTODESK OBJECTARX MESH SYNC</span>
            </div>

            {/* SVG Kinematics Viewport */}
            <svg viewBox="0 0 700 380" className="w-full h-auto bg-stone-900/60 rounded-xl border border-stone-800">
              <defs>
                <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#292524" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="700" height="380" fill="url(#cadGrid)" />

              {/* Upper Gantry Long Travel Rail (X) */}
              <rect x="50" y="40" width="600" height="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
              <line x1="50" y1="50" x2="650" y2="50" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />
              
              {/* Millimeter Scale Ticks */}
              {[0, 1000, 2000, 3000, 4000, 5000].map((tick) => {
                const x = 50 + (tick / 5000) * 600;
                return (
                  <g key={tick}>
                    <line x1={x} y1="35" x2={x} y2="40" stroke="#94a3b8" strokeWidth="1" />
                    <text x={x} y="30" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                      {tick}mm
                    </text>
                  </g>
                );
              })}

              {/* Tapping Zone / Molten Pool at Target X = 3250 */}
              <g transform="translate(410, 290)">
                <rect x="0" y="0" width="120" height="60" fill="#ea580c" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
                <line x1="10" y1="20" x2="110" y2="20" stroke="#fef08a" strokeWidth="4" />
                <text x="60" y="45" fill="#fef08a" fontSize="10" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle">
                  SAMPLING POOL (1450°C)
                </text>
              </g>

              {/* Moving Gantry Carriage (interpolated X) */}
              {(() => {
                const carriagePixelX = 50 + (gantryX / 5000) * 600;
                const probeLengthPixel = (telescopicZ / 2200) * 230;

                return (
                  <g transform={`translate(${carriagePixelX}, 50)`}>
                    {/* Carriage Body */}
                    <rect x="-40" y="0" width="80" height="40" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" rx="4" />
                    <circle cx="-25" cy="20" r="5" fill="#38bdf8" />
                    <circle cx="25" cy="20" r="5" fill="#38bdf8" />
                    <text x="0" y="24" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                      CARRIAGE
                    </text>

                    {/* Telescopic Lance descending (Z) */}
                    <line x1="0" y1="40" x2="0" y2={40 + probeLengthPixel} stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                    <rect x="-8" y={40 + probeLengthPixel - 15} width="16" height="20" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                    
                    {/* Laser guide line */}
                    <line x1="0" y1={40 + probeLengthPixel} x2="0" y2="290" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                    {/* Dimension annotation on probe */}
                    {telescopicZ > 50 && (
                      <text x="14" y={40 + probeLengthPixel / 2} fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">
                        Z: {telescopicZ.toFixed(0)}mm
                      </text>
                    )}
                  </g>
                );
              })()}

              {/* Emergency Retract Home Indicator */}
              <circle cx="50" cy="50" r="8" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <text x="50" y="80" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                HOME (0,0)
              </text>
            </svg>

            {/* Live Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 block">Gantry X Position</span>
                <span className="text-base font-mono font-bold text-amber-400 tabular-nums">
                  {gantryX.toFixed(1)} mm
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Target: 3250.0 mm</span>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 block">Telescopic Z Depth</span>
                <span className="text-base font-mono font-bold text-cyan-400 tabular-nums">
                  {telescopicZ.toFixed(1)} mm
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Target: 1850.0 mm</span>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 block">Cooling Water Valve</span>
                <span className={`text-xs font-mono font-bold ${waterValveOpen ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {waterValveOpen ? 'OPEN (4.2 Bar)' : 'CLOSED (Eco)'}
                </span>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 block">Compressed Air Purge</span>
                <span className={`text-xs font-mono font-bold ${airValveOpen ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {airValveOpen ? 'OPEN (6.0 Bar)' : 'CLOSED (Eco)'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 flex flex-wrap items-center gap-3">
            <button
              onClick={runAutonomousCastCycle}
              disabled={isAutomating || state === 'EMERGENCY_STOP'}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-comic font-bold rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Test Case A: Autonomous Cast Cycle</span>
            </button>

            <button
              onClick={triggerSlagBlockageEmergency}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-comic font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Test Case B: Slag Blockage Fault</span>
            </button>

            {state === 'EMERGENCY_STOP' && (
              <button
                onClick={handleSystemReset}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Send SYSTEM_RESET Signal</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Console Terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 bg-stone-950 rounded-2xl border-2 border-stone-800 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-stone-200">
                  C++ stdout Telemetry Stream
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-500">gcc 13.2 / ObjectARX 2026</span>
            </div>

            {/* Console Log Area */}
            <div className="p-3 bg-black/80 rounded-xl border border-stone-800/80 font-mono text-xs max-h-[480px] overflow-y-auto flex flex-col gap-1.5">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-stone-500 text-[10px] shrink-0">{log.time}</span>
                  <span className={`break-all ${
                    log.type === 'alarm'
                      ? 'text-rose-400 font-bold'
                      : log.type === 'warn'
                      ? 'text-amber-400'
                      : log.type === 'step'
                      ? 'text-cyan-300 font-semibold'
                      : log.type === 'sync'
                      ? 'text-stone-400'
                      : 'text-stone-300'
                  }`}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] font-mono text-stone-400">
              <span className="text-cyan-400 font-bold block mb-1">State Machine Integrity Safeguards:</span>
              <span>
                Verified Test Case C lockout prevention: When in <code>EMERGENCY_STOP</code>, any subsequent sampling attempts are rejected until an explicit <code>SYSTEM_RESET</code> handshake is executed.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
