
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode,
    text?: React.ReactNode,
    variant?: "primary" | "secondary" | "tertiary"
}

export default function Tag(props: TagProps) {
    const { children, text, className, variant = "primary" } = props

    if (children) {
        return (
            <span className={`bg-${variant}-900 px-3 rounded text-white ${className}`}>{children}</span>
        )
    }
    
    return (
        <span className={`bg-${variant}-900 px-3 rounded text-white ${className}`}>{text}</span>
    )
}