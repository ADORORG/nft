import Button from "@/components/Button"
import Link from "next/link"
import appRoutes from "@/config/app.route"

export default function HeroButton() {
    
    return (
        <div className="flex gap-6 my-6">
            <Link href={appRoutes.create}>
                <Button
                    className="font-semibold py-3 px-8 text-2xl"
                    variant="gradient"
                    rounded
                >
                    Create
                </Button> 
            </Link>     
            <Link href={appRoutes.marketplace}>
                <Button
                    className="font-semibold py-3 px-8 text-2xl transition duration"
                    variant="gradient"
                    inversed
                    rounded
                >
                    Marketplace
                </Button>  
            </Link>
        </div>
    )
}