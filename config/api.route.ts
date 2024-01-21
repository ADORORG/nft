
/**
 * Get the base URI for erc721 and erc1155
 * @param chainId 
 * @returns string uri
 */
export function getNftContractBaseURI(chainId: number) {
    /**
     * For the current nft solidity contract,
     * The contract address will be automatically appended to the token uri in the deployed contract
     * @example 
     * chainId = 5
     * contractAddress = '0x'
     * uri = 'https://nft.adors.org/contract/5/0x'
     * token uri for token Id `1` will be https://nft.adors.org/contract/5/0x/1
     */
    return `${process.env.NEXT_PUBLIC_CONTRACT_BASE_URI}${chainId}/`
}

/** Backend api routes */
const apiRoutes = {
    /** Update account Profile */
    updateProfile: "/api/account/updateProfile",
    /** Update account profile pic using token media */
    setProfilePic: "/api/account/setProfilePic",
    /** Verify account email */
    verifyAccountEmail: "/api/account/verifyEmail",
    /** Request email Otp */
    requestEmailOtp: "/api/account/requestEmailOtp",
    /** Mint in a primary sale mint event */
    mintOnEvent: "/api/event/mint/:eventDocId",
    /** Create a new collection */
    createCollection: "/api/create/collection",
    /** Create a new contract */
    createContract: "/api/create/contract",
    /** Create a new token */
    createToken: "/api/create/token",
    /** Create primary sale event */
    createEvent: "/api/create/event",
    /** Create market order */
    createMarketOrder: "/api/create/market",
    /** Create market auction bid */
    createMarketAuctionBid: "/api/create/bid/:marketOrderDocId",
    /** Search Collection */
    searchCollection: "/api/search/collection",
    /** Search Contract */
    searchContract: "/api/search/contract",
    /** Search nft contract event */
    searchEvent: "/api/search/event",
    /** Get draft token */
    getDraftToken: "/api/draft/token",
    /** Get draft contract */
    getDraftContract: "/api/draft/contract",
    /** Get draft event */
    getDraftEvent: "/api/draft/event",
    /** Get a single collection */
    getCollectionBySlug: "/api/collection/slug/:slug",
    /** Get account collections by owners' address */
    getCollectionByAddress: "/api/collection/account/:address",
    /** Get account contracts by owners' address */
    getContractByAddress: "/api/contract/account/:address",
    /** Get token market orders */
    getTokenMarketOrders: "/api/market/token/:tokenDocId",
    /** Get a single active order on token */
    getActiveMarketOrder: "/api/market/active/order/:tokenDocId",
    /** Get market offers on token */
    getActiveOffers: "/api/market/active/offers/:tokenDocId",
    /** Get token market order bids */
    getTokenMarketOrderBids: "/api/market/bid/:marketOrderDocId",
    /** Mark a market order as sold */
    finaliseMarketOrder: "/api/market/finalise/:marketOrderDocId",
    /** Cancel market order */
    cancelMarketOrder: "/api/market/cancel/:marketOrderDocId",
    /** 
     * Get Redeemable content of a token. 
     * Callable by the token holder/owner
     */
    getRedeemableContent: "/api/token/redeem/:tokenDocId",
    /** Transfer token offchain to a newOwner after transferring onchain */
    transferToken: "/api/token/transfer",
    /** Get all supported currencies */
    getAllCurrency: "/api/currency/getAll",
    /** Get currency by chain Id */
    getCurrenciesByChain: "/api/currency/chain/:chainId",
    /** Add new currency. Callable by admin */
    addNewCurrency: "/api/currency/add",
    /** Update a currency. Substituting the currency _id for 'currencyDocId' in params  */
    updateCurrency: "/api/currency/update/:currencyDocId",
    /** Import a contract and its tokens */
    import: "/api/import",
    // V2 routes
    /** Create a new token */
    createTokenV2: "/api/v2/create/token",
    /** Create nft minting event */
    createEventV2: "/api/v2/create/event",
    /** Upload file for a token */
    uploadTokenMedia: "/api/v2/create/media/token/:docId",
    /** Upload file for a collection */
    uploadCollectionMedia: "/api/v2/create/media/collection/:docId",
    /** Upload file for a event */
    uploadEventMedia: "/api/v2/create/media/event/:docId",
}

export default apiRoutes