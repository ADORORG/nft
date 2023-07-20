import { useState, useEffect } from "react"
import Button from "@/components/Button"
import { MARKET_SALE_TYPES } from "@/lib/types/common"

interface saleTypeButtonsProps {
    onSelected: (category: string) => void
    exclude?: Array<string>
}

export default function SaleTypeButtons({ onSelected, exclude = [] }: saleTypeButtonsProps) {
    const buttonsType = MARKET_SALE_TYPES.filter((saleType) => !exclude.includes(saleType))
    const [activeButton, setActiveButton] = useState<string>(buttonsType[0])

    useEffect(() => {
        // send the first button as the default
        onSelected(activeButton);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-wrap justify-center gap-4">
            {buttonsType.map((type, index) => (
                <Button
                    key={type+index}
                    className={`capitalize px-4 py-2 lg:text-2xl transition ${type === activeButton ? "opacity-100" : "opacity-60"}`}
                    variant="primary"
                    rounded
                    onClick={() => {
                        onSelected(type)
                        setActiveButton(type)
                    }}
                >
                    {type}
                </Button>
            ))}
        </div>
    )
}