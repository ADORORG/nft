"use client"
import { useState, useEffect } from "react"

export default function useVideoLoader(src: string) {
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        const video = document.createElement("video")
        video.src = src

        video.oncanplay = () => {
            setLoaded(true)
        }
       
    }, [src])

    return loaded
}