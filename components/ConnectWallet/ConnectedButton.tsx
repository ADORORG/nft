import { useContext } from "react"
import { useAccount, useBalance, useNetwork } from "wagmi"
import { ConnectWalletManagerContext } from "./ContextWrapper"
import { cutAddress } from "./utils"
import type { ConnectedWalletButtonProps } from "./types"

export default function ConnectedWalletButton(props: ConnectedWalletButtonProps) {
    const config = useContext(ConnectWalletManagerContext)
    const { 
        addressClassName = config?.connectedButton?.addressClassName,
        buttonClassName = config?.connectedButton?.buttonClassName,
        wrongNetworkClassName = config?.connectedButton?.wrongNetworkClassName, 
        wrongNetworkText = config?.connectedButton?.wrongNetworkText,
        decimals = config?.decimals,
        disabled = config?.connectedButton?.disabled,
        onClick = config?.connectedButton?.onClick,
    } = props

    const { address } = useAccount()
    const { data: balance } = useBalance({address})
    const { chain: currentChain } = useNetwork()

    return (
        <>
        {
            currentChain?.unsupported ? 
            <button
                className={wrongNetworkClassName}
                disabled={true}
            >
                {wrongNetworkText}
            </button>
            :
            <button 
                className={buttonClassName}
                onClick={onClick}
                disabled={disabled}
            >
                {parseFloat(balance?.formatted ?? '0').toFixed(decimals)} {balance?.symbol}
                <span className={addressClassName}>{address ? cutAddress(address) : ""}</span>
            </button>
        }
        </>
    )
}