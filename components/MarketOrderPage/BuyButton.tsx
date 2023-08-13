import type { MarketOrderProp } from "./types"
import { Tag as TagIcon } from "react-bootstrap-icons"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import Button from "@/components/Button"


export default function BuyButton(props: MarketOrderProp) {
    
    const buyFixedOrder = () => {

    }
    
    return (
        <div>
            <Button 
                className="flex flex-wrap items-center"
                variant="secondary"
                onClick={buyFixedOrder} 
                rounded
            >
                <TagIcon
                    className="h-5 w-5"
                />&nbsp; 
                Buy now&nbsp; 
                <CryptoCurrencyDisplay
                    currency={props.order.currency}
                    amount={props.order.price}
                />
            </Button>
        </div>
    )
}