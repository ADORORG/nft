import { useEffect } from "react"
import { SelectWithIcon } from "@/components/Select"
import { supportedChains } from "@/web3.config"
import { useAtom } from "jotai"
import { selectedChainId } from "./store"
import { useNetwork, useSwitchNetwork } from "wagmi"

// import chain icons
import {
    BinanceIcon,
    EthereumIcon,
    PolygonIcon,
    FantomIcon,
    AvalancheIcon,
    ArbitrumIcon,
    HarmonyIcon,
    OptimismIcon,
} from "./Icons"

const chainIcons = {
    1: EthereumIcon,
    5: EthereumIcon,
    10: OptimismIcon,
    56: BinanceIcon,
    137: PolygonIcon,
    250: FantomIcon,
    43114: AvalancheIcon,
    42161: ArbitrumIcon,
    1666600000: HarmonyIcon
}

export default function NetworkChainSelect() {
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

    const handleChainChange = async (chainId: number | string) => {
        await switchNetworkAsync?.(chainId as number)
        setChainId(chainId)
    }

    return (
        <SelectWithIcon
            options={selectOptions}
            defaultValue={chainId}
            onChange={handleChainChange}
            buttonClassName="w-44"
        />
    )
}