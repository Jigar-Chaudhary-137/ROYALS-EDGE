import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { fetchBatters } from '../api';
import Podium from '../components/Podium';
import PlayerImage from '../components/PlayerImage';

export default function BatterRankings({ onSelectPlayer }) {
  const [batters, setBatters] = useState([]);
  const [top10, setTop10] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [minBalls, setMinBalls] = useState(45);
  const [sortBy, setSortBy] = useState('final_rating');
  const [ascending, setAscending] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    loadBatters();
  }, [search, minBalls, sortBy, ascending]);

  const loadBatters = async () => {
    setLoading(true);
    try {
      const data = await fetchBatters(search, sortBy, ascending, minBalls);
      setBatters(data.rankings || []);
      setTop10(data.top_10 || []);
    } catch (err) {
      console.error("Failed to load batters", err);
    } finally {
      setLoading(false);
    }
  };

  // Distinct teams for filter
  const teamsList = useMemo(() => {
    const s = new Set();
    batters.forEach(b => {
      if (b.team) s.add(b.team.split('/')[0].trim());
    });
    return ['All', ...Array.from(s).sort()];
  }, [batters]);

  // Client-side team filter
  const filteredBatters = useMemo(() => {
    if (selectedTeam === 'All') return batters;
    return batters.filter(b => b.team && b.team.includes(selectedTeam));
  }, [batters, selectedTeam]);

  // Pagination slice
  const totalPages = Math.ceil(filteredBatters.length / pageSize) || 1;
  const paginatedBatters = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBatters.slice(start, start + pageSize);
  }, [filteredBatters, page]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setAscending(!ascending);
    } else {
      setSortBy(col);
      setAscending(false);
    }
    setPage(1);
  };

  const renderSortIndicator = (col) => {
    if (sortBy !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 inline ml-1" />;
    return ascending ? (
      <ArrowUp className="w-3 h-3 text-[#E83E8C] inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#E83E8C] inline ml-1" />
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-50 text-[#E83E8C] border border-pink-200/80 text-xs font-black mb-2 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Rajasthan Royals Auction Intelligence</span>
            </div>
            <h2 className="text-2xl font-black text-[#14213D] tracking-tight">
              Batting Under Pressure
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Identifying batters who elevate their strike rate, boundary frequency, and average when the match is on the line (MPI ≥ 70.0). Filtered by Empirical Bayes prior shrinkage ($K=40$).
            </p>
          </div>

          <div className="text-right flex-shrink-0 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Qualified Cohort</span>
            <span className="text-lg font-black text-[#174EA6]">{batters.length} Batters</span>
          </div>
        </div>
      </div>

      {/* Top 3 Visual Podium Spotlight */}
      <div className="rr-card p-6 border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-black text-[#14213D] uppercase tracking-wider">
              Podium Spotlight: Top 3 Pressure Finishers
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Click any card to inspect full profile</span>
        </div>
        <Podium items={top10.slice(0, 3)} type="batter" onSelectPlayer={onSelectPlayer} />
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by player or team name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E83E8C]/30 focus:border-[#E83E8C]"
          />
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          {/* Team Filter Dropdown */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 text-[11px]">Team:</span>
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E83E8C]"
            >
              {teamsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Min Pressure Balls Slider */}
          <div className="flex items-center space-x-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold text-[11px] whitespace-nowrap">Min Balls:</span>
            <input
              type="range"
              min="30"
              max="120"
              step="5"
              value={minBalls}
              onChange={(e) => {
                setMinBalls(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="w-20 accent-[#E83E8C]"
            />
            <span className="font-black text-[#14213D] w-6">{minBalls}</span>
          </div>
        </div>
      </div>

      {/* Complete Rankings Table */}
      <div className="rr-card overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#14213D] text-white sticky top-16 z-20">
              <tr>
                <th className="px-3 py-3 font-bold text-center w-12 cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('rank')}>
                  Rank {renderSortIndicator('rank')}
                </th>
                <th className="px-4 py-3 font-bold cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('striker_name')}>
                  Player {renderSortIndicator('striker_name')}
                </th>
                <th className="px-3 py-3 font-bold">Franchise / Affiliation</th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_balls')}>
                  Balls {renderSortIndicator('p_balls')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_runs')}>
                  Runs {renderSortIndicator('p_runs')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_sr')}>
                  Press SR {renderSortIndicator('p_sr')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('all_sr')}>
                  Norm SR {renderSortIndicator('all_sr')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('sr_improvement')}>
                  SR Delta {renderSortIndicator('sr_improvement')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_avg')}>
                  Avg {renderSortIndicator('p_avg')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_boundary_pct')}>
                  Bound % {renderSortIndicator('p_boundary_pct')}
                </th>
                <th className="px-4 py-3 font-bold text-center cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('final_rating')}>
                  Rating {renderSortIndicator('final_rating')}
                </th>
                <th className="px-3 py-3 font-bold text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#E83E8C] animate-ping" />
                      <span>Loading validated batter rankings...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedBatters.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    No batters match the active search and filter thresholds.
                  </td>
                </tr>
              ) : (
                paginatedBatters.map((b) => {
                  const isTop10 = b.rank <= 10;
                  const isExpanded = expandedId === b.striker_id;
                  const diffColor = b.sr_improvement > 0 ? 'text-emerald-600 font-bold' : 'text-slate-500';

                  return (
                    <React.Fragment key={b.striker_id}>
                      <tr
                        className={`hover:bg-slate-50/90 transition-colors group ${
                          isTop10 ? 'bg-white' : 'bg-slate-50/20'
                        }`}
                      >
                        {/* Rank */}
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-[11px] ${
                              b.rank === 1
                                ? 'bg-amber-400 text-amber-950 shadow-xs'
                                : b.rank === 2
                                ? 'bg-slate-300 text-slate-900'
                                : b.rank === 3
                                ? 'bg-amber-700 text-white'
                                : b.rank <= 10
                                ? 'bg-pink-100 text-[#E83E8C]'
                                : 'text-slate-400 bg-slate-100'
                            }`}
                          >
                            {b.rank}
                          </span>
                        </td>

                        {/* Player Photo + Name */}
                        <td className="px-4 py-2.5">
                          <div
                            onClick={() => onSelectPlayer && onSelectPlayer(b.striker_id)}
                            className="flex items-center space-x-2.5 cursor-pointer group-hover:text-[#E83E8C] transition-colors"
                          >
                            <PlayerImage
                              playerId={b.striker_id}
                              playerName={b.striker_name}
                              team={b.team}
                              size="sm"
                              rounded="rounded-lg"
                              className="group-hover:ring-2 group-hover:ring-[#E83E8C] transition-all"
                            />
                            <div>
                              <span className="font-extrabold text-[#14213D] group-hover:text-[#E83E8C] block truncate max-w-[150px] sm:max-w-[200px]">
                                {b.striker_name}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {b.intl_team || 'International'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Team */}
                        <td className="px-3 py-2.5 text-slate-600 font-medium text-xs whitespace-nowrap">
                          {b.team}
                        </td>

                        {/* Balls */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-700">{b.p_balls}</td>

                        {/* Runs */}
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-[#14213D]">{b.p_runs}</td>

                        {/* Pressure SR */}
                        <td className="px-3 py-2.5 text-right font-mono font-black text-[#E83E8C] text-[13px]">
                          {Number(b.p_sr).toFixed(1)}
                        </td>

                        {/* Career Norm SR */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-500">{Number(b.all_sr).toFixed(1)}</td>

                        {/* SR Delta */}
                        <td className={`px-3 py-2.5 text-right font-mono ${diffColor}`}>
                          {b.sr_improvement > 0 ? `+${Number(b.sr_improvement).toFixed(1)}` : Number(b.sr_improvement).toFixed(1)}
                        </td>

                        {/* Average */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-800 font-semibold">{Number(b.p_avg).toFixed(1)}</td>

                        {/* Boundary % */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-700">{Number(b.p_boundary_pct).toFixed(1)}%</td>

                        {/* Rating */}
                        <td className="px-4 py-2.5 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-pink-50 text-[#E83E8C] font-black text-xs border border-pink-200/80 shadow-2xs">
                            {Number(b.final_rating).toFixed(1)}
                          </span>
                        </td>

                        {/* Audit Details Toggle */}
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : b.striker_id)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Expand rationale & verification"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Technical Rationale Row */}
                      {isExpanded && (
                        <tr className="bg-pink-50/30 border-y border-pink-100 text-xs">
                          <td colSpan={12} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-3">
                                <div className="text-[11px] font-bold text-[#E83E8C] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                                  <Zap className="w-3.5 h-3.5" />
                                  <span>Scouting Performance Rationale</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                  {b.rationale}
                                </p>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sample Tier</span>
                                <span className="text-xs font-black text-[#14213D]">{b.reliability_tier}</span>
                                <button
                                  onClick={() => onSelectPlayer && onSelectPlayer(b.striker_id)}
                                  className="mt-2 text-center py-1.5 rounded-lg bg-[#14213D] text-white text-[11px] font-bold hover:bg-[#1e293b] transition-colors"
                                >
                                  Open 360° Profile
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{paginatedBatters.length ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-bold text-slate-800">{Math.min(page * pageSize, filteredBatters.length)}</span> of{' '}
            <span className="font-bold text-slate-800">{filteredBatters.length}</span> batters
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
