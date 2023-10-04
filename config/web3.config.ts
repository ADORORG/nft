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
import { AppInfo } from "@/lib/app.config"
import supportedChains from "./web3.chain"

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
export { supportedWalletConnectors }