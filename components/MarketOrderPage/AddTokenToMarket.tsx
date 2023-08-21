import type TokenPageProps from "@/components/TokenPage/types"
import type MarketOrderType from "@/lib/types/market"
import type { CryptocurrencyType } from "@/lib/types/currency"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { InputField, Radio, SwitchCheckbox } from "@/components/Form"
import { Select } from "@/components/Select"
import Button from "@/components/Button"
import InfoText from "@/components/InfoText"
import { dateToHtmlInput, dateToRelativeDayAndHour } from "@/utils/date"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { useAuthStatus } from "@/hooks/account"
import { useAllCurrencies } from "@/hooks/fetch"
import { useContractChain } from "@/hooks/contract"
import { parseUnits, getAddress } from "viem"
import { useNetwork, usePublicClient, useWalletClient } from "wagmi"
/** Import nft & marketplace ABIs versions */
import { marketplaceAbiVersionMap } from "@/abi/marketplace"
// import { erc1155AbiVersionMap } from "@/abi/erc1155"
import { erc721AbiVersionMap } from "@/abi/erc721"
import { defaultMarketplaceVersion, getMarketplaceContract } from "@/config/marketplace.contract"
import { IERC721PermitInterface } from "@/config/interface.id"
import apiRoutes from "@/config/api.route"


