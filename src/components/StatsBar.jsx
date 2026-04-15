import { TrendingUp, DollarSign, Bell, Target } from 'lucide-react'

function Stat({ icon: Icon, label, value, subtext, highlight }) {
  return (
    <div className="glass-card p-4 flex items-start gap-4 flex-1 min-w-0">
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-brand-gold-glow border border-brand-gold/30' : 'bg-brand-purple-glow border border-brand-purple/30'}`}>
        <Icon size={18} className={highlight ? 'text-brand-gold' : 'text-brand-purple-light'} />
      </div>
      <div className="min-w-0">
        <p className="stat-label truncate">{label}</p>
        <p className={`text-xl font-bold font-mono mt-0.5 ${highlight ? 'text-brand-gold' : 'text-white'}`}>
          {value}
        </p>
        {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
      </div>
    </div>
  )
}

export default function StatsBar({ totalValueUSD, weightedApy, potentialExtraYield, alertCount }) {
  const fmt = (n) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(2)}M`
      : n >= 1_000
      ? `$${(n / 1_000).toFixed(1)}K`
      : `$${n.toFixed(2)}`

  const extraYieldUSD = (totalValueUSD * potentialExtraYield) / 100

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Stat
        icon={DollarSign}
        label="Total Deposited"
        value={fmt(totalValueUSD)}
        subtext="Across all Kamino positions"
      />
      <Stat
        icon={TrendingUp}
        label="Avg Supply APY"
        value={`${weightedApy.toFixed(2)}%`}
        subtext="Weighted by position size"
      />
      <Stat
        icon={Target}
        label="Potential Extra Yield"
        value={`+${potentialExtraYield.toFixed(2)}%`}
        subtext={`+${fmt(extraYieldUSD)}/yr if optimized`}
        highlight={potentialExtraYield >= 2}
      />
      <Stat
        icon={Bell}
        label="Active Alerts"
        value={alertCount}
        subtext={alertCount === 1 ? '1 position can be optimized' : `${alertCount} positions can be optimized`}
        highlight={alertCount > 0}
      />
    </div>
  )
}
