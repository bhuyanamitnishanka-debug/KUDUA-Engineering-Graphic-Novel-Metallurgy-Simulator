import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Thermometer, Droplets, Wind, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

export interface TelemetryPoint {
  time: number;
  shieldTempC: number;
  internalTempC: number;
  qRadIn: number;
  qWaterOut: number;
  status: 'STABLE' | 'ELEVATED' | 'CRITICAL WARN';
}

export const ThermalEngineSimulator: React.FC = () => {
  // Parameters
  const [metalTempC, setMetalTempC] = useState(1450);
  const [waterFlowLpm, setWaterFlowLpm] = useState(21); // ~0.35 kg/s
  const [airPurgeW, setAirPurgeW] = useState(350);
  const [ambientC, setAmbientC] = useState(45);
  const [coolingWaterInC, setCoolingWaterInC] = useState(25);
  const [simulationDurationSec, setSimulationDurationSec] = useState(15);

  // Runtime State
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const timerRef = useRef<number | null>(null);

  // Run full simulation data
  const fullSimulationData = useMemo(() => {
    const DT = 0.1;
    const TIME_STEPS = Math.round(simulationDurationSec / DT);
    const EMISSIVITY = 0.85;
    const SIGMA = 5.67e-8;
    const SURFACE_AREA = 0.45;

    const T_MOLTEN_K = metalTempC + 273.15;
    const T_WATER_IN_K = coolingWaterInC + 273.15;

    const SHIELD_MASS = 22.0;
    const SHIELD_SPECIFIC_HEAT = 670.0;
    const CHASSIS_MASS = 3.5;
    const CHASSIS_SPECIFIC_HEAT = 900.0;

    const WATER_FLOW_RATE = (waterFlowLpm / 60); // kg/s
    const WATER_SPECIFIC_HEAT = 4184.0;
    const COOLING_EFFICIENCY = 0.42;

    let t_shield = ambientC + 273.15;
    let t_internal = 30.0 + 273.15;

    const points: TelemetryPoint[] = [];

    for (let step = 0; step < TIME_STEPS; step++) {
      const currentTime = Math.round(step * DT * 10) / 10;
      const proximityFactor = currentTime > 3.0 ? 1.0 : currentTime / 3.0;

      // Radiant heat input from 1450°C iron
      const q_rad_in = EMISSIVITY * SIGMA * SURFACE_AREA * (Math.pow(T_MOLTEN_K, 4) - Math.pow(t_shield, 4)) * proximityFactor;

      // Active water cooling extraction
      const delta_t_water = Math.max(0, t_shield - T_WATER_IN_K);
      const q_water_out = WATER_FLOW_RATE * WATER_SPECIFIC_HEAT * delta_t_water * COOLING_EFFICIENCY;

      // Shield thermal update
      const net_q_shield = q_rad_in - q_water_out;
      const delta_t_shield = (net_q_shield * DT) / (SHIELD_MASS * SHIELD_SPECIFIC_HEAT);
      t_shield += delta_t_shield;

      // Conductive transfer to internal chassis
      const q_conductive_leak = Math.max(0, 0.12 * (t_shield - t_internal));
      const air_purge_cooling = Math.min(
        airPurgeW,
        q_conductive_leak + Math.max(0, 0.5 * (t_internal - (25.0 + 273.15)))
      );

      const net_q_internal = q_conductive_leak - air_purge_cooling;
      const delta_t_internal = (net_q_internal * DT) / (CHASSIS_MASS * CHASSIS_SPECIFIC_HEAT);
      t_internal += delta_t_internal;

      const shieldC = Math.round((t_shield - 273.15) * 10) / 10;
      const internalC = Math.round((t_internal - 273.15) * 10) / 10;

      let status: 'STABLE' | 'ELEVATED' | 'CRITICAL WARN' = 'STABLE';
      if (internalC >= 65.0) {
        status = 'CRITICAL WARN';
      } else if (internalC >= 50.0) {
        status = 'ELEVATED';
      }

      points.push({
        time: currentTime,
        shieldTempC: shieldC,
        internalTempC: internalC,
        qRadIn: Math.round(q_rad_in),
        qWaterOut: Math.round(q_water_out),
        status
      });
    }

    return points;
  }, [metalTempC, waterFlowLpm, airPurgeW, ambientC, coolingWaterInC, simulationDurationSec]);

  // Reset or run simulation
  useEffect(() => {
    setCurrentStep(0);
    setTelemetry([fullSimulationData[0]]);
  }, [fullSimulationData]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= fullSimulationData.length - 1) {
            setIsRunning(false);
            return prev;
          }
          const next = prev + 1;
          setTelemetry((t) => [...t, fullSimulationData[next]]);
          if (fullSimulationData[next].status === 'CRITICAL WARN') {
            sound.playAlarm();
          }
          return next;
        });
      }, 70);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, fullSimulationData]);

  const currentPoint = telemetry[telemetry.length - 1] || fullSimulationData[0];

  const handleTogglePlay = () => {
    sound.playClank();
    if (currentStep >= fullSimulationData.length - 1) {
      setCurrentStep(0);
      setTelemetry([fullSimulationData[0]]);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    sound.playPneumaticHiss();
    setIsRunning(false);
    setCurrentStep(0);
    setTelemetry([fullSimulationData[0]]);
  };

  const handleFastForwardAll = () => {
    sound.playPneumaticHiss();
    setIsRunning(false);
    setCurrentStep(fullSimulationData.length - 1);
    setTelemetry(fullSimulationData);
  };

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 240;
  const maxTemp = Math.max(120, ...fullSimulationData.map(d => Math.max(d.shieldTempC, d.internalTempC))) + 15;

  const pointsShield = telemetry.map((d) => {
    const x = (d.time / simulationDurationSec) * (chartWidth - 60) + 40;
    const y = chartHeight - 30 - ((d.shieldTempC / maxTemp) * (chartHeight - 50));
    return `${x},${y}`;
  }).join(' ');

  const pointsInternal = telemetry.map((d) => {
    const x = (d.time / simulationDurationSec) * (chartWidth - 60) + 40;
    const y = chartHeight - 30 - ((d.internalTempC / maxTemp) * (chartHeight - 50));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
            <span>PYTHON 3.11 THERMAL ENGINE SPEC</span>
            <span>·</span>
            <span>TAB 6, 7 & 8 RESOLVED CODE</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-epic text-stone-100 mt-1">
            Thermodynamic Simulation Sandbox
          </h1>
          <p className="text-xs sm:text-sm font-body text-stone-400 mt-1">
            Simulates the convective and radiant response of the probe outer shield and internal electronics chassis during molten iron immersion.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-comic font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Sim' : 'Run Simulation'}</span>
          </button>
          <button
            onClick={handleFastForwardAll}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-lg text-xs font-mono transition-colors"
          >
            Calculate All
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-100 rounded-lg text-xs font-mono transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Graph & Live Telemetry (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Status Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 flex flex-col">
              <span className="text-[11px] font-mono text-stone-400">Current Time</span>
              <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
                {currentPoint.time.toFixed(1)} s
              </span>
              <span className="text-[10px] text-stone-500 font-mono mt-0.5">Step {currentStep} / {fullSimulationData.length}</span>
            </div>

            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 flex flex-col">
              <span className="text-[11px] font-mono text-stone-400">Outer Shield Temp</span>
              <span className="text-xl font-mono font-bold text-orange-400 tabular-nums">
                {currentPoint.shieldTempC.toFixed(1)} °C
              </span>
              <span className="text-[10px] text-stone-500 font-mono mt-0.5">Start: {ambientC}°C</span>
            </div>

            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 flex flex-col">
              <span className="text-[11px] font-mono text-stone-400">Internal Bay Temp</span>
              <span className={`text-xl font-mono font-bold tabular-nums ${
                currentPoint.internalTempC >= 65 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'
              }`}>
                {currentPoint.internalTempC.toFixed(1)} °C
              </span>
              <span className="text-[10px] text-stone-500 font-mono mt-0.5">Limit: 65.0°C</span>
            </div>

            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              currentPoint.status === 'CRITICAL WARN' 
                ? 'bg-rose-950/40 border-rose-600 text-rose-300' 
                : currentPoint.status === 'ELEVATED'
                ? 'bg-amber-950/40 border-amber-600 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
            }`}>
              <span className="text-[11px] font-mono">Safety Interlock</span>
              <span className="text-xs font-mono font-bold tracking-wider">
                {currentPoint.status === 'CRITICAL WARN' ? '● CRITICAL WARN' : currentPoint.status === 'ELEVATED' ? '▲ ELEVATED' : '● STABLE'}
              </span>
              <span className="text-[10px] font-mono opacity-80 mt-0.5">
                {currentPoint.internalTempC < 65 ? 'Electronics Protected' : 'RETRACT REQUIRED'}
              </span>
            </div>
          </div>

          {/* SVG Real-Time Temperature Curve Chart */}
          <div className="p-4 bg-stone-950 rounded-2xl border-2 border-stone-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-stone-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-orange-400">
                  <span className="w-3 h-0.5 bg-orange-400 inline-block" /> Outer Shield (°C)
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Internal Bay (°C)
                </span>
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-3 h-0.5 border-b border-dashed border-rose-500 inline-block" /> 65°C Limit
                </span>
              </div>
              <span>Max Scale: {Math.round(maxTemp)}°C</span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[500px]">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
                  const y = chartHeight - 30 - ratio * (chartHeight - 50);
                  const tempVal = Math.round(ratio * maxTemp);
                  return (
                    <g key={ratio}>
                      <line x1="40" y1={y} x2={chartWidth - 20} y2={y} stroke="#292524" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="32" y={y + 3} fill="#78716c" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
                        {tempVal}
                      </text>
                    </g>
                  );
                })}

                {/* 65°C Critical Threshold Line */}
                {(() => {
                  const y65 = chartHeight - 30 - ((65 / maxTemp) * (chartHeight - 50));
                  return (
                    <g>
                      <line x1="40" y1={y65} x2={chartWidth - 20} y2={y65} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" />
                      <text x={chartWidth - 25} y={y65 - 4} fill="#ef4444" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                        CRITICAL LOCKOUT THRESHOLD: 65°C
                      </text>
                    </g>
                  );
                })()}

                {/* Vertical Time Axis */}
                <line x1="40" y1="20" x2="40" y2={chartHeight - 30} stroke="#44403c" strokeWidth="2" />
                <line x1="40" y1={chartHeight - 30} x2={chartWidth - 20} y2={chartHeight - 30} stroke="#44403c" strokeWidth="2" />

                {/* Time Axis Labels */}
                {[0, 3, 6, 9, 12, 15].map((t) => {
                  const x = (t / simulationDurationSec) * (chartWidth - 60) + 40;
                  return (
                    <g key={t}>
                      <line x1={x} y1={chartHeight - 30} x2={x} y2={chartHeight - 25} stroke="#57534e" strokeWidth="1.5" />
                      <text x={x} y={chartHeight - 12} fill="#a8a29e" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                        {t}s
                      </text>
                    </g>
                  );
                })}

                {/* Telemetry Polylines */}
                {pointsShield && (
                  <polyline
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsShield}
                  />
                )}

                {pointsInternal && (
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsInternal}
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Real-Time Telemetry Log Table */}
          <div className="p-4 bg-stone-900 rounded-xl border border-stone-800">
            <span className="text-xs font-mono uppercase text-stone-400 tracking-wider block mb-2">
              Recent Telemetry Frames (0.1s Delta)
            </span>
            <div className="overflow-x-auto max-h-40 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-stone-500 border-b border-stone-800">
                  <tr>
                    <th className="py-1.5 px-2">Time (s)</th>
                    <th className="py-1.5 px-2">Shield (°C)</th>
                    <th className="py-1.5 px-2">Internal Bay (°C)</th>
                    <th className="py-1.5 px-2">Radiant Q_in (W)</th>
                    <th className="py-1.5 px-2">Water Q_out (W)</th>
                    <th className="py-1.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {telemetry.slice(-6).reverse().map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-800/40">
                      <td className="py-1 px-2 text-stone-400 tabular-nums">{row.time.toFixed(1)}</td>
                      <td className="py-1 px-2 text-orange-400 tabular-nums">{row.shieldTempC.toFixed(1)}</td>
                      <td className="py-1 px-2 text-cyan-400 tabular-nums">{row.internalTempC.toFixed(1)}</td>
                      <td className="py-1 px-2 tabular-nums">{row.qRadIn}</td>
                      <td className="py-1 px-2 tabular-nums">{row.qWaterOut}</td>
                      <td className="py-1 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          row.status === 'CRITICAL WARN' ? 'bg-rose-950 text-rose-300 font-bold' : 'text-emerald-400'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Thermodynamic Physics Controls (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 bg-stone-900 rounded-2xl border-2 border-stone-800 shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h2 className="text-lg font-bold font-epic text-stone-100 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <span>Simulation Parameters</span>
              </h2>
              <span className="text-[10px] font-mono text-stone-400">REAL-TIME NUMPY ENGINE</span>
            </div>

            {/* Slider 1: Molten Metal Temp */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Molten Stream Temp
                </span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">{metalTempC} °C</span>
              </div>
              <input
                type="range"
                min="1100"
                max="1600"
                step="25"
                value={metalTempC}
                onChange={(e) => setMetalTempC(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-stone-500">Document Baseline: 1450.0°C</span>
            </div>

            {/* Slider 2: Water Cooling Flow Rate */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Cooling Flow
                </span>
                <span className="font-mono font-bold text-cyan-400 tabular-nums">{waterFlowLpm} L/min</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={waterFlowLpm}
                onChange={(e) => setWaterFlowLpm(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-stone-500">Document Spec: 15 to 25 L/min (~0.35 kg/s)</span>
            </div>

            {/* Slider 3: Air Purge Heat Extraction */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-400" /> Compressed Air Purge
                </span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">{airPurgeW} W</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="25"
                value={airPurgeW}
                onChange={(e) => setAirPurgeW(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-stone-500">Bounded by available heat leak</span>
            </div>

            {/* Slider 4: Total Immersion Time */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-stone-300">Immersion Duration</span>
                <span className="font-mono font-bold text-stone-200 tabular-nums">{simulationDurationSec} s</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={simulationDurationSec}
                onChange={(e) => setSimulationDurationSec(Number(e.target.value))}
                className="w-full accent-stone-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-stone-500">Standard Sampling Sequence: 15.0 s</span>
            </div>

            {/* Corrective Measures Notes (from Tab 7 & 8) */}
            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs font-body text-stone-400 flex flex-col gap-2">
              <span className="font-mono font-semibold text-amber-400 uppercase text-[11px]">
                Engine Bug Fixes Enforced:
              </span>
              <p className="text-[11px] leading-relaxed">
                ● <strong>Bounded Air Purge</strong>: Prevents negative heat flux when ambient and internal temps are close.
              </p>
              <p className="text-[11px] leading-relaxed">
                ● <strong>Differential Resistance Water Convection</strong>: Eliminates Step 0 temperature crash during initial immersion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
