import type { PopulatedContractType } from '@/lib/types/contract'
import { createContract, getContractsByQuery, getOrCreateContractByQuery } from '@/lib/handlers'
import { isEthereumAddress } from '@/lib/utils/main'
import { CustomRequestError } from '@/lib/error/request'

export default async function createOrUpdateContract(contract: PopulatedContractType) {
    let newContract

    if (contract._id) {
        const draftQuery = {
            _id: contract._id,
            owner: contract.owner,
        }

        const prevContracts = await getContractsByQuery(draftQuery, {limit: 1})

        if (!prevContracts.length) {
            throw new CustomRequestError('Draft contract not found', 400)
        }

        const withContractAddress = isEthereumAddress(contract?.contractAddress)

        newContract = await getOrCreateContractByQuery(draftQuery, {
            version: contract.version,
            label: contract.label,
            symbol: contract.symbol,
            royalty: contract.royalty,
            contractAddress: withContractAddress ? contract?.contractAddress?.toLowerCase() : "",
            chainId: contract.chainId,
            draft: withContractAddress ? false : true
        })

    } else {
        // create a draft contract pending deployment
        newContract = await createContract(contract)
    }

    return newContract as PopulatedContractType
}
