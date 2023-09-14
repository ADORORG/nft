import { useContext } from "react"
import ConnectedWallet from "./ConnectedWallet"
import Modal from "@/components/Modal"
import { useAccount } from "wagmi"
import { ConnectWalletManagerContext } from "./ContextWrapper"

import type { ConnectWalletModalProps } from "./types"

export default function ConnectedWalletModal(props: ConnectWalletModalProps) {
    const config = useContext(ConnectWalletManagerContext)
    const { 
        show = config?.connectWalletModal?.show, 
        onHide = config?.connectWalletModal?.onHide,
         backdrop = config?.connectWalletModal?.backdrop,
     } = props
    const { connector: activeConnector } = useAccount()

    const handleDisconnect = () => {
        try {
            onHide?.()
            config?.ConnectedWalletDiv?.onDisconnect?.()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal
            show={show ?? false}
            onHide={onHide ?? (() => {})}
            backdrop={backdrop ?? true}
            className="shadow-lg"
        >
            <Modal.Header>
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                    {activeConnector?.name} Connected
                </h3>
            </Modal.Header>
            <Modal.Body>
                <ConnectedWallet
                    onDisconnect={handleDisconnect}
                    onAddressCopy={() => config?.ConnectedWalletDiv?.onAddressCopy?.()}
                    decimals={config?.decimals}
                />
            </Modal.Body>
        </Modal>
    )
}