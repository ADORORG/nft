export const AppInfo = {
  name: "Ador",
  description: "Expression is essential",
  website: 'https://adors.org',
	support: 'support@adors.org',
  logoUrl: "/logo.svg"
} as const

// Also configured in next.config.js
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'
export const CONTRACT_TOKEN_URI_PREFIX = 'https://mainnet.adors.org/api/contract/token/'
export const OTP_EXPIRY = 60 * 60 * 1000 // 1 hour
export const OTP_RETRY = 60 * 1000 // 1 minute

export const fiatCurrencies = [
  {
    name: 'United States Dollar',
    iso: 'usd',
    symbol: '$',
    image: '/flags/us.svg'
  },
  {
    name: 'Euro',
    iso: 'eur',
    symbol: '€',
    image: '/flags/eu.svg'
  },
  {
    name: 'Pound Sterling',
    iso: 'gbp',
    symbol: '£',
    image: '/flags/gb.svg'
  },
  {
    name: 'Japanese Yen',
    iso: 'jpy',
    symbol: '¥',
    image: '/flags/jp.svg'
  },
  {
    name: 'Chinese Yuan',
    iso: 'cny',
    symbol: '¥',
    image: '/flags/cn.svg'
  },
  {
    name: 'Nigerian Naira',
    iso: 'ngn',
    symbol: '₦',
    image: '/flags/ng.svg'
  },
  {
    name: 'Indian Rupee',
    iso: 'inr',
    symbol: '₹',
    image: '/flags/in.svg'
  },
  {
    name: 'South African Rand',
    iso: 'zar',
    symbol: 'R',
    image: '/flags/za.svg'
  },
] as const

export const dbCollections = {
  accounts: 'nft_accounts',
  collections: 'nft_collections',
  tokens: 'nft_tokens',
  marketOrders: 'nft_market_orders',
  bids: 'nft_bids',
  currencies: 'nft_currencies',
  contracts: 'nft_contracts',
  authentication: 'nft_authentication',
} as const

export const collectionCategories = [
    {
      name: 'Virtual Art',
      slug: 'virtual_art'
    },
    {
      name: 'Painting',
      slug: 'painting'
    },
    {
      name: 'Photography',
      slug: 'photography'
    },
    {
      name: 'Music',
      slug: 'music'
    },
    {
      name: 'Video',
      slug: 'video'
    },
    {
      name: 'Collectibles',
      slug: 'collectibles'
    },
    {
      name: 'AI',
      slug: 'ai'
    },
    {
      name: 'Games',
      slug: 'games'
    },
    {
      name: 'Books',
      slug: 'books'
    }
] as const