

export type AccountDataType = "token" | "collection" | "marketplace"

export interface PageProps {
    address: string,
    accountData: AccountDataType,
    pagination: number
}