"use client"
import type { PopulatedContractType } from "@/lib/types/contract"
import { useState } from "react"
import ContractForm from "@/components/CreateForm/Contract/ContractForm"

export default function DraftContractForm({ draftContract }: { draftContract: PopulatedContractType }) {
    const [_draftContract, _setDraftContract] = useState(draftContract)

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center py-10 md:leading-4">Publish draft contract</h1>
            
            <ContractForm
                contract={_draftContract}
                setContract={_setDraftContract as any}
            />
        </div>
    )
}