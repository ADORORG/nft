
const appRoutes = {
    /** Create collection route */
    createCollection: "/create/collection",
    /** View a single collection */
    viewCollection: "/collection/:slug",
    /** Explore list of collections */
    collections: "/collection",
    /** Explore a contract */
    viewContract: "/contract/:chainId/:contractAddress/",
    /** Create token route */
    createToken: "/create/token",
    /** View a token and market data */
    viewToken: "/contract/:chainId/:contractAddress/:tokenId",
    /** View an event data */
    viewEvent: "/event/:eventDocId",
    /** View list of events */
    events: "/events",
    /** Create ERC721 contract */
    createErc721: "/create/erc721",
    /** Create ERC1155 contract */
    createErc1155: "/create/erc1155",
    /** Search page */
    search: "/search",
    /** View, update, and verify user profile */
    setProfile: "/profile/",
    // setProfile: "/account/setProfile",
    /** Explore account address */
    viewAccount: "/account/:address",
    /** Vieww account tokens */
    viewAccountToken: "/account/:address/token",
    /** View account collections */
    viewAccountCollection: "/account/:address/collection",
    /** View account market orders */
    viewAccountMarketOrders: "/account/:address/marketplace",
    /** View sale event created by account */
    viewAccountSaleEvent: "/account/:address/marketplace",
    /** View account contracts */
    viewAccountContract: "/account/:address/contract",
    /** Explore token & collection page */
    explore: "#",
    /** Marketplace page */
    marketplace: "/marketplace",
    /** Import token page */
    import: "#",
    /** Transfer token page */
    transfer: "#",
    /** Create page that shows options to create token, event, collection & contract */
    create: "/create",
    /** Create event page */
    createEvent: "/create/event",
    /** Create open edition event */
    createOpenEdition: "/create/event/openEdition",
    /** Create limited edition event */
    createLimitedEdition: "/create/event/limitedEdition",
    /** Create one of one edition event */
    createOneOfOne: "/create/event/oneOfOne",
    /** Legal links */
    privacyPolicy: "#",
    termsOfService: "#"
}

export default appRoutes