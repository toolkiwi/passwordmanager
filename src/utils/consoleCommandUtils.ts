/* eslint-disable no-console */
import { AppInterface } from '@/interfaces/AppInterface';
import { VaultInterface } from '@/interfaces/VaultInterface';
import dayjs from 'dayjs';

/**
 * Utility class to manage console-exposed commands
 */
class ConsoleCommandUtils {
    /**
     * Registers a console command `GetVaultDetails` to print vault information
     * and `GetVaultSize` to get current localStorage usage
     *
     * @param {VaultInterface.State} Vault - The current state of the vault from Redux
     * @param {AppInterface.State} App - The current application state from Redux
     *
     * @returns {void}
     */
    public static RegisterVaultInformations(
        Vault: VaultInterface.State,
        App: AppInterface.State,
    ): void {
        if (!App.unlocked || !Vault._d) return;

        /**
         * Ensure no existing command is registered
         */
        if ('GetVaultDetails' in window) delete window.GetVaultDetails;
        if ('GetVaultSize' in window) delete window.GetVaultSize;

        /**
         * Create the `GetVaultDetails` function globally on window
         */
        Object.defineProperty(window, 'GetVaultDetails', {
            configurable: true,
            get() {
                console.clear();
                console.log(
                    '%c---------------------------------------------',
                    'color: #444;',
                );
                console.log(
                    '%c[ Vault Information ]',
                    'color: #00bcd4; font-weight: bold; font-size: 16px;',
                );
                console.log(
                    `%c• Name: %c${Vault._d?.name || 'N/A'}`,
                    'color: #888; font-weight: bold;',
                    'color: #fff;',
                );
                console.log(
                    `%c• Passwords stored: %c${Vault._d?.passwords?.length ?? 0}`,
                    'color: #888; font-weight: bold;',
                    'color: #fff;',
                );
                console.log(
                    `%c• Passwords in trash: %c${Vault._d?.trash?.length ?? 0}`,
                    'color: #888; font-weight: bold;',
                    'color: #fff;',
                );
                console.log(
                    `%c• Encryption Algorithm: %c${Vault._d?.algo || 'Unknown'}`,
                    'color: #888; font-weight: bold;',
                    'color: yellow;',
                );
                console.log(
                    `%c• Version: %c${Vault._v || 'N/A'}`,
                    'color: #888; font-weight: bold;',
                    'color: #fff;',
                );
                console.log(
                    `%c• Vault created at: %c${Vault._d?.created_at ? dayjs(Vault._d.created_at).format('DD MMM YYYY HH:mm') : 'Unknown'}`,
                    'color: #888; font-weight: bold;',
                    'color: #fff;',
                );
                console.log(
                    `%c• Size: %c${ConsoleCommandUtils.getLocalStorageSizeInKB()}`,
                    'color: #888; font-weight: bold;',
                    'color: yellow;',
                );
                console.log(
                    '%c---------------------------------------------',
                    'color: #444;',
                );
            },
        });

        /**
         * Create the `GetLocalStorageSize` function globally on window
         */
        Object.defineProperty(window, 'GetVaultSize', {
            configurable: true,
            get() {
                console.log(
                    `%cLocalStorage Size: %c${ConsoleCommandUtils.getLocalStorageSizeInKB()}`,
                    'color: #00bcd4; font-weight: bold;',
                    'color: yellow;',
                );
            },
        });

        return;
    }

    /**
     * Calculate the current localStorage size in KB
     *
     * @returns {string} - The size in KB
     */
    private static getLocalStorageSizeInKB(): string {
        let total = 0;
        for (const key in localStorage) {
            if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
                const value = localStorage.getItem(key);
                total += key.length + (value ? value.length : 0);
            }
        }
        return (total / 1024).toFixed(2) + ' KB';
    }
}

export default ConsoleCommandUtils;
