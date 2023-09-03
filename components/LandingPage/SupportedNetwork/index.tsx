import Image from "next/image"

export default function SupportedBlockchainNetwork() {
    const networks = [
        "/network/ethereum.png",
        "/network/base.png",
        "/network/polygon.png",
        "/network/optimism.png",
    ]
    return (
        <div className="bg-white dark:bg-gray-950 pt-10">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row justify-center items-center gap-16">
                    {
                        networks.map((network, index) => (
                            <div key={network + index}>
                                <Image  
                                    className="w-[250px] h-[60px] opacity-40 px-4"
                                    src={network}
                                    alt=""
                                    width={180}
                                    height={60}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
