export const AppInfo = {
  name: 'Ador',
  description: 'Expression is essential',
  website: 'https://adors.org',
	support: 'support@adors.org',
  logoUrl: 'https://adors.org/logo.svg'
} as const

// Also configured in next.config.js
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

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
  /** Platform user account database collection name */
  accounts: 'nft_accounts',
  /** Collections of nft tokens created by account */
  collections: 'nft_collections',
  /** Nft tokens created by account, belongs to a collection */
  tokens: 'nft_tokens',
  /** Secondary marketplace orders */
  marketOrders: 'nft_market_orders',
  /** Bids for auction orders type on marketOrders in the marketplace */
  bids: 'nft_bids',
  /** Crypto Currencies available/supported for listing in the marketplace*/
  currencies: 'nft_currencies',
  /** Nft Contracts deployed on the blockchain, ERC721 and ERC1155 */
  contracts: 'nft_contracts',
  /** Nft contract (pre)sale events conducted on the platform, related to contracts */
  nftContractSaleEvents: 'nft_contract_sale_events',
  /** Authentication for performing actions such as email verification */
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
      name: 'VI',
      slug: 'vi'
    },
    {
      name: 'Games',
      slug: 'games'
    },
    {
      name: 'Education',
      slug: 'education'
    }
] as const