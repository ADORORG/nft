import identicon from "identicon.js";

/**
 * Extract prefix and suffix of an ethereum address joined by an ellipsis
 * @param addr - Ethereum address
 * @param prefix - prefix length
 * @param suffix - suffix length
 * @returns the shortened address
 */
export function cutAddress(addr: string, prefix = 5, suffix = 4): string {
    const start = addr.substring(0, prefix);
    const end = addr.substring(addr.length - suffix);
    return `${start}...${end}`;
}

export function imageData(data: string, size: number = 10) {
	const options = {
		size,
		format: "svg"
	} as const
	const iconData = new identicon(data, options).toString();
	return `data:image/svg+xml;base64,${iconData}`;
}
