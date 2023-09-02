"use client"
import { configureChains, createConfig } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { LedgerConnector } from "wagmi/connectors/ledger"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { SafeConnector } from "wagmi/connectors/safe"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import {
  mainnet,
  polygon,
  optimism,
  goerli,
  bsc,
  baseGoerli,
  type Chain
} from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { AppInfo } from "@/lib/app.config"

const supportedChains = [
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
        projectId: "c959e4e094bf2538d3f364baddf2c92c"
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