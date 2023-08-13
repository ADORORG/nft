import type TokenPageProps from "./types"
import type { AttributeType } from "@/lib/types/common"

export default function TokenAttributes(props: TokenPageProps) {

    if (!props.token?.attributes || props.token?.attributes.length === 0) {
        return null
    }

    return (
        <div className="py-4 flex flex-row flex-wrap gap-4 justify-center">
            {
                props.token.attributes.map((attr, index) => (
                    <Attribute 
                        attribute={attr} 
                        key={index+attr.trait_type}
                    />
                ))
            }
        </div>
    )
}

function Attribute({attribute}: {attribute: AttributeType}) {
    return (
        <div 
            className="flex flex-col rounded border border-gray-200 dark:border-gray-800 content-center items-center"
        >  
            <h6 className="bg-gray-100 dark:bg-gray-800 text-center px-2 w-full">{attribute.trait_type}</h6>
            <span className="p-2">{attribute.value}</span>
        </div>
    )
}