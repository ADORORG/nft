
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode
    text?: React.ReactNode
}

export default function Tag(props: TagProps) {
    const { children, text, className } = props

    if (children) {
        return (
            <span className={`bg-tertiary-900 px-3 rounded text-white ${className}`}>{children}</span>
        )
    }
    
    return (
        <span className={`bg-tertiary-900 px-3 rounded text-white ${className}`}>{text}</span>
    )
}