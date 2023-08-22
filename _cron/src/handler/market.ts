import Currency from '../lib/models/currency';
import { fiatCurrencies } from '../lib/app.config'
import { makeApiRequest } from '../utils';


export async function updateMarketData() {
    const coinList = await Currency.find({}).lean().exec();
    const cmcMarketData = await fetchCoingeckoMarketData(coinList.map(c => c.marketId) as string[]);
    console.log("cmcMarketData", cmcMarketData)
    if (cmcMarketData) {
         // update many
        return Currency.bulkWrite(coinList.map( coin => {
            const { _id, marketId } = coin;
            const coinData = cmcMarketData[marketId as keyof typeof cmcMarketData];

            return {
                updateOne: {
                    filter: {_id},
                    update: {$set: {
                        price: coinData
                    }},
                }
            }
        }));
    }
}

async function fetchCoingeckoMarketData(coinIds: string[]) {
    try {
        const slugs = coinIds.join(',');
        const fiats = fiatCurrencies.map(fiat => fiat.iso).join(',');
        const reqOption = {
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${slugs}&vs_currencies=${fiats}&include_24hr_change=true`,
            method: 'get'
        }
        return makeApiRequest(reqOption);
    } catch (e) {
        // do nothing
        console.log(e);
    }
}