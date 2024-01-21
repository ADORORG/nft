import type { TokenListProps, TokenPreviewProps } from "./types"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { cutString } from "@/utils/main"
import { MediaSkeleton } from "@/components/Skeleton"
import MediaPreview from "@/components/MediaPreview"
import Bordered from "@/components/Bordered"
import Button from "@/components/Button"

export default function ShowAccountTokens(props: TokenListProps) {
    const { tokens, nextHandler } = props
    const [loading, setLoading] = useState(false)

    const importAllTokens = async () => {
        try {
            setLoading(true)
            await nextHandler()
            toast.success("Imported completed")
        } catch (error) {
            console.log(error)
            toast.error("Error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Button
                className="px-4"
                variant="gradient"
                loading={loading}
                disabled={loading}
                onClick={() => importAllTokens()}
            >
                Continue
            </Button>
            
            <div className="flex flex-row flex-wrap gap-3">
            {
                tokens.map(token => (
                    <Bordered key={token.tokenId}>
                        <TokenPreviewCard token={token} />
                    </Bordered>
                ))
            }
            </div>
        </div>
    )
}

function TokenPreviewCard(props: TokenPreviewProps) {
    const { token } = props

    return (
        <div className="flex flex-col gap-3 w-[290px] h-[250px] rounded p-4 bg-gray-100 dark:bg-gray-900 hover:bg-opacity-60 transition drop-shadow-xl">
            <div>
                <MediaPreview
                    src={token.media}
                    type={"image/*"}
                    loadingComponent={<MediaSkeleton className="w-full h-full" />}
                    previewClassName="flex justify-center items-center w-full h-full"
                    className="max-w-[220px] max-h-[220]"
                />
            </div>
            <h4 
                className={`text-xl text-gray-950 py-3 dark:text-white tracking-wide subpixel-antialiased`}
                title={`${token.name} #${token.tokenId}`}
            >
                {cutString(token.name, 16)}#{token.tokenId}
            </h4>
        </div>
    )
}