import React from 'react';
import {
  LayoutDashboard,
  Database,
  Flame,
  Award,
  Shield,
  UserCheck,
  Scale,
  Target,
  BookOpen,
  DownloadCloud,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', fullLabel: 'Overview Dashboard', icon: LayoutDashboard },
  { id: 'explorer', label: 'Data Explorer', fullLabel: 'Dataset Explorer', icon: Database },
  { id: 'pressure', label: 'Pressure Engine', fullLabel: 'Match Pressure Engine (MPI)', icon: Flame },
  { id: 'batters', label: 'Batters', fullLabel: 'Top 10 Batters', icon: Award },
  { id: 'bowlers', label: 'Bowlers', fullLabel: 'Top 10 Bowlers', icon: Shield },
  { id: 'profiles', label: 'Player Profiles', fullLabel: 'Individual Player 360°', icon: UserCheck },
  { id: 'comparison', label: 'Player Comparison', fullLabel: 'Head-to-Head Comparison', icon: Scale },
  { id: 'recommendations', label: 'RR Auction Strategy', fullLabel: 'RR Squad Strategy 2027', icon: Target },
  { id: 'methodology', label: 'Methodology', fullLabel: 'Methodology & Science', icon: BookOpen },
  { id: 'exports', label: 'Export Centre', fullLabel: 'Deliverables & Exports', icon: DownloadCloud },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  collapsed = false,
  onToggleCollapse
}) {
  return (
    <aside
      className={`bg-[#14213D] text-white flex-shrink-0 flex flex-col transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`py-4 border-b border-slate-800/80 flex items-center ${
        collapsed ? 'px-3 justify-center' : 'px-5 justify-between'
      }`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E83E8C] to-[#174EA6] flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm">
            RR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-black tracking-tight text-white truncate">
                ROYAL SCOUT
              </h1>
              <p className="text-[10px] font-semibold text-pink-400/90 tracking-wider uppercase truncate">
                Rajasthan Royals Analytics
              </p>
            </div>
          )}
        </div>

        {!collapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.fullLabel : undefined}
              className={`w-full flex items-center rounded-xl text-xs transition-all group relative ${
                collapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-[#E83E8C] to-[#174EA6] text-white font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-pink-300'
                }`}
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Active Indicator bar */}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status Box */}
      {!collapsed ? (
        <div className="p-3 mx-3 mb-4 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-pink-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IPL 2027 AUCTION INTEL</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Vectorized Match Pressure Index (MPI) with Empirical Bayes prior shrinkage.
          </p>
        </div>
      ) : (
        <div className="p-2 mb-3 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
