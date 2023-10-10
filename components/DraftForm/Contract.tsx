"use client"
import type { PopulatedContractType } from "@/lib/types/contract"
import { useState } from "react"
import ContractForm from "@/components/CreateForm/Contract/ContractForm"

export default function DraftContractForm({ _draftContract }: { _draftContract: PopulatedContractType }) {
    const [draftContract, setDraftContract] = useState(_draftContract)

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center py-10 md:leading-4">Publish draft contract</h1>
            
            <ContractForm
                contract={draftContract}
                setContract={setDraftContract as any}
            />
        </div>
    )
}