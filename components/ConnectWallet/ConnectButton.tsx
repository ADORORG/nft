import { useAccount } from "wagmi"
import { useAtom } from "jotai"
import { showWalletConnectModal } from "./store"
import ConnectedWalletButton from "./ConnectedButton"
import Button from "@/components/Button"

interface ConnectWalletButtonProps {
    text?: string
}

export default function ConnectWalletButton(props: ConnectWalletButtonProps) {
    const [showModal, setShowModal] = useAtom(showWalletConnectModal)
    const { isConnected } = useAccount()

    if (isConnected) return (
        <ConnectedWalletButton />
    )

    return (
        <Button 
                rounded 
                className="font-semibold"
                onClick={() => setShowModal(true)}
                disabled={showModal}
            >
                {props.text || "Sign in"}
        </Button>
    )
}