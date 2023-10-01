

export type AccountDataType = "token" | "collection" | "event" | "contract" | "marketplace"

export interface PageProps {
    address: string,
    accountData: AccountDataType,
    pagination: number
}