import type { MarketOrderProp } from "./types"
import { Tag as TagIcon } from "react-bootstrap-icons"
import Button from "@/components/Button"


export default function BuyButton(props: MarketOrderProp) {
    
    const buyFixedOrder = () => {

    }
    
    return (
        <div className="w-3/4">
            <Button 
                className="flex flex-wrap justify-center items-center gap-2 w-full py-3 text-xl md:text-2xl"
                variant="secondary"
                onClick={buyFixedOrder} 
                rounded
            >
                
                <TagIcon
                    className="h-5 w-5"
                />
                <span className="flex">
                    Buy now
                </span>
            
            </Button>
        </div>
    )
}