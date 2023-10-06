"use client"
import type ContractType from "@/lib/types/contract"
import { useState } from "react"
import { useNetwork } from "wagmi"
import { useAuthStatus } from "@/hooks/account"
import { ERC721_VERSION } from "@/solidity/erc721.compiled"
import { ERC1155_VERSION } from "@/solidity/erc1155.compiled"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import ContractForm from "./ContractForm"
/**
 * Collect contract data, 
 * save data to the database, 
 * deploy contract to the blockchain and
 * update contract address in the database.
 * @param param0 
 * @returns 
 */
export default function CreateNftContractForm({nftSchema}: Pick<ContractType, "nftSchema">) {
    const { chain } = useNetwork()
    const { isConnected } = useAuthStatus()
    // setup partial contract data
    const [contractData, setContractData] = useState<Partial<ContractType>>({
        nftSchema, 
        nftEdition: "private", 
        draft: true,
        contractAddress: "",
        chainId: chain?.id as number,
        royalty: 0,
        version: nftSchema === "erc721" ? ERC721_VERSION : ERC1155_VERSION
    })

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center pb-10 md:leading-4">Create {nftSchema.toUpperCase()} Contract</h1>
            {
                isConnected ? 
                <ContractForm 
                    contract={contractData} 
                    setContract={setContractData} 
                />
                :
                <ConnectWalletButton 
                    className="my-10 self-center"
                />
            }
        </div>
    )
}