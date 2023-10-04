import {
    mainnet,
    polygon,
    optimism,
    goerli,
    bsc,
    baseGoerli,
    type Chain
  } from "wagmi/chains"
  

const chainList = [
    mainnet, 
    polygon, 
    optimism, 
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
    bsc,
    // testnet
    goerli,
    baseGoerli
]

/**
 * Supported chain id is provided in .env
 * in a comma separated string
 */
const supportedChainIds = process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_ID?.split(",")
const supportedChains = chainList.filter(c => supportedChainIds?.includes(c.id.toString()) )

export default supportedChains