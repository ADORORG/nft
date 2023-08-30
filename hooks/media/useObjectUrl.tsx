import { useEffect, useState } from "react"

export function useMediaObjectUrl(file: File | null) {
    const [tempMediaObjectUrl, setTempMediaObjectUrl] = useState("")

    useEffect(() => {
         // Revoke the previous objectURL
        if (tempMediaObjectUrl) {
            URL.revokeObjectURL(tempMediaObjectUrl)
        }
        
        if (file instanceof File) {
            // create a new objectURL
            setTempMediaObjectUrl(URL.createObjectURL(file))
        }

         /**
         * Cleanup the temporary object URL when the component unmount.
         * This does not depend on 'tempMediaObjectUrl' intentionally.
         */
        return () => {
            // cleanup objectURL
            if (tempMediaObjectUrl) {
                URL.revokeObjectURL(tempMediaObjectUrl)
            }
        }
        // Only run this effect when the media file object changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    return tempMediaObjectUrl
}