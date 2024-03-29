import type { PageProps } from "../../types"
import type { PopulatedNftTokenType } from "@/lib/types/token"
import { NftTokenCard } from "@/components/Card"
import Pagination from "@/components/Pagination"
import appRoute from "@/config/app.route"
import { replaceUrlParams } from "@/utils/main"

// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getTokensByQuery, countTokenByQuery } from "@/lib/handlers"

const DOCUMENT_BATCH = 25

async function getServerSideData({address, pageNumber}: {address: string, pageNumber: number}) {
    await mongoooseConnectionPromise
    
    const query = {
        owner: address.toLowerCase(),
        tokenId: { $exists: true, $ne: null },
    }

    const [ accountTokens, accountTokenCount ] = await Promise.all([
        getTokensByQuery(query, {
            limit: DOCUMENT_BATCH, 
            skip: (pageNumber - 1) * DOCUMENT_BATCH
        }),
        countTokenByQuery(query)
    ])

    return {
        accountTokens: accountTokens as PopulatedNftTokenType[],
        accountTokenCount
    } 
}

export default async function Page({address, pagination: pageNumber}: PageProps) {
    const {accountTokens, accountTokenCount} = await getServerSideData({address, pageNumber: Number(pageNumber)})

    return (
        <div>
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 px-4 pt-6 pb-12">
                {   
                    accountTokens &&
                    accountTokens.length ?
                    accountTokens.map(token => (
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
                totalDocument={accountTokenCount || 0}
                limitPerPage={DOCUMENT_BATCH}
                currentPage={Number(pageNumber)}
                linkPrefix={`${replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})}/token`}
            />
        </div>
    )
}