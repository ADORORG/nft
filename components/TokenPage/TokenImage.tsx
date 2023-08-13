import type TokenPageProps from "./types"
import Image from "@/components/Image"

export default function TokenImage(props: TokenPageProps) {

    return (
        <div className="flex justify-center p-4 drop-shadow-lg">
            <Image 
                src={props.token.image}
                alt={props.token.tokenId}
                data={`${props.token.contract.contractAddress}${props.token.tokenId}`}
                title={props.token.name}
                // height={350}
                width={350}
                className="max-h-[450px]"
            />
        </div>
    )
}