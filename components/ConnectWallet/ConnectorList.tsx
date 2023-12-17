import { useConnect } from "wagmi"
import { MetamaskIcon, CoinbaseIcon, OperaIcon, WalletConnectIcon, TrustWalletIcon, LedgerIcon, SafeIcon } from "./Icons"
import type { ConnectWalletProps } from "./types"

export default function WalletConnectorList(props: ConnectWalletProps) {
    const {onConnected, onConnectionError, connectors, chainId} = props
    const { connect, isLoading, pendingConnector } = useConnect({
        onSuccess: onConnected,
        onError: onConnectionError
    })
    
    const walletMapping = [
        {
            name: "Metamask",
            Icon: MetamaskIcon,
            connector: connectors?.Metamask,
            isPopular: true
        },
        {
            name: "Wallet Connect",
            Icon: WalletConnectIcon,
            connector: connectors?.WalletConnect
        },
        {
            name: "Coinbase Wallet",
            Icon: CoinbaseIcon,
            connector: connectors?.Coinbase
        },
        {
            name: "Opera Wallet",
            Icon: OperaIcon,
            connector: connectors?.Injected
        },
        {
            name: "Trust Wallet",
            Icon: TrustWalletIcon,
            connector: connectors?.Injected
        },
        /* {
            name: "Ledger",
            Icon: LedgerIcon,
            connector: connectors?.Ledger
        }, */
        {
            name: "Safe",
            Icon: SafeIcon,
            connector: connectors?.Safe
        }
    ]

    return (
        <ul className="my-4 space-y-3">
            {
                walletMapping.map((wallet, index) => (
                    <li key={wallet.name + index}>
                        <a 
                            href="#" 
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                            onClick={() => connect({connector: wallet.connector, chainId})}
                        >                 
                            <wallet.Icon className="w-8 h-8"/>
                            <span className="flex-1 ml-3 whitespace-nowrap">
                                { wallet.name }
                            </span>
                            {
                                isLoading &&
                                pendingConnector?.id === wallet?.connector?.id &&
                                <span className="ml-3 text-xs font-medium text-gray-500 dark:text-gray-400">Connecting...</span>
                            }
                            {
                                wallet.isPopular && (
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Popular</span>
                                )
                            }
                        </a>
                    </li>
                ))
            }
        </ul>
    )
}
