import { useState } from "react"
import { 
    nftSaleEventDataStore,
    nftSaleEventCreatedStore,
    nftEventContractDataStore,
    nftEventContractMediaStore,
    nftEventContractDeployedStore,
} from "@/store/form"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import Button from "@/components/Button"

export default function CreateEventModal() {
    const [creatingOnchain, setCreatingOnchain] = useState(false)
    const [creatingOffchain, setCreatingOffchain] = useState(false)
    const [nftEventContractData, setNftEventContractData] = useAtom(nftEventContractDataStore)
    const [nftSaleEventData, setNftSaleEventData] = useAtom(nftSaleEventDataStore)
    /** Media file object for this event */
    const [nftEventMedia, setNftEventMedia] = useAtom(nftEventContractMediaStore)
    /** Holds whether we've deployed or added the event on the blockchain */
    const [nftContractDeployed, setNftContractDeployed] = useAtom(nftEventContractDeployedStore)
    /** Holds whether we've added the event to the database locally */
    const [nftSaleEventCreated, setNftSaleEventCreated] = useAtom(nftSaleEventCreatedStore)


    const handleCreateOnchain = async () => {
        try {
            setCreatingOnchain(true)
            // deploy or create a new nft id
            console.log(nftEventMedia, nftSaleEventCreated)
            // setNftContractDeployed(true)
        } catch (error: any) {
            toast.error(error)
        } finally {
            setCreatingOnchain(false)
        }
    }

    const handleCreateOffchain = async () => {
        try {
            setCreatingOffchain(true)
            // deploy or create a new nft id

            setNftSaleEventCreated(true)
        } catch (error: any) {
            toast.error(error)
        } finally {
            setCreatingOffchain(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 p-1 md:w-80">
            <Button
                disabled={nftContractDeployed}
                className="w-full"
                variant="gradient"
                loading={creatingOnchain}
                onClick={handleCreateOnchain}
                rounded
            >
                {creatingOnchain ? "Creating on-chain..." : "Create on blockchain"}
            </Button>

            <Button
                disabled={!nftContractDeployed || nftSaleEventCreated}
                className="w-full"
                variant="gradient"
                loading={creatingOffchain}
                onClick={handleCreateOffchain}
                rounded
            >
                {creatingOffchain ? "Creating offchain..." : "Create off-chain"}
            </Button>
        </div>
    )
}