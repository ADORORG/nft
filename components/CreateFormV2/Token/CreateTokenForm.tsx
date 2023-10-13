import type { PopulatedNftTokenType } from "@/lib/types/token"
import type { CreateTokenFormProps } from "./types"
import { useState, useCallback, useMemo } from "react"
import { CodeSlash, CloudCheck, BagCheck, PlayCircle, Collection as CollectionIcon } from "react-bootstrap-icons"
import { fetcher } from "@/utils/network"
import Stepper from "@/components/Stepper"
import CreateTokenMedia from "./component/Media"
import CreateTokenMetadata from "./component/Metadata"
import PreviewAndMintToken from "./component/PreviewAndMint"
import SelectTokenCollection from "./component/RelatedCollection"
import apiRoutes from "@/config/api.route"

export default function CreateTokenForm(props: CreateTokenFormProps) {
    const screenMap = useMemo(() => {
        return [SelectTokenCollection, CreateTokenMetadata, CreateTokenMedia, PreviewAndMintToken] as const
    }, [])
    const [screenIndex, setScreenIndex] = useState<0 | 1 | 2 | 3>(0) 
    const [nftTokenData, setNftTokenData] = useState(props.tokenData)
     /** 
    * Progress steps
    */
     const steps = {
        contractSelect: {
            title: "Contract & Collection",
            subtitle: "Select contract & collection",
            done: nftTokenData.contract !== undefined && nftTokenData.xcollection !== undefined,
            active: screenIndex === 0,
            icon: <CollectionIcon className="" />
        },
        metadata: {
            title: "Metadata",
            subtitle: "Save token details",
            done: nftTokenData._id !== undefined,
            active: screenIndex === 1,
            icon: <CloudCheck className="" />
        },
        media: {
            title: "Media",
            subtitle: "Upload token media",
            done: nftTokenData.media !== undefined,
            active: screenIndex === 2,
            icon: <PlayCircle className="" />
        },
        mint: {
            title: "Preview & Mint",
            subtitle: "Mint token on chain",
            done: nftTokenData.tokenId !== undefined,
            active: screenIndex === 3,
            icon: <CodeSlash className="" />
        },
        market: {
            title: "Marketplace",
            subtitle: "Ready to sell",
            done: nftTokenData.draft === false,
            active: false,
            icon: <BagCheck className="" />
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
    
    const updateTokenData = useCallback((tokenData: Partial<PopulatedNftTokenType>) => {
        setNftTokenData((prev) => ({
            ...prev,
            ...tokenData
        }))
    }, [])

    const saveTokenData = useCallback(async (token: Partial<PopulatedNftTokenType> = {}) => {
        const response = await fetcher(apiRoutes.createTokenV2, {
            method: "POST",
            body: JSON.stringify({
                ...nftTokenData,
                ...token
            })
        })

        if (response.success) {
            updateTokenData(response.data as PopulatedNftTokenType)
            return response.data as PopulatedNftTokenType
        }
    }, [nftTokenData, updateTokenData])

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
                        tokenData={nftTokenData}
                        setTokenData={updateTokenData}
                        saveTokenData={saveTokenData}
                        nextSreen={screenIndex === (screenMap.length - 1) ? undefined : handleNextScreen}
                        previousScreen={screenIndex === 0 ? undefined : handlePreviousScreen}
                        accountCollections={props.accountCollections}
                        accountContracts={props.accountContracts}
                    />
                </div>
            </div>
        </div>
    )
}
