import { PopulatedNftTokenType } from "@/lib/types/token"
import Image from "@/components/Image"
import Banner from "@/components/Banner"
import SocialIcon from "@/components/SocialIcon"
import { NftTokenCard } from "@/components/Card"
import { FiatCurrencyDisplay } from "@/components/Currency"

// Server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { setAccountDetails, getTokensByOwner, getTraderAccountMarketValue } from "@/lib/handlers"

interface PageProps {
    address: string
}

async function getServerSideData(params: PageProps) {
    const { address } = params
    await mongoooseConnectionPromise

    const [account, tokens, accountMarketValue] = await Promise.all([
        setAccountDetails(address, {}),
        getTokensByOwner(address),
        getTraderAccountMarketValue({
            $or: [{seller: address.toLowerCase()}, {buyer: address.toLowerCase()}]
        })
    ])

    return {
        tokens,
        account,
        accountMarketValue
    }
}

export default async function Page({params}: {params: PageProps}) {
    const { account, tokens, accountMarketValue} = await getServerSideData(params)
    const {
        address,
        name,
        image,
        discord,
        twitter,
    } = account

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                <Banner className="pb-8 mt-8">
                    <Banner.Image>
                        <Image 
                            src={image}
                            alt=""
                            data={address}
                            width={400}
                        />
                    </Banner.Image>
                    
                    <Banner.Body>
                        <Banner.Heading>
                            Account {name} 
                        </Banner.Heading>

                        <Banner.Text>
                            <span className="select-all break-words">{address}</span>
                        </Banner.Text>
                        <h5 className="pb-4 text-lg">
                            Value:&nbsp; 
                            <FiatCurrencyDisplay 
                                amount={
                                    accountMarketValue.length
                                    ?
                                    accountMarketValue[0].dollarValue
                                    :
                                    0
                                } 
                                className="text-white font-bold" 
                            />
                        </h5>
                    </Banner.Body>
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

                {/* Account token */}

                <div className="flex flex-col md:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 my-4 pt-8">
                    {   
                        tokens &&
                        tokens.length ?
                        tokens.map(token => (
                            <NftTokenCard
                                key={token?._id?.toString()}
                                token={token as PopulatedNftTokenType}
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