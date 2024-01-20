import type NftContractType from "@/lib/types/contract"
import Button from "@/components/Button"

interface ShowMetadataProps {
    metadata: Partial<NftContractType>;
    tokenUri: string;
    currentAccountIsOwner: boolean;
    nextStep: () => void;
}

export default function ShowMetadata(props: ShowMetadataProps) {
    const {metadata, tokenUri, currentAccountIsOwner, nextStep} = props
    const {contractAddress, nftSchema, owner, label, symbol} = metadata
    
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
                                onClick={nextStep}
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