import React from 'react';
import {
  Flame,
  Award,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
  DownloadCloud,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  Target,
  BarChart3,
  ExternalLink,
  Crown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import StatCard from '../components/StatCard';
import Podium from '../components/Podium';
import PlayerImage from '../components/PlayerImage';

export default function Overview({ overviewData, onNavigate, onSelectPlayer }) {
  if (!overviewData) {
    return (
      <div className="p-16 text-center text-slate-500">
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E83E8C] animate-ping" />
          <span className="text-sm font-semibold">Compiling Rajasthan Royals analytics overview...</span>
        </div>
      </div>
    );
  }

  const { summary, top_batters_podium, top_bowlers_podium, stage_breakdown, recent_recommendations } = overviewData;

  // Chart data for Top 5 Batters
  const topBattersChart = top_batters_podium ? top_batters_podium.slice(0, 5).map(b => ({
    name: b.striker_name.split(' ').slice(-1)[0],
    rating: Number(b.final_rating),
    sr: Number(b.p_sr),
    fullName: b.striker_name
  })) : [];

  // Chart data for Top 5 Bowlers
  const topBowlersChart = top_bowlers_podium ? top_bowlers_podium.slice(0, 5).map(bw => ({
    name: bw.bowler_name.split(' ').slice(-1)[0],
    rating: Number(bw.final_rating),
    econ: Number(bw.p_econ),
    fullName: bw.bowler_name
  })) : [];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14213D] via-[#1a2d52] to-[#174EA6] p-8 sm:p-10 text-white shadow-xl border border-slate-700/60">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-black mb-4 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SupeRR Selector Season 2 • IPL 2027 Auction Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 leading-[1.15]">
            Discover Players Who Deliver Under Pressure.
          </h1>

          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed mb-8 max-w-2xl">
            Data-driven scouting intelligence for Rajasthan Royals IPL 2027 auction strategy. Analyzing 200,999 deliveries across 883 matches (2022–2026) to quantify clutch performance where match outcome is on the line.
          </p>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <button
              onClick={() => onNavigate('batters')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#E83E8C] text-white hover:bg-[#d4327a] active:scale-95 transition-all shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>Explore Batters</span>
            </button>

            <button
              onClick={() => onNavigate('bowlers')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#174EA6] text-white hover:bg-[#133f85] active:scale-95 transition-all shadow-md"
            >
              <Shield className="w-4 h-4" />
              <span>Explore Bowlers</span>
            </button>

            <button
              onClick={() => onNavigate('pressure')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-all active:scale-95"
            >
              <Flame className="w-4 h-4 text-pink-300" />
              <span>View Pressure Analysis</span>
            </button>

            <button
              onClick={() => onNavigate('exports')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-all active:scale-95"
            >
              <DownloadCloud className="w-4 h-4 text-pink-300" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KEY PERFORMANCE INDICATORS (6 CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Verified Dataset Scale & Clutch Sample
          </h2>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            100% Single Source of Truth
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Deliveries"
            value={(summary?.total_balls || 200999).toLocaleString()}
            subtitle="Ball-by-ball rows"
            icon={CheckCircle2}
            color="navy"
          />
          <StatCard
            title="Matches"
            value={(summary?.total_matches || 883).toLocaleString()}
            subtitle="IPL & T20I (2022–2026)"
            icon={Layers}
            color="blue"
          />
          <StatCard
            title="Competitions"
            value={(summary?.total_competitions || 141).toLocaleString()}
            subtitle="IPL & International series"
            icon={Trophy}
            color="navy"
          />
          <StatCard
            title="Pressure Balls"
            value={(summary?.pressure_balls || 18414).toLocaleString()}
            subtitle="MPI ≥ 70.0"
            trend={`${summary?.pressure_pct || 9.16}% of total`}
            icon={Flame}
            color="pink"
          />
          <StatCard
            title="Qualified Batters"
            value={(summary?.eligible_batters || 118).toString()}
            subtitle="≥45 pressure balls"
            trend="Empirical Bayes K=40"
            icon={Award}
            color="gold"
          />
          <StatCard
            title="Qualified Bowlers"
            value={(summary?.eligible_bowlers || 92).toString()}
            subtitle="≥60 legal balls"
            trend="Empirical Bayes K=36"
            icon={Shield}
            color="emerald"
          />
        </div>
      </div>

      {/* 3. FEATURED PLAYERS SPOTLIGHT (TOP BATTER, TOP BOWLER, TOP RR PLAYER) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black text-[#14213D] uppercase tracking-wider">
              Featured Player Showcase: Elite Pressure Performers
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Click to inspect 360° Profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Top Ranked Batter: Rinku Singh */}
          <div
            onClick={() => onSelectPlayer && onSelectPlayer(4708)}
            className="rr-card p-5 border-2 border-pink-200 bg-gradient-to-br from-pink-50/40 via-white to-slate-50 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E83E8C] text-white">
                #1 Batter Under Pressure
              </span>
              <span className="text-xs font-black text-[#E83E8C]">97.01 / 100</span>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <PlayerImage
                playerId={4708}
                playerName="Rinku Singh"
                team="Kolkata Knight Riders / India"
                size="xl"
                rounded="rounded-2xl"
                className="ring-4 ring-pink-100 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-[#14213D] group-hover:text-[#E83E8C] transition-colors truncate">
                  Rinku Singh
                </h3>
                <p className="text-[11px] text-slate-500 truncate">Kolkata Knight Riders / India</p>
                <div className="mt-2 text-xs font-mono font-black text-[#14213D]">
                  225.8 SR <span className="text-slate-400 font-normal">|</span> 125.7 Avg
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
              Scored 377 pressure runs with only 3 dismissals across 13 clutch encounters. Boasts an unprecedented +73.07 SR delta with 37.13% boundary frequency.
            </p>
          </div>

          {/* Top Ranked Bowler: Rashid Khan */}
          <div
            onClick={() => onSelectPlayer && onSelectPlayer(4722)}
            className="rr-card p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#174EA6] text-white">
                #1 Bowler Under Pressure
              </span>
              <span className="text-xs font-black text-[#174EA6]">72.13 / 100</span>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <PlayerImage
                playerId={4722}
                playerName="Rashid Khan"
                team="Gujarat Titans / Afghanistan"
                size="xl"
                rounded="rounded-2xl"
                className="ring-4 ring-blue-100 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-[#14213D] group-hover:text-[#174EA6] transition-colors truncate">
                  Rashid Khan
                </h3>
                <p className="text-[11px] text-slate-500 truncate">Gujarat Titans / Afghanistan</p>
                <div className="mt-2 text-xs font-mono font-black text-[#14213D]">
                  6.87 Econ <span className="text-slate-400 font-normal">|</span> 29 Wickets
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
              Elite sample across 41.3 pressure overs (249 legal deliveries). Strikes every 8.59 balls under duress while improving economy by +0.56 RPO.
            </p>
          </div>

          {/* Top RR-Associated Player: Ravindra Jadeja */}
          <div
            onClick={() => onSelectPlayer && onSelectPlayer(152)}
            className="rr-card p-5 border-2 border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white">
                RR Core Spotlight
              </span>
              <span className="text-xs font-black text-amber-700">59.56 / 100</span>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <PlayerImage
                playerId={152}
                playerName="Ravindra Jadeja"
                team="Rajasthan Royals / India"
                size="xl"
                rounded="rounded-2xl"
                className="ring-4 ring-amber-100 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-[#14213D] group-hover:text-amber-700 transition-colors truncate">
                  Ravindra Jadeja
                </h3>
                <p className="text-[11px] text-slate-500 truncate">Rajasthan Royals / India</p>
                <div className="mt-2 text-xs font-mono font-black text-[#14213D]">
                  169.6 SR <span className="text-slate-400 font-normal">|</span> 40.7 Avg
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
              Rank #5 Batter with a high-clutch average of 40.71 and strike rate acceleration of +34.57. Demonstrates ice-cool temperament in high-stress chases.
            </p>
          </div>
        </div>
      </div>

      {/* 4. VISUAL PODIUMS (BATTERS & BOWLERS SIDE-BY-SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batting Podium */}
        <div className="rr-card p-6 border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <div>
              <h3 className="text-sm font-black text-[#14213D] flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#E83E8C]" />
                <span>Top Batters Under Pressure</span>
              </h3>
              <p className="text-xs text-slate-500">Highest rated batters in ≥70 pressure scenarios</p>
            </div>
            <button
              onClick={() => onNavigate('batters')}
              className="text-xs font-bold text-[#E83E8C] hover:text-[#d4327a] flex items-center space-x-1"
            >
              <span>Full Top 10</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <Podium items={top_batters_podium} type="batter" onSelectPlayer={onSelectPlayer} />
        </div>

        {/* Bowling Podium */}
        <div className="rr-card p-6 border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <div>
              <h3 className="text-sm font-black text-[#14213D] flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#174EA6]" />
                <span>Top Bowlers Under Pressure</span>
              </h3>
              <p className="text-xs text-slate-500">Highest rated bowlers in ≥70 pressure scenarios</p>
            </div>
            <button
              onClick={() => onNavigate('bowlers')}
              className="text-xs font-bold text-[#174EA6] hover:text-[#123e85] flex items-center space-x-1"
            >
              <span>Full Top 10</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <Podium items={top_bowlers_podium} type="bowler" onSelectPlayer={onSelectPlayer} />
        </div>
      </div>

      {/* 5. ANALYTICS & PRESSURE DISTRIBUTION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Breakdown Progress Gauges */}
        <div className="rr-card p-6 border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-[#14213D] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#174EA6]" />
                <span>Pressure Distribution by Innings Stage</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quantifying pressure volume across Powerplay, Middle, and Death overs (2022–2026)
              </p>
            </div>
            <button
              onClick={() => onNavigate('pressure')}
              className="text-xs font-bold text-[#174EA6] hover:underline flex items-center space-x-1"
            >
              <span>Pressure Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {stage_breakdown?.map((stage) => {
              const isDeath = stage.stage_phase.includes('Death');
              const isMiddle = stage.stage_phase.includes('Middle');
              const barColor = isDeath ? 'bg-[#E83E8C]' : isMiddle ? 'bg-[#174EA6]' : 'bg-slate-500';

              return (
                <div key={stage.stage_phase} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex justify-between items-center mb-1.5 text-xs font-black text-[#14213D]">
                    <span className="flex items-center space-x-1.5">
                      {isDeath && <Flame className="w-3.5 h-3.5 text-[#E83E8C]" />}
                      <span>{stage.stage_phase}</span>
                    </span>
                    <span className="font-mono text-slate-700">
                      {stage.pressure_balls?.toLocaleString()} balls ({stage.pressure_pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(100, stage.pressure_pct * 1.8)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500 font-medium">
                    <span>Average MPI: <strong>{stage.avg_pressure_score} / 100</strong></span>
                    <span>Total Phase Volume: {stage.total_balls?.toLocaleString()} balls</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Auction Radar Box */}
        <div className="rr-card p-6 border-slate-200 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#14213D] to-[#1E293B] text-white">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Rajasthan Royals Radar</span>
            </div>

            <h3 className="text-lg font-black tracking-tight mb-2">
              Auction Intelligence Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium mb-4">
              The empirical data demonstrates that elite clutch performance is heavily concentrated: only 9.16% of deliveries meet high pressure constraints. Finishing specialists like Rinku Singh (+73.07 SR delta) and death bowlers like Rashid Khan (8.59 balls/wkt) offer non-substitutable match equity.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60">
            <button
              onClick={() => onNavigate('recommendations')}
              className="w-full py-2.5 rounded-xl bg-[#E83E8C] hover:bg-[#d4327a] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Explore RR Auction Targets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
