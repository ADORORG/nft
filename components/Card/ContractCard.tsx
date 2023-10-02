"use client"
import type { PopulatedContractType } from "@/lib/types/contract"
import Link from "next/link"
import { Link45deg } from "react-bootstrap-icons"
import { cutAddress, replaceUrlParams, cutString } from "@/utils/main"
import { useChainById } from "@/hooks/contract"
import { getChainIcon } from "@/components/ConnectWallet/ChainIcons"
import { UserAccountAvatarWithLink } from "@/components/UserAccountAvatar"
import appRoutes from "@/config/app.route"

export default function ContractCard({ contract }: { contract: PopulatedContractType }) {
    const {
        contractAddress,
        label,
        // symbol,
        // nftEdition,
        nftSchema,
        chainId,
        owner
    } = contract
    const ChainIcon = getChainIcon(chainId)
    const chainInfo = useChainById(chainId)
    const contractLink = replaceUrlParams(appRoutes.viewContract, { contractAddress, chainId: chainId.toString() })
    
    return (
        <div className="w-70 h-36 drop-shadow-md rounded p-3 bg-gray-100 dark:bg-gray-900 hover:opacity-80 transition">
            <div className="flex flex-col gap-2">
                <p className="flex items-center">
                    <span>CA: &nbsp;</span>
                    <Link href={contractLink} className="flex items-center gap-1">
                        <span>{cutAddress(contractAddress, 16, 4)}</span>
                        <span><Link45deg className="w-4 h-4 ml-1" /></span>
                    </Link>
                </p>

                <p className="">
                    <span>Name: {cutString(label, 14)} ({nftSchema})</span>
                </p>

                <div className="flex flex-row gap-2">
                    <span>Chain: </span>
                    <span className="flex items-center gap-1">
                        <ChainIcon className="w-4 h-4" /> 
                        <span>{chainInfo?.name}</span>
                    </span>
                </div>

                <div className="flex flex-row gap-2">
                    Owner:&nbsp; 
                    <UserAccountAvatarWithLink 
                        account={owner} 
                        width={24}
                        height={24}
                    />
                </div>
            </div>
        </div>
    )
}