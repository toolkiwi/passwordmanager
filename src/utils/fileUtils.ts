import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { VaultInterface } from '@/interfaces/VaultInterface';
import { t } from 'i18next';

class FileUtils {
    /**
     * Download Vault file
     * @param Vault
     */
    public static download(Vault: VaultInterface.State) {
        saveAs(
            new Blob(
                [
                    '+ptk+'
                        + CryptoJS.AES.encrypt(
                            JSON.stringify(Vault),
                            Vault._d!.master,
                        ).toString(),
                ],
                { type: 'text/plain;charset=utf-8;author:ToolKiwi' },
            ),
            `${Vault._d!.name}-${dayjs(new Date()).format('MM-DD-YYYY-HHmm')}.ptk`,
        );
    }

    /**
     * On file upload
     * Try to decrypt the file content
     * @param file
     * @param masterPassword
     */
    public static async upload(file: File, masterPassword: string) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const eventResult = event.target?.result as string;
                /**
                 * Verify if the prefix "+ptk+" is present
                 */
                if (eventResult && eventResult.includes('+ptk+')) {
                    let encryptedText = eventResult;
                    encryptedText = encryptedText.replace('+ptk+', '');
                    try {
                        const bytes = CryptoJS.AES.decrypt(
                            encryptedText,
                            masterPassword,
                        );
                        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

                        if (decryptedText) {
                            resolve(decryptedText);
                        } else {
                            reject(t('error:upload.error'));
                        }
                    } catch (e) {
                        reject(t('error:upload.error'));
                        return e;
                    }
                } else {
                    reject(t('error:upload.format'));
                }
            };

            reader.onerror = () => {
                reject(t('error:upload.read'));
            };

            reader.readAsText(file);

            return;
        });
    }
}
export default FileUtils;
