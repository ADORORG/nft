import { useContext } from "react"
import { useAccount } from "wagmi"
import { WalletModalContext, ConnectWalletManagerContext } from "./ContextWrapper"
import ConnectedWalletButton from "./ConnectedButton"
import Button from "@/components/Button"
import type { ConnectWalletButtonProps } from "./types"

export default function ConnectWalletButton(props: ConnectWalletButtonProps) {
    const config = useContext(ConnectWalletManagerContext)
    const walletModal = useContext(WalletModalContext)
    const { 
        text = config?.connectWalletButton?.text, 
        showConnectedButton = config?.connectWalletButton?.showConnectedButton,
        className, 
        ...otherProps 
    } = props
    const { isConnected } = useAccount()

    if (isConnected && showConnectedButton === true) {
        return (
            <ConnectedWalletButton
                onClick={() => walletModal?.({showConnectedModal: true})}
            />
        )
    } else if (isConnected) {
        return null
    }

    return (
        <Button 
                rounded 
                className={`${className}`}
                onClick={() => walletModal?.({showConnectorsModal: true})}
                variant="gradient"
                {...otherProps}
            >
                {text}
        </Button>
    )
}
