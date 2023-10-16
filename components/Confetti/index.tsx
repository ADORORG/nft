import { useState, useEffect } from "react"
import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"

export default function ConfettiAnimation(props: {seconds?: number}) {
    const { width, height } = useWindowSize()
    const [run, setRun] = useState(true)

    useEffect(() => {
        if (run) {
            setTimeout(() => {
                setRun(false)
            }, (props.seconds || 5) * 1000)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!run) {
        return null
    }

    return (
        <div className="fixed z-0 top-0 left-0 w-screen h-screen">
            <Confetti
                width={width}
                height={height}
                run={true}
            />
        </div>
    )
}