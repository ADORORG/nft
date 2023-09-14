"use client"
import React, { createContext, useState} from "react"
import useLocalStorage from "use-local-storage"
import ConnectorModal from "./ConnectorModal"
import ConnectedModal from "./ConnectedModal"
import type ConnectWalletManagerProps from "./types"

interface WalletModalContextProps {
    showConnectorsModal: boolean,
    showConnectedModal: boolean,
}

const defaultWalletModalContext: WalletModalContextProps = {
    showConnectorsModal: false,
    showConnectedModal: false,
}

export const WalletModalContext = createContext<((c: Partial<WalletModalContextProps>) => void) | null>(null)
export const ConnectWalletManagerContext = createContext<Omit<ConnectWalletManagerProps, "children"> | null>(null)

export default function ConnectWalletContextWrapper(props: ConnectWalletManagerProps) {
    const { children, chainId, ...otherProps } = props
    const [showWalletModal, setShowWalletModal] = useState(defaultWalletModalContext)
    const [_chainId, _setChainId] = useLocalStorage<number | undefined>("__selectedChainId__", chainId)
   
    const updateWalletModalContext = (newContext: Partial<WalletModalContextProps>) => {
        setShowWalletModal(prev => ({...prev, ...newContext}))
    }

    return (
        <ConnectWalletManagerContext.Provider value={{...otherProps, chainId: _chainId, setChainId: _setChainId }}>
            <WalletModalContext.Provider value={updateWalletModalContext}>
                { children }
                <ConnectorModal
                    show={showWalletModal.showConnectorsModal}
                    onHide={() => setShowWalletModal({...showWalletModal, showConnectorsModal: false})}
                    backdrop={true}
                />
                <ConnectedModal
                    show={showWalletModal.showConnectedModal}
                    onHide={() => setShowWalletModal({...showWalletModal, showConnectedModal: false})}
                    backdrop={true}
                />
            </WalletModalContext.Provider>
        </ConnectWalletManagerContext.Provider>
    )
}