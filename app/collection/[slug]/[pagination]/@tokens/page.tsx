import { NftTokenCard } from "@/components/Card"
import Pagination from "@/components/Pagination"
import appRoute from "@/config/app.route"
import { replaceUrlParams } from "@/utils/main"

// Server
import getServerSideData from "../serverSideData"

export default async function Page({params: {slug, pagination: pageNumber}}: {params: {slug: string, pagination: string}}) {
    const { collectionTokens, collectionTokensCount, limit } = await getServerSideData({slug, pageNumber: Number(pageNumber)})

    return (
        <div>
            {/* Collection tokens */}
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-4 my-4 px-4 pt-8">
                {   
                    collectionTokens &&
                    collectionTokens.length ?
                    collectionTokens.map(token => (
                        <NftTokenCard
                            key={token?._id?.toString()}
                            token={token}
                        />
                    ))
                    :
                    <p className="text-center">Nothing&apos;s here</p>
                }
            </div>

            <Pagination
                totalDocument={collectionTokensCount || 0}
                limitPerPage={limit}
                currentPage={Number(pageNumber)}
                linkPrefix={replaceUrlParams(appRoute.viewCollection, {slug})}
            />
        </div>
    )
}