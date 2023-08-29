import type { NftContractEditionType } from "@/lib/types/common"

/**
 * Convert to royalty percent. Base default to 100.
 * @param value 
 * @returns 
 */
export function toRoyaltyPercent(value: number, base: number = 100) {
    return value * base
}

/**
 * Convert from royalty percent. Base default to 100.
 * @param value 
 * @returns 
 */
export function fromRoyaltyPercent(value: number, base: number = 100) {
    return Math.round(value / base)
}

export function getEventContractEditionData(event: NftContractEditionType, supply = 0) {
    let editionStr = ""
    let supplyStr = ""

    switch (event) {
        case "open_edition":
            editionStr = "Unlimited edition"
            supplyStr = "Unlimited"
        break;
        case "limited_edition":
        case "generative_series":
            editionStr = `${supply} editions`
            supplyStr = `${supply} / ${supply}`
        break;

        case "one_of_one":
            editionStr = "One of one"
            supplyStr = "1 / 1"
        break;
    }

    return {
        editionStr,
        supplyStr
    }
}