import Button from "@/components/Button"

export default function JoinOurCommunity() {

    return (
        <div className="bg-white dark:bg-gray-950 p-8 lg:p-8">
            <div className="container mx-auto">
                <div className="max-w-xl mx-auto flex flex-col justify-center bg-gray-200 dark:bg-slate-900 dark:bg-opacity-40 gap-8 p-8 lg:p-16 rounded">
                    <h2 className="text-center text-3xl">
                        Join our community
                    </h2>
                    <p className="text-center text-normal">
                        Meet other creators, collectors, and curators. Learn about the latest news and updates.
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            className="text-xl"
                            variant="primary"
                            rounded
                        >
                            Join Discord
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}