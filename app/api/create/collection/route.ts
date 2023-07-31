import type CollectionType from '@/lib/types/collection'
import type AccountType from '@/lib/types/account'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateCollection, createCollection, setAccountDetails } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { onlyAlphaNumeric } from '@/lib/utils/main'
import { dataUrlToReadableStream } from '@/lib/utils/file'
import { uploadImageToIPFS } from '@/lib/utils/pinata'
import { type NextRequest, NextResponse } from 'next/server'

async function createNewCollection(request: NextRequest, _: any, { user }: {user: AccountType}) {
    await mongooseConnectPromise
    const formData = await request.formData()
    
    // Build the collection data
    const data: any = {
        slug: onlyAlphaNumeric(formData.get('name') as string),
        owner: user.address
    }

    for (const key of formData.keys()) {
        data[key] = formData.get(key)
    }
    
    // validate the collection data
    const isValidCollection = await validateCollection(data)
    if (!isValidCollection) {
        throw new CustomRequestError('Collection data is invalid', 400)
    }

    /** 
     * Ensure that image and banner is a dataURI
     * @todo Implement a more strict check for media dataURI  
    */
    if (
        (!data.image && !data.image.startsWith('data:image')) ||
        (!data.banner && !data.banner.startsWith('data:image'))
    ) throw new CustomRequestError('Please provide a valid image and banner for this collection', 400);
    
    // Convert dataURI to readable stream
    const imageId = `${data.slug}-image`;
    const bannerId = `${data.slug}-banner`;
    const imageStream = dataUrlToReadableStream(data.image, imageId);
    const bannerStream = dataUrlToReadableStream(data.banner, bannerId);
    
    // Upload readable stream to ipfs through pinata
    const [imageHash, bannerHash] = await Promise.all([
        uploadImageToIPFS(imageStream, bannerId),
        uploadImageToIPFS(bannerStream, bannerId)
    ])

    // Get the user session account
    const account = await setAccountDetails(user.address, {address: user.address})
    // create the new collection
    const newCollection = await createCollection({
        image: imageHash,
        banner: bannerHash,
        slug: data.slug,
        name: data.name,
        description: data.description,
        tags: data.tags,
        category: data.category,
        externalUrl: data.externalUrl,
        twitter: data.twitter,
        discord: data.discord,
        owner: account._id
    })
    
    // send the new collection in response
    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newCollection,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(createNewCollection))

export { wrappedPost as POST}