import type AccountType from "@/lib/types/account"
import { FiatCurrencyDisplay } from "@/components/Currency"
import Banner from "@/components/Banner"
import TagList from "@/components/TagList"
import Tag from "@/components/Tag"
import SocialIcon from "@/components/SocialIcon"
import AccountAvatar from "@/components/UserAccountAvatar"
import MediaPreview from "@/components/MediaPreview"
import Link from "next/link"
import appRoute from "@/config/app.route"
import { IPFS_GATEWAY } from "@/lib/app.config"
// Server
import getServerSideData from "../serverSideData"

export default async function Page({params: {slug}}: {params: {slug: string}}) {
    const {collection, collectionValueInDollar } = await getServerSideData({slug})
    const owner = collection?.owner as AccountType

    const {
        name,
        description,
        tags,
        category,
        // externalUrl,
        // banner,
        media,
        mediaType,
        image,
        discord,
        twitter
    } = collection || {}

    return (
        <Banner className="pb-8">
            <Banner.Image>
                <MediaPreview
                    type={mediaType || "image/*"}
                    src={`${IPFS_GATEWAY}${media || image}`}
                    previewClassName="h-[200px] w-[200px] flex justify-center items-center"
                    className="max-h-[200px]"
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
                        <Link title={owner?.address} href={appRoute.viewAccount.replace(":address", owner?.address)}>
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
                                collectionValueInDollar[0].dollarValue
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
                            link: twitter||'#'
                        },
                        {
                            name: "discord",
                            link: discord||'#'
                        }
                    ]}
                    
                />
            </Banner.Links>
        </Banner>
    )
}