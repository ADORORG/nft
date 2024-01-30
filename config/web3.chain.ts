import {
    mainnet,
    // polygon,
    // optimism,
    // bsc,
    goerli,
    baseGoerli,
    type Chain
} from "wagmi/chains"

const supportedChains = [
    mainnet, 
    // polygon, 
    // optimism, 
    /** Add base mainnet */
    {
        id: 8453,
        name: "Base",
        network: "base-mainnet",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorers: {
            default: {
                name: "Basescan",
                url: "https://basescan.org"
            }
        },
        rpcUrls: {
            default: {
                http: ["https://mainnet.base.org"]
            },
            public: {
                http: ["https://mainnet.base.org"]
            }
        }
    } satisfies Chain,
    // bsc,
    // testnet
    goerli,
    baseGoerli
]


export default supportedChains