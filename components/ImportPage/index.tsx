"use client"
import NftTokenType from "@/lib/types/token"
import type { ContractMetadataType } from "./types"
import { useState } from "react"
import { useERC1155, useERC721 } from "@/hooks/contract/nft"
import { useAuthStatus } from "@/hooks/account"
import { ERC1155Interface, ERC721Interface } from "@/config/contract.interfaceId"
import { isEthereumAddress } from "@/utils/main"
import { fetcher } from "@/utils/network"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import ImportForm from "./Form"
import ShowMetadata from "./ShowMetadata"
import ShowAccountTokens from "./ShowTokens"

// For event log filter
import { usePublicClient } from "wagmi"
import erc721Abi from "@/abi/erc721"
import erc1155Abi from "@/abi/erc1155"

export default function ImportPage() {
    const [screen, setScreen] = useState<"metadata" | "token_balance">("metadata")
    const [contractMetadata, setContractMetadata] = useState<Partial<ContractMetadataType>>({})
    const [tokenUri, setTokenUri] = useState<string>("")
    const [accountTokens, setAccountTokens] = useState<Partial<NftTokenType>[]>([])
    const { address, isConnected } = useAuthStatus()
    const publicClient = usePublicClient()
    const erc1155Helper = useERC1155()
    const erc721Helper = useERC721()
    

    const handleMetadataFetch = async (contractAddress: string) => {
        setScreen("metadata")
        if (!isEthereumAddress(contractAddress)) {
            throw new Error("Contract address is invalid")
        }

        const getContractMetadata = async (helper: typeof erc1155Helper | typeof erc721Helper, schema: ContractMetadataType['nftSchema']) => {
            const [tokenName, tokenSymbol, tokenURI, ownerAddress] = await Promise.all([
                helper.tokenName({contractAddress}),
                helper.tokenSymbol({contractAddress}),
                helper.tokenURI({contractAddress, tokenId: 1}),
                helper.ownerAddress({contractAddress}),
            ])
            
            setContractMetadata({
                label: tokenName,
                symbol: tokenSymbol,
                owner: ownerAddress,
                contractAddress,
                nftSchema: schema
            })
            setTokenUri(tokenURI)

            return {
                tokenName,
                tokenSymbol,
                tokenURI,
                ownerAddress
            }
        }

        // Determine contract schema (ERC1155 or ERC721)
        const [isErc1155, isErc721] = await Promise.all([
            erc1155Helper.supportInterface({
                contractAddress,
                interfaceId: ERC1155Interface
            }),
            erc721Helper.supportInterface({
                contractAddress,
                interfaceId: ERC721Interface
            })
        ])

        try {
            if (isErc1155) {
                await getContractMetadata(erc1155Helper, "erc1155")
            } else if (isErc721) {
                await getContractMetadata(erc721Helper, "erc721")
            }
        } catch (error) {
            throw new Error("Contract schema could not be determined. Try switching network")
        }
    }

    const fetchAccountERC1155Token = async () => {
        const TransferSinglefilter = await publicClient.createContractEventFilter({
            abi: erc1155Abi,
            address: contractMetadata?.contractAddress as any,
            eventName: "TransferSingle",
            strict: true,
            args: {
                to: address
            }
        })

        const TransferBatchfilter = await publicClient.createContractEventFilter({
            abi: erc1155Abi,
            address: contractMetadata?.contractAddress as any,
            eventName: "TransferBatch",
            strict: true,
            args: {
                to: address
            }
        })

        const transferSingleLogs = await publicClient.getFilterLogs({filter: TransferSinglefilter})
        const transferBatchLogs = await publicClient.getFilterLogs({filter: TransferBatchfilter})
        
        const tokenIds = Array.from(new Set([
            ...transferSingleLogs.map(log => log.args.id),
            ...transferBatchLogs.map(log => log.args.ids.flat()).flat()
        ]))

        const fetchTokenMetaData = async ({tokenId}: {tokenId: string}) => {
            try {
                const balance = await erc1155Helper.balanceOf({
                    contractAddress: contractMetadata?.contractAddress as string,
                    tokenId: Number(tokenId),
                    accountAddress: address
                })
    
                if (balance > 0) {
                    const tokenURI = await erc1155Helper.tokenURI({
                        contractAddress: contractMetadata?.contractAddress as any,
                        tokenId: Number(tokenId)
                    })
                    const metadata = await fetcher<Partial<NftTokenType>>(tokenURI, {
                        method: "GET"
                    })

                    return {
                        name: metadata.name,
                        description: metadata.description,
                        media: metadata.image,
                        quantity: balance,
                        tokenId: Number(tokenId),
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }

        const accountTokens = await Promise.all(tokenIds.map(tokenId => fetchTokenMetaData({tokenId: tokenId.toString()})))
        return accountTokens.filter(Boolean) as Partial<NftTokenType>[]
    }

    const fetchAccountERC721Token = async () => {
        const TransferFilter = await publicClient.createContractEventFilter({
            abi: erc721Abi,
            address: contractMetadata?.contractAddress as any,
            eventName: "Transfer",
            strict: true,
            args: {
                to: address
            }
        })

        const transferLogs = await publicClient.getFilterLogs({filter: TransferFilter})
        const tokenIds = Array.from(new Set(transferLogs.map(log => log.args.tokenId.toString())))

        const fetchTokenMetaData = async ({tokenId}: {tokenId: string}) => {
            try {
                const owner = await erc721Helper.ownerOf({
                    contractAddress: contractMetadata?.contractAddress as string,
                    tokenId: Number(tokenId),
                })
    
                if (owner.toLowerCase() === address?.toLowerCase()) {
                    const tokenURI = await erc721Helper.tokenURI({
                        contractAddress: contractMetadata?.contractAddress as any,
                        tokenId: Number(tokenId)
                    })
                    const metadata = await fetcher<Partial<NftTokenType>>(tokenURI, {
                        method: "GET"
                    })
    
                    return {
                        name: metadata.name,
                        description: metadata.description,
                        media: metadata.image,
                        tokenId: Number(tokenId),
                    }
                }

            } catch (error) {
                console.error(error)
            }
        }

        const accountTokens = await Promise.all(tokenIds.map(tokenId => fetchTokenMetaData({tokenId})))
        return accountTokens.filter(Boolean) as Partial<NftTokenType>[]
    }

    const fetchContractToken = async () => {
        let accountTokens = []

        if (contractMetadata?.nftSchema === "erc1155") {
            accountTokens = await fetchAccountERC1155Token()
        } else if (contractMetadata?.nftSchema === "erc721") {
            accountTokens = await fetchAccountERC721Token()
        } else {
            throw new Error("Contract schema is invalid")
        }
        setAccountTokens(accountTokens)
        setScreen("token_balance")
    }

    const uploadAccountTokens = async () => {
        
    }
 
    return (
        <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            <h1 className="text-xl py-6">Import NFT Contract token</h1>
            {
                isConnected ? 
                <div>
                    {
                        screen === "token_balance" ? 
                        <div>
                            <ShowAccountTokens
                                tokens={accountTokens}
                                nextHandler={uploadAccountTokens}
                            />
                        </div>
                        :
                        <div>
                            <ImportForm 
                                importHandler={handleMetadataFetch}
                            />
                            <div className="mt-4">
                                {
                                    contractMetadata?.contractAddress &&
                                    <ShowMetadata
                                        metadata={contractMetadata}
                                        tokenUri={tokenUri}
                                        currentAccountIsOwner={address?.toLowerCase() === contractMetadata?.owner?.toString()?.toLowerCase()}
                                        nextStep={fetchContractToken}
                                    />
                                }
                            </div>
                        </div>
                    }
                </div>
                :
                <ConnectWalletButton
                    className="my-10 self-center"
                />
            }
            
        </div>
    )
}