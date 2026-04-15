import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Zap, ChevronDown, Copy, LogOut, ExternalLink, RefreshCw } from 'lucide-react'
import { useState } from 'react'

function truncate(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`
}

export default function Header({ onRefresh, loading, lastUpdated }) {
  const { publicKey, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey.toBase58())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDisconnect = () => {
    disconnect()
    setDropdownOpen(false)
  }

  const timeAgo = lastUpdated
    ? Math.round((Date.now() - lastUpdated.getTime()) / 1000) + 's ago'
    : null

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border"
      style={{ background: 'rgba(5,5,11,0.92)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-gold border border-dark-950"
                style={{ boxShadow: '0 0 6px rgba(245,158,11,0.8)' }} />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">Kamino</span>
              <span className="font-bold text-sm tracking-tight" style={{ color: '#8B5CF6' }}> Yield Guard</span>
            </div>
          </div>

          {/* Center — live indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-border bg-surface-secondary">
              <span className="pulse-dot" />
              <span className="text-xs text-gray-400 font-medium">Live — Mainnet</span>
            </div>
            {timeAgo && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin text-brand-purple-light' : ''} />
                {loading ? 'Refreshing...' : `Updated ${timeAgo}`}
              </button>
            )}
          </div>

          {/* Wallet */}
          <div className="relative">
            {!connected ? (
              <button
                onClick={() => setVisible(true)}
                className="btn-primary text-white"
              >
                <Zap size={14} />
                Connect Solflare
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-brand-purple/40 bg-brand-purple-glow text-white text-sm font-medium transition-all hover:border-brand-purple/70"
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-dim flex items-center justify-center text-xs font-bold">
                    ◎
                  </span>
                  {truncate(publicKey?.toBase58())}
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-surface-border shadow-card overflow-hidden animate-fade-in"
                    style={{ background: '#0F0F1A' }}>
                    <div className="p-3 border-b border-surface-border">
                      <p className="text-xs text-gray-500 mb-1">Connected Wallet</p>
                      <p className="text-sm font-mono text-white">{truncate(publicKey?.toBase58())}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={handleCopy}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-surface-secondary hover:text-white transition-colors"
                      >
                        <Copy size={14} />
                        {copied ? 'Copied!' : 'Copy Address'}
                      </button>
                      <a
                        href={`https://solscan.io/account/${publicKey?.toBase58()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-surface-secondary hover:text-white transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ExternalLink size={14} />
                        View on Solscan
                      </a>
                      <button
                        onClick={handleDisconnect}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={14} />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
