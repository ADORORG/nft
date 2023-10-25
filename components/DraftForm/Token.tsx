"use client"
import type { PopulatedNftTokenType } from "@/lib/types/token"
import CreateTokenForm from "@/components/CreateFormV2/Token/CreateTokenForm"

export default function DraftTokenForm({ draftToken }: { draftToken: PopulatedNftTokenType }) {

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center py-10 md:leading-4">Publish draft token</h1>
            
            <CreateTokenForm
                tokenData={{
                    ...draftToken,
                    royalty: draftToken?.royalty || draftToken?.contract?.royalty || 0,
                    quantity: draftToken.quantity || 1,
                }}
                accountCollections={[{...draftToken.xcollection}]}
                accountContracts={[{...draftToken.contract}]}
            />
        </div>
    )
}