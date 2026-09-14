import { VaultInterface } from '@/interfaces/VaultInterface';

/**
 * Default vault settings applied on vault creation
 * autolock_on_reload is enabled by default: the vault is always encrypted in browser storage
 */
export const VAULT_SETTINGS_DEFAULT: VaultInterface.Settings = {
    autolock_inactivity: false,
    autolock_on_leave: false,
    autolock_on_reload: true,
};

/**
 * Delay without user interaction before the vault is locked (10 minutes)
 */
export const AUTOLOCK_INACTIVITY_DELAY = 10 * 60 * 1000;

/**
 * Events considered as user activity to reset the inactivity timer
 */
export const AUTOLOCK_ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const;

