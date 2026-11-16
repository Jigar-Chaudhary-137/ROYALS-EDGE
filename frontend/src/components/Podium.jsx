import React from 'react';
import { Award, Zap, TrendingUp, ShieldCheck, Crown } from 'lucide-react';
import PlayerImage from './PlayerImage';

export default function Podium({ items = [], type = 'batter', onSelectPlayer }) {
  if (!items || items.length < 3) return null;

  // Podium arrangement: Rank 2 (left), Rank 1 (center, prominent), Rank 3 (right)
  const [first, second, third] = items;
  const podiumList = [
    {
      player: second,
      rank: 2,
      medal: 'Silver',
      cardStyle: 'border-slate-300 bg-gradient-to-b from-slate-50 to-white hover:border-slate-400',
      badgeBg: 'bg-slate-200 text-slate-800',
      badgeColor: 'navy',
      imgSize: 'lg',
      height: 'min-h-[300px]'
    },
    {
      player: first,
      rank: 1,
      medal: 'Gold',
      cardStyle: 'border-amber-400/80 bg-gradient-to-b from-amber-50/60 via-white to-pink-50/20 hover:border-amber-500 shadow-md',
      badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black',
      badgeColor: 'pink',
      imgSize: 'xl',
      height: 'min-h-[340px] z-10'
    },
    {
      player: third,
      rank: 3,
      medal: 'Bronze',
      cardStyle: 'border-amber-600/40 bg-gradient-to-b from-orange-50/40 to-white hover:border-amber-600',
      badgeBg: 'bg-amber-700/20 text-amber-900',
      badgeColor: 'blue',
      imgSize: 'lg',
      height: 'min-h-[290px]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-3 pb-2">
      {podiumList.map(({ player, rank, cardStyle, badgeBg, badgeColor, imgSize, height }) => {
        if (!player) return null;
        const name = type === 'batter' ? player.striker_name : player.bowler_name;
        const pid = type === 'batter' ? player.striker_id : player.bowler_id;
        const rating = Number(player.final_rating).toFixed(1);

        const isBatter = type === 'batter';
        const primaryMetric = isBatter
          ? `${Number(player.p_sr).toFixed(1)} SR`
          : `${Number(player.p_econ).toFixed(2)} Econ`;

        const secondaryMetric = isBatter
          ? `${Number(player.p_avg).toFixed(1)} Avg • ${player.p_runs} Runs`
          : `${player.p_wickets} Wkts • ${player.p_overs} Overs`;

        const deltaMetric = isBatter
          ? `SR Delta: ${player.sr_improvement > 0 ? '+' : ''}${Number(player.sr_improvement).toFixed(1)}`
          : `Econ Diff: ${player.econ_improvement > 0 ? '+' : ''}${Number(player.econ_improvement).toFixed(2)} RPO`;

        return (
          <div
            key={rank}
            onClick={() => onSelectPlayer && onSelectPlayer(pid)}
            className={`cursor-pointer rounded-2xl p-5 flex flex-col justify-between border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl relative overflow-hidden group ${cardStyle} ${height}`}
          >
            {/* Top row: Rank Pill + Crown for Rank 1 */}
            <div className="flex justify-between items-center w-full mb-3">
              <div className="flex items-center space-x-1.5">
                {rank === 1 && <Crown className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />}
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-2xs ${badgeBg}`}>
                  Rank #{rank}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {player.reliability_tier ? player.reliability_tier.split(' ')[0] : 'Qualified'}
              </span>
            </div>

            {/* Center: Player Portrait & Name */}
            <div className="flex flex-col items-center text-center my-2">
              <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                <PlayerImage
                  playerId={pid}
                  playerName={name}
                  team={player.team}
                  size={imgSize}
                  rounded="rounded-2xl"
                  showBadge={true}
                  badgeText={`#${rank}`}
                  badgeColor={badgeColor}
                  className="ring-4 ring-white shadow-md"
                />
              </div>

              <h4 className="text-sm sm:text-base font-black text-[#14213D] leading-tight group-hover:text-[#E83E8C] transition-colors line-clamp-1">
                {name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-full mt-0.5">
                {player.team || 'Franchise'}
              </p>

              {/* Rating Highlight Gauge */}
              <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white shadow-2xs border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Rating</span>
                <span className="text-base font-black text-[#E83E8C]">{rating}</span>
                <span className="text-[10px] text-slate-400 font-bold">/100</span>
              </div>
            </div>

            {/* Bottom Key Metrics Panel */}
            <div className="bg-white/95 backdrop-blur-xs rounded-xl p-2.5 border border-slate-200/70 shadow-2xs mt-3">
              <div className="flex justify-between items-center text-xs font-black text-[#14213D]">
                <span>{primaryMetric}</span>
                <span className="text-[11px] font-bold text-[#174EA6]">{secondaryMetric}</span>
              </div>
              <div className="text-[10px] font-semibold text-emerald-600 mt-1 flex items-center justify-between">
                <span>{deltaMetric}</span>
                <span className="text-slate-400 text-[9px] font-medium">MPI ≥ 70</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
