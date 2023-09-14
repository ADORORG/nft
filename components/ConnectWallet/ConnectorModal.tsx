import { useContext } from "react"
import Modal from "@/components/Modal"
import ConnectorList from "./ConnectorList"
import { ConnectWalletManagerContext } from "./ContextWrapper"
import type { ConnectWalletModalProps } from "./types"

export default function ConnectWalletModal(props: ConnectWalletModalProps) {
    const config = useContext(ConnectWalletManagerContext)
    const { 
        show = config?.connectWalletModal?.show, 
        onHide = config?.connectWalletModal?.onHide, 
        backdrop = config?.connectWalletModal?.backdrop, 
        infoNode = config?.connectWalletModal?.infoNode, 
    } = props

    return (
        <Modal
            show={show ?? false}
            onHide={onHide ?? (() => {}) }
            backdrop={backdrop ?? true}
        >
            <Modal.Header>
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                    Connect wallet
                </h3>
            </Modal.Header>
            <Modal.Body>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of our available wallet providers</p>
                    <ConnectorList
                        onConnected={(data) => {
                            onHide?.()
                            config?.walletConnectorsDiv?.onConnected?.(data)
                        }}
                        onConnectionError={error => config?.walletConnectorsDiv?.onConnectionError?.(error)}
                        connectors={config?.connectors || {}}
                        chainId={config?.chainId}
                    />
                    <div>
                        {
                            infoNode ?
                            infoNode 
                            :
                            <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                Wallet connection is required to perform actions on the platform 
                            </a>
                        }   
                    </div>
            </Modal.Body>
        </Modal>
    )
}
