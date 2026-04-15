import { ASSET_META } from '../config.js';

const KAMINO_API_URL = "https://api.hubbleprotocol.io"; 
const cache = new Map();
const CACHE_TTL = 30_000;

function cached(key, fetcher) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.data);
  return fetcher().then((data) => {
    cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

export async function fetchLendingVaults() {
  return cached('lending-vaults', async () => {
    try {
      const res = await fetch(`${KAMINO_API_URL}/v2/reserves`);
      if (!res.ok) return getDemoMarketOverview();
      const data = await res.json();
      return normalizeReserves(data);
    } catch (e) {
      return getDemoMarketOverview();
    }
  });
}

export async function fetchUserObligations(walletAddress) {
  if (!walletAddress) return [];
  return cached(`obligations-${walletAddress}`, async () => {
    try {
      const res = await fetch(`${KAMINO_API_URL}/v2/users/${walletAddress}/obligations`);
      if (!res.ok) return [];
      const data = await res.json();
      return normalizeObligations(data);
    } catch (e) {
      return [];
    }
  });
}

function normalizeReserves(raw) {
  const list = Array.isArray(raw) ? raw : (raw?.reserves || []);
  return list.map((r) => ({
    symbol: r.symbol || 'SOL',
    supplyApy: (r.supplyInterestAPY || 0) * 100,
    name: r.symbol || 'Solana',
  }));
}

function normalizeObligations(raw) {
  const list = Array.isArray(raw) ? raw : (raw?.obligations || []);
  return list.map((o) => ({
    deposits: (o.deposits || []).map((d) => ({
      symbol: d.symbol,
      amount: parseFloat(d.amount || 0),
      value: parseFloat(d.marketValue || 0),
      apy: (d.supplyApy || 0) * 100,
    })),
  }));
}

export function runYieldComparison(userObligations, allReserves) {
  const results = [];
  userObligations.forEach((ob) => {
    ob.deposits.forEach((dep) => {
      results.push({
        symbol: dep.symbol,
        name: dep.symbol,
        amount: dep.amount,
        value: dep.value,
        currentApy: dep.apy,
        bestApy: dep.apy,
        apyGap: 0,
      });
    });
  });
  return results;
}

export function getDemoPositions() { return []; }
export function getDemoMarketOverview() { return []; }