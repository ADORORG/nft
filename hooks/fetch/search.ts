import type AccountType from "@/lib/types/account"
import type { PopulatedCollectionType} from "@/lib/types/collection"
import type { PopulatedContractType } from "@/lib/types/contract"
import type { PopulatedNftContractEventType } from "@/lib/types/event"
import type { AppRouterApiResponseType } from "@/lib/types/common"
import { isEthereumAddress } from "@/utils/main"
import { fetcher } from "@/utils/network"
import useSWR from "swr"
import apiRoutes from "@/config/api.route"

export function useCollectionSearch(searchQuery?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<PopulatedCollectionType[]>>(
        searchQuery ? 
        `${apiRoutes.searchCollection}?q=${searchQuery}`
        : null
    )

    return {
        collections: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useContractSearch(searchQuery?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<PopulatedContractType[]>>(
        searchQuery ? 
        `${apiRoutes.searchContract}?q=${searchQuery}`
        : null
    )

    return {
        contracts: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useEventSearch(searchQuery?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<PopulatedNftContractEventType[]>>(
        searchQuery ? 
        `${apiRoutes.searchEvent}?q=${searchQuery}`
        : null
    )

    return {
        events: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useAccountSearch(searchQuery?: string) {
    const url = isEthereumAddress(searchQuery) ? `${apiRoutes.searchAccount}?q=${searchQuery}` : null
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<AccountType[]>>(
        url,
        {refreshInterval: 5000}
    )

    return {
        accounts: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}
