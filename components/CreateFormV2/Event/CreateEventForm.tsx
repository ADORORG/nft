"use client"
import type { PopulatedNftContractEventType } from "@/lib/types/event"
import type { CreateEventFormProps } from "./types"
import { useState, useCallback, useMemo } from "react"
import { CodeSlash, CloudCheck, Gear, RocketTakeoff, PlayCircle, Collection as CollectionIcon } from "react-bootstrap-icons"
import { fetcher } from "@/utils/network"
import { nftEditionChecker } from "@/utils/contract"
import Stepper from "@/components/Stepper"
import CreateEventMedia from "./component/Media"
import CreateEventMetadata from "./component/Metadata"
import EventConfiguration from "./component/Configuration"
import PreviewAndMintToken from "./component/PreviewAndDeploy"
import EventContractAndCollection from "./component/RelatedCollection"
import ConfettiAnimation from "@/components/Confetti"
import apiRoutes from "@/config/api.route"

export default function CreateEventForm(props: CreateEventFormProps) {
    const screenMap = useMemo(() => {
        return [EventContractAndCollection, EventConfiguration, CreateEventMetadata, CreateEventMedia, PreviewAndMintToken]
    }, [])
    const [screenIndex, setScreenIndex] = useState<0 | 1 | 2 | 3 | 4>(0) 
    const [nftEventData, setNftEventData] = useState(props.eventData)
    const nftEditionType = nftEditionChecker(props.eventData.nftEdition)

    const step2Done = useMemo(() => {
        const {
            // step 2 data
            price,
            start,
            end,
            feeRecipient,
            royalty,
            royaltyReceiver,
            supply
        } = nftEventData

        return (
            price !== undefined &&
            start !== undefined &&
            end !== undefined &&
            feeRecipient !== undefined &&
            royalty !== undefined &&
            royaltyReceiver !== undefined &&
            supply !== undefined
        )
    }, [nftEventData])
    /** 
    * Progress steps
    */
    const steps = {
        contractAndCollectionSelect: {
            title: "Contract & Collection",
            subtitle: "Select contract & collection",
            done: !!(nftEventData?.contract?.label && nftEventData?.contract?.symbol && nftEventData?.contract?.chainId) && nftEventData.xcollection !== undefined,
            active: screenIndex === 0,
            icon: <CollectionIcon className="" />
        },
        eventConfiguration: {
            title: "Configure",
            subtitle: "Set event details",
            done: step2Done,
            active: screenIndex === 1,
            icon: <Gear className="" />
        },
        eventTokenMetadata: {
            title: "Metadata",
            subtitle: "Set token details",
            // Event Must be created to set this step as done
            done: nftEventData._id !== undefined,
            active: screenIndex === 2,
            icon: <CloudCheck className="" />
        },
        eventMedia: {
            title: "Media",
            subtitle: "Upload event media",
            done: nftEventData.media !== undefined,
            active: screenIndex === 3,
            icon: <PlayCircle className="" />
        },
        createOnChain: {
            title: "Deploy",
            subtitle: "Deploy the event",
            done: (nftEditionType.isLimitedSupply || nftEditionType.isOneOfOne) ? nftEventData.partitionId !== undefined : !!nftEventData?.contract?.contractAddress,
            active: screenIndex === 4,
            icon: <CodeSlash className="" />
        },
        created: {
            title: "Created",
            subtitle: "Ready to mint",
            done: nftEventData.draft === false,
            active: false,
            icon: <RocketTakeoff className="" />
        },
    }

    const handleNextScreen = useCallback(() => {
        const sc = screenIndex + 1 as typeof screenIndex
        if (screenMap[sc]) {
            setScreenIndex(sc)
        }
    }, [screenIndex, screenMap])

    const handlePreviousScreen = useCallback(() => {
        const sc = screenIndex - 1 as typeof screenIndex
        if (screenMap[sc]) {
            setScreenIndex(sc)
            return
        }
    }, [screenIndex, screenMap])
    
    const updateEventData = useCallback((eventData: Partial<PopulatedNftContractEventType>) => {
        setNftEventData((prev) => ({
            ...prev,
            ...eventData
        }))
    }, [])

    const saveEventData = useCallback(async (event: Partial<PopulatedNftContractEventType> = {}) => {
        const response = await fetcher(apiRoutes.createEventV2, {
            method: "POST",
            body: JSON.stringify({
                ...nftEventData,
                ...event
            })
        })

        if (response.success) {
            updateEventData(response.data as PopulatedNftContractEventType)
            return response.data as PopulatedNftContractEventType
        }
    }, [nftEventData, updateEventData])

    const Screen = screenMap[screenIndex]

    return (

        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
                <div className="md:px-6">
                    <Stepper
                        steps={Object.values(steps)}
                    />
                </div>
                <div className="col-span-2">
                    <Screen 
                        eventData={nftEventData}
                        setEventData={updateEventData}
                        saveEventData={saveEventData}
                        nextSreen={screenIndex === (screenMap.length - 1) ? undefined : handleNextScreen}
                        previousScreen={screenIndex === 0 ? undefined : handlePreviousScreen}
                        accountCollections={props.accountCollections}
                        accountContracts={props.accountContracts}
                        step2Done={step2Done}
                    />
                </div>
            </div>

            {/* Run confetti when done */}
            {
                steps.createOnChain.done
                ?
                <ConfettiAnimation seconds={7} />
                :
                null
            }
        </div>
    )
}