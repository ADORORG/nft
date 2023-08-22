"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionCategories = exports.dbCollections = exports.fiatCurrencies = exports.OTP_RETRY = exports.OTP_EXPIRY = exports.CONTRACT_TOKEN_URI_PREFIX = exports.IPFS_GATEWAY = exports.AppInfo = void 0;
exports.AppInfo = {
    name: "Ador",
    description: "Expression is essential",
    website: 'https://adors.org',
    support: 'support@adors.org',
    logoUrl: "/logo.svg"
};
// Also configured in next.config.js
exports.IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
exports.CONTRACT_TOKEN_URI_PREFIX = 'https://mainnet.adors.org/api/contract/token/';
exports.OTP_EXPIRY = 60 * 60 * 1000; // 1 hour
exports.OTP_RETRY = 60 * 1000; // 1 minute
exports.fiatCurrencies = [
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
];
exports.dbCollections = {
    accounts: 'nft_accounts',
    collections: 'nft_collections',
    tokens: 'nft_tokens',
    marketOrders: 'nft_market_orders',
    bids: 'nft_bids',
    currencies: 'nft_currencies',
    contracts: 'nft_contracts',
    authentication: 'nft_authentication',
};
exports.collectionCategories = [
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
];
