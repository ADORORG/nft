import React, { useEffect } from "react"

type ModalChildren = {
    children: React.ReactNode
    className?: string
    onHide?: () => void
}

type ModalProps = {
    children: React.ReactNode
    className?: string
    onHide: () => void
    show: boolean
    backdrop?: boolean
};

type ModalComponent = React.FC<ModalProps> & {
    Header: React.FC<ModalChildren>;
    Body: React.FC<ModalChildren>;
    Footer: React.FC<ModalChildren>;
}

const Modal: ModalComponent = (props) =>{
    const { 
        children, 
        className, 
        show,
        backdrop = false, 
        onHide, 
        ...rest } = props

    useEffect(() => {
        if (show) {
            document.documentElement.classList.add("overflow-hidden");
        } else {
            document.documentElement.classList.remove("overflow-hidden");
        }
    }, [show])
    
    if (!show) return null
    
    // remove scroll bar and prevent body from moving when modal is open
    const handleClose = () => {
        // document.documentElement.classList.remove("overflow-hidden");
        onHide()
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }

    return (
        <div 
            onClick={backdrop ? handleBackdropClick : undefined}
            tabIndex={-1} 
            aria-hidden="true" 
            className={`fixed inset-0 flex items-center justify-center z-50 ${className}`} {...rest}>
            
            <div className="absolute inset-0 bg-opacity-75 bg-gray-500" onClick={backdrop ? handleBackdropClick : undefined}></div>
            <div className="md:max-w-md">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {
                        React.Children.map(children, (child) => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child, { onHide: handleClose } as any)
                            }
                            return child
                        })
                    }
                </div>
            </div>
        </div>
    )
}

const ModalBody: React.FC<ModalChildren> = ({ children }) => {
    return <div className="p-6">{children}</div>;
}

const ModalHeader: React.FC<ModalChildren> = (props) => {
    const { children, className, onHide } = props;

    return (
        <div className={`px-6 py-4 border-b rounded-t dark:border-gray-600 ${className}`}>
            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={onHide}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
            {children}
        </div>
    )
}

const ModalFooter: React.FC<ModalChildren> = ({ children, className }) => {
    return (
        <div className={`px-6 py-4 border-t rounded-b dark:border-gray-600 ${className}`}>
            {children}
        </div>
    )
}



Modal.Body = ModalBody
Modal.Header = ModalHeader
Modal.Footer = ModalFooter

export default Modal