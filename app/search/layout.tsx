
interface SearchLayoutProps {
    children: React.ReactNode,
}

export default function Layout(props: SearchLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container min-h-[500px] mx-auto py-6 px-8 lg:px-0">
                {props.children}
            </div>
        </div>
    )
}