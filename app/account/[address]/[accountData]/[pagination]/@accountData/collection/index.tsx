import type { PopulatedCollectionType } from "@/lib/types/collection"
import type { PageProps } from "../../types"
import { CollectionCard } from "@/components/Card"
import Pagination from "@/components/Pagination"
import appRoute from "@/config/app.route"
import { replaceUrlParams } from "@/utils/main"

// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getCollectionsByQuery, countCollectionByQuery } from "@/lib/handlers"

const DOCUMENT_BATCH = 25

async function getServerSideData({address, pageNumber}: {address: string, pageNumber: number}) {
    await mongoooseConnectionPromise

    const [ collections, collectionCount ] = await Promise.all([
        getCollectionsByQuery({
            owner: address.toLowerCase()
        }, {
            limit: DOCUMENT_BATCH, 
            skip: (pageNumber - 1) * DOCUMENT_BATCH
        }),
        countCollectionByQuery({
            owner: address.toLowerCase()
        })
    ])
    return {
        collections: collections as PopulatedCollectionType[],
        collectionCount
    } 
}

export default async function Page({address, pagination: pageNumber}: PageProps) {
    const {collections, collectionCount} = await getServerSideData({address, pageNumber: Number(pageNumber)})

    return (
        <div>
            {/* Collection tokens */}
            <div className="flex flex-row justify-center md:justify-start flex-wrap gap-4 my-4 py-8">
                {   
                    collections &&
                    collections.length ?
                    collections.map(collection => (
                        <CollectionCard
                            key={collection?._id?.toString()}
                            collection={collection}     
                        />                        
                    ))
                    :
                    <p className="text-center">Nothing&apos;s here</p>
                }
            </div>

            <Pagination
                totalDocument={collectionCount || 0}
                limitPerPage={DOCUMENT_BATCH}
                currentPage={Number(pageNumber)}
                linkPrefix={`${replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})}/collection`}
            />
        </div>
    )
}