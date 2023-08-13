import Tag from "@/components/Tag"
import { splitAtWhiteSpaceOrComma } from "@/utils/main"

interface TagListProps extends React.AllHTMLAttributes<HTMLSpanElement> {
    tags?: string
}

export default function TagList(props: TagListProps) {
    const { tags, className } = props

    if (!tags || !tags.length) {
        return null
    }

    return (
            splitAtWhiteSpaceOrComma(tags)
            .map((tag, index) =>
                <Tag 
                    key={tag+index}
                    text={tag} 
                    className={`mx-1 ${className}`}
                />
            )
    )
}