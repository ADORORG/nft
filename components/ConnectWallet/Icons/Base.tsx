import { SVGProps } from "react"

export default function BaseIcon(props: SVGProps<SVGSVGElement>) {

    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 2500 2500"
          xmlSpace="preserve"
          {...props}
        >
          <path d="M1247.8 2500c691.6 0 1252.2-559.6 1252.2-1250S1939.4 0 1247.8 0C591.7 0 53.5 503.8 0 1144.9h1655.1v210.2H0C53.5 1996.2 591.7 2500 1247.8 2500z" />
        </svg>
    )
}