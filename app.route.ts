
const appRoute = {
    /** Create collection route */
    createCollection: "/create/collection",
    /** View a single collection */
    viewCollection: "/collection/:slug",
    /** View list of collections */
    collections: "/collection",
    /** Create token route */
    createToken: "/create/token",
    /** View a token and market data */
    viewToken: "/contract/:contractAddress/:tokenId",
    /** Create ERC721 contract */
    createErc721: "/create/erc721",
    /** Create ERC1155 contract */
    createErc1155: "/create/erc1155",
    /** View account address */
    viewAccount: "/account/:address",
    /** Explore token & collection page */
    explore: "/explore",
    /** Marketplace page */
    marketplace: "/marketplace",
    /** Import token page */
    import: "/import",
    /** Transfer token page */
    transfer: "/transfer"
}

export default appRoute