import React, { useState, useEffect } from 'react';
import {
  Scale,
  Award,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { comparePlayers, fetchBatters, fetchBowlers } from '../api';
import PlayerImage from '../components/PlayerImage';

const PRESETS = {
  batter: [
    { label: 'Rinku vs Tim David', idA: 4708, idB: 6396 },
    { label: 'Miller vs Dhoni', idA: 1077, idB: 8 },
    { label: 'Jadeja vs Tewatia', idA: 152, idB: 3926 },
    { label: 'Rinku vs Shubham Dubey', idA: 4708, idB: 25139 }
  ],
  bowler: [
    { label: 'Rashid vs Bumrah', idA: 4722, idB: 2933 },
    { label: 'Bumrah vs Mustafizur', idA: 2933, idB: 4373 },
    { label: 'Varun vs Chahal', idA: 6256, idB: 1612 },
    { label: 'Kuldeep vs Theekshana', idA: 3644, idB: 19316 }
  ]
};

export default function PlayerComparison({ initialPlayerAId, initialPlayerBId, onSelectPlayer }) {
  const [role, setRole] = useState('batter');
  const [playerAId, setPlayerAId] = useState(initialPlayerAId || 4708); // Rinku Singh
  const [playerBId, setPlayerBId] = useState(initialPlayerBId || 6396); // Tim David
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [battersList, setBattersList] = useState([]);
  const [bowlersList, setBowlersList] = useState([]);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (initialPlayerAId) setPlayerAId(initialPlayerAId);
    if (initialPlayerBId) setPlayerBId(initialPlayerBId);
  }, [initialPlayerAId, initialPlayerBId]);

  useEffect(() => {
    runComparison();
  }, [role, playerAId, playerBId]);

  const loadLists = async () => {
    try {
      const bRes = await fetchBatters('', 'final_rating', false, 30);
      const bwRes = await fetchBowlers('', 'final_rating', false, 36);
      setBattersList(bRes.rankings || []);
      setBowlersList(bwRes.rankings || []);
    } catch (err) {
      console.error(err);
    }
  };

  const runComparison = async () => {
    if (!playerAId || !playerBId) return;
    setLoading(true);
    try {
      const res = await comparePlayers([playerAId, playerBId], role);
      setProfiles(res.profiles || []);
    } catch (err) {
      console.error("Comparison load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'batter') {
      setPlayerAId(4708);
      setPlayerBId(6396);
    } else {
      setPlayerAId(4722);
      setPlayerBId(2933);
    }
  };

  const playerOptions = role === 'batter' ? battersList : bowlersList;
  const pA = profiles[0];
  const pB = profiles[1];
  const statsA = role === 'batter' ? pA?.batting : pA?.bowling;
  const statsB = role === 'batter' ? pB?.batting : pB?.bowling;

  // Comparison Metrics Definitions with Winner Rules
  const metrics = role === 'batter' ? [
    {
      key: 'rating',
      label: 'Pressure Rating',
      valA: statsA?.rating,
      valB: statsB?.rating,
      fmt: (v) => `${Number(v).toFixed(1)} / 100`,
      better: 'higher'
    },
    {
      key: 'pressure_sr',
      label: 'Pressure Strike Rate',
      valA: statsA?.pressure_sr,
      valB: statsB?.pressure_sr,
      fmt: (v) => Number(v).toFixed(1),
      better: 'higher'
    },
    {
      key: 'normal_sr',
      label: 'Career Baseline SR',
      valA: statsA?.normal_sr,
      valB: statsB?.normal_sr,
      fmt: (v) => Number(v).toFixed(1),
      better: 'higher'
    },
    {
      key: 'sr_improvement',
      label: 'Clutch SR Delta',
      valA: statsA?.sr_improvement,
      valB: statsB?.sr_improvement,
      fmt: (v) => `${v > 0 ? '+' : ''}${Number(v).toFixed(1)}`,
      better: 'higher'
    },
    {
      key: 'pressure_avg',
      label: 'Pressure Batting Average',
      valA: statsA?.pressure_avg,
      valB: statsB?.pressure_avg,
      fmt: (v) => Number(v).toFixed(1),
      better: 'higher'
    },
    {
      key: 'death_sr',
      label: 'Death Overs SR (16-20)',
      valA: statsA?.death_sr,
      valB: statsB?.death_sr,
      fmt: (v) => Number(v).toFixed(1),
      better: 'higher'
    },
    {
      key: 'pressure_dot_pct',
      label: 'Pressure Dot Ball %',
      valA: statsA?.pressure_dot_pct,
      valB: statsB?.pressure_dot_pct,
      fmt: (v) => `${Number(v).toFixed(1)}%`,
      better: 'lower' // Lower dot % is better for batters
    },
    {
      key: 'pressure_boundary_pct',
      label: 'Boundary %',
      valA: statsA?.pressure_boundary_pct || 30.0,
      valB: statsB?.pressure_boundary_pct || 30.0,
      fmt: (v) => `${Number(v).toFixed(1)}%`,
      better: 'higher'
    }
  ] : [
    {
      key: 'rating',
      label: 'Pressure Rating',
      valA: statsA?.rating,
      valB: statsB?.rating,
      fmt: (v) => `${Number(v).toFixed(1)} / 100`,
      better: 'higher'
    },
    {
      key: 'pressure_economy',
      label: 'Pressure Economy Rate',
      valA: statsA?.pressure_economy,
      valB: statsB?.pressure_economy,
      fmt: (v) => Number(v).toFixed(2),
      better: 'lower' // Lower economy is better
    },
    {
      key: 'normal_economy',
      label: 'Career Baseline Economy',
      valA: statsA?.normal_economy,
      valB: statsB?.normal_economy,
      fmt: (v) => Number(v).toFixed(2),
      better: 'lower'
    },
    {
      key: 'econ_improvement',
      label: 'Clutch Economy Delta',
      valA: statsA?.econ_improvement,
      valB: statsB?.econ_improvement,
      fmt: (v) => `${v > 0 ? '+' : ''}${Number(v).toFixed(2)} RPO`,
      better: 'higher' // Higher delta reduction is better
    },
    {
      key: 'pressure_wickets',
      label: 'Pressure Wickets',
      valA: statsA?.pressure_wickets,
      valB: statsB?.pressure_wickets,
      fmt: (v) => `${v} wkts`,
      better: 'higher'
    },
    {
      key: 'pressure_strike_rate',
      label: 'Balls per Wicket',
      valA: statsA?.pressure_strike_rate,
      valB: statsB?.pressure_strike_rate,
      fmt: (v) => Number(v).toFixed(1),
      better: 'lower' // Lower balls per wkt is better
    },
    {
      key: 'pressure_dot_pct',
      label: 'Pressure Dot Ball %',
      valA: statsA?.pressure_dot_pct,
      valB: statsB?.pressure_dot_pct,
      fmt: (v) => `${Number(v).toFixed(1)}%`,
      better: 'higher' // Higher dot% is better for bowlers
    },
    {
      key: 'death_economy',
      label: 'Death Overs Economy',
      valA: statsA?.death_economy,
      valB: statsB?.death_economy,
      fmt: (v) => Number(v).toFixed(2),
      better: 'lower'
    }
  ];

  // Visual Chart Data
  const chartData = metrics.slice(1, 6).map(m => ({
    name: m.label.replace('Pressure ', '').replace('Career Baseline ', ''),
    [pA?.player_name || 'Player A']: Number(m.valA) || 0,
    [pB?.player_name || 'Player B']: Number(m.valB) || 0
  }));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-50 text-[#E83E8C] border border-pink-200/80 text-xs font-black mb-2 uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Head-to-Head Scouting Tool</span>
            </div>
            <h2 className="text-2xl font-black text-[#14213D] tracking-tight">
              Player Performance Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Side-by-side analytical evaluation of pressure metrics, clutch differentials, and tactical strengths for auction decision-making.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-black">
            <button
              onClick={() => handleSwitchRole('batter')}
              className={`px-4 py-2 rounded-lg transition-all ${
                role === 'batter'
                  ? 'bg-[#14213D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compare Batters
            </button>
            <button
              onClick={() => handleSwitchRole('bowler')}
              className={`px-4 py-2 rounded-lg transition-all ${
                role === 'bowler'
                  ? 'bg-[#14213D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compare Bowlers
            </button>
          </div>
        </div>

        {/* Quick Comparison Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Scouting Presets:
          </span>
          {PRESETS[role].map(preset => (
            <button
              key={preset.label}
              onClick={() => {
                setPlayerAId(preset.idA);
                setPlayerBId(preset.idB);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-pink-50 hover:text-[#E83E8C] border border-slate-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player A Selector */}
        <div className="rr-card p-4 border-l-4 border-[#E83E8C] flex items-center space-x-3">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase text-pink-500 tracking-wider block mb-1">
              Candidate A
            </label>
            <select
              value={playerAId}
              onChange={(e) => setPlayerAId(parseInt(e.target.value, 10))}
              className="w-full text-xs font-bold text-[#14213D] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#E83E8C]"
            >
              {playerOptions.map((p) => {
                const id = role === 'batter' ? p.striker_id : p.bowler_id;
                const name = role === 'batter' ? p.striker_name : p.bowler_name;
                return (
                  <option key={`a-${id}`} value={id}>
                    #{p.rank} {name} ({p.team}) — {p.final_rating}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Player B Selector */}
        <div className="rr-card p-4 border-l-4 border-[#174EA6] flex items-center space-x-3">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase text-blue-500 tracking-wider block mb-1">
              Candidate B
            </label>
            <select
              value={playerBId}
              onChange={(e) => setPlayerBId(parseInt(e.target.value, 10))}
              className="w-full text-xs font-bold text-[#14213D] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#174EA6]"
            >
              {playerOptions.map((p) => {
                const id = role === 'batter' ? p.striker_id : p.bowler_id;
                const name = role === 'batter' ? p.striker_name : p.bowler_name;
                return (
                  <option key={`b-${id}`} value={id}>
                    #{p.rank} {name} ({p.team}) — {p.final_rating}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">Loading side-by-side comparison...</div>
      ) : pA && pB ? (
        <>
          {/* Side-by-Side Portrait Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player A Card */}
            <div className="rr-card p-6 bg-gradient-to-br from-pink-50/40 via-white to-slate-50 border-2 border-pink-200 shadow-md">
              <div className="flex items-center space-x-4">
                <PlayerImage
                  playerId={pA.player_id}
                  playerName={pA.player_name}
                  team={pA.ipl_team || pA.intl_team}
                  size="xl"
                  rounded="rounded-2xl"
                  showBadge={true}
                  badgeText={`#${statsA?.rank || '-'}`}
                  badgeColor="pink"
                  className="ring-4 ring-pink-100"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E83E8C] block">
                    {pA.intl_team} • {pA.ipl_team}
                  </span>
                  <h3 className="text-xl font-black text-[#14213D] truncate">{pA.player_name}</h3>
                  <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-pink-100/60 border border-pink-200">
                    <span className="text-[10px] uppercase font-bold text-pink-700">Rating:</span>
                    <span className="text-base font-black text-[#E83E8C]">{Number(statsA?.rating).toFixed(1)}</span>
                    <span className="text-[10px] text-pink-500 font-bold">/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Player B Card */}
            <div className="rr-card p-6 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 border-2 border-blue-200 shadow-md">
              <div className="flex items-center space-x-4">
                <PlayerImage
                  playerId={pB.player_id}
                  playerName={pB.player_name}
                  team={pB.ipl_team || pB.intl_team}
                  size="xl"
                  rounded="rounded-2xl"
                  showBadge={true}
                  badgeText={`#${statsB?.rank || '-'}`}
                  badgeColor="blue"
                  className="ring-4 ring-blue-100"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#174EA6] block">
                    {pB.intl_team} • {pB.ipl_team}
                  </span>
                  <h3 className="text-xl font-black text-[#14213D] truncate">{pB.player_name}</h3>
                  <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-100/60 border border-blue-200">
                    <span className="text-[10px] uppercase font-bold text-blue-700">Rating:</span>
                    <span className="text-base font-black text-[#174EA6]">{Number(statsB?.rating).toFixed(1)}</span>
                    <span className="text-[10px] text-blue-500 font-bold">/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HEAD-TO-HEAD METRICS COMPARISON TABLE */}
          <div className="rr-card overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-6 py-4 bg-[#14213D] text-white flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-wider">
                Direct Metric Comparison (Green = Superior Performance)
              </h3>
              <span className="text-[11px] font-bold text-pink-300">
                Match Pressure Index ≥ 70.0
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {metrics.map((m) => {
                const numA = Number(m.valA);
                const numB = Number(m.valB);
                let winnerA = false;
                let winnerB = false;

                if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                  if (m.better === 'higher') {
                    winnerA = numA > numB;
                    winnerB = numB > numA;
                  } else {
                    winnerA = numA < numB;
                    winnerB = numB < numA;
                  }
                }

                return (
                  <div
                    key={m.key}
                    className="grid grid-cols-12 py-3 px-6 items-center hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Candidate A Value */}
                    <div className="col-span-4 text-left font-mono">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                          winnerA
                            ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 shadow-2xs'
                            : 'text-slate-700'
                        }`}
                      >
                        {m.fmt(m.valA)}
                        {winnerA && <span className="ml-1 text-[10px]">★</span>}
                      </span>
                    </div>

                    {/* Metric Name */}
                    <div className="col-span-4 text-center font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      {m.label}
                    </div>

                    {/* Candidate B Value */}
                    <div className="col-span-4 text-right font-mono">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                          winnerB
                            ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 shadow-2xs'
                            : 'text-slate-700'
                        }`}
                      >
                        {winnerB && <span className="mr-1 text-[10px]">★</span>}
                        {m.fmt(m.valB)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VISUAL BAR COMPARISON CHART */}
          <div className="rr-card p-6 border-slate-200">
            <h4 className="text-xs font-black text-[#14213D] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-[#174EA6]" />
              <span>Side-by-Side Analytical Visualization</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Direct comparison of clutch strike/economy metrics under match pressure
            </p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#14213D', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey={pA.player_name} fill="#E83E8C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={pB.player_name} fill="#174EA6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SIDE-BY-SIDE ANALYTICAL STRENGTHS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player A Strengths */}
            <div className="rr-card p-5 bg-pink-50/20 border-pink-200">
              <h5 className="text-xs font-black text-[#E83E8C] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E83E8C]" />
                <span>{pA.player_name}: Key Strengths</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {pA.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-pink-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Player B Strengths */}
            <div className="rr-card p-5 bg-blue-50/20 border-blue-200">
              <h5 className="text-xs font-black text-[#174EA6] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#174EA6]" />
                <span>{pB.player_name}: Key Strengths</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {pB.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
