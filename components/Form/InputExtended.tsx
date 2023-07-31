import Input from "./Input"
import type { InputProps } from './types'

type InputExtendedProps = InputProps & {
    Icon: React.ReactElement
}
export default function InputExtended(props: InputExtendedProps) {
    const { Icon, ...inputProps } = props
    return (
        <div className="lg:flex-auto relative lg:ml-10 mt-4 md:mt-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {Icon}
            </span>
            <Input 
                {...inputProps}
            />
        </div>
    )
}
