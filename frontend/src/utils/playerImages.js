/**
 * Centralized Player Image and Brand Asset Management System
 * Provides authentic, verified player photography with high-fidelity team-themed fallbacks.
 */

export const VERIFIED_PLAYER_PHOTOS = {
  // Batters Top 10
  4708: '/players/4708.png',   // Rinku Singh (Official IPL HD)
  1077: '/players/1077.png',   // David Miller (Verified High-Res)
  8: '/players/8.png',         // MS Dhoni (Official IPL HD)
  152: '/players/152.png',     // Ravindra Jadeja (Official IPL HD)
  4722: '/players/4722.png',   // Rashid Khan (Official IPL HD)
  7897: '/players/7897.png',   // Tilak Varma (Verified High-Res)
  
  // Bowlers Top 10
  2933: '/players/2933.png',   // Jasprit Bumrah (Official IPL HD)
  4373: '/players/4373.jpg',   // Mustafizur Rahman (Verified High-Res)
  6256: '/players/6256.png',   // Varun Chakravarthy (Official IPL HD)
  1612: '/players/1612.jpg',   // Yuzvendra Chahal (Verified High-Res)
  3644: '/players/3644.jpg',   // Kuldeep Yadav (Verified High-Res)
  
  // Key Cohort & RR Players
  830: '/players/830.jpg',     // Josh Hazlewood
  3605: '/players/3605.png',   // Aiden Markram
};

export const FRANCHISE_BRAND_COLORS = {
  'Rajasthan Royals': { primary: '#E83E8C', secondary: '#14213D', text: '#FFFFFF', tag: 'RR' },
  'Kolkata Knight Riders': { primary: '#3A225D', secondary: '#D4AF37', text: '#FFFFFF', tag: 'KKR' },
  'Mumbai Indians': { primary: '#004BA0', secondary: '#D1AB3E', text: '#FFFFFF', tag: 'MI' },
  'Chennai Super Kings': { primary: '#F9CD05', secondary: '#124380', text: '#14213D', tag: 'CSK' },
  'Gujarat Titans': { primary: '#1B2133', secondary: '#B38F4E', text: '#FFFFFF', tag: 'GT' },
  'Royal Challengers Bengaluru': { primary: '#14213D', secondary: '#EC1C24', text: '#FFFFFF', tag: 'RCB' },
  'Delhi Capitals': { primary: '#004C93', secondary: '#EF1B23', text: '#FFFFFF', tag: 'DC' },
  'Punjab Kings': { primary: '#ED1B24', secondary: '#C49537', text: '#FFFFFF', tag: 'PBKS' },
  'India': { primary: '#0066CC', secondary: '#FF9933', text: '#FFFFFF', tag: 'IND' },
  'Australia': { primary: '#00843D', secondary: '#FFCD00', text: '#FFFFFF', tag: 'AUS' },
  'South Africa': { primary: '#007749', secondary: '#FFB81C', text: '#FFFFFF', tag: 'SA' },
  'West Indies': { primary: '#7B0046', secondary: '#FFC400', text: '#FFFFFF', tag: 'WI' },
  'Afghanistan': { primary: '#1B2133', secondary: '#D32011', text: '#FFFFFF', tag: 'AFG' },
  'Bangladesh': { primary: '#006A4E', secondary: '#F42A41', text: '#FFFFFF', tag: 'BAN' },
  'Pakistan': { primary: '#006600', secondary: '#009933', text: '#FFFFFF', tag: 'PAK' },
  'Sri Lanka': { primary: '#003893', secondary: '#FFB612', text: '#FFFFFF', tag: 'SL' },
  'Default': { primary: '#14213D', secondary: '#E83E8C', text: '#FFFFFF', tag: 'T20' }
};

export function getPlayerPhoto(playerId) {
  if (!playerId) return null;
  const numId = typeof playerId === 'string' ? parseInt(playerId, 10) : playerId;
  return VERIFIED_PLAYER_PHOTOS[numId] || null;
}

export function getTeamColors(teamString) {
  if (!teamString) return FRANCHISE_BRAND_COLORS['Default'];
  for (const [key, colors] of Object.entries(FRANCHISE_BRAND_COLORS)) {
    if (teamString.includes(key)) {
      return colors;
    }
  }
  return FRANCHISE_BRAND_COLORS['Default'];
}

export function getPlayerInitials(name) {
  if (!name) return 'CR';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
