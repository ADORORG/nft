import { PlayBtn, Image as ImageIcon, FileMusic } from "react-bootstrap-icons"

interface HasMediaTypeProps {
    mediaType: string,
    className?: string,
    title?: string,
    size?: number
}

export default function MediaTypeIcon(props: HasMediaTypeProps) {
    const { mediaType, className, size = 16 } = props

    const hasImage = mediaType.includes("image")
    const hasVideo = mediaType.includes("video")
    const hasAudio = mediaType.includes("audio")

    if (hasImage) {
        return (
            <ImageIcon
                size={size}
                title="Contains an image"
                className={className}
            />
        )
    } else if (hasAudio) {
        return (
            <FileMusic
                size={size}
                title={"Contains an audio"}
                className={className}
            />
        )
    } else if (hasVideo) {
        return (
            <PlayBtn
                size={size}
                title={"Contains a video"}
                className={className}
            />
        )
    } else {
        return null
    }
}