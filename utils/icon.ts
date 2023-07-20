import identicon from "identicon.js";

export default function imageData(data: string, size: number = 10) {
	const options = {
		size,
		format: "svg"
	} as const
	const iconData = new identicon(data, options).toString();
	return `data:image/svg+xml;base64,${iconData}`;
}