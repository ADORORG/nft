import type { NftContractEditionType } from "@/lib/types/common"

/**
 * Convert to royalty percent. Base default to 100.
 * @param value 
 * @returns 
 * @example toRoyaltyPercent(49, 100) // 4900
 */
export function toRoyaltyPercent(value: number, base: number = 100) {
    return value * base
}

/**
 * Convert from royalty percent. Base default to 100.
 * @param value 
 * @returns 
 * @example fromRoyaltyPercent(4900, 100) // 49
 */
export function fromRoyaltyPercent(value: number, base: number = 100) {
    return Math.round(value / base)
}

export function getEventContractEditionData(event: NftContractEditionType, supply = 0) {
    let editionStr = ""
    let supplyStr = ""
    let contractStr = "Private"

    switch (event) {
        case "open_edition":
            editionStr = "Open edition"
            supplyStr = "Unlimited"
            contractStr = "Open edition"
        break;
        case "limited_edition":
        case "generative_series":
            editionStr = `${supply} editions`
            supplyStr = `${supply} / ${supply}`
            contractStr = "Limited edition"
        break;

        case "one_of_one":
            editionStr = "One of one"
            supplyStr = "1 / 1"
            contractStr = "Limited edition"
        break;
    }

    return {
        editionStr,
        supplyStr,
        contractStr
    }
}

/**
 * Determine the edition and supply type
 * @param editionType 
 * @returns 
 */
export function nftEditionChecker(editionType?: NftContractEditionType) {

    const isOneOfOne = editionType === "one_of_one"
    const isLimitedEdition = editionType === "limited_edition"
    const isOpenEdition = editionType === "open_edition"
    const isGenerative = editionType === "generative_series"

    return {
        /** True for one_of_one edition */
        isOneOfOne,
        /** True for limited_edition edition */
        isLimitedEdition,
        /** True for open_edition edition */
        isOpenEdition,
        /** True for generative_series edition */
        isGenerative,
        /** True for generative_series or limited_edition edition */
        isLimitedSupply: isGenerative || isLimitedEdition
    }

}