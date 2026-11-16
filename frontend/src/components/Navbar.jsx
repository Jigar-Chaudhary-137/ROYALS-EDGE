import React from 'react';
import {
  UploadCloud,
  Download,
  RefreshCw,
  Menu,
  ChevronRight,
  Database,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import GlobalSearch from './GlobalSearch';

const PAGE_NAMES = {
  overview: 'Overview Dashboard',
  explorer: 'Data Explorer',
  pressure: 'Match Pressure Engine (MPI)',
  batters: 'Batting Under Pressure',
  bowlers: 'Bowling Under Pressure',
  profiles: 'Player 360° Profiles',
  comparison: 'Head-to-Head Comparison',
  recommendations: 'RR Auction Strategy',
  methodology: 'Scientific Methodology',
  exports: 'Export Centre'
};

export default function Navbar({
  status,
  activeTab,
  onOpenUpload,
  onRunAnalysis,
  isAnalyzing,
  onNavigate,
  onSelectPlayer,
  onToggleSidebar,
  sidebarCollapsed
}) {
  const isReady = status?.is_analyzed;
  const summary = status?.summary;
  const pageTitle = PAGE_NAMES[activeTab] || 'Dashboard';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Left: Mobile Toggle + Brand & Breadcrumb */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name */}
            <div
              onClick={() => onNavigate('overview')}
              className="flex items-center space-x-2.5 cursor-pointer group select-none flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E83E8C] via-[#c42e72] to-[#14213D] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                RR
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-[#14213D] text-base tracking-tight">ROYAL SCOUT</span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-pink-50 text-[#E83E8C] border border-pink-200/60 uppercase tracking-widest">
                    IPL 2027
                  </span>
                </div>
              </div>
            </div>

            {/* Breadcrumb Indicator */}
            <div className="hidden md:flex items-center space-x-2 text-xs pl-3 border-l border-slate-200 text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={() => onNavigate('overview')}>Platform</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-[#14213D]">{pageTitle}</span>
            </div>
          </div>

          {/* Center: Global Player Search */}
          <div className="flex-1 max-w-sm sm:max-w-md mx-2">
            <GlobalSearch onSelectPlayer={onSelectPlayer} />
          </div>

          {/* Right: Data Status Badge + Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Status Pill */}
            {summary && (
              <div className="hidden xl:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>200,999 Balls Verified</span>
              </div>
            )}

            {/* Upload Data Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* Run Analysis Action */}
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-white shadow-sm transition-all ${
                isAnalyzing
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#E83E8C] hover:bg-[#d4327a] active:scale-[0.98]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'Recalculate'}</span>
            </button>

            {/* Export Centre Button */}
            <button
              onClick={() => onNavigate('exports')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#14213D] text-white hover:bg-[#1e293b] shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline">Exports</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
