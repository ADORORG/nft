
export default function FeatureItemMarketData() {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-4">
            <div className="lg:px-10 text-gray-400">
                <h3 className="text-sm font-bold py-3 tracking-tight">
                    Current Price
                </h3>
                <h3 className="text-lg font-semibold leading-8">
                    4.20 ETH
                </h3>       
                <span className="text-md font-semibold">
                    $13,000.89
                </span>
            </div>

            <div className="lg:px-10 lg:border-l-2 text-gray-400 border-slate-500">
                <h3 className="text-sm font-bold py-3 tracking-tight">
                    Auction Ends
                </h3>
                <div className="flex text-center font-bold">
                    <span>
                        <span className="text-lg">23</span>
                        <br />
                        <span className="text-sm">hours</span>
                    </span>
                    &nbsp;
                    <span className="text-lg">:</span>
                    &nbsp;
                    <span>
                        <span className="text-lg">24</span>
                        <br />
                        <span className="text-sm">Minutes</span>
                    </span>
                    &nbsp;
                    <span className="text-lg">:</span>
                    &nbsp;
                    <span>
                        <span className="text-lg">53</span>
                        <br />
                        <span className="text-sm">Seconds</span>
                    </span>
                </div>
            </div>
        </div>
    )
}