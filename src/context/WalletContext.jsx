import { createContext, useContext, useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'

// Убираем старые переменные и вставляем твой Quicknode напрямую
const RPC_ENDPOINT = import.meta.env.VITE_QUICKNODE_RPC;

const WalletCtx = createContext(null)

export function WalletContextProvider({ children }) {
  const wallets = useMemo(
    () => [new SolflareWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider
      endpoint={RPC_ENDPOINT}
      config={{ commitment: 'confirmed' }}
    >
      <WalletProvider wallets={wallets} autoConnect={true}> 
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useWalletCtx() {
  return useContext(WalletCtx)
}