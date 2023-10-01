import type { PopulatedContractType } from "@/lib/types/contract"
import type { PageProps } from "../../types"
import { ContractCard } from "@/components/Card"
import Pagination from "@/components/Pagination"
import appRoute from "@/config/app.route"
import { replaceUrlParams } from "@/utils/main"

// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getContractsByQuery, countContractByQuery } from "@/lib/handlers"

const DOCUMENT_BATCH = 25

async function getServerSideData({address, pageNumber}: {address: string, pageNumber: number}) {
    await mongoooseConnectionPromise

    const [ contracts, contractCount ] = await Promise.all([
        getContractsByQuery({
            owner: address.toLowerCase()
        }, {
            limit: DOCUMENT_BATCH, 
            skip: (pageNumber - 1) * DOCUMENT_BATCH
        }),
        countContractByQuery({
            owner: address.toLowerCase()
        })
    ])
    return {
        contracts: contracts as PopulatedContractType[],
        contractCount
    } 
}

export default async function Page({address, pagination: pageNumber}: PageProps) {
    const {contracts, contractCount} = await getServerSideData({address, pageNumber: Number(pageNumber)})

    return (
        <div>
            {/* Account contract */}
            <div className="flex flex-row justify-center md:justify-start flex-wrap gap-4 mb-10 pt-6 pb-12">
                {   
                    contracts &&
                    contracts.length ?
                    contracts.map(contract => (
                        <ContractCard
                            key={contract?._id?.toString()}
                            contract={contract}     
                        />                        
                    ))
                    :
                    <p className="text-center">Nothing&apos;s here</p>
                }
            </div>

            <Pagination
                totalDocument={contractCount || 0}
                limitPerPage={DOCUMENT_BATCH}
                currentPage={Number(pageNumber)}
                linkPrefix={`${replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})}/contract`}
            />
        </div>
    )
}