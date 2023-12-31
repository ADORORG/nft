import LoadingSpinner from "@/components/LoadingSpinner"
import { ContractCard } from "@/components/Card"
import { useContractSearch } from "@/hooks/fetch/search"

export default function ContractSearch({searchQuery}: {searchQuery: string}) {
    const { contracts, isLoading } = useContractSearch(searchQuery)

    if (isLoading) {
        return (
            <div className="">
                <LoadingSpinner />
            </div>
        )
    }

    if (!contracts || contracts.length === 0) {
        return (
            <div className="">
                No matching contract.
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-4">
            { 
                contracts.map((contract) => (
                    <ContractCard 
                        key={contract._id?.toString()}
                        contract={contract}
                    />
                ))
            }
        </div>
    )
}