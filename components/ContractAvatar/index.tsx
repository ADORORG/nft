import type ContractType from "@/lib/types/contract"
import Link from "next/link"
import Image from "@/components/Image"
import appRoutes from "@/config/app.route"
import { cutAddress, replaceUrlParams } from "@/utils/main"

interface ContractAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    contract: ContractType
}

export default function ContractAvatar(props: ContractAvatarProps) {
    const { className, ...otherProps } = props

    return (
        <Link 
            href={
                replaceUrlParams(appRoutes.viewContract, {
                    chainId: props.contract.chainId.toString(),
                    contractAddress: props.contract?.contractAddress || ""
                })
            }
            className="flex gap-1 items-center"
        >
            <Image 
                src=""
                alt=""
                data={props.contract.contractAddress}
                className={`rounded border border-gray-100 dark:border-gray-800 ${className}`}
                {...otherProps}
            />
            &nbsp;
            <span>{cutAddress(props.contract?.contractAddress)}</span>
        </Link>
    )
}