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


function getChainIcon(chainId: number) {
    return chainIcons[chainId]
}

export {
    chainIcons,
    getChainIcon
}
