"use client"
import type { DraftDataType } from "./types"
import { useState } from "react"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import { useAuthStatus } from "@/hooks/account"
import { Select } from "@/components/Select"
import TokenDraftPage from "./Token"
import ContractDraftPage from "./Contract"
import EventDraftPage from "./Event"

export default function DraftPage() {
    const [draftType, setDraftType] = useState<DraftDataType>("token")
    const { session } = useAuthStatus()

    return (
        <div>
            <div className="max-w-sm">
                <label htmlFor="draftType" className="my-3 opacity-70">Draft type</label>
                <Select
                    id="draftType"
                    value={draftType}
                    onChange={e => setDraftType(e.target.value as DraftDataType)}
                    className="rounded"
                >
                    <Select.Option value="token">Token</Select.Option>
                    <Select.Option value="event">Event</Select.Option>
                    <Select.Option value="contract">Contract</Select.Option>
                </Select>
            </div>
            {
                session?.user ?
                <div className="py-6">
                    {draftType === "token" && <TokenDraftPage address={session?.user.address} />}
                    {draftType === "event" && <EventDraftPage address={session?.user.address} />}
                    {draftType === "contract" && <ContractDraftPage address={session?.user.address} />}
                </div>
                :
                <div className="py-6">
                    <p className="py-2">Please connect your wallet to view draft.</p>
                    <ConnectWalletButton />
                </div>
            }
            
        </div>
    )
}