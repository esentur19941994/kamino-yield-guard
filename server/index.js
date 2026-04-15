import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Quicknode RPC endpoint (from env) or fallback to public mainnet RPC
const QUICKNODE_URL = process.env.QUICKNODE_RPC_URL || 'https://api.mainnet-beta.solana.com'
const KAMINO_API_BASE = 'https://api.kamino.finance'

// ── RPC Proxy ──────────────────────────────────────────────────────────────────
app.post('/api/rpc', async (req, res) => {
  try {
    const response = await fetch(QUICKNODE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('[RPC Proxy Error]', err.message)
    res.status(500).json({ error: 'RPC proxy failed', details: err.message })
  }
})

// ── Kamino API Proxy ───────────────────────────────────────────────────────────
app.get('/api/kamino/*', async (req, res) => {
  try {
    const path = req.params[0]
    const query = new URLSearchParams(req.query).toString()
    const url = `${KAMINO_API_BASE}/${path}${query ? `?${query}` : ''}`

    console.log(`[Kamino Proxy] GET ${url}`)

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'KaminoYieldGuard/1.0',
      },
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: text })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('[Kamino Proxy Error]', err.message)
    res.status(500).json({ error: 'Kamino proxy failed', details: err.message })
  }
})

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    rpc: QUICKNODE_URL.includes('quiknode') ? 'quicknode' : 'public',
    timestamp: new Date().toISOString(),
  })
})

// ── Wallet Positions (derives from on-chain via RPC) ───────────────────────────
app.post('/api/wallet/positions', async (req, res) => {
  try {
    const { walletAddress } = req.body
    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress is required' })
    }

    // Fetch token accounts for the wallet via RPC
    const rpcBody = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [
        walletAddress,
        { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
        { encoding: 'jsonParsed', commitment: 'confirmed' },
      ],
    }

    const rpcRes = await fetch(QUICKNODE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody),
    })
    const rpcData = await rpcRes.json()
    res.json(rpcData)
  } catch (err) {
    console.error('[Wallet Positions Error]', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`\n🛡  Kamino Yield Guard — Backend Server`)
  console.log(`   Port  : ${PORT}`)
  console.log(`   RPC   : ${QUICKNODE_URL.includes('quiknode') ? '⚡ QuickNode' : '🌐 Public RPC'}`)
  console.log(`   Kamino: ${KAMINO_API_BASE}\n`)
})
