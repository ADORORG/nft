import type { Connector, Chain } from "wagmi"

export interface ConnectedWalletButtonProps {
    /** Text to display if wallet is connected to an unsupported network */
    wrongNetworkText?: string,
    /** Classname to pass to the button that displays wrong network connection */
    wrongNetworkClassName?: string,
    /** ClassNames to pass to the connected wallet button */
    buttonClassName?: string,
    /** ClassName to pass to the span element that holds the wallet address */
    addressClassName?: string,
    /** A function called whenever user click the wallet connected button */
    onClick?: (arg: any) => void,
    /** Disable clicking of the wallet connected button */
    disabled?: boolean,
    /** Decimal places to fixed account balance */
    decimals?: number
}

export interface ConnectedWalletProps {
    /** A function to call when address is copied*/
    onAddressCopy?: () => void,
    /** A function to call when wallet is successfully disconnected */
    onDisconnect?: () => void,
    /** Decimal places to fixed account balance */
    decimals?: number
}

export interface ConnectWalletProps {
    /** A function called whenever wallet is connected */
    onConnected?: (arg: any) => void,
    /** A function called if there's an error when connecting wallet */
    onConnectionError?: (arg: any) => void,
    /** An array of supported chains */
    connectors?: Record<string, Connector>,
    /** The default chainId to connect to */
    chainId?: number,
}

export interface NetworkChainSelectProps {
    /** Whether to request user to switch chain in wallet when it's changed on the UI */
    switchOnChange?: boolean,
    /** A function that receives the new chain id whenever it is changed by user */
    onChange?: (chainId: number | string) => void,
    /** ClassNames to pass to the chain dropdown select element */
    className?: string,
}

export interface ConnectWalletModalProps {   
    /** Signifies when to display the modal */
    show: boolean,
    /** A function called whenever user closes the modal. 
     * Should set 'show' to 'false' to hide the modal 
    * */
    onHide: () => void,
    /** True will disable hiding modal when backdrop area is clicked */
    backdrop?: boolean,
    /** The info text to display at the bottom of the modal */
    infoNode?: React.ReactNode
}

export interface ConnectWalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string,
    /** If wallet is already connected, show the connectedButton */
    showConnectedButton?: boolean,
}

export default interface ConnectWalletManagerProps {
    /** Decimal places to fixed account balance */
    decimals?: number,
    /** The default chainId to connect to */
    chainId?: number,
    /** Used this to update chain id within the context */
    setChainId?: (newChainId: number) => void,
    children: React.ReactNode,
    /** Supported Wallet connectors */
    connectors: Record<string, Connector>,
    /** An array of supported chains */
    supportedChains: Chain[],
    /** Connected wallet display button */
    connectedButton?: ConnectedWalletButtonProps,
    /** The container that display user address, copy button and disconnect button */
    ConnectedWalletDiv?: ConnectedWalletProps,
    /** The div that displays the list of wallet connectors */
    walletConnectorsDiv?: ConnectWalletProps,
    /** A dropdown that displays the list of supported network chain */
    networkChainSelect?: NetworkChainSelectProps,
    /** The modal that displays 'walletConnectorsDiv' and 'ConnectedWalletDiv' */
    connectWalletModal?: ConnectWalletModalProps,
    /** Connect walle button. The modal trigger */
    connectWalletButton?: ConnectWalletButtonProps
}