export default function AddTokenToMarket(props: TokenPageProps) {
    const router = useRouter()
    const { currencies } = useAllCurrencies()
    const { chain } = useNetwork()
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const contractChain = useContractChain(props.token.contract)
    const { address, session } = useAuthStatus()
    /** List form fields */
    const [orderData, setOrderData] = useState<Partial<MarketOrderType>>({})
    /** Processing status */
    const [loading, setLoading] = useState(false)
    /** Keep track of actions processesd.
     * This way, if transaction fails or an unexpected error occurred, user could continue from the last point
     * This may not be necessary if we have a backend cron that monitors the changes/events in the contract onchain 
    */
    const [processedOnchain, setProcessedOnchain] = useState(false)
    const [processedOffchain, setProcessedOffchain] = useState(false)
    /** Date and Time used to handle orderData.endsAt */
    const [time, setTime] = useState("")
    const [date, setDate] = useState("")
    /**
     * Consent to approval all token if it"s a onchain listing
     */
    const [consentToApproveAll, setConsentToApproveAll] = useState(false)
    /** Calculate days and hours to auction end date */
    const auctionTimeLeft = dateToRelativeDayAndHour(orderData?.endsAt)
    /** Are we dealing with ERC721 nft schema otherwise ERC1155 */
    const isErc721 = props.token.contract.nftSchema === "erc721"
    /** Listing saleType */
    const isAuction = orderData.saleType === "auction"
    
    /** Handle form fields change */
    const handleChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        const { name, value } = e.target
        setOrderData({...orderData, [name]: value})
    }

    /** Handle time and date for auction endsAt */
    const handleDateAndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        let endsAt = orderData.endsAt

        if (name === "date") {
            endsAt = new Date(`${value} ${time}`)
            setDate(value)
        } else if (name === "time") {
            setTime(value)
            endsAt = new Date(`${date} ${value}`)
        }

        setOrderData({
            ...orderData,
           endsAt
        })
    }

    /** Validate market order form */
    const validateOrderForm = () => {
        const auctionFields = ["buyNowPrice", "endsAt"] as const
        const commonFields = ["saleType", "currency", "price"] as const
        const { saleType } = orderData

        if (!saleType) {
            throw new Error("Please select Auction | Fixed")
        }

        for (const field of commonFields) {
            if (!orderData[field]) {
                throw new Error("Please fill all fields")
            }
        }

        if (saleType === "auction") {
            for (const field of auctionFields) {
                if (!orderData[field]) {
                    throw new Error("Please fill all fields for auction")
                }
            }
        }
    }

    /** Get Approval Signature */
    const getApprovalSignature = ({
        tokenContractName,
        tokenContractChainId,
        tokenContractAddress,
        tokenContractNonce,
        tokenId,
        marketplaceContractAddress,
        signatureDeadline
    }:{
        tokenContractName: string,
        tokenContractChainId: number,
        tokenContractAddress: string,
        tokenContractNonce: bigint,
        tokenId: number,
        marketplaceContractAddress: string,
        signatureDeadline: number

    }) => {
        /** Request approval signature */
        return walletClient?.signTypedData({
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                Permit: [
                    { name: "spender", type: "address" },
                    { name: "tokenId", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            },
            primaryType: "Permit",
            domain: {
                name: tokenContractName,
                version: "1",
                chainId: BigInt(tokenContractChainId),
                verifyingContract: getAddress(tokenContractAddress),
            },
            message: {
                spender: getAddress(marketplaceContractAddress),
                tokenId: BigInt(tokenId),
                nonce: BigInt(tokenContractNonce),
                deadline: BigInt(signatureDeadline)
            }
        })
    }

    /** Get order signature */
    const getOrderSignature = ({
        marketplaceContractVersion,
        marketplaceContractName,
        marketplaceContractAddress,
        tokenContractChainId,
        tokenContractAddress,
        tokenId,
        bigOrderPrice,
        currency,
        signatureDeadline,
    }: {
        marketplaceContractVersion: string, 
        marketplaceContractName: string, 
        marketplaceContractAddress: string,
        tokenContractChainId: number,
        tokenContractAddress: string,
        tokenId: number,
        bigOrderPrice: bigint,
        currency: CryptocurrencyType,
        signatureDeadline: number,
    }) => {
         /** Request order signature */
        return walletClient?.signTypedData({
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                Order: [
                    { name: "token", type: "address" },
                    { name: "tokenId", type: "uint256" },
                    { name: "paymentToken", type: "address" },
                    { name: "buyNowPrice", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            },
            primaryType: "Order",
            domain: {
                name: marketplaceContractName,
                version: marketplaceContractVersion,
                chainId: BigInt(tokenContractChainId),
                verifyingContract: getAddress(marketplaceContractAddress),
            },
            message: {
                token: getAddress(tokenContractAddress),
                tokenId: BigInt(tokenId),
                paymentToken: getAddress(currency.address),
                buyNowPrice: bigOrderPrice,
                deadline: BigInt(signatureDeadline)
            }
        })
    }

    /**
     * Save new market data to the database
     * @todo Make it reusable in other similar functions
     * @param orderData
     */
    const addTokenToMarketplaceOffchain = async (orderData: MarketOrderType) => {
        const response = await fetcher(apiRoutes.createMarketOrder, {
            method: "POST",
            body: JSON.stringify(orderData)
        })

        if (response.success) {
            setProcessedOffchain(true)
            toast.success(response.message)
            router.refresh()
        }
    }

    /**
    * Handle token listing in the marketplace 
    * @todo Reduce function further - separation of concern
    */
    const addTokenToMarketplaceOnchain = async () => {
        /**
         * ERC1155 Marketplace is not implemented yet
         */
        if (!isErc721) {
            throw new Error("ERC1155 market is not implemented")
        }

        /** Validate market form fields */
        validateOrderForm()

        const {
            tokenId,
            contract: {
                contractAddress: tokenContractAddress,
                version: tokenContractVersion,
                chainId: tokenContractChainId
            }
        } = props.token

        /** Create an intermediate type of Token Contract version
         * This is to ensure that "viem" infer argument type
        */
        type TokenContractAbiVersions = keyof typeof erc721AbiVersionMap
        /** The ABI version for this token contract */
        const tokenContractAbi = erc721AbiVersionMap[tokenContractVersion as TokenContractAbiVersions]

        /** 
         * The permit type to use for listing of this token (Offchain or onchain).
         * By default, we"ll list the token onchain */
        let permitType: "offchain" | "onchain" = "onchain"

        /**
         * Check for offchain permit support on token contract address
         * @note Nft Contract deployed on this app support offchain.
         * However, contract imported from another platform may not support offchain permit.
         * Hence, the need to check for support
         */
        try {
            const supportOffchainSigning = await publicClient.readContract({
                address: tokenContractAddress as any,
                abi: tokenContractAbi,
                functionName: "supportsInterface",
                args: [IERC721PermitInterface]
            })

            if (supportOffchainSigning) {
                permitType = "offchain"
            }

        } catch (error: any) {
            console.log(error)
        }

        /** The selected currency for listing */
        const currency = currencies?.find(c => c._id?.toString() === orderData.currency) as CryptocurrencyType
        /** Convert order price to bigInt */
        const bigOrderPrice = parseUnits(orderData.price as string, currency.decimals)
        /** Convert order buyNowPrice to bigInt */
        const bigOrderBuyNowPrice = parseUnits(orderData.buyNowPrice || "0", currency.decimals)
        /** A hard coded deadline of a month (in seconds) is used for order and approval deadline for signature */
        const signatureDeadline = Math.floor(Date.now() / 1000) + 2592000

        /** 
         * The appropriate marketplace contract address
         * We"ll add new listing to the latest (default) marketplace contract
         * Hence, we get the marketplace contract address & its ABI using the defaultMarketplaceVersion
         * 
        */
        const marketplaceContractAddress = getMarketplaceContract(props.token, defaultMarketplaceVersion)
        const marketplaceAbiByVersion = marketplaceAbiVersionMap[defaultMarketplaceVersion]
        let orderSignature, approvalSignature, listTxHash

        /** Auction listing happens onchain for the current defaultMarketplaceVersion.
         * No offchain listing for auction sale type
         */
        if (permitType === "offchain" && !isAuction) {
            // This listing is fixed price listing with offchain support

            /**
             * Fetch marketplace contract name and version, contract name and nonce to use for signing
             */
            const [marketplaceContractName, marketplaceContractVersion, tokenContractName, tokenContractNonce] = await Promise.all([
                publicClient.readContract({
                    address: marketplaceContractAddress,
                    abi: marketplaceAbiByVersion,
                    functionName: "name",
                }),
                publicClient.readContract({
                    address: marketplaceContractAddress,
                    abi: marketplaceAbiByVersion,
                    functionName: "version",
                }),
                publicClient.readContract({
                    address: getAddress(tokenContractAddress),
                    abi: tokenContractAbi,
                    functionName: "name",
                }),
                publicClient.readContract({
                    address: getAddress(tokenContractAddress),
                    abi: tokenContractAbi,
                    functionName: "nonces",
                    args: [BigInt(tokenId)]
                })
            ])

            orderSignature = await getOrderSignature({
                marketplaceContractVersion,
                marketplaceContractAddress,
                marketplaceContractName,
                tokenContractChainId,
                tokenContractAddress,
                tokenId,
                bigOrderPrice,
                currency,
                signatureDeadline
            })

            approvalSignature = await getApprovalSignature({
                tokenContractName,
                tokenContractChainId,
                tokenContractAddress,
                tokenContractNonce,
                tokenId,
                marketplaceContractAddress,
                signatureDeadline
            })

        } else {

            if (permitType === "offchain") {
                /** Offchain is supported. However, this is an auction listing 
                 * We'll use the eip712 approvalSignature 
                */
                const [tokenContractName, tokenContractNonce] = await Promise.all([
                    publicClient.readContract({
                        address: getAddress(tokenContractAddress),
                        abi: tokenContractAbi,
                        functionName: "name",
                    }),
                    publicClient.readContract({
                        address: getAddress(tokenContractAddress),
                        abi: tokenContractAbi,
                        functionName: "nonces",
                        args: [BigInt(tokenId)]
                    })
                ])

                approvalSignature = await getApprovalSignature({
                    tokenContractName,
                    tokenContractChainId,
                    tokenContractAddress,
                    tokenContractNonce,
                    tokenId,
                    marketplaceContractAddress,
                    signatureDeadline
                })
                
            } else if (consentToApproveAll) {
                /** eip712 offchain approval signature is not supported.
                 * Thus, request to approval all nft token if user has consented to approval all
                 */

                /** isApprovedForAll status for this marketplace contract */
                const isApproved = await publicClient.readContract({
                    address: getAddress(tokenContractAddress),
                    abi: tokenContractAbi,
                    functionName: "isApprovedForAll",
                    args: [address as any, marketplaceContractAddress]
                })

                if (!isApproved) {
                    await walletClient?.writeContract({
                        address: getAddress(tokenContractAddress),
                        abi: tokenContractAbi,
                        functionName: "setApprovalForAll",
                        args: [marketplaceContractAddress, true]
                    })
                }


            } else {
                /** Approved address to spend this token */
                const approvedAddress = await publicClient.readContract({
                    address: getAddress(tokenContractAddress),
                    abi: tokenContractAbi,
                    functionName: "getApproved",
                    args: [BigInt(tokenId)]
                })

                if (approvedAddress.toLowerCase() !== marketplaceContractAddress.toLowerCase()) {
                    await walletClient?.writeContract({
                        address: getAddress(tokenContractAddress),
                        abi: tokenContractAbi,
                        functionName: "approve",
                        args: [marketplaceContractAddress, BigInt(tokenId)]
                    })
                }
            }

            if (isAuction) {
                const auctionDuration = Math.floor(((orderData?.endsAt || new Date()).getTime() - Date.now()) / 1000) // duration in seconds,
                if (approvalSignature) {
                    // use offchain signature
                    listTxHash = await walletClient?.writeContract({
                        address: marketplaceContractAddress,
                        abi: marketplaceAbiByVersion,
                        functionName: "createAuctionListingWithPermit",
                        args: [
                            getAddress(tokenContractAddress),
                            BigInt(tokenId),
                            bigOrderPrice,
                            bigOrderBuyNowPrice,
                            BigInt(auctionDuration),
                            getAddress(currency.address),
                            BigInt(signatureDeadline),
                            approvalSignature
                        ]
                    })
                } else {
                    // no offchain
                    listTxHash = await walletClient?.writeContract({
                        address: marketplaceContractAddress,
                        abi: marketplaceAbiByVersion,
                        functionName: "createAuctionListing",
                        args: [
                            getAddress(tokenContractAddress),
                            BigInt(tokenId),
                            bigOrderPrice,
                            bigOrderBuyNowPrice,
                            BigInt(auctionDuration),
                            getAddress(currency.address)
                        ]
                    })
                }
            } else {
                listTxHash = await walletClient?.writeContract({
                    address: marketplaceContractAddress,
                    abi: marketplaceAbiByVersion,
                    functionName: "createFixedListing",
                    args: [
                        getAddress(tokenContractAddress),
                        BigInt(tokenId),
                        bigOrderPrice,
                        getAddress(currency.address)
                    ]
                })
            }
        }

        if (listTxHash) {
            // wait for listTxhash
            // if it fails, we do not want to proceed with listing
            await publicClient.waitForTransactionReceipt({hash: listTxHash})
        }
        // Done processing onchain
        setProcessedOnchain(true)

        return {
            token: props.token,
            saleType: isAuction ? "auction" : "fixed",
            quantity: 1,
            seller: session?.user.address as string,
            permitType,
            status: "active",
            currency,
            listTxHash,
            version: defaultMarketplaceVersion.toString(),
            orderDeadline: signatureDeadline.toString(),
            orderSignature,
            approvalSignature
        } as const
    }

    /**
     * Handle listing token in the marketplace
     * @todo - Make it reusable in other similar functions
     */
    const handleAddTokenToMarketplace = async () => {
        try {
            setLoading(true)

            if (!processedOnchain) {
                // ensure we are connected to right chain that host this token contract
                await contractChain.ensureContractChainAsync()
                
                const result = await addTokenToMarketplaceOnchain()
                const update = {...orderData, ...result}
                setOrderData(update)
                await addTokenToMarketplaceOffchain(update as MarketOrderType)
            } else if (!processedOffchain) {
                await addTokenToMarketplaceOffchain(orderData as MarketOrderType)
            } else {
                router.refresh()
            }

        } catch (error: any) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col justify-center my-3">
            <h1 className="text-2xl py-6">
                Add {props.token.name}#{props.token.tokenId} to market
            </h1>
            <div className="flex flex-wrap gap-4 my-1">
                <Radio 
                    label="Fixed"
                    value="fixed"
                    name="saleType"
                    onChange={handleChange}
                    disabled={loading}
                />
                <Radio 
                    label="Auction"
                    value="auction"
                    name="saleType"
                    onChange={handleChange}
                    disabled={loading}
                />
            </div>

            <Select
                className="rounded my-1"
                value={orderData?.currency?.toString() || ""}
                onChange={handleChange}
                name="currency"
                disabled={loading}
            >
                <Select.Option value="" disabled>Select currency</Select.Option>
                {
                    currencies && 
                    currencies.length &&
                    /** If not chain (i.e wallet is not connected) show all currencies */
                    currencies.filter(c => !chain || c.chainId === chain.id)
                    .map(c => (
                        <Select.Option
                            key={c._id?.toString()} 
                            value={c._id?.toString()}
                        >
                            {c.name} {c.symbol}
                        </Select.Option>
                    ))
                }
            </Select>

            <div className="my-2">
                <InputField 
                    label={orderData.saleType === "auction" ? "Starting Price" : "Price"}
                    className="rounded"
                    name="price"
                    type="number"
                    min="0"
                    step="0.0001"
                    value={orderData.price || "0"}
                    onChange={handleChange}
                    disabled={loading}
                />
            </div>

            {
                orderData.saleType === "auction" ?
                <>
                    <div className="my-2">
                        <InputField 
                            label="Instant buy price"
                            className="rounded"
                            name="buyNowPrice"
                            type="number"
                            min={orderData.price || "0"}
                            step="0.0001"
                            value={orderData.buyNowPrice || "0"}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-wrap my-2">
                        <InputField 
                            label="End date"
                            className="rounded"
                            name="date"
                            type="date"
                            min={dateToHtmlInput()}
                            value={date}
                            onChange={handleDateAndTimeChange}
                            disabled={loading}
                        />
                        <InputField 
                            label="End time"
                            className="rounded"
                            name="time"
                            type="time"
                            value={time}
                            onChange={handleDateAndTimeChange}
                            disabled={loading}
                        />
                    </div>
                    <p className="py-2">
                        Auction ends: {auctionTimeLeft.days}, {auctionTimeLeft.hours}
                    </p>
                </>
                :
                null
            }

            <div className="my-2">
                <SwitchCheckbox
                    label="Approve all tokens"
                    checked={consentToApproveAll}
                    onChange={() => setConsentToApproveAll(!consentToApproveAll)}
                />
            </div>
             {/* Additional information */}
             <div className="flex flex-col gap-2 my-2">
                <InfoText
                    text="We may request an approval signature"
                />
                <InfoText
                    text="We may request an order signature"
                />
            </div>
            <div>
                <Button
                    className="w-full md:w-3/4"
                    variant="gradient"
                    loading={loading}
                    disabled={loading || !session?.user}
                    onClick={handleAddTokenToMarketplace}
                    rounded
                >
                    Add to market
                </Button>
            </div>
        </div>
    )
}