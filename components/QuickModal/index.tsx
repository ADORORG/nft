import Modal, { type ModalProps } from "@/components/Modal"

interface QuickModalProps extends ModalProps {
    modalTitle: React.ReactNode,
    modalBody: React.FC<any>,
    modalBodyClassName?: string
    [otherProps: string]: any
}

/**
 * Construct a quick modal component without the need to manually use Modal, Modal.Header or Modal.Body
 * @param props 
 * @returns 
 */
export default function QuickModal(props: QuickModalProps) {
	const { 
        show, 
        onHide, 
        backdrop, 
        className,
        modalBodyClassName,
        modalBody: ModalBody,
        modalTitle: ModaTitle,
        ...modalBodyProps
    } = props;

	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop={backdrop}
            className={className}
		>
			<Modal.Header>
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                    {ModaTitle}
                </h3>
			</Modal.Header>
			<Modal.Body>
				<ModalBody className={modalBodyClassName} {...modalBodyProps} />
			</Modal.Body>
			
		</Modal>
	)
}
