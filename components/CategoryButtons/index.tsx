import { useState, useEffect } from "react"
import Button from "@/components/Button"
import { collectionCategories } from "@/lib/app.config"

interface CategoryButtonsProps {
    onSelected: (category: string) => void
    exclude?: Array<string>
}

export default function CategoryButtons({ onSelected, exclude = [] }: CategoryButtonsProps) {
    const categoryButtons = collectionCategories.filter((category) => !exclude.includes(category.slug))
    const [activeSlug, setActiveSlug] = useState<string>(categoryButtons[0].slug)

    useEffect(() => {
        onSelected(activeSlug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-wrap justify-center gap-4">
            {categoryButtons.map(({ name, slug }, index) => (
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