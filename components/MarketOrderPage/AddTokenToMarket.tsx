import type TokenPageProps from "@/components/TokenPage/types"
import type MarketOrderType from "@/lib/types/market"
import { ChangeEvent, useState } from "react"
import { InputField, Radio, SwitchCheckbox } from "@/components/Form"
import { Select } from "@/components/Select"
import Button from "@/components/Button"
import { dateToHtmlInput, dateToRelativeDayAndHour } from "@/utils/date"
import { useAllCurrencies } from "@/hooks/fetch"
import { useNetwork } from "wagmi"

export default function AddTokenToMarket(props: TokenPageProps) {
    const { currencies } = useAllCurrencies()
    const { chain } = useNetwork()
    const [orderData, setOrderData] = useState<Partial<MarketOrderType>>({})
    /** Date and Time used to handle orderData.endsAt */
    const [time, setTime] = useState("")
    const [date, setDate] = useState("")
    /**
     * Consent to approval all token if it's a onchain listing
     */
    const [consentToApproveAll, setConsentToApproveAll] = useState(false)

    const auctionTimeLeft = dateToRelativeDayAndHour(orderData?.endsAt as Date)
    
    const handleChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        const { name, value } = e.target
        setOrderData({...orderData, [name]: value})
    }

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

    const handleAddTokenToMarketplace = () => {

    }

    return (
        <div className="flex flex-col justify-center my-3">
            <div className="flex flex-wrap gap-4 my-1">
                <Radio 
                    label="Fixed"
                    value="fixed"
                    name="saleType"
                    onChange={handleChange}
                />
                <Radio 
                    label="Auction"
                    value="auction"
                    name="saleType"
                    onChange={handleChange}
                />
            </div>

            <Select
                className="rounded my-1"
                value={orderData.currency?.toString() || ""}
                onChange={handleChange}
            >
                <Select.Option value="" disabled>Select currency</Select.Option>
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
                        />
                        <InputField 
                            label="End time"
                            className="rounded"
                            name="time"
                            type="time"
                            value={time}
                            onChange={handleDateAndTimeChange}
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

            <div>
                <Button
                    className="w-full md:w-3/4"
                    variant="secondary"
                    onClick={handleAddTokenToMarketplace}
                    rounded
                >
                    Add to market
                </Button>
            </div>
        </div>
    )
}