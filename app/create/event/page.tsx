import { Icon1Square, UiChecks, UiChecksGrid } from "react-bootstrap-icons"
import Link from "next/link"
import Button from "@/components/Button"
import appRoute from "@/config/app.route"

export default function CreateEventIndex() {
    const eventOptions = [
        {
            title: "Create Open Edition",
            description: "Create primary minting event with unlimited supply",
            href: appRoute.createOpenEdition,
            icon: <UiChecks className="h-5 w-5" />,
            disabled: false,
        },
        {
            title: "Create Limited Edition",
            description: "Create primary minting event with limited supply",
            href: appRoute.createLimitedEdition,
            icon: <UiChecksGrid className="h-5 w-5" />,
            disabled: true,
        },
        {
            title: "Create One-of-One",
            description: "Create primary minting event with single supply",
            href:appRoute.createOneOfOne,
            icon: <Icon1Square className="h-5 w-5" />,
            disabled: true,
        }
    ]


    return (
        <div className="flex flex-col max-w-sm mx-auto gap-6">
            <h1 className="text-center text-2xl py-4">Create Minting Event</h1>
            {
                eventOptions.map(event => (
                    <Link
                        key={event.href}
                        href={event.href}
                        className="w-full"
                    >
                        <Button
                            disabled={event.disabled}
                            className="flex flex-col md:flex-row gap-6 items-center p-4 w-full"
                            variant="gradient"
                            rounded
                        >
                            <span>
                                {event.icon}
                            </span>
                            <span className="flex flex-col gap-2">
                                <span>
                                    {event.title}
                                </span>
                                <span className="text-sm">
                                    {event.description}
                                </span>
                            </span>
                        </Button>
                    </Link>
                ))
            }
        </div>
    )
}