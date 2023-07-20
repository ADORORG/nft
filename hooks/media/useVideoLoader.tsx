"use client"
import { useState, useEffect } from "react";

export default function useVideoLoader(src: string) {
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        const video = document.createElement('video');
        video.src = src;

        const handleCanPlay = () => {
            setLoaded(true);
        };

        video.addEventListener("canplay", handleCanPlay);

        return () => {
            video.removeEventListener("canplay", handleCanPlay);
        };
    }, [src]);

    return loaded;
}