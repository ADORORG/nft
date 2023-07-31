
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>  {
    rounded?: boolean,
    label?: React.ReactNode,
    fileExtensionText?: React.ReactNode,
}

export interface InputExtendedProps extends InputProps  {
    labelClassName?: string

}

