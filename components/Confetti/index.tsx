import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"

export default function ConfettiAnimation() {
    const { width, height } = useWindowSize()
    return (
        <div className="fixed -z-10 top-0 left-0 w-screen h-screen">
            <Confetti
                width={width}
                height={height}
                run={true}

            />
        </div>
    )
}