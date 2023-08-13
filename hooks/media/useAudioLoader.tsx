"use client"
import { useState, useEffect } from "react"

export default function useAudioLoader(src: string) {
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        const audio = new Audio(src)
        
        audio.oncanplay = () => {
            setLoaded(true)
        } 
    
    }, [src])

    return loaded;
}