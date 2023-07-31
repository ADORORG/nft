import { useState, useEffect } from "react"
import Button from "@/components/Button"
import { collectionCategories } from "@/lib/app.config"

interface CategoryButtonsProps {
    onSelected: (category: string) => void
    exclude?: Array<string>
    include?: Array<string>
}

export default function CategoryButtons({ onSelected, exclude = [], include = [] }: CategoryButtonsProps) {
    const exludeCategoryButtons = collectionCategories.filter((category) => !exclude.includes(category.slug))
    const includeCategoryButtons = exludeCategoryButtons.filter((category) => include.includes(category.slug))
    const [activeSlug, setActiveSlug] = useState<string>(includeCategoryButtons[0].slug)

    useEffect(() => {
        onSelected(activeSlug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-wrap justify-center gap-4">
            {includeCategoryButtons.map(({ name, slug }, index) => (
                <Button
                    key={slug+index}
                    className={`px-4 py-2 lg:text-2xl transition ${slug === activeSlug ? "opacity-100" : "opacity-60"}`}
                    variant="primary"
                    onClick={() => {
                        onSelected(slug)
                        setActiveSlug(slug)
                    }}
                    rounded
                >
                    {name}
                </Button>
            ))}
        </div>
    )
}