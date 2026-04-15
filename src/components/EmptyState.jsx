import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { Zap, ArrowRight, ExternalLink } from 'lucide-react'

export default function EmptyState() {
  const { setVisible } = useWalletModal()
  const { connected } = useWallet()

  return (
    <div className="glass-card p-8 sm:p-12 text-center flex flex-col items-center gap-6">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
        style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(109,40,217,0.1))', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 0 40px rgba(124,58,237,0.15)' }}
      >
        <Zap size={36} className="text-brand-purple-light" fill="rgba(124,58,237,0.3)" />
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          {connected ? 'No Kamino Positions Found' : 'Connect Your Wallet'}
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {connected
            ? "We couldn't find any active Kamino lending positions for this wallet. Deposit assets on Kamino to start earning yield."
            : 'Connect your Solflare wallet to see your Kamino lending positions and get personalised yield optimization alerts.'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {!connected ? (
          <button onClick={() => setVisible(true)} className="btn-primary">
            <Zap size={16} />
            Connect Solflare
          </button>
        ) : null}
        <a
          href="https://app.kamino.finance/lending"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-surface-border text-sm font-semibold text-gray-300 hover:text-white hover:border-brand-purple/40 transition-all"
        >
          Go to Kamino
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Demo note */}
      <p className="text-xs text-gray-600 max-w-sm">
        The dashboard is showing demo data below. Connect a wallet with active Kamino positions to see real-time yield comparisons.
      </p>
    </div>
  )
}
