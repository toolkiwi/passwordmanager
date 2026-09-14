import { VaultInterface } from '@/interfaces/VaultInterface';

export const TOTP_DEFAULT = {
    secret: '',
    digits: 6,
    period: 30,
    algorithm: 'SHA1',
} as VaultInterface.TOTP;

export const KEY_TYPES: VaultInterface.KeyType[] = ['SSH', 'API', 'PGP', 'OTHER'];

export const KEY_FORM_DEFAULT: VaultInterface.Form.Key = {
    title: '',
    type: 'SSH',
    host: '',
    username: '',
    private_key: '',
    public_key: '',
    passphrase: '',
    note: '',
    tag_id: '',
};
