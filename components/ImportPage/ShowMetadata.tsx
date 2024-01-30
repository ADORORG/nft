import type NftContractType from "@/lib/types/contract"
import { useState } from "react"
import { toast } from "react-hot-toast"
import Button from "@/components/Button"

interface ShowMetadataProps {
    metadata: Partial<NftContractType>;
    tokenUri: string;
    currentAccountIsOwner: boolean;
    nextStep: () => Promise<void>;
}

export default function ShowMetadata(props: ShowMetadataProps) {
    const {metadata, tokenUri, currentAccountIsOwner, nextStep} = props
    const {contractAddress, nftSchema, owner, label, symbol} = metadata
    const [loading, setLoading] = useState(false)

    const handleNextStep = async () => {
        try {
            setLoading(true)
            await nextStep()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded">
            <table className="w-full text-left rtl:text-right">
                <tbody>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td>Contract Address</td>
                        <td>{contractAddress}</td>
                    </tr>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td>Schema</td>
                        <td>{nftSchema?.toUpperCase()}</td>
                    </tr>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td>Owner</td>
                        <td className="break-all">
                            {owner?.toString()} <br/>
                            {currentAccountIsOwner && <span> (You)</span>}
                        </td>
                    </tr>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td>Name</td>
                        <td>{label}</td>
                    </tr>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td>Symbol</td>
                        <td>{symbol}</td>
                    </tr>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td>URI</td>
                        <td className="break-all">{tokenUri}</td>
                    </tr>
                </tbody>
                <tfoot className="py-4">
                    <tr>
                        <td colSpan={2}>
                            <Button
                                variant="gradient"
                                className="w-full"
                                loading={loading}
                                disabled={loading}
                                onClick={handleNextStep}
                                rounded
                            >
                                Continue
                            </Button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}