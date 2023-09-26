import type { PageProps } from "../types"
import Banner from "@/components/Banner"
import SocialIcon from "@/components/SocialIcon"
import AccountAvatar from "@/components/UserAccountAvatar"
import { FiatCurrencyDisplay } from "@/components/Currency"
// Server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { setAccountDetails, getTraderAccountMarketValue } from "@/lib/handlers"


async function getServerSideData(address: string) {
    await mongoooseConnectionPromise

    const [account, accountMarketValue] = await Promise.all([
        setAccountDetails(address, {}),
        getTraderAccountMarketValue({
            $or: [{seller: address.toLowerCase()}, {buyer: address.toLowerCase()}]
        })
    ])

    return {
        account,
        accountMarketValue
    }
}

export default async function Page({params: {address}}: {params: PageProps}) {
    const { account, accountMarketValue} = await getServerSideData(address.toLowerCase())
    const {
        name,
        discord,
        twitter,
    } = account

    return (
        <Banner className="pb-8 mt-8">
            <Banner.Image>
                <AccountAvatar
                    account={account}
                    width={160}
                    height={160}
                    className="rounded"
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
    )
}