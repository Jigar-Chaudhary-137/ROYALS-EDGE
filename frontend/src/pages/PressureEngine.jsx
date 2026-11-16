import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sliders,
  TrendingUp,
  Activity,
  Layers,
  HelpCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { fetchPressureAnalysis } from '../api';

export default function PressureEngine() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive Simulator State
  const [simInnings, setSimInnings] = useState(2);
  const [simOver, setSimOver] = useState(18);
  const [simRRR, setSimRRR] = useState(11.5);
  const [simWicketsInHand, setSimWicketsInHand] = useState(4);
  const [simBallsRemaining, setSimBallsRemaining] = useState(18);
  const [simRunsRequired, setSimRunsRequired] = useState(35);
  const [simIsKnockout, setSimIsKnockout] = useState(true);

  useEffect(() => {
    loadPressureData();
  }, []);

  const loadPressureData = async () => {
    try {
      const data = await fetchPressureAnalysis();
      setAnalysisData(data);
    } catch (err) {
      console.error("Failed to load pressure analysis", err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time calculation replicating backend engine
  const calculateSimulatedPressure = () => {
    const koBonus = simIsKnockout ? 6.0 : 0.0;
    if (simInnings >= 3) return { total: 100.0, tier: 'High', breakdown: { rrr: 100, wih: 100, stage: 100, close: 100 } };

    if (simInnings === 2) {
      // 1. RRR
      let p_rrr;
      if (simRRR <= 6.0) p_rrr = Math.max(5.0, simRRR * 3.0);
      else if (simRRR <= 9.0) p_rrr = 18.0 + (simRRR - 6.0) * 10.0;
      else if (simRRR <= 12.0) p_rrr = 48.0 + (simRRR - 9.0) * 11.0;
      else if (simRRR <= 16.0) p_rrr = 81.0 + (simRRR - 12.0) * 3.5;
      else p_rrr = 95.0 + Math.min(5.0, (simRRR - 16.0) * 0.5);

      if (simBallsRemaining <= 12 && simRunsRequired > 45) p_rrr *= 0.70;

      // 2. WIH
      let p_wih;
      if (simWicketsInHand >= 9) p_wih = 15.0;
      else if (simWicketsInHand >= 7) p_wih = 30.0;
      else if (simWicketsInHand >= 5) p_wih = 50.0;
      else if (simWicketsInHand >= 3) p_wih = 75.0;
      else if (simWicketsInHand === 2) p_wih = 90.0;
      else p_wih = 100.0;

      // 3. Stage
      let p_stage;
      if (simOver <= 6) p_stage = 25.0 + simOver * 2.0;
      else if (simOver <= 15) p_stage = 40.0 + (simOver - 6) * 3.0;
      else p_stage = 70.0 + (simOver - 15) * 6.0;

      // 4. Closeness
      let p_close;
      if (simOver >= 16 && simRunsRequired <= 50 && simWicketsInHand >= 2) {
        p_close = 85.0 + (simOver - 16) * 3.5;
      } else if (simOver >= 11 && simRunsRequired <= 80) {
        p_close = 55.0 + (simOver - 11) * 3.0;
      } else {
        p_close = 35.0;
      }

      const score = Math.min(100.0, Math.max(0.0, 0.35 * p_rrr + 0.25 * p_wih + 0.20 * p_stage + 0.20 * p_close + koBonus));
      const tier = score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Low';
      return { total: Math.round(score * 10) / 10, tier, breakdown: { rrr: Math.round(p_rrr), wih: Math.round(p_wih), stage: Math.round(p_stage), close: Math.round(p_close) } };
    } else {
      // Innings 1
      const p_death = simOver >= 16 ? 72.0 + (simOver - 16) * 6.0 : simOver >= 12 ? 45.0 + (simOver - 11) * 5.0 : 25.0 + simOver * 2.5;
      const p_collapse = simOver <= 6 && simWicketsInHand <= 7 ? 75.0 + (8 - simWicketsInHand) * 8.0 : simWicketsInHand <= 3 ? 80.0 : 30.0;
      const p_crr = 45.0;
      const score = Math.min(100.0, Math.max(0.0, 0.40 * p_death + 0.35 * p_collapse + 0.15 * p_crr + 3.0 + koBonus));
      const tier = score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Low';
      return { total: Math.round(score * 10) / 10, tier, breakdown: { death: Math.round(p_death), collapse: Math.round(p_collapse), crr: Math.round(p_crr) } };
    }
  };

  const simResult = calculateSimulatedPressure();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-extrabold text-[#14213D] flex items-center space-x-2">
          <Flame className="w-5 h-5 text-[#E83E8C]" />
          <span>Match Pressure Analysis Engine</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Dynamic delivery-level pressure measurement function $P \in [0, 100]$ incorporating required run rate, wickets in hand, death overs leverage, and tournament stakes.
        </p>
      </div>

      {/* Interactive Simulator Card */}
      <div className="rr-card p-6 bg-gradient-to-br from-white via-slate-50/60 to-pink-50/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-extrabold text-[#14213D] flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#E83E8C]" />
              <span>Interactive Pressure Simulator</span>
            </h3>
            <p className="text-xs text-slate-500">Adjust match situation parameters to observe dynamic pressure calculation</p>
          </div>

          {/* Innings Selector */}
          <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-bold">
            <button
              onClick={() => setSimInnings(2)}
              className={`px-3 py-1.5 rounded-md transition-all ${simInnings === 2 ? 'bg-[#14213D] text-white shadow-xs' : 'text-slate-600'}`}
            >
              2nd Innings (The Chase)
            </button>
            <button
              onClick={() => setSimInnings(1)}
              className={`px-3 py-1.5 rounded-md transition-all ${simInnings === 1 ? 'bg-[#14213D] text-white shadow-xs' : 'text-slate-600'}`}
            >
              1st Innings (Setting Par)
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Controls Column */}
          <div className="lg:col-span-2 space-y-4 text-xs">
            {/* Over Slider */}
            <div>
              <div className="flex justify-between font-bold text-[#14213D] mb-1">
                <span>Current Over Number: Over {simOver}</span>
                <span className="text-[#174EA6] font-extrabold">{simOver <= 6 ? 'Powerplay' : simOver <= 15 ? 'Middle Overs' : 'Death Overs (16-20)'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={simOver}
                onChange={(e) => setSimOver(parseInt(e.target.value))}
                className="w-full accent-[#E83E8C]"
              />
            </div>

            {simInnings === 2 ? (
              <>
                {/* RRR Slider */}
                <div>
                  <div className="flex justify-between font-bold text-[#14213D] mb-1">
                    <span>Required Run Rate (RRR): {simRRR} RPO</span>
                    <span className="text-slate-500">{simRRR <= 7 ? 'Comfortable' : simRRR <= 10 ? 'Challenging' : 'High Difficulty'}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="22"
                    step="0.5"
                    value={simRRR}
                    onChange={(e) => setSimRRR(parseFloat(e.target.value))}
                    className="w-full accent-[#E83E8C]"
                  />
                </div>

                {/* Runs Required & Balls Remaining */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#14213D] block mb-1">Runs Required: {simRunsRequired}</label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      value={simRunsRequired}
                      onChange={(e) => setSimRunsRequired(parseInt(e.target.value))}
                      className="w-full accent-[#174EA6]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#14213D] block mb-1">Balls Remaining: {simBallsRemaining}</label>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={simBallsRemaining}
                      onChange={(e) => setSimBallsRemaining(parseInt(e.target.value))}
                      className="w-full accent-[#174EA6]"
                    />
                  </div>
                </div>
              </>
            ) : null}

            {/* Wickets in Hand */}
            <div>
              <div className="flex justify-between font-bold text-[#14213D] mb-1">
                <span>Wickets in Hand: {simWicketsInHand} ({10 - simWicketsInHand} down)</span>
                <span className={simWicketsInHand <= 3 ? 'text-red-600 font-extrabold' : 'text-slate-500'}>
                  {simWicketsInHand <= 3 ? 'Severe Collapse Risk' : 'Batting Depth Available'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simWicketsInHand}
                onChange={(e) => setSimWicketsInHand(parseInt(e.target.value))}
                className="w-full accent-[#E83E8C]"
              />
            </div>

            {/* Knockout Match Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="ko"
                checked={simIsKnockout}
                onChange={(e) => setSimIsKnockout(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
              />
              <label htmlFor="ko" className="font-bold text-slate-700 cursor-pointer">
                IPL Playoff / Knockout Match Stake Multiplier (+6.0 index points)
              </label>
            </div>
          </div>

          {/* Result Output Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-center">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Calculated Pressure Index
              </span>
              <div className="text-4xl font-extrabold text-[#E83E8C] tracking-tight">
                {simResult.total}
                <span className="text-sm text-slate-400 font-normal">/100</span>
              </div>

              {/* Tier Badge */}
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    simResult.tier === 'High'
                      ? 'bg-red-100 text-red-700'
                      : simResult.tier === 'Moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {simResult.tier} Pressure Scenario {simResult.total >= 70 ? '🔥' : ''}
                </span>
              </div>
            </div>

            {/* Sub-component vector details */}
            <div className="mt-4 pt-4 border-t border-slate-100 text-left text-xs space-y-1.5">
              {simInnings === 2 ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>RRR Factor (35% wt):</span>
                    <strong className="text-[#14213D]">{simResult.breakdown.rrr}/100</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Wickets in Hand (25% wt):</span>
                    <strong className="text-[#14213D]">{simResult.breakdown.wih}/100</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Innings Stage (20% wt):</span>
                    <strong className="text-[#14213D]">{simResult.breakdown.stage}/100</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Match Closeness (20% wt):</span>
                    <strong className="text-[#14213D]">{simResult.breakdown.close}/100</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Death Overs (40% wt):</span>
                    <strong className="text-[#14213D]">{simResult.breakdown.death}/100</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Collapse Risk (35% wt):</span>
                    <strong className="text-[#14213D]">{simResult.breakdown.collapse}/100</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Pressure Distribution Figures */}
      {analysisData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Histogram Card */}
          <div className="rr-card p-5">
            <h3 className="text-sm font-extrabold text-[#14213D] mb-1">
              Pressure Score Distribution (200,999 Deliveries)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribution showing how deliveries span Low (&lt;40), Moderate (40-69), and High (&ge;70)
            </p>

            <div className="space-y-2">
              {analysisData.histogram?.map((item) => {
                const isHigh = parseInt(item.range.split('-')[0]) >= 70;
                const barColor = isHigh ? 'bg-[#E83E8C]' : 'bg-[#174EA6]';
                const pct = ((item.count / 200999) * 100).toFixed(1);
                return (
                  <div key={item.range} className="flex items-center text-xs">
                    <span className="w-12 font-mono text-slate-600 font-bold">{item.range}</span>
                    <div className="flex-1 mx-3 bg-slate-100 h-4 rounded-md overflow-hidden">
                      <div
                        className={`h-full ${barColor}`}
                        style={{ width: `${Math.min(100, parseFloat(pct) * 3.5)}%` }}
                      ></div>
                    </div>
                    <span className="w-20 text-right font-semibold text-slate-700">
                      {item.count.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Over-by-Over Progression */}
          <div className="rr-card p-5">
            <h3 className="text-sm font-extrabold text-[#14213D] mb-1">
              Average Pressure Progression (Over 1 to Over 20)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Average pressure score escalating through Powerplay, Middle, and Death overs
            </p>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {analysisData.over_progression?.map((item) => {
                const isDeath = item.overid >= 16;
                const isMiddle = item.overid >= 7 && item.overid <= 15;
                const cardBg = isDeath
                  ? 'bg-pink-50 border-pink-200 text-[#E83E8C]'
                  : isMiddle
                  ? 'bg-blue-50 border-blue-200 text-[#174EA6]'
                  : 'bg-slate-50 border-slate-200 text-slate-700';

                return (
                  <div key={item.overid} className={`p-2 rounded-lg border ${cardBg}`}>
                    <span className="text-[10px] font-bold block text-slate-500">Over {item.overid}</span>
                    <span className="text-sm font-extrabold block">{item.avg_pressure}</span>
                    <span className="text-[10px] opacity-80 block">{item.pressure_pct}% High</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

