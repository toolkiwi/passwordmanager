import { VaultInterface } from '@/interfaces/VaultInterface';

export const TOTP_DEFAUL = {
    secret: '',
    digits: 6,
    period: 30,
    algorithm: 'SHA1',
} as VaultInterface.TOTP;
