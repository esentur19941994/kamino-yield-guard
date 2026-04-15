// Central config — all external URLs go through the backend proxy
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Backend routes (proxied through our Express server)
export const RPC_ENDPOINT = `${API_BASE_URL}/api/rpc`
export const KAMINO_API = (path) => `${API_BASE_URL}/api/kamino/${path}`

// Yield alert threshold — surfaces a notification when a better vault offers +2% APY
export const YIELD_ALERT_THRESHOLD = 2.0

// Kamino known vault mint addresses (Mainnet)
export const KNOWN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  JitoSOL: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
  mSOL: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  JLP: '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
  PYUSD: '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
  wBTC: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',
  ETH: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
}

// Asset display metadata
export const ASSET_META = {
  SOL:    { symbol: 'SOL',    name: 'Solana',            color: '#9945FF', icon: '◎' },
  USDC:   { symbol: 'USDC',   name: 'USD Coin',          color: '#2775CA', icon: '$' },
  USDT:   { symbol: 'USDT',   name: 'Tether USD',        color: '#26A17B', icon: '₮' },
  JitoSOL:{ symbol: 'JitoSOL',name: 'Jito Staked SOL',   color: '#5EF57E', icon: 'J' },
  mSOL:   { symbol: 'mSOL',   name: 'Marinade SOL',      color: '#FC8F1B', icon: 'M' },
  BONK:   { symbol: 'BONK',   name: 'Bonk',              color: '#F4A22E', icon: 'B' },
  JLP:    { symbol: 'JLP',    name: 'Jupiter LP',        color: '#C7F764', icon: 'Ω' },
  PYUSD:  { symbol: 'PYUSD',  name: 'PayPal USD',        color: '#003087', icon: 'P' },
  wBTC:   { symbol: 'wBTC',   name: 'Wrapped Bitcoin',   color: '#F7931A', icon: '₿' },
  ETH:    { symbol: 'ETH',    name: 'Ethereum',          color: '#627EEA', icon: 'Ξ' },
}
