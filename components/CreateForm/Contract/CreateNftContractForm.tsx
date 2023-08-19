"use client"
import type ContractType from "@/lib/types/contract"
import type { Abi } from "viem"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStatus } from "@/hooks/account"
import { toast } from "react-hot-toast"
import { useNetwork, useWalletClient, usePublicClient } from "wagmi"
import { InputField } from "@/components/Form"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { ERC1155_BYTECODE, ERC1155_VERSION } from "@/solidity/erc1155.compiled"
import { ERC721_BYTECODE, ERC721_VERSION } from "@/solidity/erc721.compiled"
import erc1155Abi from "@/abi/erc1155"
import erc721Abi from "@/abi/erc721"
import Button from "@/components/Button"
import apiRoutes, { getNftContractBaseURI } from "@/config/api.route"
import appRoutes from "@/config/app.route"

export default function CreateNftContractForm({nftSchema}: Pick<ContractType, "nftSchema">) {
    const router = useRouter()
    const { isConnected, address } = useAuthStatus()
    const [contractData, setContractData] = useState<Partial<ContractType>>({nftSchema})
    const [loading, setLoading] = useState(false)
    const [deployed, setDeployed] = useState(false)
    const { chain } = useNetwork()
    const { data: walletClicent } = useWalletClient()
    const publicClient = usePublicClient()
    const isErc721 = nftSchema === "erc721"

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
        setContractData({...contractData, [name]: value})
	}

    const uploadContractData = async (newContractData: ContractType) => {
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

    }

    const deployContractNftContract = async ({nftBytecode, nftAbi, nftVersion}: {nftBytecode: `0x${string}`, nftAbi: Abi, nftVersion: string}) => {
        const chainId = chain?.id as number
        const deployTxhash = await walletClicent?.deployContract({
            abi: nftAbi,
            account: address,
            bytecode: nftBytecode,
            args: [
                contractData.label as string, 
                contractData.symbol as string, 
                getNftContractBaseURI(chainId),
                BigInt(contractData.royalty as number)
            ]
        })

        const transactionReceipt = await publicClient.waitForTransactionReceipt({
            hash: deployTxhash as any
        })
        setDeployed(true)
        
        return {
            version: nftVersion,
            chainId: chainId,
            owner: transactionReceipt.from,
            contractAddress: transactionReceipt.contractAddress as string
        } as const

    }

    const handleSubmit = async () => {
        try {  
            setLoading(true)
            if (!contractData.label || !contractData.symbol || !contractData.royalty) {
                throw new Error("Please fill all fields")
            }
            
            if (!deployed) {
                let result
                
                if (isErc721) {
                    result = await deployContractNftContract({
                        nftAbi: erc721Abi,
                        nftBytecode: ERC721_BYTECODE,
                        nftVersion: ERC721_VERSION
                    })
                } else {
                    result = await deployContractNftContract({
                        nftAbi: erc1155Abi,
                        nftBytecode: ERC1155_BYTECODE,
                        nftVersion: ERC1155_VERSION
                    })
                }
                
                const contractUpdate = {
                    label: contractData.label,
                    royalty: contractData.royalty,
                    symbol: contractData.symbol,
                    nftSchema,
                    ...result
                }

                setContractData(contractUpdate)
                await uploadContractData(contractUpdate)
            } else {
                await uploadContractData(contractData as ContractType)
            }
           
        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full md:w-1/2 lg:w-2/5 mx-auto">
            <h1 className="text-4xl pb-10 md:leading-4">Create {isErc721 ? "ERC721" : "ERC1155"} Contract</h1>

            <div className="flex flex-col gap-4 justify-center">
                {/* Contract label */}
                <InputField
                    label="Contract label"
                    type="text"
                    name="label"
                    placeholder="e.g. Metador"
                    onChange={handleInputChange}
                    value={contractData?.label || ""}
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                        disabled={loading}
                        loading={loading}
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