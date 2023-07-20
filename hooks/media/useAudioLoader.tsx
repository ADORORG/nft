"use client"
import { useState, useEffect } from "react";

export default function useAudioLoader(src: string) {
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        const audio = new Audio(src);
        
        const handleCanPlay = () => {
            setLoaded(true);
        };

        audio.addEventListener("canplay", handleCanPlay);

        return () => {
            audio.removeEventListener("canplay", handleCanPlay);
        };
    }, [src]);

    return loaded;
}