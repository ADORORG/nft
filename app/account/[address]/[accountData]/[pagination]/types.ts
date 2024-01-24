

export type AccountDataType = "token" | "collection" | "event" | "contract" | "offer_received" | "offer_sent"

export interface PageProps {
    address: string,
    accountData: AccountDataType,
    pagination: number
}