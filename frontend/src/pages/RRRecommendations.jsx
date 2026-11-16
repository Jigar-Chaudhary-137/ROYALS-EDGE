import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { fetchRecommendations } from '../api';
import PlayerImage from '../components/PlayerImage';

export default function RRRecommendations({ onSelectPlayer }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecs();
  }, []);

  const loadRecs = async () => {
    try {
      const data = await fetchRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14213D] via-[#1a2d52] to-[#E83E8C] p-8 text-white shadow-xl border border-slate-700/60">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-black mb-3 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>IPL 2027 AUCTION INTELLIGENCE BLUEPRINT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
            Rajasthan Royals Squad Optimization
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Data-backed player acquisition targets selected through the Match Pressure Index (MPI) to address Rajasthan Royals' core tactical requirements: death-overs boundary acceleration, middle-overs choke, and high-leverage defensive economy.
          </p>
        </div>
      </div>

      {/* Strategic Rationale & Compliance Callout */}
      <div className="rr-card p-5 bg-gradient-to-br from-pink-50/50 via-white to-blue-50/40 border-pink-200 shadow-2xs">
        <div className="flex items-start space-x-3.5">
          <Sparkles className="w-5 h-5 text-[#E83E8C] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-[#14213D] font-black block text-sm mb-1">
              Methodological Compliance & Responsible Scouting Framework
            </strong>
            These recommendations derive exclusively from verified historical pressure data (2022–2026). In accordance with competition guidelines, no speculative retention rumors, manufactured hammer prices, or unverified squad availability are assumed. All candidates are evaluated purely on statistical synergy, tactical role clarity, and Sawai Mansingh Stadium pitch dimensions.
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-5">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E83E8C] animate-ping" />
              <span className="text-sm font-semibold">Compiling Rajasthan Royals auction dossiers...</span>
            </div>
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="rr-card p-6 border-l-4 border-l-[#E83E8C] hover:border-l-[#174EA6] hover:shadow-lg transition-all duration-300"
            >
              {/* Header Row: Player Photo, Name, Team, Rating & Action */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-4 min-w-0">
                  <PlayerImage
                    playerId={rec.player_id}
                    playerName={rec.player_name}
                    team={rec.current_team}
                    size="lg"
                    rounded="rounded-2xl"
                    className="ring-2 ring-slate-100 shadow-sm flex-shrink-0"
                  />

                  <div className="min-w-0">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-[#E83E8C] uppercase tracking-wider">
                      {rec.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[#14213D] mt-1 truncate">
                      {rec.player_name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{rec.current_team}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Pressure Rating</span>
                    <span className="text-2xl font-black text-[#E83E8C]">{Number(rec.pressure_rating).toFixed(1)}</span>
                    <span className="text-xs text-slate-400 font-bold">/100</span>
                  </div>

                  <button
                    onClick={() => onSelectPlayer && onSelectPlayer(rec.player_id)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#14213D] hover:bg-[#1e293b] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <span>Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
                  </button>
                </div>
              </div>

              {/* Body Details: Role, Tactical Fit, and Analytical Evidence */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Target Squad Role */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Target Squad Role</span>
                    <strong className="text-[#14213D] text-xs leading-snug block">{rec.rr_squad_role}</strong>
                  </div>
                  <span className="text-[11px] text-[#174EA6] font-mono font-bold mt-2 block bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                    {rec.pressure_metric}
                  </span>
                </div>

                {/* Tactical Synergy & Pitch Fit */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 md:col-span-2">
                  <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Tactical Synergy & Sawai Mansingh Stadium Fit</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{rec.rr_tactical_value}</p>
                </div>
              </div>

              {/* Auction Verdict & Reality Caveat */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <span className="font-bold text-[#14213D]">Scouting Verdict:</span>
                  <span className="text-slate-700 font-semibold">{rec.auction_verdict}</span>
                </div>

                <div className="flex items-center space-x-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 self-start sm:self-auto">
                  <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span>Subject to franchise RTM / retention declarations</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
