import { VaultInterface } from '@/interfaces/VaultInterface';
import CryptoJS from 'crypto-js';
import { createTransform } from 'redux-persist';

/**
 * Transform to encrypt/decrypt vault data when persisting/rehydrating
 */
const VaultEncryptTransform = createTransform<VaultInterface.State, VaultInterface.State>(
    /**
     * Before persisting
     */
    (inboundState) => {
        const data = inboundState;

        if (!data || !data._d?.master) {
            return {
                ...inboundState,
            } as VaultInterface.State;
        }

        try {
            const password = data._d?.master;
            const plaintext = JSON.stringify({
                ...data,
            });

            const ciphertext = CryptoJS.AES.encrypt(plaintext, password).toString();
            return {
                ...inboundState,
                _d: {
                    name: inboundState._d?.name,
                    logo: inboundState._d?.logo,
                    algo: inboundState._d?.algo,
                },
                _cipher: ciphertext,
            } as VaultInterface.State;
        } catch {
            return {
                ...inboundState,
                _cipher: null,
            } as VaultInterface.State;
        }
    },

    /**
     * After rehydrating
     */
    (outboundState) => {
        return outboundState;
    },
    { whitelist: ['vault'] },
);

export default VaultEncryptTransform;
