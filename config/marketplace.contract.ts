
type ChainMarketplaceMap = {
    [key: string]: `0x${string}`
}

type MarketplaceContractMap = {
    [key: number]: ChainMarketplaceMap
}

const goerliMarketplace: ChainMarketplaceMap = {
    /** Map marketplace versions to nft type */
    // version 1
    "1": "0x4Dbd29AdF3D79f2CF506f148288352EF921BE65a"
} as const

const ethMainnetMarketplace: ChainMarketplaceMap = {
    /** Map marketplace versions */
     // version 1
     "1": "0xA9515EBAe4EaE0EF8F63951283868614B7645027"
} as const

const baseGoerliMarketplace: ChainMarketplaceMap = {
    /** Map marketplace versions */
     // version 1
     "1": "0x099f95b0694A0D808f7C6c46A621f4E5E5E36dF5"
} as const

const marketplaceContractAddresses: MarketplaceContractMap = {
    1: ethMainnetMarketplace,
    5: goerliMarketplace,
    84531: baseGoerliMarketplace
} as const

/** defaultMarketplaceVersion will be updated whenever we deploy a new marketplace contract  */
export const defaultMarketplaceVersion = "1"
export default marketplaceContractAddresses

/**
 * Get the appropriate marketplace contract address based on contract chainId & contract nftSchema
 * @param tokenContractChainId - Token contract chain id
 * @param version - The version to get, defaults to the marketplace contract latest version
 * @returns 
 */
export function getMarketplaceContract(tokenContractChainId: number, version: string = defaultMarketplaceVersion) {
    try {
        /** Get the marketplace contract by chainId */
        const marketplaceContractByChain = marketplaceContractAddresses[tokenContractChainId]

        if (!marketplaceContractByChain) {
            throw new Error(`Marketplace contract for chain ${tokenContractChainId} not found`)
        }

        /** Get the marketplace contract by version */
        const marketplaceContractAddress = marketplaceContractByChain[version]

        if (!marketplaceContractAddress) {
            throw new Error(`Marketplace contract ${version} for chain[${tokenContractChainId}] is not found`)
        }

        return marketplaceContractAddress
        
    } catch(error: any) {
        throw new Error(error)
    }
}
