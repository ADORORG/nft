import type ContractType from "@/lib/types/contract"
import Link from "next/link"
import Image from "@/components/Image"
import appRoutes from "@/config/app.route"
import { cutAddress } from "@/utils/main"

export default function ContractAvatar(props: {contract: ContractType}) {

    return (
        <Link 
            href={
                appRoutes.contract
                .replace(":chainId", props.contract.chainId.toString())
                .replace(":contractAddress", props.contract.contractAddress)
            }
            className="flex gap-1 items-center"
        >
            <Image 
                src=""
                alt=""
                data={props.contract.contractAddress}
                className="h-6 w-6 rounded border border-gray-100 dark:border-gray-800"
            />
            &nbsp;
            <span>{cutAddress(props.contract.contractAddress)}</span>
        </Link>
    )
}