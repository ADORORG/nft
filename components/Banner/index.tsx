
interface BannerProps {
    children?: React.ReactNode,
    className?: string
}

export default function Banner(props: BannerProps) {
    const { className } = props

    return (
        <div className={`w-full flex flex-col md:flex-row gap-4 p-3 md:p-0 align-center rounded min-h-72 bg-gray-700 dark:bg-gray-900 rounded relative text-white dark:text-gray-200 ${className}`}>
            {props.children}
        </div>
    )
}

function Body(props: BannerProps) {
    const { className } = props
    return (
        <div className={`static md:w-3/4 md:pl-[230px] pt-10 z-10 ${className}`}>
            {props.children}
        </div>
    )
}

function Heading(props: BannerProps) {
    const { className } = props

    return (
        <h2 className={`text-4xl py-1 md:leading-3 ${className}`}>
            {props.children}
        </h2>
    )
}

function TextContent(props: BannerProps) {
    const { className } = props

    return (
        <p className={`text-lg py-3 ${className}`}>
            {props.children}
        </p>
    )
}

function BannerBackground(props: BannerProps) {
    const { className } = props

    return (
        <div className={`w-full h-full p-2 z-0 md:absolute ${className}`}>
            {/* Image banner */}
            {props.children}
        </div>
    )
}

function BannerImage(props: BannerProps) {
    const { className } = props

    return (
        <div className={`w-40 h-40 rounded-lg bg-gray-900 bg-opacity-80 drop-shadow-xl border border-gray-700 p-3 md:absolute -bottom-4 left-4 w-[180px] h-[180px] z-10 flex justify-center align-center ${className}`}>
            {props.children}
        </div>
    )
}

function Links(props: BannerProps) {
    const { className } = props

    return (
        <div className={`md:absolute h-full right-5 top-4 z-10 ${className}`}>
            {props.children}
        </div>
    )
}

function Tags(props: BannerProps) {
    const { className } = props

    return (
        <div className={`md:absolute right-5 bottom-4 z-10 ${className}`}>
            {props.children}
        </div>
    )
}

Banner.Bg = BannerBackground
Banner.Image = BannerImage
Banner.Links = Links
Banner.Tags = Tags
Banner.Body = Body
Banner.Heading = Heading
Banner.Text = TextContent