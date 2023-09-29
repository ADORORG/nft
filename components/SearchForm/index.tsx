import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search as SearchIcon } from "react-bootstrap-icons"
import appRoutes from "@/config/app.route"

export default function SearchForm() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchQuery.length) {
            router.push(`${appRoutes.search}?q=${searchQuery}`)
        }
    }

    return (
        <div className="lg:flex-auto relative lg:ml-10 mt-4 md:mt-0">
            <form onSubmit={handleSubmit}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </span>
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text" 
                    className="w-full md:w-5/6 lg:2/3 py-2 pl-10 pr-4 text-gray-800 bg-white border rounded dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-none dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" 
                    placeholder="Search items, collections, accounts" 
                    autoComplete="off"
                />
            </form>
        </div>
    )
}