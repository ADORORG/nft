import { describe, expect, it } from '@jest/globals'
import { isEthereumAddress } from '@/lib/utils/main'

describe('Main utils functions', () => {
    it('should return true for valid address', () => {
        const address = '0xFC3AB3Cb662DA997592cEB18D357a07Fc898cB2e';
        expect(isEthereumAddress(address)).toBe(true);
        expect(isEthereumAddress(address.toLowerCase())).toBeTruthy();
        expect(isEthereumAddress(address.toUpperCase())).toBeTruthy();
    })

    it('should return false for invalid address', () => {
        const invalidAddress = 'FC3AB3Cb662DA997592cEB18D357a07Fc898cB2e';
        expect(isEthereumAddress(invalidAddress)).toBeFalsy();
        expect(isEthereumAddress(invalidAddress.substring(0, 1))).toBeFalsy();
    })
})