import { useAccount } from "wagmi"
import { useAtom } from "jotai"
import { showWalletConnectModal } from "./store"
import ConnectedWalletButton from "./ConnectedButton"
import Button from "@/components/Button"

export default function ConnectWalletButton() {
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
                Sign in
        </Button>
    )
}