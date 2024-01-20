import { InputField } from "@/components/Form"
import Button from "@/components/Button"

export default function ContractAddressForm() {
    
    return (
        <div className="max-w-md mx-auto flex flex-col gap-4">
            <h1 className="text-xl py-6">Import NFT Contract token</h1>
            <div className="flex flex-col md:flex-row items-center gap-3">
                <InputField
                    className="rounded"
                    label="Contract Address"
                    placeholder="0x..."
                    autoComplete="off"
                />
                <div>
                    <Button
                        variant="gradient"
                        className="px-4"
                        rounded
                    >
                        Import
                    </Button>
                </div>
                
            </div>
        </div>
    )
}