import { KAMINO_API, YIELD_ALERT_THRESHOLD, ASSET_META } from '../config.js'

const cache = new Map()
const CACHE_TTL = 30_000 

function cached(key, fetcher) {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.data)
  return fetcher().then((data) => {
    cache.set(key, { data, ts: Date.now() })
    return data
  })
}

export async function fetchLendingVaults() {
  return cached('lending-vaults', async () => {
    try {
      const res = await fetch(KAMINO_API('v2/reserves'), {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`Kamino API Status: ${res.status}`)
      const data = await res.json()
      return normalizeReserves(data)
    } catch (e) {
      console.error('[Kamino Service] Vaults Fetch Error:', e)
      throw e // Пробрасываем ошибку, чтобы хук знал, что данных нет
    }
  })
}

export async function fetchUserObligations(walletAddress) {
  if (!walletAddress) return []
  return cached(`obligations-${walletAddress}`, async () => {
    try {
      const res = await fetch(KAMINO_API(`v2/users/${walletAddress}/obligations`), {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) {
        if (res.status === 404) return [] // Новый кошелек без позиций
        throw new Error(`Kamino API Status: ${res.status}`)
      }
      const data = await res.json()
      return normalizeObligations(data)
    } catch (e) {
      console.error('[Kamino Service] Obligations Fetch Error:', e)
      return [] // Возвращаем пусто, если позиций нет или ошибка
    }
  })
}

// ── Остальные функции оставляем без изменений ───────────────────────────────

function normalizeReserves(raw) {
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : raw.reserves || raw.data || []
  return list.map((r) => {
    const tokenSymbol = r.symbol || r.tokenSymbol || r.mint?.symbol || 'UNKNOWN'
    const supplyApy = parseFloat(r.supplyInterestAPY || r.supplyApy || r.apy || 0) * 100
    const meta = ASSET_META[tokenSymbol] || { symbol: tokenSymbol, name: tokenSymbol, color: '#7C3AED', icon: '?' }
    return {
      address: r.address || r.reserve || r.pubkey,
      marketAddress: r.lendingMarket || r.market,
      symbol: tokenSymbol,
      name: meta.name,
      color: meta.color,
      icon: meta.icon,
      supplyApy: isNaN(supplyApy) ? 0 : supplyApy,
      mintAddress: r.mint?.address || r.mintAddress || r.tokenMint,
    }
  })
}

function normalizeObligations(raw) {
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : raw.obligations || []
  return list.map((o) => ({
    address: o.address || o.pubkey,
    deposits: (o.deposits || []).map((d) => ({
      symbol: d.symbol || d.tokenSymbol,
      amount: parseFloat(d.amount || 0),
      value: parseFloat(d.marketValue || 0),
      apy: parseFloat(d.supplyApy || 0) * 100,
      reserveAddress: d.reserve,
    })),
    netValue: parseFloat(o.netValue || 0),
  }))
}

export function runYieldComparison(userObligations, allReserves) {
  const marketMap = {}
  allReserves.forEach((r) => {
    if (!marketMap[r.symbol]) marketMap[r.symbol] = []
    marketMap[r.symbol].push(r)
  })
  
  const results = []
  userObligations.forEach((obligation) => {
    obligation.deposits.forEach((deposit) => {
      const alternatives = marketMap[deposit.symbol] || []
      const bestAlternative = alternatives.sort((a, b) => b.supplyApy - a.supplyApy)[0]
      const currentApy = deposit.apy
      const bestApy = bestAlternative ? bestAlternative.supplyApy : currentApy
      const apyGap = bestApy - currentApy
      const meta = ASSET_META[deposit.symbol] || { color: '#7C3AED', icon: '?' }

      results.push({
        symbol: deposit.symbol,
        name: meta.name || deposit.symbol,
        color: meta.color,
        icon: meta.icon,
        amount: deposit.amount,
        value: deposit.value,
        currentApy,
        bestApy,
        apyGap,
        hasAlert: apyGap >= YIELD_ALERT_THRESHOLD,
      })
    })
  })
  return results
}

// Демо данные оставляем для тех случаев, когда кошелек НЕ подключен
export function getDemoPositions() {
  return [
    { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', icon: '$', amount: 12500, value: 12500, currentApy: 5.82, bestApy: 9.14, apyGap: 3.32, hasAlert: true },
  ]
}

export function getDemoMarketOverview() {
  return [
    { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', icon: '$', supplyApy: 9.14, totalSupply: 48200000 },
  ]
}