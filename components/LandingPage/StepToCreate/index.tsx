import { PuzzlePieceIcon, WalletIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import Button from "@/components/Button"
import Link from "next/link"
import appRoutes from "@/config/app.route"

export default function StepsToCreate() {

    const iconClass = "w-16 h-16 text-rose-400"

    const creatorSteps = [
        {
            title: "Setup Profile",
            description: "Connect wallet and set your social links",
            icon: <WalletIcon className={iconClass} />
        }, {
            title: "Create Artworks",
            description: "Create your collection, contract, and mint your artworks",
            icon: <PuzzlePieceIcon className={iconClass} />
        }, {
            title: "Listing",
            description: "Choose between auction and fixed listing in the marketplace",
            icon: <ShoppingBagIcon className={iconClass} />
        }
    ] as const

    return (
        <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
            <div className="container mx-auto">
                <h1 className="py-16 text-2xl text-center text-gray-800 dark:text-white">
                    Create & List <br/>
                    <span className="text-lg text-gray-600 dark:text-gray-400">It&apos;s easy to be a creator</span>
                </h1>
                <div className="flex flex-wrap gap-8 justify-center items-center">
                {
                    creatorSteps.map((step, index) => (
                        <div key={step.title + index} className="flex flex-col gap-4 p-8 rounded items-center bg-gray-200 dark:bg-gray-900 dark:bg-opacity-40">
                            <div className="p-2">
                                {step.icon}
                            </div>
                            <h1 className="p-2 text-lg text-center text-gray-800 dark:text-white">
                                {step.title}
                            </h1>
                            <p className="max-w-[300px] p-4 text-center text-gray-600 dark:text-gray-400">
                                {step.description}
                            </p>
                        </div>
                    ))
                }
                </div>
                <div className="text-center pt-12">
                    <Link href={appRoutes.create}>
                        <Button
                            className="py-3 px-4 text-lg hover:opacity-70 transition opacity-80"
                            variant="gradient"
                            rounded
                            inversed
                        >Get started</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}