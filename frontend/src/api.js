/**
 * Royal Scout API Client
 * Interacts with the backend analytical engine
 */

const BASE_URL = '/api';

export async function fetchStatus() {
  const res = await fetch(`${BASE_URL}/status`);
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}

export async function runAnalysis() {
  const res = await fetch(`${BASE_URL}/run-analysis`, { method: 'POST' });
  if (!res.ok) throw new Error('Analysis run failed');
  return res.json();
}

export async function uploadZip(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/upload-zip`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('ZIP upload failed');
  return res.json();
}

export async function uploadIndividualFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/upload-file`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('File upload failed');
  return res.json();
}

export async function fetchOverview() {
  const res = await fetch(`${BASE_URL}/overview`);
  if (!res.ok) throw new Error('Failed to fetch overview metrics');
  return res.json();
}

export async function fetchDataExplorer(dataset, page = 1, pageSize = 25, search = '') {
  const params = new URLSearchParams({
    dataset,
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  if (search) params.append('search', search);
  const res = await fetch(`${BASE_URL}/data-explorer?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch data explorer records');
  return res.json();
}

export async function fetchPressureAnalysis() {
  const res = await fetch(`${BASE_URL}/pressure-analysis`);
  if (!res.ok) throw new Error('Failed to fetch pressure analysis');
  return res.json();
}

export async function fetchBatters(search = '', sortBy = 'final_rating', ascending = false, minBalls = 45) {
  const params = new URLSearchParams({
    sort_by: sortBy,
    ascending: ascending.toString(),
    min_balls: minBalls.toString(),
  });
  if (search) params.append('search', search);
  const res = await fetch(`${BASE_URL}/batters?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch batters rankings');
  return res.json();
}

export async function fetchBowlers(search = '', sortBy = 'final_rating', ascending = false, minBalls = 60) {
  const params = new URLSearchParams({
    sort_by: sortBy,
    ascending: ascending.toString(),
    min_balls: minBalls.toString(),
  });
  if (search) params.append('search', search);
  const res = await fetch(`${BASE_URL}/bowlers?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch bowlers rankings');
  return res.json();
}

export async function fetchPlayerProfile(playerId) {
  const res = await fetch(`${BASE_URL}/player/${playerId}`);
  if (!res.ok) throw new Error('Failed to fetch player profile');
  return res.json();
}

export async function comparePlayers(playerIds, role = 'batter') {
  const res = await fetch(`${BASE_URL}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player_ids: playerIds, role }),
  });
  if (!res.ok) throw new Error('Failed to compare players');
  return res.json();
}

export async function fetchRecommendations() {
  const res = await fetch(`${BASE_URL}/rr-recommendations`);
  if (!res.ok) throw new Error('Failed to fetch RR recommendations');
  return res.json();
}

export async function searchPlayers(query) {
  if (!query || query.trim().length === 0) return { results: [] };
  const res = await fetch(`${BASE_URL}/search-players?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search players');
  return res.json();
}

