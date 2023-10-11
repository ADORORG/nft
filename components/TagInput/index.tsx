import TagList from "@/components/TagList"
import { InputField } from "@/components/Form"
import { onlyAlphaNumericAndWhiteSpace } from "@/utils/main"

interface TagInputProps {
    setTags: (tags: string) => void
    tags?: string
    maxTags: number,
    labelText?: string
}

export default function TagInput(props: TagInputProps) {

    const cleanTag = (tag: string) => {
        return onlyAlphaNumericAndWhiteSpace(tag.substring(0, 36)).split(" ").slice(0, props.maxTags).join(" ")
    }

    return (

        <div>
            <InputField
                label={props.labelText || `Tags (max ${props.maxTags})`}
                type="text"
                name="tags"
                placeholder="art 3D pin"
                onChange={e => props.setTags(cleanTag(e.target.value))}
                value={cleanTag(props.tags || "")}
                autoComplete="off"
                className="rounded focus:transition-all duration-400"
            />

            <p className="my-3">
                <TagList tags={props.tags} />
            </p>
        </div>
    )
}