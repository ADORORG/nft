import type EventMintProps from "../types"
import { RocketTakeoff } from "react-bootstrap-icons"
import { useRouter } from "next/navigation"
import { replaceUrlParams } from "@/utils/main"
import { useAuthStatus } from "@/hooks/account"
import Button from "@/components/Button"
import ConfettiAnimation from "@/components/Confetti"
import appRoutes from "@/config/app.route"

export default function MintCompleted(props: EventMintProps) {
    const router = useRouter()
    const { session } = useAuthStatus()

    return (
        <div className="w-full h-full z-50">
            <div className="flex flex-col justify-between items-center gap-8">
                <span>
                    <RocketTakeoff className="animate-pulse text-secondary-500 dark:text-secondary-300 h-12 w-12" />
                </span>

                <h2 className="text-2xl">Congratulations!!</h2>

                <div className="flex flex-col w-full gap-2">
                    <Button
                        variant="gradient"
                        className="w-full"
                        onClick={() => {
                            router.push(replaceUrlParams(appRoutes.viewCollection, {slug: props.eventData.xcollection.slug}))
                        }}
                        rounded
                    >
                        View Collection
                    </Button>

                    <Button
                        variant="gradient"
                        className="w-full"
                        onClick={() => {
                            router.push(replaceUrlParams(appRoutes.viewAccount, {address: session?.user?.address as string}))
                        }}
                        rounded
                    >
                        View Account
                    </Button>
                </div>
                
            </div>
            <ConfettiAnimation />
        </div>
    )
}