import { type PopulatedNftTokenType } from "@/lib/types/token"

type ChainMarketplaceMap = {
    erc721: {
        [key: number]: `0x${string}`
    },
    erc1155: {
        [key: number]: `0x${string}`
    }
}

type MarketplaceContractMap = {
    [key: number]: ChainMarketplaceMap
}

const goerliMarketplace: ChainMarketplaceMap = {
    /** Map marketplace versions to nft type */
    erc721: {
        1: "0x4Dbd29AdF3D79f2CF506f148288352EF921BE65a"
    },
    erc1155: {
        1: "0x0000000000000000000000000000000000000000"
    }
} as const


const ethMainnetMarketplace: ChainMarketplaceMap = {
    /** Map marketplace versions */
    erc721: {
        1: "0xA9515EBAe4EaE0EF8F63951283868614B7645027"
    },
    erc1155: {
        1: "0x0000000000000000000000000000000000000000"
    }
} as const

const marketplaceContractAddresses: MarketplaceContractMap = {
    1: ethMainnetMarketplace,
    5: goerliMarketplace,
} as const

/** defaultMarketplaceVersion will be updated whenever we deploy a new marketplace contract  */
export const defaultMarketplaceVersion = 1
export default marketplaceContractAddresses

/**
 * Get the appropriate marketplace contract address based on chainId=>contractSchema=>contractVersion
 * @param token - A populated token containing contract data
 * @param version - The version to get, defaults to the marketplace contract latest version
 * @returns 
 */
export function getMarketplaceContract(token: PopulatedNftTokenType, version: number = defaultMarketplaceVersion) {
    try {
        /** Get the contract chainId */
        const tokenContractChainId = token.contract.chainId
         /** Get the contract nftSchema */
         const tokenContractSchema = token.contract.nftSchema.toLowerCase()
        /** Get the marketplace contract by chainId */
        const marketplaceContractByChain = marketplaceContractAddresses[tokenContractChainId]

        if (!marketplaceContractByChain) {
            throw new Error(`Marketplace contract for chain ${tokenContractChainId} not found`)
        }

        /** Get the marketplace contract by nftSchema */
        const marketplaceContractBySchema = tokenContractSchema === "erc721" ? marketplaceContractByChain.erc721 : marketplaceContractByChain.erc1155
        const marketplaceContractAddress = marketplaceContractBySchema[version]

        if (!marketplaceContractAddress) {
            throw new Error(`Marketplace contract ${version} for ${tokenContractSchema} on chain[${tokenContractChainId}] is not found`)
        }

        return marketplaceContractAddress
        
    } catch(error: any) {
        throw new Error(error)
    }
}
