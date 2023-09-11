
interface CollectionItemsLayoutProps {
    // children: React.ReactNode,
    banner: React.ReactNode,
    tokens: React.ReactNode
}

export default function Layout(props: CollectionItemsLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                {/* {props.children} */}
                {props.banner}
                {props.tokens}
            </div>
        </div>
    )
}