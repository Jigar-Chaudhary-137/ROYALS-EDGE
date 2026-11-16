import React, { useState } from 'react';
import { getPlayerPhoto, getTeamColors, getPlayerInitials } from '../utils/playerImages';
import { User } from 'lucide-react';

const SIZE_MAP = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-xl',
  '2xl': 'w-32 h-32 text-2xl',
  hero: 'w-48 h-48 sm:w-56 sm:h-56 text-4xl'
};

const BADGE_COLOR_MAP = {
  pink: 'bg-[#E83E8C] text-white border-white',
  gold: 'bg-amber-500 text-white border-white',
  blue: 'bg-[#174EA6] text-white border-white',
  navy: 'bg-[#14213D] text-white border-white',
  emerald: 'bg-emerald-600 text-white border-white'
};

export default function PlayerImage({
  playerId,
  playerName = 'Player',
  team = '',
  size = 'md',
  className = '',
  showBadge = false,
  badgeText = '',
  badgeColor = 'pink',
  rounded = 'rounded-xl',
  fallbackText = ''
}) {
  const photoUrl = getPlayerPhoto(playerId);
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const teamColors = getTeamColors(team);
  const initials = getPlayerInitials(playerName);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  const hasPhoto = Boolean(photoUrl) && !imgError;

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${sizeClasses} ${rounded} overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100 ${className}`}>
      {hasPhoto ? (
        <>
          {/* Loading Skeleton */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
              <span className="font-extrabold text-slate-400 opacity-60">{initials}</span>
            </div>
          )}
          <img
            src={photoUrl}
            alt={playerName}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : (
        /* Verified Silhouette & Franchise Avatar */
        <div
          className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)`
          }}
        >
          {/* Subtle cricket jersey collar motif */}
          <div className="absolute top-0 w-3/5 h-2 bg-white/20 rounded-b-md" />
          
          {/* Player Initials */}
          <span
            className="font-extrabold tracking-tight drop-shadow-sm z-10"
            style={{ color: teamColors.text || '#FFFFFF' }}
          >
            {initials}
          </span>

          {/* Franchise tag badge for larger avatars */}
          {['lg', 'xl', '2xl', 'hero'].includes(size) && teamColors.tag && (
            <span className="absolute bottom-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-black/30 text-white/90 backdrop-blur-xs">
              {teamColors.tag}
            </span>
          )}
        </div>
      )}

      {/* Optional Ranking / Rating Badge Overlay */}
      {showBadge && badgeText && (
        <span
          className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-black border-2 shadow-sm leading-none z-20 ${
            BADGE_COLOR_MAP[badgeColor] || BADGE_COLOR_MAP.pink
          }`}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
}
