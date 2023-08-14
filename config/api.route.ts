
/**
 * Get the base URI for erc721 and erc1155
 * @param chainId 
 * @returns string uri
 */
export function getNftContractBaseURI(chainId: number) {
    /**
     * For the current contract,
     * The contract address will be appended to this uri in the deployed contract
     * @example 
     * chainId = 5
     * contractAddress = '0x'
     * uri = 'https://api.adors.org/contract/5/0x'
     */
    return `https://api.adors.org/contract/${chainId}/`
}

/** Backend api routes */
const apiRoutes = {
    /** Create a new collection */
    createCollection: "/api/create/collection",
    /** Create a new contract */
    createContract: "/api/create/contract",
    /** Create a new token */
    createToken: "/api/create/token",
    /** Create market order */
    createMarketOrder: "/api/create/market",
    /** Get a single collection */
    getCollectionBySlug: "/api/collection/slug/:slug",
    /** Get account collections by owners' address */
    getCollectionByAddress: "/api/collection/account/:address",
    /** Get account contracts by owners' address */
    getContractByAddress: "/api/contract/account/:address",
    /** Get token market orders */
    getTokenMarketOrders: "/api/market/token/:tokenDocId",
    /** Get token market order bids */
    getTokenMarketOrderBids: "/api/market/bid/:marketOrderDocId",
    /** 
     * Get Redeemable content of a token. 
     * Callable by the token holder/owner
     */
    getRedeemableContent: "/api/token/redeem/:tokenDocId",
    /** Get all supported currencies */
    getAllCurrency: "/api/currency/getAll",
    /** Get currency by chain Id */
    getCurrenciesByChain: "/api/currency/chain/:chainId",
    /** Add new currency. Callable by admin */
    addNewCurrency: "/api/currency/new"
}

export default apiRoutes