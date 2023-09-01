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
    BaseIcon
} from "./Icons"

const chainIcons: Record<number, React.FC<React.SVGAttributes<SVGElement>>> = {
    1: EthereumIcon,
    5: EthereumIcon,
    10: OptimismIcon,
    56: BinanceIcon,
    137: PolygonIcon,
    250: FantomIcon,
    8453: BaseIcon,
    84531: BaseIcon,
    43114: AvalancheIcon,
    42161: ArbitrumIcon,
    1666600000: HarmonyIcon,
}

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

    const handleChainChange = async (chainId: number | string) => {
        setChainId(chainId)
        if (props.switchOnChange) {
            await switchNetworkAsync?.(chainId as number)
        }
        if (props.onChange) {
            props.onChange(chainId)
        }
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