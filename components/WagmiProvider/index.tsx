"use client"
import { WagmiConfig } from "wagmi"
import myWagmiConfig from "@/web3.config"

export default function WagmiProvider({children}: {children: React.ReactNode}) {

    return (
        <WagmiConfig config={myWagmiConfig}>
            {children}
        </WagmiConfig>
    )
}