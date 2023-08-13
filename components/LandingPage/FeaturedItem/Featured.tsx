import FeatureContent from "./FeaturedContent";

export default function FeaturedItem() {

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="max-w-6xl px-6 py-10 mx-auto">
                <main className="relative z-20 w-full mt-8 lg:flex lg:items-center xl:mt-12">
                    <div className="absolute w-full bg-gray-800 -z-10 lg:h-96 rounded-2xl"></div>
                    <FeatureContent />
                </main>
            </div>
        </div>
    )
}