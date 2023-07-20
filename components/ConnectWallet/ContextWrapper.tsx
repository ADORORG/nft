import React from "react"
import { useAtom } from "jotai"
import { showWalletConnectModal, showConnectedWalletModal } from "./store"
import ConnectorModal from "./ConnectorModal"
import ConnectedWalletModal from "./ConnectedModal"

export default function ConnectWalletContextWrapper({ children }: { children: React.ReactNode }) {
    const [showWalletModal, setShowWalletModal] = useAtom(showWalletConnectModal)
    const [showConnectedModal, setShowConnectedModal] = useAtom(showConnectedWalletModal)

    return (
        <>
            { children }
            <ConnectorModal
                show={showWalletModal}
                onHide={() => setShowWalletModal(false)}
                backdrop={true}
            />
            <ConnectedWalletModal
                show={showConnectedModal}
                onHide={() => setShowConnectedModal(false)}
                backdrop={true}
            />
        </>
    )
}