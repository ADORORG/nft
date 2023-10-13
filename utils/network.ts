import type { AppRouterApiResponseType } from "@/lib/types/common"

export async function fetcher<R=AppRouterApiResponseType>(url: URL | string, options?: RequestInit): Promise<R> {
    const response = await fetch(url, options)
    const data: R = await response.json()

    if (!response.ok) {
        const error: Error & {body?: R}  = new Error(`${response.status}:${response.statusText}`)
        error.body = data
        throw error
    }

    return data
}

/**
 * Get error message from Error object.
 * Initially used to get error message from fetch api request error.
 * Hence, the name getFetcherErrorMessage
 * @param error 
 * @returns 
 */
export function getFetcherErrorMessage(error: any): string {
    const message = error.body && error.body.message ? error.body.message : error.message
    // Some error message from web3 client are ugly, however, they are separated by new line.
    // We split the message and attempt to return the first & second line
    const splitMessage = message.split('\n')

    if (splitMessage.length > 1) {
        return `${splitMessage[0]} ${splitMessage[1]}`
    }
    return message
}


/**
 * Read the progress of a fetch response
 * @param response 
 * @param setProgress 
 */
export function readFetchResponseProgress(response: Promise<Response>, setProgress: (value: number) => void) {
    response.then(res => {
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const contentLength = res.headers.get("Content-Length")

        if (contentLength === null) {
            return
        }

        const expectedContentLength = parseInt(contentLength, 10)
        let loadedContentLength = 0

        const reader = res.body?.getReader()

        function readChunkLength() {
            reader?.read().then(({value, done}) => {
                if (done) {
                    return
                }

                loadedContentLength += value.length
                const percentage = Math.round(loadedContentLength / expectedContentLength) * 100

                setProgress(percentage)

                readChunkLength()
            })
        }

        readChunkLength()

    }).catch(console.error)
}