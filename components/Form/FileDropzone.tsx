import { useState } from "react";

interface FileDropzoneProps {
    mediaHandler: (files: FileList | null) => void,
    className?: string,
    children?: React.ReactNode
}

export default function FileDropzone(props: FileDropzoneProps) {
    const [dragging, setDragging] = useState(false)

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(false)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(false)

        props.mediaHandler(e.dataTransfer.files)
    }

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`${dragging ? 'z-10 bg-gray-300 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-900'} ${props.className}`}
        >
            {props.children}
        </div>
    )
}