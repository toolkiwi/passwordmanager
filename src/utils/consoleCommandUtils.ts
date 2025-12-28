/* eslint-disable no-console */
import { AppInterface } from '@/interfaces/AppInterface';
import { VaultInterface } from '@/interfaces/VaultInterface';
import dayjs from 'dayjs';

/**
 * Utility class to manage console-exposed commands
 */
class ConsoleCommandUtils {
    /**
     * Registers console commands for vault management:
     * - `GetVaultDetails`: Print vault information
     * - `GetVaultSize`: Get current localStorage usage
     * - `GetVaultPasswords`: Display all password objects
     * - `ExportVaultJSON`: Export entire decrypted vault as JSON
     */
    public static RegisterVaultInformations(Vault: VaultInterface.State, App: AppInterface.State): void {
        if (!App.unlocked || !Vault._d) return;

        /**
         * Ensure no existing commands are registered
         */
        if ('TK_GetVaultDetails' in window) delete window['TK_GetVaultDetails'];
        if ('TK_GetVaultSize' in window) delete window['TK_GetVaultSize'];
        if ('TK_GetVaultPasswords' in window) delete window['TK_GetVaultPasswords'];
        if ('TK_ExportVaultJSON' in window) delete window['TK_ExportVaultJSON'];

        /**
         * Create the `GetVaultDetails` function globally on window
         */
        Object.defineProperty(window, 'TK_GetVaultDetails', {
            configurable: true,
            get() {
                console.clear();
                console.log('%c---------------------------------------------', 'color: #444;');
                console.log('%c[ Vault Information ]', 'color: #00bcd4; font-weight: bold; font-size: 16px;');
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
                console.log(`%c• Version: %c${Vault._v || 'N/A'}`, 'color: #888; font-weight: bold;', 'color: #fff;');
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
                console.log('%c---------------------------------------------', 'color: #444;');
            },
        });

        /**
         * Create the `GetVaultSize` function globally on window
         */
        Object.defineProperty(window, 'TK_GetVaultSize', {
            configurable: true,
            get() {
                console.log(
                    `%cLocalStorage Size: %c${ConsoleCommandUtils.getLocalStorageSizeInKB()}`,
                    'color: #00bcd4; font-weight: bold;',
                    'color: yellow;',
                );
            },
        });

        /**
         * Create the `GetVaultPasswords` function globally on window
         */
        Object.defineProperty(window, 'TK_GetVaultPasswords', {
            configurable: true,
            get() {
                console.clear();
                console.log('%c---------------------------------------------', 'color: #444;');
                console.log('%c[ Password Objects ]', 'color: #4caf50; font-weight: bold; font-size: 16px;');

                const passwords = Vault._d?.passwords || [];

                if (passwords.length === 0) {
                    console.log('%c• No passwords found in vault', 'color: #ff9800; font-style: italic;');
                } else {
                    console.log(`%c• Found ${passwords.length} password(s):`, 'color: #888; font-weight: bold;');
                    console.log('%c---------------------------------------------', 'color: #444;');

                    passwords.forEach((password, index) => {
                        console.log(
                            `%c[${index + 1}] %c${password.title || 'Unnamed'}`,
                            'color: #2196f3; font-weight: bold;',
                            'color: #fff; font-size: 13px;',
                            password,
                        );
                    });
                }

                console.log('%c---------------------------------------------', 'color: #444;');
            },
        });

        /**
         * Create the `ExportVaultJSON` function globally on window
         * Exports the entire decrypted vault as JSON
         */
        Object.defineProperty(window, 'TK_ExportVaultJSON', {
            configurable: true,
            get() {
                const vaultExport = {
                    version: Vault._v,
                    vault: Vault._d,
                    exportedAt: new Date().toISOString(),
                };

                console.clear();
                console.log('%c---------------------------------------------', 'color: #444;');
                console.log('%c[ Vault JSON Export ]', 'color: #ff6f00; font-weight: bold; font-size: 16px;');
                console.log(
                    '%c⚠️  WARNING: This contains your decrypted vault data!',
                    'color: #ff0000; font-weight: bold;',
                );
                console.log('%c---------------------------------------------', 'color: #444;');
                console.log(vaultExport);
                console.log('%c---------------------------------------------', 'color: #444;');
                console.log('%cJSON String:', 'color: #888; font-weight: bold;');
                console.log(JSON.stringify(vaultExport, null, 2));
                console.log('%c---------------------------------------------', 'color: #444;');

                /**
                 * Return the object for direct access if needed
                 */
                return vaultExport;
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
