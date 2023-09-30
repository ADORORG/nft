"use client"

import { useAuthStatus } from "@/hooks/account"
import ConnectWalletButton from "@/components/ConnectWallet/ConnectButton"
import CreateEventForm from "./CreateEventForm"
import type { CreateEventFormProps } from "./types"

export default function CreateEventFormIndex(props: CreateEventFormProps) {
    const { session } = useAuthStatus()

    return (
        <div>
            {
                session?.user?.address ?
                <CreateEventForm {...props} />
                :
                <div className="flex flex-row justify-center items-center">
                    <ConnectWalletButton />
                </div>
            }
        </div>
    )
}