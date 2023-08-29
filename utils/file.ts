

/**
 * Read file data as dataURL
 * @param file - file blob
 * @param fileResultHandler a function that received the read result
 */
export function readSingleFileAsDataURL (file: Blob, fileResultHandler: (update: ArrayBuffer | string | null) => void ) {
        
    if (file && window.Worker) {
        const fileWorker = new Worker("/file.worker.js")
        
        fileWorker.postMessage(file)
        fileWorker.onmessage = (e) => {
            fileResultHandler(e.data)
            fileWorker.terminate()
        }
    } else if (file) {
        const reader = new FileReader()
        reader.addEventListener("load", function() {
            fileResultHandler(reader.result)
        }, false)

        reader.readAsDataURL(file)
    } else {
        throw new Error("Invalid file")
    }
    
}


/**
 * Validate a file type and size
 * @param file File blob
 * @param options an optional config for allowed extension and media size
 * @returns `true` or throws if media type/size does not comply with options
 */
export function validateFile (file: Blob, {ext = [], size}: {ext?: string[], size?: number}) {
    const fileExt = file?.name?.split(".").pop()?.toLowerCase()
    const fileSize = file?.size

    if (ext.length && (!fileExt || !ext.includes(fileExt))) {
        throw new Error("Invalid file extension. Expected one of " + ext.join(" "))
    }

    if (size && size < fileSize) {
        throw new Error("File size should not be more than " + size)
    }

    return true
}