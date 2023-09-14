"use client"
import { toast } from "react-hot-toast"
import { ConnectWalletContext } from "@/components/ConnectWallet"
import { useAuthStatus } from "@/hooks/account"
import { supportedChains, supportedWalletConnectors } from "@/web3.config"

export default function WalletConnectWrapper({ children}: { children: React.ReactNode}) {
    const { requestSignOut } = useAuthStatus()
    return (
        <ConnectWalletContext
            connectors={supportedWalletConnectors}
            supportedChains={supportedChains}
            decimals={2}
            chainId={1}
            connectWalletButton={{
                text: "Connect Account",
                showConnectedButton: false,
            }}
            connectedButton={{
                wrongNetworkClassName: "flex justify-between items-center px-2 py-2.5 font-semibold text-center shadow-lg text-rose-900 bg-gray-50 rounded-lg border border-gray-100 dark:text-rose-300 dark:bg-gray-900 dark:border-gray-800",
                wrongNetworkText: "Wrong Network",
                addressClassName: "bg-gray-200 text-gray-700 font-semibold mx-2 px-2.5 py-0.5 rounded dark:text-gray-200 dark:bg-gray-700",
                buttonClassName: "text-sm flex justify-between items-center px-2 py-2.5 font-semibold text-center shadow-lg text-gray-900 bg-gray-50 border border-gray-100 dark:text-gray-50 dark:bg-gray-900 dark:border-gray-800"    
            }}
            ConnectedWalletDiv={{
                onAddressCopy: () => toast.success("Address copied to clipboard"),
                onDisconnect: async () => {
                    await requestSignOut()
                    toast.success("Wallet disconnected")
                },
            }}
            walletConnectorsDiv={{
                onConnected: (data) => toast.success(`Wallet connected:${data?.connector?.name}`),
                onConnectionError: (error) => toast.error(error?.message),
            }}
        >
            { children }
        </ConnectWalletContext>
    )
}