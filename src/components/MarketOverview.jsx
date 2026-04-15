import { useState } from 'react'
import { Search, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { ASSET_META } from '../config.js'

function UtilizationBar({ value }) {
  const color = value > 85 ? '#EF4444' : value > 70 ? '#F59E0B' : '#10B981'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-surface-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: Math.min(value, 100) + '%', background: color }}
        />
      </div>
      <span className="text-xs font-mono text-gray-400 w-10 text-right shrink-0">{value.toFixed(1) + '%'}</span>
    </div>
  )
}

export default function MarketOverview({ vaults }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('supplyApy')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  const filtered = (vaults || [])
    .filter((v) => {
      const q = search.toLowerCase()
      return (
        (v.symbol || '').toLowerCase().includes(q) ||
        (v.name || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const av = a[sortBy] || 0
      const bv = b[sortBy] || 0
      return sortDir === 'desc' ? bv - av : av - bv
    })

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="text-gray-600 text-xs">↕</span>
    return sortDir === 'desc'
      ? <TrendingDown size={12} className="text-brand-purple-light" />
      : <TrendingUp size={12} className="text-brand-purple-light" />
  }

  const fmtSupply = (n) => {
    if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B'
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return n.toFixed(2)
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-bold text-white">Market Overview</h2>
          <p className="text-xs text-gray-500 mt-0.5">All Kamino lending markets — live APY data</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-surface-secondary border border-surface-border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple/50 w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left px-4 sm:px-5 py-3 text-gray-500 font-medium text-xs tracking-wide">Asset</th>
              <th
                className="text-right px-3 py-3 text-gray-500 font-medium text-xs tracking-wide cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap"
                onClick={() => handleSort('supplyApy')}
              >
                <span className="flex items-center gap-1 justify-end">
                  Supply APY <SortIcon col="supplyApy" />
                </span>
              </th>
              <th
                className="text-right px-3 py-3 text-gray-500 font-medium text-xs tracking-wide cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap hidden sm:table-cell"
                onClick={() => handleSort('borrowApy')}
              >
                <span className="flex items-center gap-1 justify-end">
                  Borrow APY <SortIcon col="borrowApy" />
                </span>
              </th>
              <th
                className="text-right px-3 py-3 text-gray-500 font-medium text-xs tracking-wide cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap hidden md:table-cell"
                onClick={() => handleSort('totalSupply')}
              >
                <span className="flex items-center gap-1 justify-end">
                  Total Supply <SortIcon col="totalSupply" />
                </span>
              </th>
              <th className="text-right px-3 sm:px-5 py-3 text-gray-500 font-medium text-xs tracking-wide hidden lg:table-cell whitespace-nowrap">
                Utilization
              </th>
              <th className="text-right px-3 sm:px-5 py-3 text-gray-500 font-medium text-xs tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vault, i) => {
              const meta = ASSET_META[vault.symbol] || { color: '#7C3AED', icon: '?' }
              const apy = vault.supplyApy || 0
              return (
                <tr
                  key={vault.address || vault.symbol + i}
                  className="border-b border-surface-border/50 hover:bg-surface-secondary/50 transition-colors"
                >
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: (meta.color || vault.color || '#7C3AED') + '22', color: meta.color || vault.color }}
                      >
                        {meta.icon || vault.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{vault.symbol}</div>
                        <div className="text-xs text-gray-500">{vault.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <span
                      className="font-mono font-bold text-sm"
                      style={{ color: apy >= 10 ? '#10B981' : apy >= 5 ? '#F59E0B' : '#9CA3AF' }}
                    >
                      {apy.toFixed(2) + '%'}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right hidden sm:table-cell">
                    <span className="font-mono text-sm text-red-400">
                      {(vault.borrowApy || 0).toFixed(2) + '%'}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right hidden md:table-cell">
                    <span className="font-mono text-sm text-gray-300">
                      {fmtSupply(vault.totalSupply)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-5 py-3.5 hidden lg:table-cell">
                    <UtilizationBar value={vault.utilizationRate || 0} />
                  </td>
                  <td className="px-3 sm:px-5 py-3.5 text-right">
                    <a
                      href="https://app.kamino.finance/lending"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-purple-light hover:text-white transition-colors"
                    >
                      Lend
                      <ExternalLink size={11} />
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">
            No assets match your search.
          </div>
        )}
      </div>
    </div>
  )
}
