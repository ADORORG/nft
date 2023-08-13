import { useAccount } from "wagmi"
import { useAtom } from "jotai"
import { showWalletConnectModal } from "./store"
import ConnectedWalletButton from "./ConnectedButton"
import Button from "@/components/Button"
import { HTMLAttributes } from "react"

interface ConnectWalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string,
}

export default function ConnectWalletButton(props: ConnectWalletButtonProps) {
    const { text = "Connect Wallet", className, ...otherProps } = props
    const [showModal, setShowModal] = useAtom(showWalletConnectModal)
    const { isConnected } = useAccount()

    if (isConnected) return (
        <ConnectedWalletButton />
    )

    return (
        <Button 
                rounded 
                className={`font-semibold ${className}`}
                onClick={() => setShowModal(true)}
                disabled={showModal}
                {...otherProps}
            >
                {text}
        </Button>
    )
}