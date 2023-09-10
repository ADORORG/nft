"use client"
import { useEffect } from "react"
import { SelectWithIcon } from "@/components/Select"
import { supportedChains } from "@/web3.config"
import { useAtom } from "jotai"
import { selectedChainId } from "./store"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { chainIcons } from "./ChainIcons"

interface NetworkChainSelectProps {
    switchOnChange?: boolean,
    onChange?: (chainId: number | string) => void,
    className?: string,
}

export default function NetworkChainSelect(props: NetworkChainSelectProps) {
    const [chainId, setChainId] = useAtom(selectedChainId)
    const { chain: currentChain } = useNetwork()
    const { switchNetworkAsync } = useSwitchNetwork()

    useEffect(() => {
        if (currentChain?.id && !currentChain?.unsupported) {
            setChainId(currentChain.id)
        }
    }, [currentChain, setChainId])

    const selectOptions = supportedChains.map(({id: value, name: label}) => {
        const Icon = chainIcons[value]
        return {
            value, 
            label, 
            icon: <Icon className="h-5 mr-2" />
        }
    })

    const handleChainChange = async (newChainId: number | string) => {
        if (props.switchOnChange) {
            await switchNetworkAsync?.(newChainId as number)
        }
        if (props.onChange) {
            props.onChange(newChainId)
        }
        setChainId(newChainId)
    }

    return (
        <SelectWithIcon
            options={selectOptions}
            defaultValue={chainId}
            onChange={handleChainChange}
            buttonClassName={`w-44 ${props.className}`}
        />
    )
}