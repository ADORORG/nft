import type AccountType from '@/lib/types/account'
import type NftContractType from '@/lib/types/contract'
import type NftTokenType from '@/lib/types/token'
import type CollectionType from '@/lib/types/collection'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getContractByAddress, createContract, createManyTokens, getTokensByQuery, getCollectionsByQuery, setAccountDetails } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError, withSession } from '@/wrapper'

interface ReqBodyType {
    contract: NftContractType;
    xcollection: CollectionType;
    tokens: NftTokenType[];
}

async function importContractToken(req: NextRequest, _: {}, { user }: {user: AccountType}) {
    const { contract, tokens, xcollection } = await req.json() as ReqBodyType

    if (!contract || !tokens.length || !xcollection) {
        throw new CustomRequestError('Invalid request data')
    }

    await mongooseConnectPromise
    const collection = await getCollectionsByQuery({
        _id: xcollection,
        owner: user
    }, {})

    if (!collection.length) {
        throw new CustomRequestError('Invalid collection')
    }

    /* 
    * Create a new contract if it's not existing
    * Create a tokens for non-existing ones or
    * Create all the tokens at once if the contract
    * is not existing
    */
    const existingContract = await getContractByAddress(contract.contractAddress as string, contract.chainId)

    if (!existingContract) {
        // Get or create contract owner account
        const contractOwner = await setAccountDetails(contract.owner?.toString()?.toLowerCase() as string, {address: contract.owner as string})

        const newContract = await createContract({
            contractAddress: contract.contractAddress,
            chainId: contract.chainId,
            nftSchema: contract.nftSchema,
            nftEdition: 'private',
            version: '',
            imported: true,
            draft: false,
            royalty: 0,
            owner: contractOwner
        })

        // Create many tokens since contract is not existing in our db
        await createManyTokens(tokens.map(token => ({
            contract: newContract,
            owner: user, // Current user
            xcollection: collection[0],
            tokenId: token.tokenId,
            quantity: newContract.nftSchema === 'erc1155' ? token.quantity : 1,
            name: token.name,
            description: token.description,
            media: token.media,
            draft: false
        })))
    } else {
        /* 
        * contract is existing,
        * Only create non-existing tokens
        */

        // Find all the tokens that matches the tokenId with the same contract
        const queriedTokens = await getTokensByQuery({
            contract: existingContract._id,
            tokenId: {$in: tokens.map(token => token.tokenId)}
        }, {select: '_id'})
        
        /* 
        * Find tokens in queriedTokens.
        * We'll create tokens that are not found
        */
        const tokensPendingCreation = tokens.filter(token => {
            return !queriedTokens.find(qT => qT.tokenId?.toString() === token.tokenId?.toString())
        })

        await createManyTokens(tokensPendingCreation.map(token => ({
            contract: existingContract,
            owner: user, // Current user
            xcollection: collection[0],
            tokenId: token.tokenId,
            quantity: existingContract.nftSchema === 'erc1155' ? token.quantity : 1,
            name: token.name,
            description: token.description,
            media: token.media,
            draft: false
        })))
    }
    
    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: null,
        code: 200
    }, {status: 200})
}

const wrappedPost = withRequestError(withSession(importContractToken))
export { wrappedPost as POST}