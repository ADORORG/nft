
/**
 * Convert a date to HTML input value of type date
 * @param date 
 * @returns 
 */
export function dateToHtmlInput(date = new Date()){
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * @description Get difference in days between two dates
 * @see https://stackoverflow.com/a/15289883/3186314
 * @param a Date
 * @param b Date
 * @returns 
 * 
 */
export function dateDifferenceInDays(a: Date, b: Date) {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

/**
 * Get the relative days and hours to a date 
 * @param _date 
 * @returns 
 */
export function dateToRelativeDayAndHour(_date: Date = new Date()) {
	const date = new Date(_date);
	const now = new Date();
	const daysDiff  = dateDifferenceInDays(now, date);
	// const hours = daysDiff > 0 ? date.getHours() : date.getHours() - now.getHours();
	const hours = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
	const rtf = new Intl.RelativeTimeFormat("en", { style: "long", numeric: "auto" });
	return {
		days: isFinite(daysDiff) ? rtf.format(daysDiff, "day") : "",
		hours: `at ${hours}`,
		future: date > now,
	}
}