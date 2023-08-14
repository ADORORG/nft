"use client"
import type ContractType from "@/lib/types/contract"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStatus } from "@/hooks/account"
import { toast } from "react-hot-toast"
import { useNetwork, useWalletClient, usePublicClient } from "wagmi"
import { InputField } from "@/components/Form"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { ERC1155_BYTECODE, ERC1155_VERSION } from "@/solidity/erc1155.compiled"
import erc1155Abi from "@/abi/erc1155"
import Button from "@/components/Button"
import apiRoutes, { getNftContractBaseURI } from "@/config/api.route"
import appRoutes from "@/config/app.route"

export default function CreateERC1155ContractForm() {
    const router = useRouter()
    const { isConnected, address } = useAuthStatus()
    const [contractData, setContractData] = useState<Partial<ContractType>>({version: ERC1155_BYTECODE, label: "", nftSchema: "erc1155"})
    const [isLoading, setIsLoading] = useState(false)
    const { chain } = useNetwork()
    const { data: walletClicent } = useWalletClient()
    const publicClient = usePublicClient()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
        setContractData({...contractData, [name]: value})
	}

    const handleSubmit = async () => {
        try {  
            setIsLoading(true)
            if (!contractData.label || !contractData.symbol || !contractData.royalty) {
                throw new Error("Please fill all fields")
            }

            const chainId = chain?.id as number
            const deployTxhash = await walletClicent?.deployContract({
                abi: erc1155Abi,
                account: address,
                bytecode: ERC1155_BYTECODE,
                args: [
                    contractData.label, 
                    contractData.symbol, 
                    getNftContractBaseURI(chainId),
                    BigInt(contractData.royalty)
                ]
            })

            const transactionReceipt = await publicClient.waitForTransactionReceipt({
                hash: deployTxhash as any
            })

            const newContractData = {
                label: contractData.label,
                royalty: contractData.royalty,
                symbol: contractData.symbol,
                nftSchema: "erc1155",
                version: ERC1155_VERSION,
                chainId: chainId,
                owner: transactionReceipt.from,
                contractAddress: transactionReceipt.contractAddress as string,
            } satisfies ContractType

            const response = await fetcher(apiRoutes.createContract, {
                method: "POST",
                body: JSON.stringify(newContractData)
            })

            if (response.success) {
                toast.success(response.message)
                router.push(appRoutes.viewContract
                    .replace(":chainId", newContractData.chainId.toString())
                    .replace(":contractAddress", newContractData.contractAddress)
                )
            }

        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full md:w-1/2 lg:w-2/5 mx-auto">
            <h1 className="text-4xl pb-10 md:leading-4">Create ERC1155 Contract</h1>

            <div className="flex flex-col gap-4 justify-center">
                {/* Contract label */}
                <InputField
                    label="Contract label"
                    type="text"
                    name="label"
                    placeholder="e.g. Metador"
                    onChange={handleInputChange}
                    value={contractData?.label || ""}
                    autoComplete="off"
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-3"
                />

                {/* Contract Symbol */}
                <InputField
                    label="Contract Symbol"
                    type="text"
                    name="symbol"
                    placeholder="e.g. MET"
                    onChange={handleInputChange}
                    value={contractData?.symbol || ""}
                    autoComplete="off"
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-3"
                />
                {/* Contract default Royalty */}
                <InputField
                    label="Contract Royalty (1000 = 10%, 500 = 5%, 100 = 1%)"
                    type="number"
                    name="royalty"
                    placeholder="1000 = 10%, 500 = 5%, 100 = 1%"
                    max={1000}
                    min={0}
                    onChange={handleInputChange}
                    value={contractData?.royalty || "0"}
                    autoComplete="off"
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-3"
                />
                        
            </div>

            <div className="my-4 flex gap-4">
                {
                    isConnected ?
                    <Button
                        className="px-3"
                        variant="secondary"
                        rounded
                        onClick={handleSubmit}
                        disabled={isLoading}
                        loading={isLoading}
                    >Start Deployment</Button>
                    :
                    <ConnectWalletButton 
                        className=""
                    />
                }
            </div>
        </div>
    )
}