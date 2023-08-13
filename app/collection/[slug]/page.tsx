import { FiatCurrencyDisplay } from "@/components/Currency"
import Banner from "@/components/Banner"
import Image from "@/components/Image"
import TagList from "@/components/TagList"
import Tag from "@/components/Tag"
import SocialIcon from "@/components/SocialIcon"
import AccountAvatar from "@/components/UserAccountAvatar"
import Link from "next/link"
import appRoute from "@/config/app.route"
import type AccountType from "@/lib/types/account"
import { getSettledPromiseValue } from "@/utils/main"

// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getCollectionBySlug, getCollectionValueInDollar } from "@/lib/handlers"

async function getServerSideData(slug: string) {
    await mongoooseConnectionPromise
    const [collection, collectionValueInDollar] = await Promise.allSettled([
        getCollectionBySlug(slug),
        getCollectionValueInDollar({slug: slug.toLowerCase()})
    ])
    
    return {
        collection: getSettledPromiseValue(collection, []),
        collectionValueInDollar: getSettledPromiseValue(collectionValueInDollar, [])
    }
}

export default async function Page({params: {slug}}: {params: {slug: string}}) {
    const {collection, collectionValueInDollar } = await getServerSideData(slug)
    const owner = collection?.owner as AccountType

    const {
        name,
        description,
        tags,
        category,
        // externalUrl,
        // banner,
        image,
        discord,
        twitter
    } = collection || {}

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                <Banner className="pb-8">
                    <Banner.Image>
                        <Image 
                            src={image}
                            alt=""
                        />
                    </Banner.Image>
                    
                    <Banner.Body>
                        <Banner.Heading>
                            {name}
                        </Banner.Heading>

                        <Banner.Text>
                            {description}
                        </Banner.Text>
                        <div className="flex flex-col gap-4 pb-4">
                            <div className="flex flex-row items-center">
                                <span>Owner: &nbsp;</span>
                                <Link title={owner?.address} href={appRoute.account.replace(":address", owner?.address)}>
                                    <AccountAvatar 
                                        account={owner} 
                                        width={32} 
                                        className="rounded" 
                                    />
                                </Link>
                            </div>
                            <h5 className="">
                                Collection Value:&nbsp; 
                                <FiatCurrencyDisplay 
                                    amount={
                                        collectionValueInDollar.length
                                        ?
                                        collectionValueInDollar[0].amount
                                        :
                                        0
                                    } 
                                    className="text-white font-bold" 
                                />
                            </h5>
                            <h5 className="">Category: <Tag>{category}</Tag></h5>
                        </div>
                        
                    </Banner.Body>
                    
                    <Banner.Tags>
                       <TagList tags={tags} className="text-lg px-2 py-1" />
                    </Banner.Tags>
                    <Banner.Links>
                        <SocialIcon
                            iconClassName="h-6 w-6 mx-2"
                            socials={[
                                {
                                    name: "twitter",
                                    link: twitter
                                },
                                {
                                    name: "discord",
                                    link: discord
                                }
                            ]}
                            
                        />
                    </Banner.Links>
                </Banner>

                {/* Collection items */}


            </div>
        </div>
    )
}