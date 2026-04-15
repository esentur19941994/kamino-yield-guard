import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

function SingleAlert({ alert, onDismiss }) {
  const extraYearlyUSD = Math.round((alert.apyGap / 100) * alert.value)
  const bestMarket =
    alert.alternatives && alert.alternatives[0]
      ? alert.alternatives[0].marketAddress
      : 'Kamino Market'

  return (
    <div className="alert-banner rounded-2xl p-4 sm:p-5 flex items-start gap-4">
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.35)' }}
      >
        <AlertTriangle size={18} className="text-brand-gold" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">
                {'Better ' + alert.symbol + ' yield available'}
              </span>
              <span className="badge-gold">{'+' + alert.apyGap.toFixed(2) + '% APY'}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {'Current: '}
              <span className="font-mono text-white font-semibold">{alert.currentApy.toFixed(2) + '%'}</span>
              {' — Best: '}
              <span className="font-mono text-brand-gold font-bold">{alert.bestApy.toFixed(2) + '%'}</span>
              {' — extra '}
              <span className="text-emerald-400 font-semibold">{'$' + extraYearlyUSD.toLocaleString() + '/yr'}</span>
              {' on your '}
              <span className="font-mono text-white">{'$' + (alert.value || 0).toLocaleString()}</span>
              {' position.'}
            </p>
          </div>
          <button
            onClick={() => onDismiss(alert.symbol)}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <a
            href="https://app.kamino.finance/lending"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5"
          >
            Migrate on Kamino
            <ArrowRight size={13} />
          </a>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            {'Best: ' + bestMarket}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function YieldAlert({ alerts }) {
  const [dismissed, setDismissed] = useState(new Set())

  const visible = alerts.filter((a) => !dismissed.has(a.symbol))

  if (visible.length === 0) return null

  const handleDismiss = (symbol) => {
    setDismissed((prev) => new Set([...prev, symbol]))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle size={15} className="text-brand-gold" />
        <h2 className="text-sm font-semibold text-brand-gold tracking-wide">
          YIELD OPPORTUNITIES DETECTED
        </h2>
        <span className="badge-gold">{visible.length}</span>
      </div>

      {visible.map((alert) => (
        <SingleAlert key={alert.symbol} alert={alert} onDismiss={handleDismiss} />
      ))}
    </div>
  )
}
