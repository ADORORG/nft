import type { DraftDataType } from "@/components/DraftPage/types"
import DraftTokenForm from "@/components/DraftForm/Token"
import DraftContractForm from "@/components/DraftForm/Contract"

// server side
import { getContractsByQuery, getTokensByQuery, getEventsByQuery } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'


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
        token: <DraftTokenForm _draftToken={draftData as any} />,
        event: <div>event</div>,
        contract: <DraftContractForm _draftContract={draftData as any} />
    }

    return (
        <div>
            {draftMap[params.draftType]}
        </div>
    )
}