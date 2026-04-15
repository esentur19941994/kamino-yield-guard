import { useState, useEffect, useCallback, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection } from '@solana/web3.js' // Добавили это
import {
  fetchLendingVaults,
  fetchUserObligations,
  runYieldComparison,
  getDemoPositions,
  getDemoMarketOverview,
} from '../services/kaminoService.js'

// ВСТАВЬ СВОЮ ССЫЛКУ ИЗ QUICKNODE НИЖЕ
const RPC_ENDPOINT = import.meta.env.VITE_QUICKNODE_RPC;

export function useKaminoData() {
  const { publicKey, connected } = useWallet()
  const [state, setState] = useState({
    positions: [],
    marketVaults: [],
    alerts: [],
    totalValueUSD: 0,
    weightedApy: 0,
    potentialExtraYield: 0,
    loading: true,
    error: null,
    lastUpdated: null,
    isDemo: true,
  })
  const mountedRef = useRef(true)

  const loadData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))

    try {
      // 1. Прямая проверка связи с блокчейном через твой RPC
      const connection = new Connection(RPC_ENDPOINT);
      
      // Попробуем достать данные рынков (даже если API упадет, мы попробуем выжить)
      let vaults = [];
      try {
        vaults = await fetchLendingVaults();
      } catch (e) {
        console.warn("Kamino API down, using demo markets overview");
        vaults = getDemoMarketOverview();
      }
      
      if (connected && publicKey) {
        // Проверяем реальный баланс кошелька в SOL для теста связи
        const balance = await connection.getBalance(publicKey);
        console.log("RPC Connection success! Balance:", balance / 1e9, "SOL");

        const obligations = await fetchUserObligations(publicKey.toBase58());
        const positions = obligations.length > 0 ? runYieldComparison(obligations, vaults) : [];
        
        setState({
          positions,
          marketVaults: vaults,
          alerts: positions.filter(p => p.hasAlert),
          totalValueUSD: positions.reduce((sum, p) => sum + (p.value || 0), 0),
          weightedApy: 0,
          potentialExtraYield: 0,
          loading: false,
          error: null,
          lastUpdated: new Date(),
          isDemo: false, 
        })
      } else {
        const demoPos = getDemoPositions()
        setState({
          positions: demoPos,
          marketVaults: getDemoMarketOverview(),
          alerts: demoPos.filter(p => p.hasAlert),
          totalValueUSD: 12500,
          weightedApy: 5.82,
          potentialExtraYield: 3.32,
          loading: false,
          error: null,
          lastUpdated: new Date(),
          isDemo: true,
        })
      }
    } catch (err) {
      console.error("Critical Load error:", err);
      // Если RPC упал или другая фатальная ошибка
      setState(s => ({ 
        ...s, 
        loading: false, 
        error: "RPC or API Error. Check console.",
        isDemo: !connected 
      }));
    }
  }, [connected, publicKey])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { ...state, refresh: loadData }
}