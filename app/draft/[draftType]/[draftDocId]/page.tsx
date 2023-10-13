import { PopulatedNftTokenType } from "@/lib/types/token"
import { PopulatedContractType } from "@/lib/types/contract"
import type { DraftDataType } from "@/components/DraftPage/types"
import DraftTokenForm from "@/components/DraftForm/Token"
import DraftContractForm from "@/components/DraftForm/Contract"
// server side
import { getContractsByQuery, getTokensByQuery, getEventsByQuery } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

// Do not revalidate this page
export const revalidate = 86400

async function getServerSideData({draftType, draftDocId}: {draftType: DraftDataType, draftDocId: string}) {
    await mongooseConnectPromise

    const draftMap = {
        token: getTokensByQuery,
        event: getEventsByQuery,
        contract: getContractsByQuery
    }

    const draftData = await draftMap[draftType]({_id: draftDocId, draft: true}, {limit: 1, select: ""})
    
    return {
        draftData: draftData[0]
    }
}

export default async function Page({params}: {params: { draftType: DraftDataType, draftDocId: string }}) {
    const { draftData } = await getServerSideData(params)

    const draftMap = {
        token: <DraftTokenForm draftToken={draftData as PopulatedNftTokenType} />,
        event: <div>event</div>,
        contract: <DraftContractForm draftContract={draftData as PopulatedContractType} />
    }

    return (
        <div>
            {draftMap[params.draftType]}
        </div>
    )
}