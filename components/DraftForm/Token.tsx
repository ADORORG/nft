"use client"
import type { PopulatedNftTokenType } from "@/lib/types/token"
import { useState } from "react"
import CreateTokenForm from "@/components/CreateForm/Token/CreateTokenForm"
import { isHttpUrl } from "@/utils/main"
import { IPFS_GATEWAY } from "@/lib/app.config"

export default function DraftTokenForm({ _draftToken }: { _draftToken: PopulatedNftTokenType }) {
    const [draftToken, setDraftToken] = useState(_draftToken)

    const updateTokenData = (tokenData: Partial<PopulatedNftTokenType>) => {
        setDraftToken((prev) => ({
            ...prev,
            ...tokenData
        }))
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center py-10 md:leading-4">Publish draft token</h1>
            
            <CreateTokenForm
                tokenData={{
                    ...draftToken,
                    media: isHttpUrl(draftToken.media) ? draftToken.media : IPFS_GATEWAY + draftToken.media,
                    royalty: draftToken.royalty || draftToken.contract?.royalty || 0,
                }}
                enableMediaChange={false}
                setTokenData={updateTokenData}
                accountCollections={[{...draftToken.xcollection}]}
                accountContracts={[{...draftToken.contract}]}
            />
        </div>
    )
}