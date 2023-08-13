import Image from "next/image"
import FeaturedItemMarketData from "./MarketData"
import FeaturedItemButtons from "./Button"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
export default function FeaturedItemContent() {
    return (
        <div className="w-full p-6 bg-gray-800 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly">
            <Image 
                className="h-24 w-24 md:mx-6 rounded-full object-cover shadow-md md:h-[32rem] md:w-80 lg:h-[36rem] lg:w-[26rem] md:rounded-2xl" 
                src="/astranault.png" 
                alt="client photo"
                width={250}
                height={250} 
            />
            
            <div className="mt-2 md:mx-6">
                <div>
                    <p className="text-lg font-medium tracking-tight text-white py-2">
                        <Image 
                            className="w-10 h-10 rounded-full inline-block object-cover" 
                            src="/astranault-avatar.png" 
                            alt="Rounded avatar" 
                            width={10}
                            height={10}
                        />
                        &nbsp;
                        @Ema Watson
                    </p>
                    <p className="text-blue-400 ">@Collectibles</p>
                </div>

                <p className="mt-4 text-lg leading-relaxed text-white md:text-xl"> “Lorem ipsum dolor sit amet, consectetur adipisicing elit.”.</p>
                
                <FeaturedItemMarketData />

                <div className="flex items-center justify-between mt-6 md:justify-start">
                    <button title="left arrow" className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 hover:bg-blue-400">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>

                    <button title="right arrow" className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 md:mx-6 hover:bg-blue-400">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}