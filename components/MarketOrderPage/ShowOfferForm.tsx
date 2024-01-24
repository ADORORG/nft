import type MarketOrderType from "@/lib/types/market"
import type TokenPageProps from "@/components/TokenPage/types"
import type { MarketOrdersProp } from "./types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Tag as TagIcon } from "react-bootstrap-icons"
import { useNetwork, useBalance } from "wagmi"
import { useAuthStatus } from "@/hooks/account"
import { useAllCurrencies } from "@/hooks/fetch"
import { useContractChain } from "@/hooks/contract"
import { useMarketOffer } from "@/hooks/contract/marketplace"
import { InputField } from "@/components/Form"
import { Select } from "@/components/Select"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import { CryptoToFiat } from "@/components/Currency"
import Button from "@/components/Button"
import InfoText from "@/components/InfoText"
import DateAndTime from "@/components/DateAndTime"
import apiRoutes from "@/config/api.route"
import { defaultMarketplaceVersion } from "@/config/marketplace.contract"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"

export default function ShowOfferForm(props: MarketOrdersProp & TokenPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [offerPrice, setOfferPrice] = useState("1.00")
    const [offerCurrency, setOfferCurrency] = useState("")
    const [offerDeadline, setOfferDeadline] = useState(0)
    const { session, isConnected } = useAuthStatus()
    const { chain } = useNetwork()
    const { currencies } = useAllCurrencies()
    const contractChain = useContractChain(props.token.contract)
    const marketOffer = useMarketOffer()
    /** Check for active offer from this session account for this token */
    const activeOfferFromAccount = session && props?.orders?.find(order => order.status === "active" && order.saleType === "offer" && order.buyer?.address.toLowerCase() === session.user.address)

    const makeAnOffer = async () => {
        try {
            setLoading(true)

            if (!offerPrice || !offerCurrency) {
                throw new Error("Please select a payment currency and enter an offer price")
            }

            if (offerDeadline < Math.floor(Date.now() / 1000)) {
                throw new Error("Please select a valid offer deadline")
            }

            /** Get the offer currency */
            const currency = currencies?.find(c => c._id?.toString() === offerCurrency)
            
            if (!currency) {
                /** This should not happen */
                throw new Error("Please select a payment currency")
            }
            // Must be connect to network where the contract was deployed
            await contractChain.ensureContractChainAsync()

            /** Create market order for this offer*/
            const marketOfferData = {
                token: props.token,
                price: offerPrice,
                saleType: "offer",
                status: "active",
                quantity: 1,
                permitType: "offchain",
                currency: currency,
                seller: props.token.owner,
                buyer: session?.user,
                orderSignature: '',
                orderDeadline: offerDeadline,
                version: defaultMarketplaceVersion.toString()
            } satisfies MarketOrderType
            
            // Get the offer signature from the offerer
            const orderSignature = await marketOffer.requestOfferData(marketOfferData)
            // overwrite the orderSignature
            marketOfferData.orderSignature = orderSignature as string

            const response = await fetcher(apiRoutes.createMarketOrder, {
                // Overwrite seller to Ethereum address
                body: JSON.stringify(marketOfferData),
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
            <h2 className="text-2xl py-6">
                Make an offer for <strong>{props.token.name}#{props.token.tokenId}</strong>
            </h2>
            {
                activeOfferFromAccount ?
                <Button 
                    className="my-3 flex flex-wrap justify-center items-center w-full"
                    variant="gradient"
                    rounded
                    disabled
                >
                    <TagIcon className="w-5 h-5 mx-1" /> Your offer is active
                </Button>
                :
                <div className="flex flex-col gap-4">
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
                    
                    <div className="my-1">
                        <h5>Offer deadline</h5>
                        <DateAndTime 
                            onChange={newDate => (
                                setOfferDeadline(Math.floor(newDate.getTime() / 1000))
                            )}
                            minDate={new Date()}
                            value={offerDeadline}
                        />
                    </div>
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
                            className="my-2 w-full md:w-3/4 text-lg flex items-center justify-center"
                            onClick={makeAnOffer}
                            variant="gradient"
                            loading={loading}
                            disabled={loading}
                            rounded
                        >
                            <span>Send offer</span>
                            <CryptoToFiat
                                currency={currencies?.find(c => c._id?.toString() === offerCurrency) as any}
                                amount={offerPrice}
                                withIcon
                            />
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