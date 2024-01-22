"use client"
import NftTokenType from "@/lib/types/token"
import type { ContractMetadataType } from "./types"
import { useState } from "react"
import { parseAbiItem } from "viem"
import { useChainId, usePublicClient } from "wagmi"
import { useRouter } from "next/navigation"
import { useERC1155, useERC721 } from "@/hooks/contract/nft"
import { useAuthStatus } from "@/hooks/account"
import { ERC1155Interface, ERC721Interface } from "@/config/contract.interfaceId"
import { isEthereumAddress, replaceUrlParams } from "@/utils/main"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import ImportForm from "./Form"
import ShowMetadata from "./ShowMetadata"
import ShowAccountTokens from "./ShowTokens"
import apiRoutes from "@/config/api.route"
import appRoutes from "@/config/app.route"
// For event log filter

export default function ImportPage() {
    const [screen, setScreen] = useState<"metadata" | "token_balance">("metadata")
    const [contractMetadata, setContractMetadata] = useState<Partial<ContractMetadataType>>({})
    const [tokenUri, setTokenUri] = useState<string>("")
    const [accountTokens, setAccountTokens] = useState<Partial<NftTokenType>[]>([])
    const { address, isConnected } = useAuthStatus()
    const router = useRouter()
    const chainId = useChainId()
    const publicClient = usePublicClient()
    const erc1155Helper = useERC1155()
    const erc721Helper = useERC721()
    
    const handleMetadataFetch = async (contractAddress: string) => {
        setScreen("metadata")
        if (!isEthereumAddress(contractAddress)) {
            throw new Error("Contract address is invalid")
        }

        const getContractMetadata = async (helper: typeof erc1155Helper | typeof erc721Helper, schema: ContractMetadataType['nftSchema']) => {
            const [tokenName, tokenSymbol, tokenURI, ownerAddress] = await Promise.allSettled([
                helper.tokenName({contractAddress}),
                helper.tokenSymbol({contractAddress}),
                helper.tokenURI({contractAddress, tokenId: 1}),
                helper.ownerAddress({contractAddress}),
            ])
            
            setContractMetadata({
                label: tokenName.status === "fulfilled" ? tokenName.value : "",
                symbol: tokenSymbol.status === "fulfilled" ? tokenSymbol.value : "",
                owner: ownerAddress.status === "fulfilled" ? ownerAddress.value : "",
                contractAddress,
                chainId,
                nftSchema: schema
            })
            setTokenUri(tokenURI.status === "fulfilled" ? tokenURI.value : "")

            return {
                tokenName,
                tokenSymbol,
                tokenURI,
                ownerAddress
            }
        }

        // Determine contract schema (ERC1155 or ERC721)
        const [isErc1155, isErc721] = await Promise.allSettled<boolean>([
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
            if (isErc1155.status === "fulfilled" && isErc1155.value) {
                await getContractMetadata(erc1155Helper, "erc1155")
            } else if (isErc721.status === "fulfilled" && isErc721.value) {
                await getContractMetadata(erc721Helper, "erc721")
            } else {
                throw new Error("Contract schema could not be determined. Try switching network")
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    const fetchAccountERC1155Token = async () => {
        const transferSingleLogs = await publicClient.getLogs({
            address: contractMetadata?.contractAddress as any,
            event: parseAbiItem("event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"),
            strict: true,
            fromBlock: BigInt(0),
            toBlock: "latest",
            args: {
                to: address
            }
        })

        const transferBatchLogs = await publicClient.getLogs({
            address: contractMetadata?.contractAddress as any,
            event: parseAbiItem("event TransferBatch( address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)"),
            strict: true,
            fromBlock: BigInt(0),
            toBlock: "latest",
            args: {
                to: address
            }
        })

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
        const transferLogs = await publicClient.getLogs({
            address: contractMetadata?.contractAddress as any,
            event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"),
            strict: true,
            fromBlock: BigInt(0),
            toBlock: "latest",
            args: {
                to: address
            }
        })

        const tokenIds = Array.from(new Set(transferLogs.map(log => log.args?.tokenId?.toString())))
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

        const accountTokens = await Promise.all(tokenIds.map(tokenId => fetchTokenMetaData({tokenId: tokenId as string})))
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

        if (accountTokens.length === 0) {
            throw new Error("We couldn't find any tokens for this contract in your wallet")
        }

        setAccountTokens(accountTokens)
        setScreen("token_balance")
    }

    const uploadAccountTokens = async (collection: string) => {
        const response = await fetcher(apiRoutes.import, {
            method: "POST",
            body: JSON.stringify({
                contract: contractMetadata,
                tokens: accountTokens,
                xcollection: collection
            })
        })

        if (response.success) {
            // navigate to contract page
            router.push(replaceUrlParams(appRoutes.viewContract, {
                chainId: contractMetadata?.chainId?.toString() as string,
                contractAddress: contractMetadata?.contractAddress as string
            }))
        }
    }
 
    return (
        <div className="mx-auto">
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
                        <div className="max-w-md">
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