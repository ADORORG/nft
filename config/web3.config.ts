"use client"
import { configureChains, createConfig } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { LedgerConnector } from "wagmi/connectors/ledger"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { SafeConnector } from "wagmi/connectors/safe"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import {
    mainnet,
    polygon,
    optimism,
    goerli,
    bsc,
    baseGoerli,
    type Chain
} from "wagmi/chains"
import { AppInfo } from "@/lib/app.config"

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
 * @note - ETH mainnet (chain id 1) is used if no chain is provided in .env. file
 */
const defaultChain = [mainnet]
const supportedChainIds = process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_ID?.split(",")
const envChains = chainList.filter(c => supportedChainIds?.includes(c.id.toString()))
const supportedChains = envChains.length ? envChains : defaultChain

const { chains, publicClient } = configureChains(
    supportedChains,
    [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }),
      publicProvider()
    ]
)

const injectedConnector = new InjectedConnector({
    chains,
})

const coinbaseConnector = new CoinbaseWalletConnector({
    chains,
    options: {
        appName: AppInfo.name,
        jsonRpcUrl: ""
    }
})

const ledgerConnector = new LedgerConnector({
    chains,
    options: {
            projectId: ""
    }
})

const metaMaskConnector = new MetaMaskConnector({
    chains
})

const safeConnector = new SafeConnector({
    chains
})

const walletConnectConnector = new WalletConnectConnector({
    chains,
    options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string
    }
})

const supportedWalletConnectors = {
    Coinbase: coinbaseConnector, 
    Metamask: metaMaskConnector, 
    Ledger: ledgerConnector, 
    Safe: safeConnector,
    Injected: injectedConnector,
    WalletConnect: walletConnectConnector
}

const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
    connectors: Object.values(supportedWalletConnectors)
})

export default wagmiConfig
export { supportedChains, supportedWalletConnectors }