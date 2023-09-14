import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAccount, useBalance, useDisconnect } from "wagmi"
import { CopyIcon, SignoutIcon } from "./Icons"
import { cutAddress, imageData } from "./utils"
import type { ConnectedWalletProps } from "./types"

export default function ConnectedWallet(props: ConnectedWalletProps) {
    const { onDisconnect, onAddressCopy, decimals = 2 } = props
    const { connector: activeConnector, address } = useAccount()
    const { data: balance } = useBalance({address})
    const { disconnect } = useDisconnect()
    
    const handleDisconnect = async () => {
        disconnect()
        onDisconnect?.()
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-4 w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800">
                {
                    address ? 
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageData(address, 24)} 
                        alt="" 
                        className="w-12 h-12 rounded-full" 
                    />
                    :
                    <span>{activeConnector?.name}</span>
                }
            </div>
            <div className="flex flex-col items-center justify-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{address ? cutAddress(address, 10, 5) : ""}</span>
                <span className="text-lg text-gray-900 dark:text-white">
                    {parseFloat(balance?.formatted ?? '0').toFixed(decimals)} {balance?.symbol}
                </span>
            </div>

            <div className="flex justify-between gap-6 mt-4">
                <CopyToClipboard 
                    text={address ?? ""} 
                    onCopy={() => onAddressCopy?.()}
                >
                    <button className="flex flex-col items-center justify-center p-4 text-gray-900 bg-gray-50 rounded-lg border shadow-lg border-gray-100 dark:text-gray-50 dark:bg-gray-900 dark:border-gray-800">
                        <CopyIcon className="w-6 h-6" />
                        <span className="font-semibold text-sm">Copy address</span>
                    </button>
                </CopyToClipboard>
                <button onClick={handleDisconnect} className="flex flex-col items-center justify-center p-4 text-gray-900 bg-gray-50 rounded-lg border shadow-lg border-gray-100 dark:text-gray-50 dark:bg-gray-900 dark:border-gray-800">  
                    <SignoutIcon className="w-6 h-6" />
                    <span className="font-semibold text-sm">Disconnect</span>
                </button>
            </div>
        </div>
    )
}