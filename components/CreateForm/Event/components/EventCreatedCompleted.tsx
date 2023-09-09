import { RocketTakeoff } from "react-bootstrap-icons"
import { useRouter } from "next/navigation"
import { replaceUrlParams } from "@/utils/main"
import Button from "@/components/Button"
import ConfettiAnimation from "@/components/Confetti"
import appRoutes from "@/config/app.route"

export default function MintCompleted({eventId}: {eventId: string}) {
    const router = useRouter()

    return (
        <div className="w-full h-full z-50 px-10">
            <div className="flex flex-col justify-between items-center gap-8">
                <span>
                    <RocketTakeoff className="animate-pulse text-secondary-500 dark:text-secondary-300 h-12 w-12" />
                </span>

                <h2 className="text-2xl">Congratulations!! <br/> Event Created!</h2>

                <div className="flex flex-col w-full gap-2">
                    <Button
                        variant="gradient"
                        className="w-full"
                        onClick={() => {
                            router.push(replaceUrlParams(appRoutes.viewEvent, {eventDocId: eventId}))
                        }}
                        rounded
                    >
                        View Event
                    </Button>
                </div>
                
            </div>
            <ConfettiAnimation />
        </div>
    )
}