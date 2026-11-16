import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, User, Award, Shield } from 'lucide-react';
import { searchPlayers } from '../api';
import PlayerImage from './PlayerImage';

export default function GlobalSearch({ onSelectPlayer }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchPlayers(query);
        setResults(data.results || []);
      } catch (err) {
        console.error('Player search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (playerId) => {
    onSelectPlayer(playerId);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search 1,200+ players..."
          className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-800 placeholder-slate-400 border border-transparent focus:border-[#E83E8C]/50 focus:outline-none focus:ring-2 focus:ring-[#E83E8C]/20 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-150">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>Search Results</span>
            {isLoading && <span className="text-[#E83E8C] animate-pulse">Searching...</span>}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {results.length > 0 ? (
              results.map((p) => {
                const isBatter = p.primary_role === 'Batter';
                return (
                  <button
                    key={`${p.player_id}-${p.primary_role}`}
                    onClick={() => handleSelect(p.player_id)}
                    className="w-full text-left px-3 py-2.5 flex items-center space-x-3 hover:bg-pink-50/50 transition-colors group"
                  >
                    <PlayerImage
                      playerId={p.player_id}
                      playerName={p.player_name}
                      team={p.team}
                      size="sm"
                      rounded="rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#E83E8C] truncate">
                          {p.player_name}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-flex items-center space-x-0.5 ${
                          isBatter ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isBatter ? <Award className="w-2.5 h-2.5 mr-0.5" /> : <Shield className="w-2.5 h-2.5 mr-0.5" />}
                          <span>{p.primary_role}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.team}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-black text-[#14213D]">
                        {p.final_rating.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Rank #{p.rank}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#E83E8C] transition-colors" />
                  </button>
                );
              })
            ) : !isLoading ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                No matching players found for "{query}".
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
