import CardSkeleton from "./Card"
import BannerSkeleton from "./Banner"

export default function PageWithBanner() {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                <div className="flex flex-col gap-6 p-8">
                    <div className="">
                        <BannerSkeleton />
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap gap-4 my-6 items-center">
                        {
                            Array.from({length: 4})
                            .map((_, index) => (
                                <CardSkeleton
                                    key={index}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}