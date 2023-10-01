

export type AccountDataType = "token" | "collection" | "event" | "marketplace"

export interface PageProps {
    address: string,
    accountData: AccountDataType,
    pagination: number
}