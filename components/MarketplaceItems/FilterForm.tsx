"use client"
import type { TotalMarketValueInDollarType } from "@/lib/types/common"
import { useEffect } from "react"
import { useAtom } from "jotai"
import { Select } from "@/components/Select"
import { marketFilterStore } from "@/store/form"
import { formatNumber } from "@/utils/main"
import { collectionCategories } from "@/lib/app.config"

interface MarketFilterFormProps {
    marketValue: TotalMarketValueInDollarType
}

export default function MarketFilterForm(props: MarketFilterFormProps) {
    const { marketValue } = props
    const [marketFilter, setMarketFilter] = useAtom(marketFilterStore)

    useEffect(() => {
        // totalOrder is used by MarketplaceItems in "./index" to determine if there's next page 
        setMarketFilter({...marketFilter, totalOrder: marketValue.orderCount})
        // eslint-disable-next-line
    }, [marketValue])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setMarketFilter({...marketFilter, [name]: value})
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 mx-8 lg:mx-1">
            <div className="w-full md:2/3 lg:w-1/3 flex flex-col md:flex-row gap-4 items-center justify-between">
                <Select
                    onChange={handleChange}
                    name="saleType"
                    value={marketFilter?.saleType || ""}
                    className="rounded"
                >
                    <Select.Option value="" disabled>Sale Type</Select.Option>
                    <Select.Option value="all">All</Select.Option>
                    <Select.Option value="auction">Auction</Select.Option>
                    <Select.Option value="fixed">Fixed Price</Select.Option>
                    <Select.Option value="offer">Offer</Select.Option>
                </Select>

                <Select
                    onChange={handleChange}
                    name="nftSchema"
                    value={marketFilter?.nftSchema || ""}
                    className="rounded"
                >
                    <Select.Option value="" disabled>NFT Type</Select.Option>
                    <Select.Option value="all">All</Select.Option>
                    <Select.Option value="erc721">ERC721</Select.Option>
                    <Select.Option value="erc1155">ERC1155</Select.Option>
                </Select>

                <Select
                    onChange={handleChange}
                    name="createdAt"
                    value={marketFilter?.createdAt || "-1"}
                    className="rounded"
                >
                    <Select.Option value="" disabled>Date Added</Select.Option>
                    <Select.Option value="-1">Latest</Select.Option>
                    <Select.Option value="1">Oldest</Select.Option>
                </Select>

                <Select
                    onChange={handleChange}
                    name="category"
                    value={marketFilter?.category || ""}
                    className="rounded"
                >
                    <Select.Option value="" disabled>Category</Select.Option>
                    <Select.Option value="all">All category</Select.Option>
                    {
                        collectionCategories.map((category) => (
                            <Select.Option 
                                key={category.slug}
                                value={category.slug}
                            >{category.name}</Select.Option>
                        ))
                    }
                </Select>
            </div>

            <div>
                <h5 className="text-2xl">{formatNumber(marketValue.dollarValue)}k+</h5>
            </div>
        </div>
    )
}