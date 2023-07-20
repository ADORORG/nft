"use client"
import { configureChains, createConfig } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { LedgerConnector } from "wagmi/connectors/ledger"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { SafeConnector } from "wagmi/connectors/safe"
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  bsc
} from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { AppInfo } from "@/lib/app.config"

const supportedChains = [
    mainnet, 
    polygon, 
    optimism, 
    arbitrum, 
    bsc,
    goerli
];

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

const supportedWalletConnectors = {
    Coinbase: coinbaseConnector, 
    Metamask: metaMaskConnector, 
    Ledger: ledgerConnector, 
    Safe: safeConnector,
    Injected: injectedConnector
}

const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
    connectors: Object.values(supportedWalletConnectors)
})

export default wagmiConfig
export { supportedChains, supportedWalletConnectors }