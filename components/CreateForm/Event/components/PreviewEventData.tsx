import type { EventDataFormProps } from "../types"
import type { NftContractEditionType } from "@/lib/types/common"

import MediaPreview from "@/components/MediaPreview"
import Bordered from "@/components/Bordered"
import { getEventContractEditionData } from "@/utils/contract"

export default function PreviewEventData(props: EventDataFormProps) {
    const editionDescription = getEventContractEditionData(props.eventData?.nftEdition as NftContractEditionType, props.eventData?.supply)

    return (
        <div className={`${props.className}`}>
            <h1>Preview</h1>

            <Bordered className="my-3 h-[260px] w-[260px] flex justify-center items-center">
                <MediaPreview 
                    type={props.eventData?.mediaType}
                    src={props.tempMediaObjectUrl}
                    previewClassName="h-[250px] w-[250px] flex justify-center items-center"
                    className="h-[250px]"
                />
            </Bordered>
            <div>
                <h5>{props.eventData.tokenName || "{Name}"}</h5>
                <h6 className="opacity-60">
                    {editionDescription.editionStr}
                </h6>
            </div>
        </div>
    )
}