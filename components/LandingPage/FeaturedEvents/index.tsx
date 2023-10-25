"use client"
import type { PopulatedNftContractEventType } from "@/lib/types/event"
import { EventMintCardSmall } from "@/components/EventMint"
import Button from "@/components/Button"
import Link from "next/link"
import appRoutes from "@/config/app.route"

export default function FeaturedEvents(props: {events:PopulatedNftContractEventType[]}) {

    return (
        <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-center gap-6">
                    {
                        props.events.map((eventData) => (
                            <div 
                                className="my-4"
                                key={eventData._id?.toString()}>
                                <EventMintCardSmall eventData={eventData} />
                            </div>
                        ))
                    }
                </div>

                <div className="text-center pt-12 lg:my-10">
                    <Link href={appRoutes.events}>
                        <Button
                        className="py-2 px-4 text-xl"
                        variant="gradient"
                        rounded
                        >Collect More</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}