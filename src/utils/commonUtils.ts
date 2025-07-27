import { createAvatar } from '@dicebear/core';
import { identicon, initials } from '@dicebear/collection';
import { VaultInterface } from '@/interfaces/VaultInterface';

class CommonUtils {
    /**
     * Function to generate a random password with a specific length
     */
    public static generateRandomPassword(length: number): string {
        const charSets: string[] = [
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'abcdefghijklmnopqrstuvwxyz',
            '0123456789',
            '!@#$%^&*()_+[]{}|;:,.<>?',
        ];

        if (length < 8) {
            throw new Error('Password length should be at least 8 characters.');
        }

        const allChars = charSets.join('');
        const passwordArray = [];
        /**
         * Ensure the password contains at least one character from each set
         */
        charSets.forEach((set) => {
            passwordArray.push(set[Math.floor(Math.random() * set.length)]);
        });
        /**
         * Fill the rest of the password length with random characters
         */
        for (let i = passwordArray.length; i < length; i++) {
            passwordArray.push(
                allChars[Math.floor(Math.random() * allChars.length)],
            );
        }
        /**
         *  Shuffle the password using Fisher-Yates algorithm (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
         */
        for (let i = passwordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordArray[i], passwordArray[j]] = [
                passwordArray[j],
                passwordArray[i],
            ];
        }

        return passwordArray.join('');
    }

    /**
     * Generate a short unique identifier based on the current date and a random number
     */
    public static generateShortUUID(length: number = 22): string {
        /**
         * Get the current timestamp and convert it to base 36
         */
        const timestamp = Date.now().toString(36);
        /**
         * Generate a random number and convert it to base 36, removing the leading '0.'
         */
        const randomNum = Math.random().toString(36).substring(2, 10);
        /**
         * Combine the timestamp and random number to create a unique identifier
         */
        const shortUUID = timestamp + randomNum;
        /**
         * Return
         */
        return shortUUID.substring(0, length);
    }

    /**
     * Return a custom avatar icon or website favicon
     */
    public static getWebsiteFavicon(item: {
        url?: string;
        title: string;
    }): string {
        if (item.url && item.url.length > 0) {
            /**
             * Return the favicon URL if the item has a valid URL
             */
            return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURI(item.url)}&size=128`;
        } else {
            /**
             * Generate and return a data URI for the initials icon if no URL is provided
             */
            return createAvatar(initials, {
                seed: item.title,
            }).toDataUri();
        }
    }

    /**
     * Format a given URL to ensure it includes "https://" if no valid prefix is provided
     */
    public static formatUrl(url: string): string {
        if (url.length === 0) return '';
        /**
         * REGEX Rule
         */
        const REGEX = /^(https?:\/\/)/i;
        /**
         * If the URL does not already start with "http://" or "https://", prepend "https://"
         */
        return REGEX.test(url) ? url : `https://${url}`;
    }

    /**
     * Generate VaultIcon with defined seed
     */
    public static VaultIcon(
        VaultLogo: VaultInterface.Data['logo'],
    ): string | null {
        /**
         * Generate the vault icon based on a seed
         */
        const Icon = createAvatar(identicon, {
            seed: VaultLogo.toString(),
        });

        return Icon ? Icon.toDataUri() : null;
    }
    /**
     * Limit Text Length
     */
    public static limitTextLength(value: string, limit: number = 50) {
        return value.length > limit ? value.slice(0, limit) + '...' : value;
    }

    /**
     * Set document title with a static prefix
     */
    public static DocumentTitle(title: string) {
        document.title = `ToolKiwi PM - ${title}`;
        return;
    }

    /**
     * Determines if a hexadecimal color is considered "light" based on its luminance
     *
     * The luminance is calculated using the standard formula for perceived brightness:
     * (0.299 * R + 0.587 * G + 0.114 * B) / 255
     * A color is considered light if its luminance is greater than 0.6
     *
     * !Maybe the luminance threshold isn't accurate, since I'm basing it solely on how it looks on my own screen...
     *
     */
    public static isColorLight(hexColor: string): boolean {
        /**
         * Ensure the color string starts with '#' and is in the proper format
         */
        if (!hexColor.startsWith('#') || hexColor.length !== 7) return false;
        /**
         * Extract red, green, and blue components from the hex string
         */
        const r: number = parseInt(hexColor.slice(1, 3), 16);
        const g: number = parseInt(hexColor.slice(3, 5), 16);
        const b: number = parseInt(hexColor.slice(5, 7), 16);
        /**
         * Calculate luminance using the formula for perceived brightness
         */
        const luminance: number = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        /**
         * Return
         */
        return luminance > 0.6;
    }
}

export default CommonUtils;
