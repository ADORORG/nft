import type { PopulatedNftTokenType} from "@/lib/types/token"
import Image from "@/components/Image"
import UserAccountAvatar from "@/components/UserAccountAvatar"
import CollectionAvatar from "@/components/CollectionAvatar"
import Button from "@/components/Button"
import Link from "next/link"
import appRoutes from "@/config/app.route"
import { replaceUrlParams, cutString } from "@/utils/main"

type NftTokenProps = {
    token: PopulatedNftTokenType, 
}

export default function NftTokenCard(props: NftTokenProps) {
    const { tokenId, name, image = "", owner, contract, xcollection } = props.token
    /**
     * @todo Fix card sizes base on size (lg | md) passed as prop
     */
    return (
        <div className={`w-56 h-80 rounded p-4 bg-gray-100 dark:bg-gray-900 hover:bg-opacity-60 transition drop-shadow-xl`}>
            <div className="flex flex-col justify-between gap-2 h-72">
                <div className={`bg-transparent flex justify-center items-center h-2/3`}>
                    <Image 
                        className={`h-full w-auto`} 
                        src={image}
                        alt=""
                        data={`${contract.contractAddress}${tokenId}`}
                        width={400}
                        // height={`${sizes[size].imageHeight}`}
                    />
                </div>

                <div className="w-full flex flex-col py-2 lg:py-4 justify-end">
                    <h4 className={`text-xl text-gray-950 dark:text-white tracking-wide subpixel-antialiased`}>
                        {cutString(name, 10)} #{tokenId}
                    </h4>
                    
                    <div className="flex flex-row items-center justify-between pt-2">
                        <div className="flex flex-row items-center gap-3">
                            <UserAccountAvatar 
                                account={owner}
                                width={24}
                                height={24}
                                title={`Owner: ${owner.address}`}
                            />
                            <CollectionAvatar
                                xcollection={xcollection}
                                width={28}
                                height={28}
                                title={`Collection: ${xcollection.name}`}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Link
                                href={
                                    replaceUrlParams(appRoutes.viewToken, {
                                        tokenId: tokenId.toString(),
                                        contractAddress: contract.contractAddress,
                                        chainId: contract.chainId.toString()
                                    })
                                }
                            >
                                <Button
                                    className="text-sm px-2 py-1"
                                    variant="secondary"
                                    rounded
                                    inversed
                                >
                                    View
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}