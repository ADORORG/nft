import type TokenPageProps from "./types"
import TagList from "../TagList"
import { Eyeglasses } from "react-bootstrap-icons"

export default function TokenTextContent(props: TokenPageProps) {

    return (
        <div className="flex flex-col gap-4 mb-4">
            <h1 className="leading-3 tracking-tight text-xl pt-4">
                {props.token.name} #{props.token.tokenId}
            </h1>
            <div title={`Token viewed by ${props.token.views}`} className="flex gap-1 items-center">
                <Eyeglasses />
                <span>{props.token.views}</span>
            </div>
            <p className="py-2">
                {props.token.description}
            </p>
            <div className="flex flex-row flex-wrap">
                <TagList tags={props.token.tags} />
            </div>
        </div>
    )
}