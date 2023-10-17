"use client"
import Link from "next/link"
import LoadingSpinner from "@/components/LoadingSpinner"
import Button from "@/components/Button"
import { ContractCard } from "@/components/Card"
import { useAccountDraftContract } from "@/hooks/fetch/draft"
import { replaceUrlParams } from "@/utils/main"
import appRoutes from "@/config/app.route"

export default function ContractDraft({address}: {address?: string}) {
    const { draftContracts, isLoading } = useAccountDraftContract(address)

    if (isLoading) {
        return (
            <div className="">
                <LoadingSpinner />
            </div>
        )
    }

    if (!draftContracts || draftContracts.length === 0) {
        return (
            <div className="">
                No draft contract.
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-4">
            { 
                draftContracts.map((contract) => (
                    <div 
                        key={contract._id?.toString()}
                        className="w-80 h-40 relative"
                    >
                        <div className="absolute rounded z-10 bg-opacity-50 top-0 left-0 bg-gray-600 w-72 h-36 flex items-center justify-center">
                            <Link href={
                                replaceUrlParams(appRoutes.editDraft, {
                                    draftType: "contract",
                                    draftDocId: contract._id?.toString() as string
                                })
                            }>
                                <Button variant="gradient" className="rounded px-6">Edit</Button>
                            </Link>
                        </div>
                        <ContractCard 
                            contract={contract}
                        />
                    </div>
                    
                ))
            }
        </div>
    )
}