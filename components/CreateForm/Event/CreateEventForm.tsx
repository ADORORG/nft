"use client"
import { useState, useEffect } from "react"
import { 
    nftSaleEventDataStore,
    nftSaleEventCreatedStore,
    nftEventContractDataStore,
    nftEventContractMediaStore,
    // nftEventContractDeployedStore,
} from "@/store/form"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useMediaObjectUrl } from "@/hooks/media/useObjectUrl"
import { toast } from "react-hot-toast"
import { nftEditionChecker } from "@/utils/contract"
import QuickModal from "@/components/QuickModal"
import NavigationButton from "@/components/NavigationButton"
import Button from "@/components/Button"
import EventContracDataForm from "./components/ContractDataForm"
import SaleDataForm from "./components/SaleDataForm"
import AttributeAndMedia from "./components/AttributeAndMedia"
import PreviewEventData from "./components/PreviewEventData"
import ReviewEventData from "./components/ReviewEventData"
import CreateEventModal from "./CreateEventModal"
import appRoutes from "@/config/app.route"

import type {EventDataFormProps, CreateEventFormProps} from "./types"

/**
 * @todo - Create an object to hold form fields and restructuring the form data and validation
 * @param param0 
 * @returns 
 */
export default function CreateEventForm({nftEdition}: CreateEventFormProps) {
    const router = useRouter()
    const screenMap = [AttributeAndMedia, EventContracDataForm, SaleDataForm, ReviewEventData] as const
    const [screenIndex, setScreenIndex] = useState<0 | 1 | 2 | 3>(0)
    /** Holds whether we've added the event to the database locally */
    const [nftSaleEventCreated] = useAtom(nftSaleEventCreatedStore)
    const [nftEventContractData, setNftEventContractData] = useAtom(nftEventContractDataStore)
    const [nftSaleEventData, setNftSaleEventData] = useAtom(nftSaleEventDataStore)
    /** Media file object for this event */
    const [nftEventMedia, setNftEventMedia] = useAtom(nftEventContractMediaStore)
    /** Temporary object URL to the selected media */
    const tempMediaObjectUrl = useMediaObjectUrl(nftEventMedia)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const nftEditionType = nftEditionChecker(nftEdition)

    const confirmNavigateAway = () => {
        const confirmNavigateAway = window.confirm("Your changes will not saved. Are you sure you want to leave this page?")
        if (confirmNavigateAway) {
            resetForm()
            router.push(appRoutes.createEvent)
        }
    }

    useEffect(() => {
        setNftSaleEventData({
            ...nftSaleEventData,
            nftEdition,
            supply: nftEditionType.isOneOfOne ? 1 : nftSaleEventData.supply,
            royalty: nftSaleEventData.royalty || 0,
            price: nftSaleEventData.price || 0,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftEdition])

    useEffect(() => {
        // Prevents the browser from immediately leaving the page
        // Confirm with the user before leaving the page and clear the form data
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            confirmNavigateAway()
            // Show a confirmation message to the user
            event.returnValue = "" // Required for browsers to display the confirmation message
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload)
    
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const resetForm = () => {
        setNftEventContractData({})
        setNftSaleEventData({})
        setNftEventMedia(null)
    }

    const handleNextScreen = () => {
        const sc = screenIndex + 1 as typeof screenIndex
        if (screenMap[sc]) {
            setScreenIndex(sc)
        }
    }

    const handlePreviousScreen = () => {
        const sc = screenIndex - 1 as typeof screenIndex
        if (screenMap[sc]) {
            setScreenIndex(sc)
            return
        }

        confirmNavigateAway()
    }

    const validateEventData = () => {
        const contractDataFields = [
            "chainId", "label", "symbol"
        ] as const

        const eventDataFields = [
            "feeRecipient", "start", "end",
            "royaltyReceiver", "mediaType", "tokenName", "tokenDescription"
        ] as const
        
        // If an existing contract is not selected, validate the new contract field
        if (!nftEventContractData._id) {
            for (const field of contractDataFields) {
                if (!nftEventContractData[field]) {
                    return false
                }
            }
        }
        // validate the event data fields
        for (const field of eventDataFields) {
            if (!nftSaleEventData[field]) {
                return false
            }
        }

        // start date must be before end date and greater than now
        if (nftSaleEventData.start && nftSaleEventData.end) {
            if (nftSaleEventData.start >= nftSaleEventData.end) {
                return false
            }
        } else {
            return false
        }


        // If edition is any of this type, validate the supply
        if (nftEditionType.isLimitedSupply) {
            if (!nftSaleEventData.supply) {
                return false
            }
        }

        // Check the media
        if (!nftEventMedia) {
            return false
        }

        return true
    }

    const showCreateEventModal = () => {
        try {
            setShowCreateModal(true)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const Screen = screenMap[screenIndex] as React.FC<EventDataFormProps>

    return (
        <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="md:w-[380px]">
                <div className="flex flex-col w-full">
                    <Screen 
                        updateContractData={setNftEventContractData}
                        updateEventData={setNftSaleEventData}
                        contractData={nftEventContractData}
                        eventData={nftSaleEventData}
                        tempMediaObjectUrl={tempMediaObjectUrl}
                        updateEventMedia={setNftEventMedia}
                        className="flex flex-col gap-8 mt-8"
                    />

                    <div className="flex flex-col gap-4 mt-6">
                        {
                            // Do not display the 'Next' button on the last screen
                            // Display the 'Create Event' button instead
                            screenIndex === screenMap.length - 1 ? 
                                <Button 
                                    variant="gradient"
                                    onClick={showCreateEventModal}
                                    className="flex flex-col items-center gap-2"
                                    disabled={!validateEventData()}
                                >
                                    <span>Create Event</span>
                                    <small className="opacity-60">You can&apos;t make changes anymore if you click me</small>
                                </Button>
                            :
                                <NavigationButton 
                                    direction="right"
                                    text="Next"
                                    variant="gradient"
                                    onClick={() => handleNextScreen()}
                                    className="flex justify-center"
                                />
                        }
                        <NavigationButton 
                            direction="left"
                            text="Go back"
                            onClick={() => handlePreviousScreen()}
                            className="bg-gray-200 dark:bg-gray-800 flex justify-center"
                        />
                    </div>
                </div>
            </div>
            <PreviewEventData
                eventData={nftSaleEventData}
                contractData={nftEventContractData}
                tempMediaObjectUrl={tempMediaObjectUrl}
            />

            {/* Create event modal */}
            <QuickModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(!nftSaleEventCreated)}
                modalTitle="Create Mint Event"
                modalBody={CreateEventModal}
                backdrop={false}
                // modalBody props
                resetForm={resetForm}
            />
        </div>
    )
}