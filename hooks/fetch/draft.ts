import type { PopulatedNftTokenType } from "@/lib/types/token"
import type { PopulatedContractType } from "@/lib/types/contract"
import type { PopulatedNftContractEventType } from "@/lib/types/event"
import type { AppRouterApiResponseType } from "@/lib/types/common"
import useSWR from "swr"
import apiRoutes from "@/config/api.route"

export function useAccountDraftContract(address?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<PopulatedContractType[]>>(
        address ? apiRoutes.getDraftContract : null
    )

    return {
        draftContracts: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useAccountDraftToken(address?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<PopulatedNftTokenType[]>>(
        address ? apiRoutes.getDraftToken : null
    )

    return {
        draftTokens: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useAccountDraftEvent(address?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<PopulatedNftContractEventType[]>>(
        address ? apiRoutes.getDraftEvent : null
    )

    return {
        draftEvents: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}