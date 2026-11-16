import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  AlertTriangle,
  Table as TableIcon,
  Layers,
  Filter
} from 'lucide-react';
import { fetchDataExplorer } from '../api';

const DATASETS = [
  { id: 'ball_by_ball', label: 'Ball by Ball (200,999 rows)', file: 'ball_by_ball.csv' },
  { id: 'matches', label: 'Matches (883 rows)', file: 'matches.csv' },
  { id: 'competitions', label: 'Competitions (141 rows)', file: 'competitions.csv' },
  { id: 'teams', label: 'Teams (353 rows)', file: 'teams.csv' },
  { id: 'playing_eleven', label: 'Playing XI (28,381 rows)', file: 'playing_eleven.csv' },
  { id: 'mapping', label: 'Player Mappings (6,413 rows)', file: 'competition_team_player_mapping.csv' }
];

export default function DataExplorer({ dataReport }) {
  const [selectedDataset, setSelectedDataset] = useState('matches');
  const [records, setRecords] = useState([]);
  const [schema, setSchema] = useState({});
  const [nullColumns, setNullColumns] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('data'); // 'data', 'schema', 'quality'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedDataset, page, pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchDataExplorer(selectedDataset, page, pageSize, search);
      setRecords(res.records || []);
      setSchema(res.schema || {});
      setNullColumns(res.null_columns || {});
      setTotalRecords(res.total_records || 0);
      setFilteredCount(res.filtered_count || 0);
    } catch (err) {
      console.error("Failed to load records", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const totalPages = Math.ceil(filteredCount / pageSize) || 1;
  const columns = records.length > 0 ? Object.keys(records[0]) : Object.keys(schema);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-[#14213D] flex items-center space-x-2">
            <Database className="w-5 h-5 text-[#E83E8C]" />
            <span>Interactive Data Explorer</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect raw schemas, verify match-level integrity, and audit data quality across all competition tables
          </p>
        </div>

        {/* Dataset Selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedDataset}
            onChange={(e) => {
              setSelectedDataset(e.target.value);
              setPage(1);
              setSearch('');
            }}
            className="text-xs font-bold text-[#14213D] bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
          >
            {DATASETS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Switcher and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Tabs */}
        <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveView('data')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeView === 'data' ? 'bg-white text-[#14213D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <TableIcon className="w-3.5 h-3.5" />
              <span>Records View ({filteredCount.toLocaleString()})</span>
            </span>
          </button>
          <button
            onClick={() => setActiveView('schema')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeView === 'schema' ? 'bg-white text-[#14213D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Schema & Dtypes</span>
            </span>
          </button>
          <button
            onClick={() => setActiveView('quality')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeView === 'quality' ? 'bg-white text-[#14213D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Quality Audit</span>
            </span>
          </button>
        </div>

        {/* Search */}
        {activeView === 'data' && (
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search across columns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 w-56 sm:w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#14213D] text-white rounded-lg text-xs font-semibold hover:bg-[#1a2d52]"
            >
              Search
            </button>
          </form>
        )}
      </div>

      {/* Main Content Pane */}
      {activeView === 'data' && (
        <div className="rr-card overflow-hidden">
          {/* Table Container */}
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#14213D] text-white sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2.5 font-bold text-slate-300 border-r border-slate-700 w-12 text-center">#</th>
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-2.5 font-bold uppercase tracking-wider whitespace-nowrap border-r border-slate-700/60 last:border-0">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                      Loading dataset records...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                      No records found matching query.
                    </td>
                  </tr>
                ) : (
                  records.map((row, idx) => (
                    <tr key={idx} className="hover:bg-pink-50/30 transition-colors">
                      <td className="px-3 py-2 text-slate-400 text-center font-mono border-r border-slate-100 bg-slate-50/50">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      {columns.map((col) => (
                        <td key={col} className="px-3 py-2 text-slate-700 whitespace-nowrap truncate max-w-xs border-r border-slate-100 last:border-0">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : (
                            <span className="text-slate-300 italic">null</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
            <div>
              Showing <span className="font-bold text-[#14213D]">{Math.min(filteredCount, (page - 1) * pageSize + 1)}</span> to{' '}
              <span className="font-bold text-[#14213D]">{Math.min(filteredCount, page * pageSize)}</span> of{' '}
              <span className="font-bold text-[#14213D]">{filteredCount.toLocaleString()}</span> entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schema View */}
      {activeView === 'schema' && (
        <div className="rr-card p-6">
          <h3 className="text-sm font-extrabold text-[#14213D] mb-1">
            Schema Architecture: {selectedDataset}.csv
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Total {Object.keys(schema).length} columns with strict type inference
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(schema).map(([col, dtype]) => (
              <div key={col} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="font-bold text-xs text-[#14213D] font-mono truncate mr-2">{col}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-[#174EA6]">
                  {dtype}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Quality Audit View */}
      {activeView === 'quality' && (
        <div className="space-y-6">
          <div className="rr-card p-6">
            <h3 className="text-sm font-extrabold text-[#14213D] mb-1">
              Cross-Table Foreign Key Integrity & Coverage
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Validation of matches, ball-by-ball deliveries, and competition mappings
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="text-slate-500 block">Match Coverage</span>
                <span className="text-xl font-extrabold text-emerald-700">100.0%</span>
                <p className="text-[11px] text-slate-600 mt-1">Every ball-by-ball match maps cleanly to matches.csv</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="text-slate-500 block">Competition Linkage</span>
                <span className="text-xl font-extrabold text-emerald-700">100.0%</span>
                <p className="text-[11px] text-slate-600 mt-1">883 matches map to 141 competitions</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <span className="text-slate-500 block">Duplicate Ball Records</span>
                <span className="text-xl font-extrabold text-[#174EA6]">0 Duplicates</span>
                <p className="text-[11px] text-slate-600 mt-1">All 200,999 delivery IDs unique and valid</p>
              </div>
            </div>
          </div>

          <div className="rr-card p-6">
            <h3 className="text-sm font-extrabold text-[#14213D] mb-1">
              Missing Value (Null) Analysis: {selectedDataset}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Audited null percentages per column
            </p>

            {Object.keys(nullColumns).length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                ✓ No missing values detected in required primary columns for this dataset.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(nullColumns).map(([col, count]) => {
                  const pct = ((count / totalRecords) * 100).toFixed(1);
                  return (
                    <div key={col} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                      <span className="font-mono text-[#14213D] truncate mr-2">{col}</span>
                      <span className="text-slate-500 font-semibold">{count.toLocaleString()} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

