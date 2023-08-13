import { InfoCircle } from "react-bootstrap-icons"

interface InfoTextProps {
    className?: string,
    containerClassName?: string,
    text: string
}

export default function InfoText(props: InfoTextProps) {
    const { containerClassName, className, text } = props
    
    return (
        <span className={`flex items-center mx-1 ${containerClassName}`}>
            <InfoCircle className={className} />&nbsp;
            {text}
        </span>
    )
}