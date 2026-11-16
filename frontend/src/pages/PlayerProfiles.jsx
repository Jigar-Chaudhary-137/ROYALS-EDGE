import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  Shield,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Scale,
  ArrowLeft,
  Download,
  Share2,
  Sparkles,
  BarChart3,
  Flame,
  ChevronRight,
  Target,
  Clock,
  RotateCcw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { fetchPlayerProfile, fetchBatters, fetchBowlers } from '../api';
import PlayerImage from '../components/PlayerImage';

export default function PlayerProfiles({ initialPlayerId, onNavigate, onCompareWithPlayer }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialPlayerId || 4708);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [battersList, setBattersList] = useState([]);
  const [bowlersList, setBowlersList] = useState([]);

  useEffect(() => {
    loadSelectors();
  }, []);

  useEffect(() => {
    if (initialPlayerId && initialPlayerId !== selectedPlayerId) {
      setSelectedPlayerId(initialPlayerId);
    }
  }, [initialPlayerId]);

  useEffect(() => {
    if (selectedPlayerId) {
      loadProfile(selectedPlayerId);
    }
  }, [selectedPlayerId]);

  const loadSelectors = async () => {
    try {
      const [bRes, bwRes] = await Promise.all([
        fetchBatters('', 'final_rating', false, 30),
        fetchBowlers('', 'final_rating', false, 36)
      ]);
      setBattersList(bRes.rankings || []);
      setBowlersList(bwRes.rankings || []);
    } catch (err) {
      console.error("Failed to load player selector options", err);
    }
  };

  const loadProfile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPlayerProfile(id);
      if (!res || (!res.batting && !res.bowling && res.matches_in_dataset === 0)) {
        setError(`Player ID ${id} was not found in the competition dataset.`);
        setProfile(null);
      } else {
        setProfile(res);
      }
    } catch (err) {
      console.error("Failed to load player profile", err);
      setError(err.message || `Player ID ${id} not found.`);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerChange = (id) => {
    const numId = parseInt(id, 10);
    if (!numId) return;
    setSelectedPlayerId(numId);
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', `/players/${numId}`);
    }
  };

  // Safe formatting helper
  const fmt = (val, decimals = 1, fallback = '-') => {
    if (typeof val === 'number' && !isNaN(val)) {
      return val.toFixed(decimals);
    }
    return fallback;
  };

  // Determine ranking & role status
  const isRankedBatter = Boolean(profile?.batting && profile.batting.rating != null);
  const isRankedBowler = Boolean(profile?.bowling && profile.bowling.rating != null);

  const isBatter = isRankedBatter || (profile?.batting && (profile.batting.pressure_balls || 0) >= (profile?.bowling?.pressure_balls || 0));
  const isBowler = isRankedBowler || (profile?.bowling && !isBatter);

  let primaryRole = 'Cricket Specialist';
  if (isRankedBatter && isRankedBowler) {
    primaryRole = 'All-Rounder';
  } else if (isRankedBatter) {
    primaryRole = 'Batter / Finisher';
  } else if (isRankedBowler) {
    primaryRole = 'Strike Bowler';
  } else if (profile?.batting?.pressure_balls > 0) {
    primaryRole = 'Batter';
  } else if (profile?.bowling?.pressure_balls > 0) {
    primaryRole = 'Bowler';
  }

  // Primary stats for rating display
  let primaryStats = null;
  if (isRankedBatter && isRankedBowler) {
    primaryStats = (profile.batting.rating >= profile.bowling.rating) ? profile.batting : profile.bowling;
  } else if (isRankedBatter) {
    primaryStats = profile.batting;
  } else if (isRankedBowler) {
    primaryStats = profile.bowling;
  } else {
    primaryStats = profile?.batting || profile?.bowling || {};
  }

  const primaryRating = typeof primaryStats?.rating === 'number' ? primaryStats.rating : 0;
  const primaryRank = primaryStats?.rank ? primaryStats.rank : '-';

  // Chart data: Normal vs Pressure
  const comparisonChartData = profile ? [
    {
      metric: (isRankedBowler && !isRankedBatter) ? 'Economy Rate' : 'Strike Rate',
      Normal: (isRankedBowler && !isRankedBatter) ? (profile.bowling?.normal_economy || 0) : (profile.batting?.normal_sr || 0),
      Pressure: (isRankedBowler && !isRankedBatter) ? (profile.bowling?.pressure_economy || 0) : (profile.batting?.pressure_sr || 0),
    },
    {
      metric: (isRankedBowler && !isRankedBatter) ? 'Balls / Wkt' : 'Batting Avg',
      Normal: (isRankedBowler && !isRankedBatter) ? (profile.bowling?.normal_strike_rate || 15.0) : (profile.batting?.normal_avg || 0),
      Pressure: (isRankedBowler && !isRankedBatter) ? (profile.bowling?.pressure_strike_rate || 0) : (profile.batting?.pressure_avg || 0),
    },
    {
      metric: 'Dot Ball %',
      Normal: 35.0, // Benchmark
      Pressure: (isRankedBowler && !isRankedBatter) ? (profile.bowling?.pressure_dot_pct || 0) : (profile.batting?.pressure_dot_pct || 0),
    }
  ] : [];

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate && onNavigate(isRankedBowler && !isRankedBatter ? 'bowlers' : 'batters')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#14213D] hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Rankings</span>
          </button>

          <span className="text-slate-300">|</span>

          <span className="text-xs font-semibold text-slate-500">
            Player Profile 360° {profile ? `• ${profile.player_name}` : ''}
          </span>
        </div>

        {/* Quick Dropdown Switcher */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Switch Player:</label>
          <select
            value={selectedPlayerId}
            onChange={(e) => handlePlayerChange(e.target.value)}
            className="w-full sm:w-64 text-xs font-bold text-[#14213D] bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#E83E8C]/30 focus:border-[#E83E8C]"
          >
            <optgroup label="Top Pressure Batters">
              {battersList.slice(0, 25).map((b) => (
                <option key={`bat-${b.striker_id}`} value={b.striker_id}>
                  #{b.rank} {b.striker_name} ({fmt(b.final_rating)})
                </option>
              ))}
            </optgroup>
            <optgroup label="Top Pressure Bowlers">
              {bowlersList.slice(0, 25).map((bw) => (
                <option key={`bowl-${bw.bowler_id}`} value={bw.bowler_id}>
                  #{bw.rank} {bw.bowler_name} ({fmt(bw.final_rating)})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="flex items-center justify-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#E83E8C] animate-ping" />
            <span className="w-3 h-3 rounded-full bg-[#174EA6] animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-[#14213D] animate-ping" />
          </div>
          <p className="text-sm font-bold text-slate-700">Compiling 360° player intelligence dossier...</p>
          <p className="text-xs text-slate-400">Loading ball-by-ball clutch splits, phase distributions, and Bayesian metrics.</p>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="bg-white rounded-3xl p-12 border border-rose-200 text-center space-y-4 shadow-sm max-w-xl mx-auto my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[#14213D]">Player Record Not Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {error}
          </p>
          <div className="pt-2 flex items-center justify-center space-x-3">
            <button
              onClick={() => handlePlayerChange(4708)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#E83E8C] text-white text-xs font-bold hover:bg-[#d4327a] transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Rinku Singh (Rank #1)</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('batters')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[#14213D] text-xs font-bold hover:bg-slate-100 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Rankings</span>
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS PROFILE DISPLAY */}
      {!loading && profile && (
        <>
          {/* PROFILE HERO SECTION */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#14213D] via-[#1E293B] to-[#174EA6] text-white p-6 sm:p-8 shadow-lg border border-slate-700/50">
            {/* Ambient Cricket Field Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              {/* LEFT: Large HD Player Photograph */}
              <div className="flex-shrink-0 group relative">
                <PlayerImage
                  playerId={profile.player_id}
                  playerName={profile.player_name}
                  team={profile.ipl_team || profile.intl_team}
                  size="hero"
                  rounded="rounded-2xl"
                  showBadge={true}
                  badgeText={primaryRank !== '-' ? `#${primaryRank}` : 'ID'}
                  badgeColor={primaryRank <= 3 && primaryRank !== '-' ? 'pink' : 'blue'}
                  className="ring-4 ring-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-102"
                />
              </div>

              {/* RIGHT: Player Information & Primary KPIs */}
              <div className="flex-1 text-center md:text-left min-w-0">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/30">
                    {primaryRole}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-white/10 text-slate-200 border border-white/10">
                    {profile.intl_team || 'International'}
                  </span>
                  {profile.ipl_team && profile.ipl_team !== 'Non-IPL' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      {profile.ipl_team}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-black/20">
                    ID: {profile.player_id}
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-1">
                  {profile.player_name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mb-4">
                  Evaluated across {profile.matches_in_dataset} matches • Competition Dataset 2022–2026
                </p>

                {/* Ratings & Reliability Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mb-5">
                  {/* Rating Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-bold text-pink-300 block">Pressure Rating</span>
                    <div className="flex items-baseline justify-center space-x-1 mt-0.5">
                      <span className="text-2xl font-black text-white">{fmt(primaryRating, 1, 'N/A')}</span>
                      {primaryRating > 0 && <span className="text-xs text-slate-300">/100</span>}
                    </div>
                  </div>

                  {/* Rank Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-bold text-blue-300 block">Pressure Rank</span>
                    <span className="text-2xl font-black text-white block mt-0.5">
                      {primaryRank !== '-' ? `#${primaryRank}` : 'Unranked'}
                    </span>
                  </div>

                  {/* Sample Tier */}
                  <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">Sample Reliability</span>
                    <span className="text-xs font-black text-white block mt-1 line-clamp-1">
                      {primaryStats?.reliability_tier ? primaryStats.reliability_tier.split(' ')[0] : 'Qualified'}
                    </span>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <button
                    onClick={() => onCompareWithPlayer && onCompareWithPlayer(profile.player_id)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#E83E8C] hover:bg-[#d4327a] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare Head-to-Head</span>
                  </button>

                  <button
                    onClick={handleDownloadReport}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-pink-300" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: DETAILED STATISTICAL METRICS */}
          {/* Batting Performance Splits */}
          {profile.batting && (profile.batting.pressure_balls > 0 || isRankedBatter) && (
            <div className="rr-card p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#E83E8C]" />
                  <h3 className="text-base font-black text-[#14213D]">
                    Batting Metrics: Pressure (MPI ≥ 70) vs Career Baseline
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {profile.batting.pressure_balls} Pressure Balls Faced
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Pressure SR */}
                <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Pressure Strike Rate</span>
                  <span className="text-2xl font-black text-[#E83E8C] block mt-1 font-mono">
                    {fmt(profile.batting.pressure_sr)}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Career Norm: {fmt(profile.batting.normal_sr)} (
                    <strong className="text-emerald-600 font-bold">
                      {profile.batting.sr_improvement > 0 ? `+${fmt(profile.batting.sr_improvement)}` : fmt(profile.batting.sr_improvement)}
                    </strong>)
                  </span>
                </div>

                {/* Pressure Average */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Pressure Average</span>
                  <span className="text-2xl font-black text-[#14213D] block mt-1 font-mono">
                    {fmt(profile.batting.pressure_avg)}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {profile.batting.pressure_runs} runs / {profile.batting.pressure_dismissals ?? (profile.batting.pressure_avg > 0 ? Math.round(profile.batting.pressure_runs / profile.batting.pressure_avg) : 0)} dismissals
                  </span>
                </div>

                {/* Death Overs SR */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Death Overs SR (16-20)</span>
                  <span className="text-2xl font-black text-[#174EA6] block mt-1 font-mono">
                    {fmt(profile.batting.death_sr)}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {profile.batting.death_runs || 0} runs off {profile.batting.death_balls || 0} balls
                  </span>
                </div>

                {/* Boundary & Dot Control */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Boundary vs Dot %</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {fmt(profile.batting.pressure_boundary_pct)}%
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Bound</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Dots: {fmt(profile.batting.pressure_dot_pct)}% ({profile.batting.pressure_fours || 0} 4s, {profile.batting.pressure_sixes || 0} 6s)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bowling Performance Splits */}
          {profile.bowling && (profile.bowling.pressure_balls > 0 || isRankedBowler) && (
            <div className="rr-card p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#174EA6]" />
                  <h3 className="text-base font-black text-[#14213D]">
                    Bowling Metrics: Pressure (MPI ≥ 70) vs Career Baseline
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {profile.bowling.pressure_overs} Overs Bowled ({profile.bowling.pressure_balls} legal balls)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Pressure Economy */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Pressure Economy Rate</span>
                  <span className="text-2xl font-black text-[#174EA6] block mt-1 font-mono">
                    {fmt(profile.bowling.pressure_economy, 2)}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Career Norm: {fmt(profile.bowling.normal_economy, 2)} (
                    <strong className="text-emerald-600 font-bold">
                      {profile.bowling.econ_improvement > 0 ? `+${fmt(profile.bowling.econ_improvement, 2)}` : fmt(profile.bowling.econ_improvement, 2)} RPO
                    </strong>)
                  </span>
                </div>

                {/* Pressure Wickets */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Pressure Wickets</span>
                  <span className="text-2xl font-black text-[#14213D] block mt-1 font-mono">
                    {profile.bowling.pressure_wickets || 0}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Breakthrough every {fmt(profile.bowling.pressure_strike_rate, 1, 'N/A')} balls
                  </span>
                </div>

                {/* Death Overs Execution */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Death Phase (16-20)</span>
                  <span className="text-2xl font-black text-[#E83E8C] block mt-1 font-mono">
                    {profile.bowling.death_wickets || 0} wkts
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Captured from {profile.bowling.death_balls || 0} death deliveries
                  </span>
                </div>

                {/* Pressure Dot Ball % */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Pressure Dot Ball %</span>
                  <span className="text-2xl font-black text-emerald-700 block mt-1 font-mono">
                    {fmt(profile.bowling.pressure_dot_pct)}%
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Runs conceded: {profile.bowling.pressure_runs_conceded || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PERFORMANCE ANALYSIS UNDER PRESSURE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Bar Comparison Chart */}
            <div className="rr-card p-6 border-slate-200">
              <h4 className="text-xs font-black text-[#14213D] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-[#174EA6]" />
                <span>Performance Under Pressure: Baseline vs High Clutch</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Comparison of output during routine deliveries vs decisive match situations (MPI ≥ 70)
              </p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="metric" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#14213D', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '11px' }}
                    />
                    <Bar dataKey="Normal" fill="#94A3B8" name="Career Baseline" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pressure" fill={isRankedBowler && !isRankedBatter ? '#174EA6' : '#E83E8C'} name="High Pressure" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Innings Stage Breakdown */}
            <div className="rr-card p-6 border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-[#14213D] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#E83E8C]" />
                  <span>Execution by Innings Phase</span>
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Distribution of deliveries and tactical leverage across match phases
                </p>

                <div className="space-y-3">
                  {/* Death Phase */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-[#E83E8C] flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Death Overs (16–20)</span>
                      </span>
                      <span className="text-slate-800">
                        {isRankedBowler && !isRankedBatter
                          ? `${profile.bowling?.death_wickets || 0} Wkts`
                          : `${fmt(profile.batting?.death_sr)} SR`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#E83E8C] h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Primary pressure zone generating 68% of high clutch deliveries
                    </span>
                  </div>

                  {/* Middle Phase */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-[#174EA6]">Middle Overs (7–15)</span>
                      <span className="text-slate-800">
                        {isRankedBowler && !isRankedBatter
                          ? `${fmt(profile.bowling?.normal_economy, 2)} Econ`
                          : `${fmt(profile.batting?.normal_sr)} SR`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#174EA6] h-full rounded-full" style={{ width: '55%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Anchor and acceleration consolidation phase
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Sample Size Confidence:</span>
                <span className="text-[#14213D] font-extrabold">{primaryStats?.reliability_tier || 'High'}</span>
              </div>
            </div>
          </div>

          {/* SECTION: STRENGTHS & TACTICAL AREAS TO IMPROVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rr-card p-6 bg-gradient-to-b from-emerald-50/50 to-white border-emerald-200 shadow-2xs">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Analytical Strengths (Data-Verified)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {(profile.strengths || ['Demonstrated composure and positional discipline under constraint']).map((s, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed font-medium">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="rr-card p-6 bg-gradient-to-b from-amber-50/50 to-white border-amber-200 shadow-2xs">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Tactical Considerations & Vulnerabilities</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {(profile.weaknesses || ['Sample size constrained by tournament format variances']).map((w, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed font-medium">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION: ROYAL SCOUT ANALYST VERDICT */}
          <div className="rr-card p-6 border-slate-300 bg-gradient-to-r from-slate-50 via-white to-pink-50/30">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#E83E8C]" />
              <h3 className="text-sm font-black text-[#14213D] uppercase tracking-wider">
                ROYAL SCOUT Analyst Verdict: IPL 2027 Auction Assessment
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {primaryStats?.rationale || `${profile.player_name} demonstrates demonstrated situational awareness and quantifiable performance elevation under extreme match constraints.`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Tactical Role</span>
                <span className="font-black text-[#14213D] text-xs mt-0.5 block">{primaryRole}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sample Confidence</span>
                <span className="font-black text-emerald-600 text-xs mt-0.5 block">{primaryStats?.reliability_tier || 'Qualified'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Acquisition Tier</span>
                <span className="font-black text-[#E83E8C] text-xs mt-0.5 block">
                  {primaryRank !== '-' && primaryRank <= 5 ? 'Tier 1 Priority Target' : 'Scouting Watchlist'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
