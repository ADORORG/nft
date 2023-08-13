import pinataSDK from '@pinata/sdk'

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)

export async function uploadMediaToIPFS(fileData: any, fileId: string) {
	try {
		const result = await pinata.pinFileToIPFS(fileData, {
            pinataMetadata: {
                name: fileId
            }
        })

		return result.IpfsHash;
	} catch (err: any) {
		throw new Error(err.message || err);
	}
}
  
export function testPinataConnection() {
	pinata.testAuthentication()
	.then(result => {
		console.log('result: ', result)

	}).catch(err => {
		console.log('error: ', err)
	})
}