import { ArrowLeftShort, ArrowRightShort } from "react-bootstrap-icons"
import Button from "@/components/Button"

interface NavigationButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    text?: string,
    direction: "left" | "right",
    disabled?: boolean,
    variant?: "primary" | "secondary" | "tertiary" | "gradient",
    loading?: boolean,
}

export default function NavigationButton(props: NavigationButtonProps) {
    const { text, direction, variant, className, disabled, ...rest } = props
    const textContent = text ? text : direction === "left" ? "Previous" : "Next"

    return (
        <Button
            className={`rounded flex items-center px-3 gap-1 hover:gap-2 transition-all ${className}`}
            variant={variant}
            disabled={disabled}
            rounded
            {...rest}
        >
            {
                direction === "left" ?
                <>
                    <ArrowLeftShort className="h-5 w-5" />
                    <span>
                        {textContent}
                    </span>
                </>
                :
                <>
                    <span>
                        {textContent}
                    </span>
                    <ArrowRightShort className="h-5 w-5" />
                </>
            }
            
        </Button>
    )
}