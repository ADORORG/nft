import ImagePreview from "./Image"
import VideoPreview from "./Video"
import AudioPreview from "./Audio"
import type MediaPreviewProps from "./type"

export function MediaPreview(props: MediaPreviewProps) {
    const { type = "", ...otherProps } = props
    
    if (type.includes("image")) {
        return (
            <ImagePreview {...otherProps} />
        )
    } else if (type.includes("video")) {
        return (
            <VideoPreview {...otherProps} />
        )
    } else if (type.includes("audio")) {
        return (
            <AudioPreview {...otherProps} />
        )
    } else {
        return null
    }
}

export {
    MediaPreview as default,
    ImagePreview,
    VideoPreview,
    AudioPreview
}