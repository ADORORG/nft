
export default interface MediaPreviewProps extends React.HTMLAttributes<HTMLImageElement|HTMLVideoElement|HTMLAudioElement> {
    /** A MutableObjectRef to select a new file */
    clickRef?: HTMLInputElement,
    src: any,
    /** className of wrapper div element */
    previewClassName?: string,
    alt?: string,
    /** Specify the media type */
    type?: string,
     /** Provide an optional loading component as placeholder */
     loadingComponent?: React.ReactNode
}