import Tag from "@/components/Tag"

interface TagListProps extends React.AllHTMLAttributes<HTMLSpanElement> {
    tags?: string
}

export default function TagList(props: TagListProps) {
    const { tags, className } = props

    if (!tags || !tags.length) {
        return null
    }

    return (
            tags.trim().split(" ")
            .map((tag, index) =>
                <Tag 
                    key={tag+index}
                    text={tag} 
                    className={`mx-1 ${className}`}
                />
            )
    )
}