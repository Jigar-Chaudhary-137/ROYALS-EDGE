import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
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
  Target
} from 'lucide-react';
import { fetchBowlers } from '../api';
import Podium from '../components/Podium';
import PlayerImage from '../components/PlayerImage';

export default function BowlerRankings({ onSelectPlayer }) {
  const [bowlers, setBowlers] = useState([]);
  const [top10, setTop10] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [minBalls, setMinBalls] = useState(60);
  const [sortBy, setSortBy] = useState('final_rating');
  const [ascending, setAscending] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    loadBowlers();
  }, [search, minBalls, sortBy, ascending]);

  const loadBowlers = async () => {
    setLoading(true);
    try {
      const data = await fetchBowlers(search, sortBy, ascending, minBalls);
      setBowlers(data.rankings || []);
      setTop10(data.top_10 || []);
    } catch (err) {
      console.error("Failed to load bowlers", err);
    } finally {
      setLoading(false);
    }
  };

  // Distinct teams for filter
  const teamsList = useMemo(() => {
    const s = new Set();
    bowlers.forEach(b => {
      if (b.team) s.add(b.team.split('/')[0].trim());
    });
    return ['All', ...Array.from(s).sort()];
  }, [bowlers]);

  // Client-side team filter
  const filteredBowlers = useMemo(() => {
    if (selectedTeam === 'All') return bowlers;
    return bowlers.filter(b => b.team && b.team.includes(selectedTeam));
  }, [bowlers, selectedTeam]);

  // Pagination slice
  const totalPages = Math.ceil(filteredBowlers.length / pageSize) || 1;
  const paginatedBowlers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBowlers.slice(start, start + pageSize);
  }, [filteredBowlers, page]);

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
      <ArrowUp className="w-3 h-3 text-[#174EA6] inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#174EA6] inline ml-1" />
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#174EA6] border border-blue-200/80 text-xs font-black mb-2 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Rajasthan Royals Bowling Intelligence</span>
            </div>
            <h2 className="text-2xl font-black text-[#14213D] tracking-tight">
              Bowling Under Pressure
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Evaluating bowling execution when defending targets in death overs and high-stress situations (MPI ≥ 70.0): legal deliveries bowled, wickets, economy containment, and dot-ball percentage.
            </p>
          </div>

          <div className="text-right flex-shrink-0 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Qualified Cohort</span>
            <span className="text-lg font-black text-[#174EA6]">{bowlers.length} Bowlers</span>
          </div>
        </div>
      </div>

      {/* Top 3 Visual Podium Spotlight */}
      <div className="rr-card p-6 border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-black text-[#14213D] uppercase tracking-wider">
              Podium Spotlight: Top 3 Strike Bowlers
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Click any card to inspect full profile</span>
        </div>
        <Podium items={top10.slice(0, 3)} type="bowler" onSelectPlayer={onSelectPlayer} />
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by bowler or team name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174EA6]/30 focus:border-[#174EA6]"
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
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#174EA6]"
            >
              {teamsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Min Legal Balls Slider */}
          <div className="flex items-center space-x-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold text-[11px] whitespace-nowrap">Min Legal Balls:</span>
            <input
              type="range"
              min="36"
              max="150"
              step="6"
              value={minBalls}
              onChange={(e) => {
                setMinBalls(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="w-20 accent-[#174EA6]"
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
                <th className="px-4 py-3 font-bold cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('bowler_name')}>
                  Bowler {renderSortIndicator('bowler_name')}
                </th>
                <th className="px-3 py-3 font-bold">Franchise / Affiliation</th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_overs')}>
                  Overs {renderSortIndicator('p_overs')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_wickets')}>
                  Wkts {renderSortIndicator('p_wickets')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_econ')}>
                  Press Econ {renderSortIndicator('p_econ')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('all_econ')}>
                  Norm Econ {renderSortIndicator('all_econ')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('econ_improvement')}>
                  Econ Diff {renderSortIndicator('econ_improvement')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_wkt_sr')}>
                  Balls/Wkt {renderSortIndicator('p_wkt_sr')}
                </th>
                <th className="px-3 py-3 font-bold text-right cursor-pointer hover:bg-[#1e293b]" onClick={() => handleSort('p_dot_pct')}>
                  Dot % {renderSortIndicator('p_dot_pct')}
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
                      <span className="w-2 h-2 rounded-full bg-[#174EA6] animate-ping" />
                      <span>Loading validated bowler rankings...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedBowlers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    No bowlers match the active search and filter thresholds.
                  </td>
                </tr>
              ) : (
                paginatedBowlers.map((bw) => {
                  const isTop10 = bw.rank <= 10;
                  const isExpanded = expandedId === bw.bowler_id;
                  const diffColor = bw.econ_improvement > 0 ? 'text-emerald-600 font-bold' : 'text-slate-500';

                  return (
                    <React.Fragment key={bw.bowler_id}>
                      <tr
                        className={`hover:bg-slate-50/90 transition-colors group ${
                          isTop10 ? 'bg-white' : 'bg-slate-50/20'
                        }`}
                      >
                        {/* Rank */}
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-[11px] ${
                              bw.rank === 1
                                ? 'bg-amber-400 text-amber-950 shadow-xs'
                                : bw.rank === 2
                                ? 'bg-slate-300 text-slate-900'
                                : bw.rank === 3
                                ? 'bg-amber-700 text-white'
                                : bw.rank <= 10
                                ? 'bg-blue-100 text-[#174EA6]'
                                : 'text-slate-400 bg-slate-100'
                            }`}
                          >
                            {bw.rank}
                          </span>
                        </td>

                        {/* Player Photo + Name */}
                        <td className="px-4 py-2.5">
                          <div
                            onClick={() => onSelectPlayer && onSelectPlayer(bw.bowler_id)}
                            className="flex items-center space-x-2.5 cursor-pointer group-hover:text-[#174EA6] transition-colors"
                          >
                            <PlayerImage
                              playerId={bw.bowler_id}
                              playerName={bw.bowler_name}
                              team={bw.team}
                              size="sm"
                              rounded="rounded-lg"
                              className="group-hover:ring-2 group-hover:ring-[#174EA6] transition-all"
                            />
                            <div>
                              <span className="font-extrabold text-[#14213D] group-hover:text-[#174EA6] block truncate max-w-[150px] sm:max-w-[200px]">
                                {bw.bowler_name}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {bw.intl_team || 'International'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Team */}
                        <td className="px-3 py-2.5 text-slate-600 font-medium text-xs whitespace-nowrap">
                          {bw.team}
                        </td>

                        {/* Overs */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                          {Number(bw.p_overs).toFixed(1)} <span className="text-[10px] text-slate-400">({bw.p_legal_balls}b)</span>
                        </td>

                        {/* Wickets */}
                        <td className="px-3 py-2.5 text-right font-mono font-black text-[#174EA6] text-[13px]">
                          {bw.p_wickets}
                        </td>

                        {/* Pressure Econ */}
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800">
                          {Number(bw.p_econ).toFixed(2)}
                        </td>

                        {/* Career Norm Econ */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-500">
                          {Number(bw.all_econ).toFixed(2)}
                        </td>

                        {/* Econ Diff */}
                        <td className={`px-3 py-2.5 text-right font-mono ${diffColor}`}>
                          {bw.econ_improvement > 0 ? `+${Number(bw.econ_improvement).toFixed(2)}` : Number(bw.econ_improvement).toFixed(2)}
                        </td>

                        {/* Balls per Wicket */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-800">
                          {Number(bw.p_wkt_sr).toFixed(1)}
                        </td>

                        {/* Dot Ball % */}
                        <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                          {Number(bw.p_dot_pct).toFixed(1)}%
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-2.5 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#174EA6] font-black text-xs border border-blue-200/80 shadow-2xs">
                            {Number(bw.final_rating).toFixed(1)}
                          </span>
                        </td>

                        {/* Audit Details Toggle */}
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : bw.bowler_id)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Expand rationale & verification"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Technical Rationale Row */}
                      {isExpanded && (
                        <tr className="bg-blue-50/30 border-y border-blue-100 text-xs">
                          <td colSpan={12} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-3">
                                <div className="text-[11px] font-bold text-[#174EA6] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                                  <Target className="w-3.5 h-3.5" />
                                  <span>Bowling Performance Rationale</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                  {bw.rationale}
                                </p>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sample Tier</span>
                                <span className="text-xs font-black text-[#14213D]">{bw.reliability_tier}</span>
                                <button
                                  onClick={() => onSelectPlayer && onSelectPlayer(bw.bowler_id)}
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
            Showing <span className="font-bold text-slate-800">{paginatedBowlers.length ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-bold text-slate-800">{Math.min(page * pageSize, filteredBowlers.length)}</span> of{' '}
            <span className="font-bold text-slate-800">{filteredBowlers.length}</span> bowlers
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
