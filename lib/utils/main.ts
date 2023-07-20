

/** 
* Check for a valid format of an ethereum address. It does not check for checksum address
* @param address - Ethereum Address to validate
* @returns
*/
export function isEthereumAddress(address: string): boolean {
    return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
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
export function isValidEmail(email: string): boolean {
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