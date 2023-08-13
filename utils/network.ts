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

export function getFetcherErrorMessage(error: any): string {
    const message = error.body && error.body.message ? error.body.message : error.message
    return message
}