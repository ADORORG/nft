import type CollectionType from "@/lib/types/collection"
import type { AppRouterApiResponseType } from "@/lib/types/common"
import useSWR from "swr"
import apiRoutes from "@/config/api.route"

export function useAccountCollection(address?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<CollectionType[]>>(address ? apiRoutes.getCollectionByAddress.replace(":address", address): null)

    return {
        accountCollections: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useCollectionBySlug(slug?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<CollectionType>>(slug ? apiRoutes.getCollectionBySlug.replace(":slug", slug): null)

    return {
        collection: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}