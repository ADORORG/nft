import { Schema, model } from 'mongoose';
import { dbCollections/* , fiatCurrencies */ } from '../app.config';
import type { CryptocurrencyType, CryptocurrencyMarketDataType } from '../types/currency';

const { currencies } = dbCollections;

const PriceSchema = new Schema<CryptocurrencyMarketDataType>({
    /* ...fiatCurrencies.reduce(
        (acc, curr) => {
        acc[curr.iso] = {type: String, default: '0'};
        return acc;
    }, {} as CryptocurrencyMarketDataType), */
    
    usd: {type: String, default: '0'},
    gbp: {type: String, default: '0'},
    eur: {type: String, default: '0'},
    zar: {type: String, default: '0'},
    ngn: {type: String, default: '0'},
    inr: {type: String, default: '0'},
    jpy: {type: String, default: '0'},
    cny: {type: String, default: '0'},
    usd_24h_change: {type: String, default: '0'},
    gbp_24h_change: {type: String, default: '0'},
    eur_24h_change: {type: String, default: '0'},
    zar_24h_change: {type: String, default: '0'},
    ngn_24h_change: {type: String, default: '0'},
    inr_24h_change: {type: String, default: '0'},
    jpy_24h_change: {type: String, default: '0'},
    cny_24h_change: {type: String, default: '0'},
}, {
    _id: false,
    strict: false
});

const CurrencySchema = new Schema<CryptocurrencyType>({
    name: {type: String, required: true},
    cid: {type: String, required: true},
    symbol: {type: String, required: true},
    decimals: {type: Number, required: true},
    chainId: {type: Number, required: true},
    address: {type: String, required: true},
    logoURI: {type: String, required: true},
    price: PriceSchema,
}, {
    collection: currencies,
    timestamps: true
});

export default model<CryptocurrencyType>(currencies, CurrencySchema);