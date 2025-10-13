import { VaultInterface } from '@/interfaces/VaultInterface';

class TotpUtils {
    /**
     * Convert a Base32 string to a Uint8Array
     */
    private static base32ToBytes(base32: string): Uint8Array {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        const bytes: number[] = [];

        /**
         * Iterate through each character in the Base32 string
         * Convert each character to its corresponding 5-bit value
         * If the character is not in the Base32 alphabet, it is skipped
         * The 5-bit values are concatenated to form a binary string
         * The binary string is then split into 8-bit chunks
         * Each 8-bit chunk is converted to a byte and added to the bytes array
         */
        for (let i = 0; i < base32.length; i++) {
            const val = alphabet.indexOf(base32[i].toUpperCase());
            if (val === -1) continue;
            bits += val.toString(2).padStart(5, '0');
        }

        /**
         * Split the binary string into 8-bit chunks
         * Each chunk is converted to a byte and added to the bytes array
         * If the last chunk is less than 8 bits, it is ignored
         */
        for (let i = 0; i + 8 <= bits.length; i += 8) {
            bytes.push(parseInt(bits.slice(i, i + 8), 2));
        }
        /**
         * Return the bytes as a Uint8Array
         * This allows for easy manipulation and storage of the binary data
         */
        return new Uint8Array(bytes);
    }

    public static GetRemainingSeconds(window: number = 30): number {
        return window - (Math.floor(Date.now() / 1000) % window);
    }

    /**
     * Generate a TOTP (Time-based One-Time Password) using the provided secret
     */
    public static async GenerateTOTP({
        secret,
        digits = 6,
        algorithm = 'SHA1',
        period = 30,
    }: VaultInterface.TOTP): Promise<string> {
        const keyBytes = this.base32ToBytes(secret);

        /**
         * Create an ArrayBuffer from the key bytes
         */
        const buffer = new ArrayBuffer(keyBytes.length);
        const key = new Uint8Array(buffer);
        key.set(keyBytes);

        const counterBuffer = new ArrayBuffer(8);
        const view = new DataView(counterBuffer);

        /**
         * Calculate the time step (counter) based on the current time and the period
         * The time step represents the number of periods that have elapsed since the Unix epoch
         * The counter is encoded as an 8-byte (64-bit) big-endian integer:
         *      - The first 4 bytes (high-order bits) are set to 0
         *      - The last 4 bytes (low-order bits) contain the time step value
         */
        const timeStep = Math.floor(Date.now() / 1000 / period);
        view.setUint32(0, 0);
        view.setUint32(4, timeStep);

        /**
         * Map the algorithm string to the corresponding Web Crypto API algorithm name
         */
        const algorithmMap: Record<string, string> = {
            SHA1: 'SHA-1',
            SHA256: 'SHA-256',
            SHA512: 'SHA-512',
        };

        const webCryptoAlgorithm = algorithmMap[algorithm] || 'SHA-1';

        /**
         * Import the key for HMAC generation
         */
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key,
            { name: 'HMAC', hash: { name: webCryptoAlgorithm } },
            false,
            ['sign'],
        );

        /**
         * Generate the HMAC using the counter as the message
         */
        const hmac = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
        const hmacArray = new Uint8Array(hmac);

        /**
         * Calculate the offset based on the last byte of the HMAC
         * The offset is the last byte of the HMAC AND 0x0f (to get the last 4 bits)
         */
        const offset = hmacArray[hmacArray.length - 1] & 0x0f;
        const binary =
            ((hmacArray[offset] & 0x7f) << 24)
            | ((hmacArray[offset + 1] & 0xff) << 16)
            | ((hmacArray[offset + 2] & 0xff) << 8)
            | (hmacArray[offset + 3] & 0xff);
        /**
         * Reduce the binary value to the desired number of digits
         * The binary value is reduced by taking the modulo of 10 raised to the number of digits
         * The result is then converted to a string and padded with leading zeros to match the number of digits
         */
        return (binary % 10 ** digits).toString().padStart(digits, '0');
    }
}

export default TotpUtils;
