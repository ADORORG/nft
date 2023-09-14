"use client"
import { useEffect, useContext } from "react"
import { SelectWithIcon } from "@/components/Select"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { chainIcons } from "./ChainIcons"
import { ConnectWalletManagerContext } from "./ContextWrapper"
import type { NetworkChainSelectProps } from "./types"

export default function NetworkChainSelect(props: NetworkChainSelectProps) {
    const config = useContext(ConnectWalletManagerContext)
    const { 
            switchOnChange = config?.networkChainSelect?.switchOnChange, 
            onChange = config?.networkChainSelect?.onChange, 
            className = config?.networkChainSelect?.className
        } = props
    const { chain: currentChain } = useNetwork()
    const { switchNetworkAsync } = useSwitchNetwork()
   
    useEffect(() => {
        if (currentChain?.id && !currentChain?.unsupported) {
            config?.setChainId?.(currentChain.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChain?.id])

    const selectOptions = config?.supportedChains?.map(({id: value, name: label}) => {
        const Icon = chainIcons[value]
        return {
            value, 
            label, 
            icon: <Icon className="h-5 mr-2" />
        }
    })

    const handleChainChange = async (_newChainId: string) => {
        const newChainId = Number(_newChainId)
        if (switchOnChange) {
            await switchNetworkAsync?.(newChainId)
        }
        if (onChange) {
            onChange(newChainId)
        }
        config?.setChainId?.(newChainId)
    }

    return (
        <SelectWithIcon
            options={selectOptions ?? []}
            defaultValue={config?.chainId as number}
            onChange={handleChainChange}
            buttonClassName={`w-44 ${className}`}
        />
    )
}