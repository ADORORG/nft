import Image from "next/image"

export default function ItemCategory() {

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="container py-10 mx-auto">
                <h1 className="py-8 text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
                    Explore NFTs by Category
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-10">
                {
                    Array.from(Array(8).keys()).map((_, i) => (
                        <div key={i} className="max-w-[15rem] my-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <Image 
                                    className="w-full" 
                                    src="/astranault-avatar.png" 
                                    alt="" 
                                    width={150}
                                    height={150}
                                />
                            </a>
                            <div className="p-5">
                                <a href="#">
                                    <h5 className="mt-2 text-center text-lg font-semibold leading-10 tracking-tight text-gray-600 dark:text-gray-300">Music</h5>
                                </a>
                            </div>
                        </div>
                    ))
                }
                </div>
                <div className="max-w-[15rem] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <Image 
                            className="w-full" 
                            src="/astranault-avatar.png" 
                            alt=""
                            width={150}
                            height={150} 
                        />
                    </a>
                    <div className="p-5">
                        <a href="#">
                            <h5 className="mt-2 text-center text-lg font-semibold leading-10 tracking-tight text-gray-600 dark:text-gray-300">Music</h5>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}