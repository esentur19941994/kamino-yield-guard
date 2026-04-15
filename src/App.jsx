import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletContextProvider } from './context/WalletContext.jsx'
import Header from './components/Header.jsx'
import StatsBar from './components/StatsBar.jsx'
import YieldAlert from './components/YieldAlert.jsx'
import PositionCard from './components/PositionCard.jsx'
import MarketOverview from './components/MarketOverview.jsx'
import EmptyState from './components/EmptyState.jsx'
import { useKaminoData } from './hooks/useKaminoData.js'
import { RefreshCw, LayoutGrid, BarChart2 } from 'lucide-react'

function Dashboard() {
  const {
    positions,
    marketVaults,
    alerts,
    totalValueUSD,
    weightedApy,
    potentialExtraYield,
    loading,
    error,
    lastUpdated,
    isDemo,
    refresh,
  } = useKaminoData()

  const [activeTab, setActiveTab] = useState('positions')

  return (
    <div className="min-h-screen bg-dark-950" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(124,58,237,0.18), transparent)' }}>
      <Header onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Demo banner */}
        {isDemo && !loading && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-purple/25 bg-brand-purple-glow text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-brand-purple-light shrink-0" />
            <span>
              Showing <strong className="text-white">demo data</strong> — connect a wallet with active Kamino positions to see live yield comparisons.
            </span>
          </div>
        )}

        {/* Error notice (non-fatal) */}
        {error && !isDemo && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/10 text-sm text-red-400">
            <span>Data refresh failed: {error}</span>
            <button onClick={refresh} className="ml-auto flex items-center gap-1 text-xs font-semibold hover:text-white transition-colors">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Stats bar */}
        <StatsBar
          totalValueUSD={totalValueUSD}
          weightedApy={weightedApy}
          potentialExtraYield={potentialExtraYield}
          alertCount={alerts.length}
        />

        {/* Yield alerts */}
        {alerts.length > 0 && <YieldAlert alerts={alerts} />}

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-secondary border border-surface-border w-fit">
          <button
            onClick={() => setActiveTab('positions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'positions'
                ? 'bg-brand-purple text-white shadow-glow-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={14} />
            My Positions
            {positions.length > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === 'positions' ? 'bg-white/20' : 'bg-surface-border text-gray-400'}`}>
                {positions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'markets'
                ? 'bg-brand-purple text-white shadow-glow-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart2 size={14} />
            Market Overview
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-surface-secondary" />
                    <div className="h-3 w-48 rounded bg-surface-secondary" />
                  </div>
                  <div className="w-20 h-8 rounded bg-surface-secondary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Positions tab */}
        {!loading && activeTab === 'positions' && (
          <>
            {positions.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {positions.map((pos, i) => (
                  <PositionCard key={pos.symbol + i} position={pos} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Markets tab */}
        {!loading && activeTab === 'markets' && (
          <MarketOverview vaults={marketVaults} />
        )}

        {/* Footer */}
        <footer className="pt-4 pb-8 text-center text-xs text-gray-600 space-y-1">
          <p>Kamino Yield Guard — data fetched live from Kamino Finance API</p>
          <p>Not financial advice. Always verify APYs on <a href="https://app.kamino.finance" target="_blank" rel="noopener noreferrer" className="text-brand-purple-light hover:underline">app.kamino.finance</a> before migrating positions.</p>
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <WalletContextProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </WalletContextProvider>
  )
}
