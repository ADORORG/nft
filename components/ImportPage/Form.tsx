"use client"
import type { ContractImportFormProps } from "./types"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { InputField } from "@/components/Form"
import Button from "@/components/Button"

export default function ImportContractAddressForm(props: ContractImportFormProps) {
    const { importHandler } = props
    const [contractAddress, setContractAddress] = useState<string>("")
    const [loading, setLoading] = useState(false)
    
    const handleContractImport = async () => {
        try {
            setLoading(true)
            await importHandler(contractAddress)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-3 my-6">
            <InputField
                className="rounded"
                label="Contract Address"
                placeholder="0x..."
                autoComplete="off"
                value={contractAddress}
                onChange={e => setContractAddress(e.target.value)}
            />
            <div>
                <Button
                    variant="gradient"
                    className="px-4"
                    loading={loading}
                    disabled={loading}
                    onClick={handleContractImport}
                    rounded
                >
                    Import
                </Button>
            </div>
        </div>
    )
}