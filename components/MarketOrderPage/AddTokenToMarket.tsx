import type TokenPageProps from "@/components/TokenPage/types"
import type MarketOrderType from "@/lib/types/market"
import type { CryptocurrencyType } from "@/lib/types/currency"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { InputField, Radio, SwitchCheckbox } from "@/components/Form"
import { Select } from "@/components/Select"
import { CryptoToFiat } from "@/components/Currency"
import DateAndTime from "@/components/DateAndTime"
import Button from "@/components/Button"
import InfoText from "@/components/InfoText"
import { callFunctionLater } from "@/utils/main"
import { dateToRelativeDayAndHour } from "@/utils/date"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { useAuthStatus } from "@/hooks/account"
import { useAllCurrencies } from "@/hooks/fetch"
import { useContractChain } from "@/hooks/contract"
import { useSignatures } from "@/hooks/contract/marketplace"
import { parseUnits, getAddress } from "viem"
import { useNetwork, usePublicClient, useWalletClient } from "wagmi"
/** Import nft & marketplace ABIs versions */
import { marketplaceAbiVersionMap } from "@/abi/marketplace"
// import { erc1155AbiVersionMap } from "@/abi/erc1155"
import { erc721AbiVersionMap } from "@/abi/erc721"
import { defaultMarketplaceVersion, getMarketplaceContract } from "@/config/marketplace.contract"
import apiRoutes from "@/config/api.route"


export default function AddTokenToMarket(props: TokenPageProps) {
    const router = useRouter()
    const { currencies } = useAllCurrencies()
    const { chain } = useNetwork()
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const contractChain = useContractChain(props.token.contract)
    const signatures = useSignatures()
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
                contractAddress: tokenContractAddress = "",
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
        
        const hasOffchainSupport = await signatures.hasOffchainSigning({contractAddress: tokenContractAddress})
        if (hasOffchainSupport) {
            permitType = "offchain"
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
         * Get the appropriate marketplace contract address.
         * We'll always add new listing to the latest (default) marketplace contract.
         * Hence, we get the marketplace contract address & its ABI using the defaultMarketplaceVersion
         * 
        */
        const marketplaceContractAddress = getMarketplaceContract(tokenContractChainId, defaultMarketplaceVersion)
        const marketplaceAbiByVersion = marketplaceAbiVersionMap[defaultMarketplaceVersion]
        let orderSignature, approvalSignature, listTxHash

        /**
         * We don't want to call these functions until we need them
         */
        const nftContractStaticParams = callFunctionLater(signatures.getContractStaticParams, {contractAddress: tokenContractAddress, tokenId: tokenId as number})
        const marketplaceStaticParams = callFunctionLater(signatures.getMarketplaceStaticParams, {marketplaceContractAddress})
       
        /** Auction listing happens onchain for the current defaultMarketplaceVersion.
         * No offchain listing for auction sale type
         */ 
        if (permitType === "offchain" && !isAuction) {
            // This listing is fixed price listing with offchain support

            /**
             * Fetch marketplace contract name and version, contract name and nonce to use for signing
             */
            const [{marketplaceName, marketplaceVersion}, {tokenContractName, tokenContractNonce}] = await Promise.all([
                marketplaceStaticParams.exec(),
                nftContractStaticParams.exec()
            ])

            orderSignature = await signatures.orderSignature({
                marketplaceContractVersion: marketplaceVersion,
                marketplaceContractAddress,
                marketplaceContractName: marketplaceName,
                tokenContractChainId,
                tokenContractAddress,
                tokenId: tokenId as number,
                bigOrderPrice,
                paymentToken: currency.address,
                signatureDeadline
            })

            approvalSignature = await signatures.approvalSignature({
                tokenContractName,
                tokenContractChainId,
                tokenContractAddress,
                tokenContractNonce,
                tokenId: tokenId as number,
                marketplaceContractAddress,
                signatureDeadline
            })

        } else {

            if (permitType === "offchain") {
                /** Offchain is supported. However, this is an auction listing 
                 * We'll use the eip712 approvalSignature 
                */
               const { tokenContractName, tokenContractNonce } = await nftContractStaticParams.exec()
                approvalSignature = await signatures.approvalSignature({
                    tokenContractName,
                    tokenContractChainId,
                    tokenContractAddress,
                    tokenContractNonce,
                    tokenId: tokenId as number,
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
                    args: [BigInt(tokenId as number)]
                })

                if (approvedAddress.toLowerCase() !== marketplaceContractAddress.toLowerCase()) {
                    await walletClient?.writeContract({
                        address: getAddress(tokenContractAddress),
                        abi: tokenContractAbi,
                        functionName: "approve",
                        args: [marketplaceContractAddress, BigInt(tokenId as number)]
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
                            BigInt(tokenId as number),
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
                            BigInt(tokenId as number),
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
                        BigInt(tokenId as number),
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
            orderDeadline: signatureDeadline,
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

    const PriceToFiat = ({price}: {price?: string}) => (
        orderData.currency ?
        <CryptoToFiat
            amount={price}
            currency={currencies?.find(c => c._id?.toString() === orderData.currency) as CryptocurrencyType}
            showZeroValue={true}
            withIcon={true}
        />
        :
        null
    )

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
                    label={
                        <span className="flex">
                            {orderData.saleType === "auction" ? "Starting Price" : "Price"}
                            <PriceToFiat price={orderData.price} />
                        </span>
                    }
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
                            label={
                                <span className="flex">
                                    Instant buy price
                                    <PriceToFiat price={orderData.buyNowPrice} />
                                </span>
                            }
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
                    <DateAndTime 
                        onChange={newDate => setOrderData({...orderData, endsAt: newDate})}
                        minDate={new Date()}
                    />

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