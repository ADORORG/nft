
interface MarketLayoutProps {
    // children: React.ReactNode,
    filter: React.ReactNode,
    orders: React.ReactNode
}

export default function Layout(props: MarketLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                {/* {props.children} */}
                {props.filter}
                {props.orders}
            </div>
        </div>
    )
}