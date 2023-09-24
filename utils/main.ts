export * from "@/lib/utils/main";

/**
 * Copy text to clipboard
 * @param textToCopy - Text to copy
 * @param done - A callback function when successfully copied
 * @returns 
 */
export function copyToClipboard(textToCopy: string, done?: () => void) {
    return navigator.clipboard.writeText(textToCopy).then(
        () => {
          /* clipboard successfully set */
          done?.()
        },
        () => {
          /* clipboard write failed */
            Promise.reject()
        },
    )
      
  }