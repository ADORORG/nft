import type { TokenListProps, TokenPreviewProps } from "./types"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { cutString } from "@/utils/main"
import { useAccountCollection } from "@/hooks/fetch"
import { useAuthStatus } from "@/hooks/account"
import { getFetcherErrorMessage } from "@/utils/network"
import { MediaSkeleton } from "@/components/Skeleton"
import { Select } from "@/components/Select"
import MediaPreview from "@/components/MediaPreview"
import Bordered from "@/components/Bordered"
import Button from "@/components/Button"

export default function ShowAccountTokens(props: TokenListProps) {
    const { tokens, nextHandler } = props
    const [loading, setLoading] = useState(false)
    const [collection, setCollection] = useState<string>("")
    const { address } = useAuthStatus()
    const { accountCollections } = useAccountCollection(address)

    const importAllTokens = async () => {
        try {
            setLoading(true)
            if (!collection) {
                throw new Error("Please select a collection")
            }
            await nextHandler(collection)
            toast.success("Imported completed")
        } catch (error: any) {
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="max-w-lg flex flex-col md:flex-row gap-3">
                <Select
                    className="rounded max-w-[400px]"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                >
                    <Select.Option value="">Select a collection</Select.Option>
                    {
                        accountCollections?.map(collection => (
                            <Select.Option 
                                value={collection._id?.toString()} 
                                key={collection._id?.toString()}>
                                {collection.name}
                            </Select.Option>
                        ))
                    }
                </Select>

                <Button
                    className="px-4 max-w-[400px]"
                    variant="gradient"
                    loading={loading}
                    disabled={loading || tokens.length === 0}
                    onClick={() => importAllTokens()}
                    rounded
                >
                    Finish&nbsp;Import
                </Button>
            </div>
            
            <div className="flex flex-row flex-wrap gap-3">
            {
                tokens.length > 0 ?
                tokens.map(token => (
                    <Bordered 
                        className="p-1"
                        key={token.tokenId}
                    >
                        <TokenPreviewCard token={token} />
                    </Bordered>
                ))
                :
                <p>No token found</p>
            }
            </div>
        </div>
    )
}

function TokenPreviewCard(props: TokenPreviewProps) {
    const { token } = props

    return (
        <div className="flex flex-col gap-3 w-[290px] h-[320px] rounded p-4 bg-gray-100 dark:bg-gray-900 hover:bg-opacity-60 transition drop-shadow-xl">
            <div className="py-2 w-[220px] h-[220px]">
                <MediaPreview
                    src={token.media}
                    type={"image/*"}
                    loadingComponent={<MediaSkeleton className="w-full h-full" />}
                    previewClassName="flex justify-center items-center w-full h-full"
                    className="max-w-[220px] max-h-[220px]"
                />
            </div>
            <h4 
                className={`text-xl text-gray-950 py-2 dark:text-white tracking-wide subpixel-antialiased`}
                title={`${token.name} #${token.tokenId}`}
            >
                {cutString(token.name, 16)}#{token.tokenId}
            </h4>
        </div>
    )
}