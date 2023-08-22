"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var app_config_1 = require("../app.config");
var currencies = app_config_1.dbCollections.currencies;
var PriceSchema = new mongoose_1.Schema({
    /* ...fiatCurrencies.reduce(
        (acc, curr) => {
        acc[curr.iso] = {type: String, default: '0'};
        return acc;
    }, {} as CryptocurrencyMarketDataType), */
    usd: { type: String, default: '0' },
    gbp: { type: String, default: '0' },
    eur: { type: String, default: '0' },
    zar: { type: String, default: '0' },
    ngn: { type: String, default: '0' },
    inr: { type: String, default: '0' },
    jpy: { type: String, default: '0' },
    cny: { type: String, default: '0' },
    usd_24h_change: { type: String, default: '0' },
    gbp_24h_change: { type: String, default: '0' },
    eur_24h_change: { type: String, default: '0' },
    zar_24h_change: { type: String, default: '0' },
    ngn_24h_change: { type: String, default: '0' },
    inr_24h_change: { type: String, default: '0' },
    jpy_24h_change: { type: String, default: '0' },
    cny_24h_change: { type: String, default: '0' },
}, {
    _id: false,
    strict: false
});
var CurrencySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    cid: { type: String, required: true },
    uid: { type: String, lowercase: true, unique: true, default: function () { return this.cid + '#' + this.chainId; } },
    symbol: { type: String, required: true },
    decimals: { type: Number, required: true },
    chainId: { type: Number, required: true },
    address: { type: String, required: true },
    logoURI: { type: String, required: true },
    price: PriceSchema,
    marketId: String,
    disabled: { type: Boolean, default: false }
}, {
    collection: currencies,
    timestamps: true
});
CurrencySchema.post('find', function (docs) {
    docs.forEach(function (doc) {
        var _a;
        (_a = doc === null || doc === void 0 ? void 0 : doc.toObject) === null || _a === void 0 ? void 0 : _a.call(doc, {
            flattenMaps: true,
            flattenObjectIds: true,
            versionKey: false
        });
    });
});
exports.default = mongoose_1.models[currencies] || (0, mongoose_1.model)(currencies, CurrencySchema);
