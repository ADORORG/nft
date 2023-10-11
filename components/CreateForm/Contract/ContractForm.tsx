"use client"
import type ContractType from "@/lib/types/contract"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useNftDeployer } from "@/hooks/contract/nft"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { toRoyaltyPercent } from "@/utils/contract"
import { InputField, RangeInput } from "@/components/Form"
import { NetworkChainSelect } from "@/components/ConnectWallet"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"
import appRoutes from "@/config/app.route"

interface ContractFormProps {
    contract: Partial<ContractType>,
    setContract: (contract: Partial<ContractType>) => void
}

/**
 * Collect contract data, 
 * save data to the database, 
 * deploy contract to the blockchain and
 * update contract address in the database.
 * @param param0 
 * @returns 
 */
export default function ContractForm({contract, setContract}: ContractFormProps) {
    const router = useRouter()
    const [royaltyPercent, setRoyaltyPercent] = useState(0)
    const [loading, setLoading] = useState(false)
    const { deployNftContract } = useNftDeployer({
        chainId: contract.chainId as number
    })

    const uploadContractData = useCallback(async (newContractData: Partial<ContractType>) => {
        const response = await fetcher(apiRoutes.createContract, {
            method: "POST",
            body: JSON.stringify(newContractData)
        })

        if (response.success) {
            return response.data
        }
    }, [])

    const updateContractAddress = useCallback(async (contract: Partial<ContractType>) => {
        const updatedContract = await uploadContractData({
            ...contract,
            draft: false
        })

        toast.success("Contract deployed successfully")
        router.push(replaceUrlParams(appRoutes.viewContract, {
            chainId: updatedContract.chainId.toString(),
            contractAddress: updatedContract.contractAddress
        }))
        
    }, [router, uploadContractData])

    const handleDeployment = useCallback(async () => {
        const deployResult = await deployNftContract({
            contractLabel: contract.label as string,
            contractSymbol: contract.symbol as string,
            contractRoyalty: contract.royalty as number,
            contractSchema: contract.nftSchema as string,
            contractVersion: contract.version as string
        })

        const contractUpdate = {...contract, ...deployResult}
        setContract(contractUpdate)
        return contractUpdate

    }, [deployNftContract, contract, setContract])
   

    const handleSubmit = useCallback(async () => {
        try {
            setLoading(true)
            if (!contract.label || !contract.symbol || contract.royalty === undefined) {
                throw new Error("Please fill all fields")
            }
            
            if (!contract._id) {
                // Contract not yet saved to database
                const savedDraft = await uploadContractData({
                    ...contract, 
                    contractAddress: "",
                    draft: true
                })

                // set the contract document _id
                if (savedDraft._id) {
                    setContract({...contract, _id: savedDraft._id})
                }
                // deploy contract 
                const deployResult = await handleDeployment()
                await updateContractAddress(deployResult)

            } else if (contract._id && contract.draft) {
                // Contract already saved to database as draft
                const deployResult = await handleDeployment()
                await updateContractAddress(deployResult)
            } else {
                await updateContractAddress(contract)
            }
           
        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }, [contract, setContract, handleDeployment, updateContractAddress, uploadContractData])

    return (
        <div className="w-full md:w-1/2 lg:max-w-md mx-auto">
            <div className="flex flex-col gap-4 justify-center">
                <div>
                    <h5 className="py-2">Network</h5>
                    <NetworkChainSelect
                        switchOnChange={true}
                        onChange={chainId => setContract({
                            ...contract, 
                            chainId: Number(chainId)
                        })}
                    />
                </div>

                {/* Contract label */}
                <InputField
                    label="Contract label"
                    type="text"
                    name="label"
                    placeholder="e.g. Metador"
                    onChange={e => setContract({...contract, label: e.target.value})}
                    value={contract?.label || ""}
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
                    onChange={e => setContract({...contract, symbol: e.target.value})}
                    value={contract?.symbol || ""}
                    disabled={loading}
                    autoComplete="off"
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-3"
                />
                {/* Contract default Royalty */}
                <div className="flex flex-col gap-3 mb-4">
                    <span>Contract Royalty ({royaltyPercent}%)</span>
                    <RangeInput
                        max={50}
                        step={1}
                        value={royaltyPercent}
                        onChange={e => {
                            const value = Number(e.target.value)
                            setRoyaltyPercent(value)
                            // set contract royalty
                            setContract({...contract, royalty: toRoyaltyPercent(value)})
                        }}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="my-4 flex gap-4">
                <Button
                    className="px-3"
                    variant="gradient"
                    rounded
                    onClick={handleSubmit}
                    disabled={loading || !!contract?.contractAddress}
                    loading={loading}
                >
                    {
                        !!contract?.contractAddress ?
                        "Deployed"
                        :
                        contract._id && contract.draft 
                        ? 
                        "Deploy"
                        :
                        "Start Deployment"
                    }
                </Button>
            </div>
        </div>
    )
}