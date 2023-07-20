"use client"
import { useState, useEffect } from "react";

export default function useImageLoader(src: string) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const image = new Image();
        image.src = src;

        image.onload = () => {
            setLoaded(true);
        };
    }, [src]);

    return loaded;
}
