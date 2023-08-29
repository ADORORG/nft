import Modal from "@/components/Modal"
import Button from "@/components/Button"

type AuthenticateModalProps = {   
    show: boolean;
    onHide: () => any;
    authenticate: () => any;
    disconnect: () => any;
    hasPendingAction: boolean;
    backdrop?: boolean;
}

export default function AuthenticateModal(props: AuthenticateModalProps) {
    const { 
        show, 
        onHide, 
        authenticate, 
        disconnect, 
        backdrop, 
        hasPendingAction 
    } = props;

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop={backdrop}
        >
            <Modal.Header>
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                    Sign a message
                </h3>
            </Modal.Header>
            <Modal.Body>
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                        You just connected or switched your wallet. Please, authenticate or disconnect to continue.
                    </p>
                    <div className="my-8 space-y-3">
                        <div className="flex flex-col gap-4">
                            <Button
                                variant="gradient"
                                onClick={authenticate}
                                disabled={hasPendingAction}
                                rounded
                            >
                                Authenticate
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={disconnect}
                                disabled={hasPendingAction}
                                rounded
                            >
                                Disconnect wallet
                            </Button>
                        </div>
                    </div>
            </Modal.Body>
        </Modal>
    )
}
