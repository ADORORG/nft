import { useEffect } from "react"
import Button from "@/components/Button"

export interface ErrorPageProp {
    error: Error,
    reset: () => void
}


export default function ErrorPage(props: ErrorPageProp) {
    const { error, reset } = props

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center">
            <h1 className="text-lg pb-6 text-gray-900 dark:text-white">Something went wrong!</h1>
            {/* <p className="text-xl text-gray-600">Oops! Page not found.</p> */}

            <Button
                className="px-4 py-2"
                variant="secondary"
                onClick={reset}
                rounded
            >
                Try again
            </Button>
        </div>
    )
}