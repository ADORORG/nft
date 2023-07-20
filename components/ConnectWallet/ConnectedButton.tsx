import { cutAddress } from "./utils"
import { useAccount, useBalance, useNetwork } from "wagmi"
import { showConnectedWalletModal } from "./store"
import { useAtom } from "jotai"

export default function ConnectedWalletButton() {
    const [showConnectedModal, setShowConnectedModal] = useAtom(showConnectedWalletModal)
    const { address } = useAccount()
    const { data: balance } = useBalance({address})
    const { chain: currentChain } = useNetwork()

    return (
        <>
        {
            currentChain?.unsupported ? 
            <button
                className="flex justify-between items-center px-2 py-2.5 text-lg font-semibold text-center shadow-lg text-rose-900 bg-gray-50 rounded-lg border border-gray-100 dark:text-rose-300 dark:bg-gray-900 dark:border-gray-800"
                disabled={true}
            >
                Wrong Network
            </button>
            :
            <button 
                onClick={() => setShowConnectedModal(true)}
                className="flex justify-between items-center px-2 py-2.5 text-lg font-semibold text-center shadow-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-100 dark:text-gray-50 dark:bg-gray-900 dark:border-gray-800"
                disabled={showConnectedModal}
                >
                {parseFloat(balance?.formatted ?? '0').toFixed(2)} {balance?.symbol}
                <span className="bg-gray-200 text-gray-700 font-semibold mx-2 px-2.5 py-0.5 rounded dark:text-gray-200 dark:bg-gray-700">{address ? cutAddress(address) : ""}</span>
            </button>
        }
        </>
    )
}