import { useState } from 'react'
import { ChevronDown, TrendingUp, AlertTriangle, ExternalLink, Check } from 'lucide-react'

function ApyBar({ label, value, max, color, current }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-gray-500 truncate shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-surface-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: pct + '%', background: color || '#7C3AED' }}
        />
      </div>
      <span className={`w-14 text-right font-mono font-semibold ${current ? 'text-white' : 'text-gray-400'}`}>
        {value.toFixed(2) + '%'}
      </span>
      {current && <Check size={11} className="text-emerald-400 shrink-0" />}
    </div>
  )
}

export default function PositionCard({ position }) {
  const [expanded, setExpanded] = useState(false)

  const { symbol, name, color, icon, amount, value, currentApy, bestApy, apyGap, hasAlert, alternatives } = position
  const maxApy = alternatives ? Math.max(...alternatives.map((a) => a.supplyApy), currentApy) : bestApy
  const extraYearlyUSD = Math.round((apyGap / 100) * (value || 0))

  const fmtAmount = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
    if (n >= 1_000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    return n.toFixed(4)
  }

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 ${hasAlert ? 'border-brand-gold/25' : 'border-surface-border'}`}
      style={hasAlert ? { boxShadow: '0 0 20px rgba(245,158,11,0.08)' } : {}}>
      {/* Header row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Token icon */}
          <div
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold border"
            style={{ background: color + '22', borderColor: color + '44', color }}
          >
            {icon}
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white">{symbol}</span>
              <span className="text-xs text-gray-500">{name}</span>
              {hasAlert && (
                <span className="badge-gold flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Opportunity
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400 font-mono">
                {fmtAmount(amount)} {symbol}
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-sm text-gray-400 font-mono">${(value || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* APY display */}
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-xs text-gray-500">Current APY</span>
            </div>
            <div className="font-mono text-xl font-bold mt-0.5" style={{ color: hasAlert ? '#F59E0B' : '#10B981' }}>
              {currentApy.toFixed(2) + '%'}
            </div>
            {hasAlert && (
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <TrendingUp size={11} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 font-mono font-semibold">
                  {'+' + apyGap.toFixed(2) + '% available'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick summary bar */}
        {hasAlert && (
          <div className="mt-4 p-3 rounded-xl border border-brand-gold/20 bg-brand-gold-glow">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-gray-400">
                {'Switch to earn '}
                <span className="font-mono font-bold text-brand-gold">{bestApy.toFixed(2) + '%'}</span>
                {' and gain '}
                <span className="text-emerald-400 font-semibold">{'$' + extraYearlyUSD.toLocaleString() + '/yr'}</span>
              </div>
              <a
                href="https://app.kamino.finance/lending"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-brand-gold hover:text-yellow-300 transition-colors"
              >
                View on Kamino
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

        {/* Toggle expanded */}
        {alternatives && alternatives.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ChevronDown size={14} className={'transition-transform ' + (expanded ? 'rotate-180' : '')} />
            {expanded ? 'Hide market comparison' : 'Compare all markets (' + alternatives.length + ')'}
          </button>
        )}
      </div>

      {/* Expanded comparison panel */}
      {expanded && alternatives && (
        <div className="border-t border-surface-border px-4 sm:px-5 py-4"
          style={{ background: 'rgba(10,10,20,0.5)' }}>
          <p className="text-xs text-gray-500 font-medium mb-3 tracking-wide uppercase">APY Comparison Across Markets</p>
          <div className="space-y-2.5">
            {alternatives.map((alt, i) => (
              <ApyBar
                key={i}
                label={alt.marketAddress || ('Market ' + (i + 1))}
                value={alt.supplyApy}
                max={maxApy}
                color={i === 0 ? '#10B981' : color}
                current={Math.abs(alt.supplyApy - currentApy) < 0.01}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
