import type { PopulatedNftContractEventType } from "@/lib/types/event"
import type { PageProps } from "../../types"
import { EventMintCollapsedSmall } from "@/components/EventMint"
import Pagination from "@/components/Pagination"
import appRoute from "@/config/app.route"
import { replaceUrlParams } from "@/utils/main"

// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getEventsByQuery, countEventByQuery } from "@/lib/handlers"

const DOCUMENT_BATCH = 25

async function getServerSideData({address, pageNumber}: {address: string, pageNumber: number}) {
    await mongoooseConnectionPromise

    const [ saleEvents, saleEventCount ] = await Promise.all([
        getEventsByQuery({
            owner: address.toLowerCase()
        }, {
            limit: DOCUMENT_BATCH, 
            skip: (pageNumber - 1) * DOCUMENT_BATCH
        }),
        countEventByQuery({
            owner: address.toLowerCase()
        })
    ])
    return {
        saleEvents: saleEvents as PopulatedNftContractEventType[],
        saleEventCount
    } 
}

export default async function Page({address, pagination: pageNumber}: PageProps) {
    const {saleEvents, saleEventCount} = await getServerSideData({address, pageNumber: Number(pageNumber)})

    return (
        <div>
            {/* Sale events created by account */}
            <div className="flex flex-row justify-center md:justify-start flex-wrap gap-4 mb-10 pt-6 pb-12">
                {   
                     saleEvents.length > 0 ?
                     saleEvents.map((eventData) => (
                         <EventMintCollapsedSmall key={eventData._id?.toString()} eventData={eventData} />
                     ))
                    :
                    <p className="text-center">Nothing&apos;s here</p>
                }
            </div>

            <Pagination
                totalDocument={saleEventCount || 0}
                limitPerPage={DOCUMENT_BATCH}
                currentPage={Number(pageNumber)}
                linkPrefix={`${replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})}/event`}
            />
        </div>
    )
}