import Button from "@/components/Button"
import Link from "next/link"
import appRoutes from "@/config/app.route"

export default function HeroButton() {
    
    return (
        <div className="flex gap-6 my-6">
            <Link href={appRoutes.explore}>
                <Button
                    className="font-semibold py-3 px-8 text-2xl transition duration"
                    variant="primary"
                    inversed
                    rounded
                >
                    Explore
                </Button>  
            </Link>
            <Link href={appRoutes.create}>
                <Button
                    className="font-semibold py-3 px-8 text-2xl"
                    variant="secondary"
                    inversed
                    rounded
                >
                    Create
                </Button> 
            </Link>     
        </div>
    )
}