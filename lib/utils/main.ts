/**
 * Get a settled promise value from Promise.allSettled
 * @param settledPromised - A promise result from Promise.allSettled
 * @param altValue - value to return if promise is not fulfilled
 * @returns a settled promise value or alternative value supplied
 */
export function getSettledPromiseValue(settledPromised: any, altValue: any = []) {
	return (
		settledPromised?.status === 'fulfilled' 
		? 
		settledPromised.value
		: 
		altValue
	)
}

/**
 * Check that 
 * @param obj 
 * @param prop 
 * @returns 
 */
export function typeGuarded<T>(obj: any, prop: string): obj is T {
	return typeof obj === 'object' && obj.hasOwnProperty(prop);
}

/** 
* Check for a valid format of an ethereum address. It does not check for checksum address
* @param address - '0x' prefixed Ethereum Address to validate
* @returns
*/
export function isEthereumAddress(address: string): boolean {
    return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
}

/**
 * Check for a valid format of an ethereum transaction hash.
 * 
 * @param hash - '0x' prefixed Transaction hash
 * @returns 
 */
export function isEthereumTransactionHash(hash: string): boolean {
	// Ethereum transaction hash is a 64-character hexadecimal string
	return (/^(0x){1}[0-9a-fA-F]{64}$/i.test(hash));
}

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

/**
 * Cut a string and attach an ellipsis
 * @param str 
 * @param length 
 * @returns 
 */
export function cutString(str: string | undefined, length: number) {
	if (!str || typeof str !== 'string') return '';
	if (str.length <= length) return str;
	return str.substring(0, length) + '...';
}

/**
 * Check if an ethereum address is zero.
 * @example Zero address is 0x0000000000000000000000000000000000000000
 * @param addr - Ethereum address
 * @returns 
 */
export function isAddressZero(addr: string): boolean {
    return parseInt(addr) === 0;
}

/**
 * Validate an email address format
 * @param email 
 * @returns
 */
export function isValidEmail(email?: string): boolean {
	if (!email) return false;
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
}

/**
 * Check if a string is a http/https protocal
 * @param str 
 * @returns
 */
export function isHttpUrl(str: string): boolean {
	try {
		const url = new URL(str);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch (err) {
		return false;
	}
}

/**
 * Check if an object is empty
 * @param obj - Object to check
 * @returns 
 */
export function isEmptyObject(obj: {[key: string]: any}) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Increment a number by a certain percentage.
 * @param number 
 * @param percent 
 * @returns 
 * @example incrementNumberByPercent(100, 10) returns 110
 * incrementNumberByPercent(95, 30) returns 124
 */
export function incrementNumberByPercent(number: number, percent: number): number {
	return Math.ceil(number + (number * percent / 100));
}

/**
 * Serialize data
 * @param data - An Array or Object
 * @returns 
 */
export function serializeData(data: any[] | {[key: string]: any}): any[] | {[key: string]: any} {
	// Check if the data is an array
	if (Array.isArray(data)) {
	  // Serialize each item in the array
	  return data.map((item) => serializeData(item));
	}
  
	// Check if the data is an object
	if (typeof data === 'object' && data !== null) {
	  const serializedData: {[key: string]: any} = {};
  
	  // Iterate over each key-value pair
	  for (const key in data) {
		// Check if the key is "_id"
		if (key === '_id') {
		  // Serialize "_id" to "id"
		  serializedData.id = data[key].toString();
		} else if (data[key] instanceof Date) {
		  // Serialize Date objects to ISO strings
		  serializedData[key] = data[key].toISOString();
		} else {
		  // Serialize other fields recursively
		  serializedData[key] = serializeData(data[key]);
		}
	  }
  
	  return serializedData;
	}
  
	// Return the data as is for other types
	return data;
}

export function onlyAlphaNumeric(str: string) {
	return str.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Format a number to
 * @param value The number to format
 * @param options Intl.NumberFormat options
 * @returns 
 */
export function formatNumber(value: number | bigint | string, options: Record<string, any>  = {}): string {
	if (typeof value === 'string') value = Number(value)
	
	const {
		locale = 'en-US',
		style = 'currency',
		currency = 'USD',
		currencyDisplay = 'symbol',
		maximumFractionDigits = 2,
	} = options

	return new Intl.NumberFormat(locale, {
		style, 
		currency, 
		currencyDisplay,
		maximumFractionDigits,
	}).format(value)
}

/**
 * Split a string at comma or whitespace. 
 * @param str - A string to split
 * @returns an Array of string
 */
export function splitAtWhiteSpaceOrComma(str: string): Array<string> {
	if (!str || typeof str !== 'string') return [];
	return str.trim().split(/[,\s]+/).filter(Boolean); // split at comma or space
}

/**
 * Clone an object
 * @param obj Array or Object to clone
 * @returns 
 */
export function deepClone(obj: any): any {
	if (Array.isArray(obj)) {
		var arr = []
		for (var i = 0; i < obj.length; i++) {
			arr[i] = deepClone(obj[i]);
		}

		return arr;
	}

	if (typeof(obj) === 'object'){
		var cloned: any = {};
		for(let key in obj){
			cloned[key] = deepClone(obj[key])
		}
		return cloned;	
	}
	return obj;
}

/**
 * Replace params in url template
 * @param urlTemplate 
 * @param params 
 * @returns 
 * @example
 * replaceUrlParams("/url/location/:a/:b/c", {a: "1", b: "2"}) returns "/url/location/1/2/c"
 */
export function replaceUrlParams(urlTemplate: string, params: Record<string, string>) {
	// Iterate over the keys in the params object
	for (const key in params) {
	  // Create a regular expression to match the placeholder
	  const regex = new RegExp(`:${key}`, "g");
	  // Replace the placeholder with the corresponding value
	  urlTemplate = urlTemplate.replace(regex, params[key]);
	}
	return urlTemplate;
}
  
/**
 * Delay execution with promise or make a process sleep for some moment
 * @param duration 
 * @returns 
 */
export function promiseDelay(duration: number) {
	return new Promise(resolve => setTimeout(resolve, duration))
}

/**
 * Call a function later by calling `.exec()`.
 * This function is  handy for DRY principle
 * @param func Function to call later
 * @param args Rest arguments that is passed to `func`
 * @returns 
 * @example
 * const doMulti = (num) => num * 33
 * const callMultiLater = callFunctionLater(doMulti, 4)
 * // Use doMulti
 * const multiValue = callMultiLater.exec() // 132
 * // Using Promise
 * const doMulti = (num) => Promise.resolve(num * 33)
 * const callMultiLater = callFunctionLater(doMulti, 4)
 * const multiValue = await callMultiLater.exec() // 132
 */
export function callFunctionLater<argT = unknown, rT = unknown>(func: (...args: argT[]) => rT, ...args: argT[]) {
	return {
		exec: () => func(...args)
	}
}