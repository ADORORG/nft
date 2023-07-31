import { SVGProps } from "react"

export default function BinanceIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" {...props}>
            <g id="Icon">
            <circle
                cx={512}
                cy={512}
                r={512}
                style={{
                    fill: "#f3ba2f",
                }}
            />
            <path
                d="M404.9 468 512 360.9l107.1 107.2 62.3-62.3L512 236.3 342.6 405.7zM236.314 511.95l62.295-62.297 62.297 62.295-62.295 62.297zM404.9 556 512 663.1l107.1-107.2 62.4 62.3h-.1L512 787.7 342.6 618.3l-.1-.1zM663.07 512.056l62.296-62.297 62.297 62.295-62.295 62.297z"
                className="st1"
            />
            <path
                d="M575.2 512 512 448.7l-46.7 46.8-5.4 5.3-11.1 11.1-.1.1.1.1 63.2 63.2 63.2-63.3z"
                className="st1"
            />
            </g>
        </svg>
    )
}