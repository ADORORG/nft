import type MarketOrderType from "@/lib/types/market"
import type TokenPageProps from "@/components/TokenPage/types"
import type { MarketOrdersProp } from "./types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Tag as TagIcon } from "react-bootstrap-icons"
import { useAuthStatus } from "@/hooks/account"
import { useNetwork, usePublicClient, useWalletClient } from "wagmi"
import { parseUnits, getAddress } from "viem"
import { useAllCurrencies } from "@/hooks/fetch"
import { InputField } from "@/components/Form"
import { Select } from "@/components/Select"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import Button from "@/components/Button"
import InfoText from "@/components/InfoText"
import erc20ABI from "@/abi/erc20"
/** Import the default (latest) marketplace ABIs */
// import erc1155MarketplaceABI from "@/abi/marketplace.erc1155"
import erc721MarketplaceABI from "@/abi/marketplace.erc721"
import apiRoutes from "@/config/api.route"
import { defaultMarketplaceVersion, getMarketplaceContract } from "@/config/marketplace.contract"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"

export default function ShowOfferForm(props: MarketOrdersProp & TokenPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [offerPrice, setOfferPrice] = useState("1.00")
    const [offerCurrency, setOfferCurrency] = useState("")
    const { session, isConnected, address } = useAuthStatus()
    const { chain } = useNetwork()
    const { currencies } = useAllCurrencies()
    const {data: walletClient} = useWalletClient({chainId: chain?.id})
    const publicClient = usePublicClient()
    /** Check for active offer from this session account for this token */
    const activeOfferFromAccount = session && props.orders.find(order => order.status === "active" && order.saleType === "offer" && order.buyer?.address.toLowerCase() === session.user.address)

    const makeAnOffer = async () => {
        try {
            setLoading(true)

            if (!offerPrice || !offerCurrency) {
                throw new Error("Please select a payment currency and enter an offer price")
            }

            /** Get the offer currency */
            const currency = currencies?.find(c => c._id?.toString() === offerCurrency)
            
            if (!currency) {
                /** This should not happen */
                throw new Error("Please select a payment currency")
            }

            const marketplaceContractAddress = getMarketplaceContract(props.token, defaultMarketplaceVersion)
            /** 
            * Get account balance and allowance for this currency
            * We are not using contract instance to reduce code bundle 
            * Contract instance bundled all methods. Thus, we are using
            * individual contract calls
            * @see - [View documentation](https://viem.sh/docs/contract/getContract.html)
            */
            const [bigAccountBalance, bigOfferCurrencyAllowance] = await Promise.all([
                publicClient.readContract({
                    address: currency?.address as any,
                    abi: erc20ABI,
                    functionName: "balanceOf",
                    args: [address]
                }),
                publicClient.readContract({
                    address: currency?.address as any,
                    abi: erc20ABI,
                    functionName: "allowance",
                    args: [address, marketplaceContractAddress]
                })
            ])

            /** Convert offer price to bigInt */
            const bigOfferPrice = parseUnits(offerPrice, currency.decimals)
            if (BigInt(bigAccountBalance as bigint) < bigOfferPrice) {
                throw new Error(`Not enough ${currency.symbol} balance`)
            }

            // const isErc721 = props.token.contract.nftSchema === "erc721"
            const tokenContractChainId = props.token.contract.chainId
            const tokenId = props.token.tokenId
            const tokenContractAddress = props.token.contract.contractAddress
            // const marketplaceAbi = isErc721 ? erc721MarketplaceABI : erc1155MarketplaceABI
            const marketplaceAbi = erc721MarketplaceABI

            /* const marketplaceContractInstance = getContract({
                address: marketplaceContractByVersion,
                abi: marketplaceAbi,
                publicClient
            }) */

            const [marketplaceContractName, marketplaceContractVersion] = await Promise.all([
                publicClient.readContract({
                    address: marketplaceContractAddress,
                    abi: marketplaceAbi,
                    functionName: "name",
                }),
                publicClient.readContract({
                    address: marketplaceContractAddress,
                    abi: marketplaceAbi,
                    functionName: "version",
                })
            ])  

            /** A hard coded deadline of a month (in seconds) is used as offer deadline for now */
            const offerDeadline = Math.floor(Date.now() / 1000) + 2592000

            /** Request order signature */
            const orderSignature = await walletClient?.signTypedData({
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
                    buyNowPrice: bigOfferPrice,
                    deadline: BigInt(offerDeadline)
                }
            })

            if (BigInt(bigOfferCurrencyAllowance as bigint) < bigOfferPrice) {
                /** Request offer currency token approval */
                await walletClient?.writeContract({
                    address: currency?.address as any,
                    abi: erc20ABI,
                    functionName: "approve",
                    args: [marketplaceContractAddress, bigOfferPrice]
                })
            }

            /** Create market order */
            const marketOffer = {
                token: props.token,
                price: offerPrice,
                saleType: "offer",
                status: "active",
                quantity: 1,
                permitType: "offchain",
                currency: currency,
                seller: props.token.owner,
                buyer: session?.user.address,
                orderSignature: orderSignature,
                orderDeadline: offerDeadline.toString(),
                version: defaultMarketplaceVersion.toString()
            } satisfies MarketOrderType
            
            const response = await fetcher(apiRoutes.createMarketOrder, {
                body: JSON.stringify(marketOffer),
                method: "POST"
            })

            if (response.success) {
                toast.success(response.message)
                router.refresh()
            }

        } catch (error: any) {
            const message = getFetcherErrorMessage(error)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="my-4">
            {
                activeOfferFromAccount ?
                <Button 
                    className="my-3 flex flex-wrap justify-center items-center w-full"
                    variant="secondary"
                    rounded
                    disabled
                >
                    <TagIcon className="w-5 h-5 mx-1" /> Your offer is active
                </Button>
                :
                <div className="flex flex-col gap-4">
                    <h5 className="my-2">
                        Make an offer for <strong>{props.token.name}#{props.token.tokenId}</strong>
                    </h5>
                    <InputField 
                        label="Offer price"
                        labelClassName="my-2"
                        className="rounded"
                        name="offerPrice"
                        type="number"
                        min={"0"}
                        step="0.0001"
                        value={offerPrice}
                        onChange={e => setOfferPrice(e.target.value)}
                    />

                    <Select 
                        onChange={e => setOfferCurrency(e.target.value)} 
                        value={offerCurrency}
                        className="my-2 rounded"
                    >
                        <Select.Option value="" disabled>Choose currency</Select.Option>
                        {
                            currencies && 
                            currencies.length &&
                            /** If not chain (i.e wallet is not connected) show all currencies */
                            currencies.filter(c => !chain || c.chainId === chain.id)
                            /** Remove chain coin like ETH, BNB. 
                             * Only tokens are accepted for offer */
                            .filter(c => !!Number(c.address))
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
                    
                    {/* Additional information */}
                    <div className="flex flex-col gap-2 my-2">
                        <InfoText
                            text="We will request an order signature"
                        />
                        <InfoText
                            text="We may request payment token approval"
                        />
                    </div>

                    {
                        isConnected ?
                        <Button
                            className="my-2 w-full md:w-3/4"
                            onClick={makeAnOffer}
                            variant="secondary"
                            loading={loading}
                            disabled={loading}
                            rounded
                        >
                            Send offer
                        </Button>
                        :
                        <ConnectWalletButton
                            className="my-2 md:w-3/4"
                        />
                    }
                    
                </div>
            }
        </div>
    )
}