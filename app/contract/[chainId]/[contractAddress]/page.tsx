import type { PopulatedContractType } from "@/lib/types/contract"
import type { PopulatedNftTokenType } from "@/lib/types/token"
import Image from "@/components/Image"
import Banner from "@/components/Banner"
import AccountAvatar from "@/components/UserAccountAvatar"
import Tag from "@/components/Tag"
import { NftTokenCard } from "@/components/Card"
import Link from "next/link"
import appRoute from "@/config/app.route"
// Server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { getContractByAddress, getTokensByQuery } from "@/lib/handlers"

interface PageProps {
    chainId: string,
    contractAddress: string,
}

async function getServerSideData(params: PageProps) {
    const { chainId, contractAddress } = params
    await mongoooseConnectionPromise
    const contract = await getContractByAddress(contractAddress, Number(chainId)) as PopulatedContractType
    const tokens = await getTokensByQuery({
        contract: contract
    }, {}) as PopulatedNftTokenType[] // Max of 100 results

    return {
        tokens,
        contract
    }
}

export default async function Page({params}: {params: PageProps}) {
    const { contract, tokens} = await getServerSideData(params)

    const {
        chainId,
        contractAddress,
        owner,
        label,
        symbol,
        nftSchema,
    } = contract

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                <Banner className="pb-8">
                    <Banner.Image>
                        <Image 
                            src={''}
                            alt=""
                            data={contractAddress}
                            width={400}
                        />
                    </Banner.Image>
                    
                    <Banner.Body>
                        <Banner.Heading>
                            {label} {symbol} 
                        </Banner.Heading>

                        <Banner.Text>
                            <span className="select-all">{contractAddress}</span>
                        </Banner.Text>
                        <div className="flex flex-col gap-4 pb-4">
                            <div className="flex flex-row items-center">
                                <span>Owner: &nbsp;</span>
                                <Link title={owner?.address} href={appRoute.viewAccount.replace(":address", owner?.address)}>
                                    <AccountAvatar 
                                        account={owner} 
                                        width={32} 
                                        className="rounded" 
                                    />
                                </Link>
                            </div>
                            <h5 className="">Schema: <Tag>{nftSchema?.toUpperCase()}</Tag></h5>
                        </div>
                        
                    </Banner.Body>
                    <Banner.Tags>
                        <Tag className="text-lg px-2 py-1 mx-3">
                                Minting: Private
                        </Tag>
                        <Tag className="text-lg px-2 py-1">
                                Chain: {chainId}
                        </Tag>
                    </Banner.Tags>
                </Banner>

                {/* Contract token */}

                <div className="flex flex-row flex-wrap gap-4 my-4 pt-8">
                    {   
                        tokens &&
                        tokens.length ?
                        tokens.map(token => (
                            <NftTokenCard
                                key={token?._id?.toString()}
                                token={token}
                            />
                        ))
                        :
                        <p className="text-center">Nothing&apos;s here</p>
                    }
                </div>

            </div>
        </div>
    )
}