import { Readable, PassThrough } from 'stream'

export function bufferToStream(myBuffer: Buffer, path?: string) {
	let stream: Readable & {path?: string} = Readable.from(myBuffer);
		stream.path = path;
		return stream;
}

export function requestBodyToStream(bodyStream: Readable) {
  // return Readable.from([bodyStream])
  const newStream = new Readable();
  newStream.push(bodyStream);
  newStream.push(null);
  return newStream;
}

export function getFileNameFromDataUrl(dataUrl: string, name = 'file') {
	const start = dataUrl.indexOf('/');
	const end = dataUrl.indexOf(';');
	const ext = dataUrl.substring(start + 1, end);
	return name + '.' + ext;
}

export function dataUrlToBuffer(dataUrl: string) {
	return Buffer.from(dataUrl.split(',')[1], 'base64');
}

export function dataUrlToReadableStream(dataUrl: string, fileId: string) {
	const buffer = dataUrlToBuffer(dataUrl);
	const filename = getFileNameFromDataUrl(dataUrl, fileId);

	return bufferToStream(buffer, filename);
}

export function isDataURL(image: string) {
    // Check if the image starts with 'data:image'
    if (!image.startsWith('data:image')) {
      return false;
    }
  
    // Decode the base64 data
    const base64Data = image.split(',')[1];
    try {
      // Attempt to decode the base64 data
      const decodedData = atob(base64Data);
  
      // Check if the decoded data starts with the appropriate image file signature
      // For example, 'PNG' for PNG images, 'JFIF' for JPEG images, etc.
      if (
        decodedData.startsWith('PNG') ||
        decodedData.startsWith('JFIF')
        // Add more checks for other image formats if needed
        // ...
      ) {
        return true;
      }
    } catch (error) {
      // An error occurred while decoding the base64 data,
      // indicating that it is not a valid image
      return false;
    }
  
    return false;
  }
  

export function createCustomReadableFromExistingReadable(existingReadable: any /* Readable (throws on build) */) {
    const customReadable = new PassThrough()
  
    existingReadable.on('data', (chunk: any) => {
      customReadable.push(chunk)
    })
  
    existingReadable.on('end', () => {
      customReadable.push(null); // Signal the end of the custom stream
    })
  
    return customReadable;
}