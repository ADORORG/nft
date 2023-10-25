"use client"
import Link from "next/link"
import LoadingSpinner from "@/components/LoadingSpinner"
import Button from "@/components/Button"
import { NftTokenCard } from "@/components/Card"
import { useAccountDraftToken } from "@/hooks/fetch/draft"
import { replaceUrlParams } from "@/utils/main"
import appRoutes from "@/config/app.route"

export default function TokenDraft({address}: {address?: string}) {
    const { draftTokens, isLoading } = useAccountDraftToken(address)

    if (isLoading) {
        return (
            <div className="">
                <LoadingSpinner />
            </div>
        )
    }

    if (!draftTokens || draftTokens.length === 0) {
        return (
            <div className="">
                No draft token.
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-4">
            { 
                draftTokens.map((token) => (
                    <div 
                        key={token._id?.toString()}
                        className="w-56 h-80 relative"
                    >
                        <div className="absolute rounded z-10 bg-opacity-50 top-0 left-0 bg-gray-600 w-56 h-80 flex items-center justify-center">
                            <Link href={
                                replaceUrlParams(appRoutes.editDraft, {
                                    draftType: "token",
                                    draftDocId: token._id?.toString() as string
                                })
                            }>
                                <Button variant="gradient" className="rounded px-6">Edit</Button>
                            </Link>
                        </div>    
                        <NftTokenCard 
                            token={token}
                        />
                    </div>
                ))
            }
        </div>
    )
}