import Modal from "@/components/Modal"
import { toast } from "react-hot-toast"
import { useConnect } from "wagmi"
import { selectedChainId } from "./store"
import { useAtom } from "jotai"
import { supportedWalletConnectors } from "@/web3.config"
import {
    MetamaskIcon,
    CoinbaseIcon,
    OperaIcon,
    // WalletConnectIcon,
    TrustWalletIcon,
    LedgerIcon,
    SafeIcon
} from "./Icons"

type ConnectWalletModalProps = {   
    show: boolean;
    onHide: () => void;
    backdrop?: boolean;
}

export default function ConnectWalletModal(props: ConnectWalletModalProps) {
    const { show, onHide, backdrop } = props;
    const [chainId] = useAtom(selectedChainId)
    const { connect, /* connectors, */ isLoading, pendingConnector } = useConnect({
        onSuccess(data) {
            toast.success(`Wallet connected:${data?.connector?.name}`)
            onHide()
        },
        onError(error) {
            toast.error(error.message)
        }
    })
    const walletMapping = [
        {
            name: "Metamask",
            Icon: MetamaskIcon,
            connector: supportedWalletConnectors.Metamask,
            isPopular: true
        },
        {
            name: "Coinbase Wallet",
            Icon: CoinbaseIcon,
            connector: supportedWalletConnectors.Coinbase
        },
        {
            name: "Opera Wallet",
            Icon: OperaIcon,
            connector: supportedWalletConnectors.Injected
        },
        {
            name: "Trust Wallet",
            Icon: TrustWalletIcon,
            connector: supportedWalletConnectors.Injected
        },
        {
            name: "Ledger",
            Icon: LedgerIcon,
            connector: supportedWalletConnectors.Ledger
        },
        {
            name: "Safe",
            Icon: SafeIcon,
            connector: supportedWalletConnectors.Safe
        }
    ]

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop={backdrop}
        >
            <Modal.Header>
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                    Connect wallet
                </h3>
            </Modal.Header>
            <Modal.Body>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of our available wallet providers or create a new one.</p>
                    <ul className="my-4 space-y-3">
                        {
                            walletMapping.map((wallet, index) => (
                                <li key={wallet.name + index}>
                                    <a 
                                        href="#" 
                                        className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                                        onClick={() => {
                                            try {
                                                connect({connector: wallet.connector, chainId})
                                            } catch (error) {
                                                console.error(error)
                                            }
                                        }}
                                    >
                                        
                                        <wallet.Icon className="w-8 h-8"/>
                                        <span className="flex-1 ml-3 whitespace-nowrap">
                                            { wallet.name }
                                        </span>
                                        {
                                            isLoading &&
                                            pendingConnector?.id === wallet.connector.id &&
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
                    <div>
                        <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                            <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            Why do I need to connect with my wallet?</a>
                    </div>
            </Modal.Body>
        </Modal>
    )
}
