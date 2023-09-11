"use client"
import { useRouter } from "next/navigation"
import NavigationButton from "@/components/NavigationButton"

interface PaginationProps {
    totalDocument: number,
    limitPerPage: number,
    currentPage: number,
    linkPrefix: string
}

export default function Pagination(props: PaginationProps) {
    const {totalDocument, limitPerPage, currentPage, linkPrefix} = props
    const router = useRouter()
    
    const lastPage = totalDocument ? Math.ceil(totalDocument / limitPerPage) : 1
    const nextPage = lastPage > currentPage ? currentPage + 1 : 0
    const previousPage = currentPage > 1 ? currentPage - 1 : 0

    return (
        <div className="flex flex-row gap-4 my-6 mx-4">
            <NavigationButton 
                direction="left"
                text="Previous Page"
                disabled={!previousPage}
                onClick={() => router.push(`${linkPrefix}/${previousPage}`)}
            />
            <NavigationButton 
                direction="right"
                text="Next Page"
                disabled={!nextPage}
                onClick={() => router.push(`${linkPrefix}/${nextPage}`)}
            />
        </div>
    )
}