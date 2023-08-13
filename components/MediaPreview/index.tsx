import ImagePreview from "./Image"
import VideoPreview from "./Video"
import AudioPreview from "./Audio"
import type MediaPreviewProps from "./type"

export function MediaRenderer(props: MediaPreviewProps) {
    const { type = "" } = props

    if (type.includes("image")) {
        return (
            <ImagePreview {...props} />
        )
    } else if (type.includes("video")) {
        return (
            <VideoPreview {...props} />
        )
    } else if (type.includes("audio")) {
        return (
            <AudioPreview {...props} />
        )
    } else {
        return null
    }
}

export {
    MediaRenderer as default,
    ImagePreview,
    VideoPreview,
    AudioPreview
}