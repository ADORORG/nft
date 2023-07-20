
export default function FeaturedItemButtons() {

    return (
        <div className="flex flex-col md:flex-row justify-start">
            <a
                href="#"
                className="rounded-md bg-slate-800 mr-3"
            >
                <span className="text-white px-3.5 py-2.5 text-sm font-semibold">
                    Place a bid
                </span>
            </a>
            <a
                href="#"
                className="rounded-md bg-slate-600"
            >
                <span className="text-white px-3.5 py-2.5 text-sm font-semibold">
                    View
                </span>
            </a>
        </div>
    )
}