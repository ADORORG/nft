
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
    /** Create ERC721 contract */
    createErc721: "/create/erc721",
    /** Create ERC1155 contract */
    createErc1155: "/create/erc1155",
    /** Explore account address */
    viewAccount: "/account/:address",
    /** Explore token & collection page */
    explore: "#",
    /** Marketplace page */
    marketplace: "#",
    /** Import token page */
    import: "#",
    /** Transfer token page */
    transfer: "#",
    /** Create page that shows options to create token, collection & contract */
    create: "/create",

    /** Legal links */
    privacyPolicy: "#",
    termsOfService: "#"
}

export default appRoutes