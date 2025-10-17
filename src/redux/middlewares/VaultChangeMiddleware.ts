import { Middleware } from '@reduxjs/toolkit';
import { VaultInterface } from '../../interfaces/VaultInterface';
import { setUnsaved } from '../features/vaultSlice';

/**
 * Middleware to detect changes in the Vault state
 * It dispatches an action to indicate unsaved changes if the Vault state changes
 */
const VaultChangeMiddleware: Middleware = (store) => {
    let previousVaultState: VaultInterface.State | null = store.getState().vault;

    return (next) => (action) => {
        // @ts-expect-error: Can't catch the right type from redux persist
        if (!action.type.startsWith('vault/') || action.type === 'vault/setUnsaved') {
            return next(action);
        }

        const currentVaultState: VaultInterface.State | null = store.getState().vault;

        /**
         * If the vault is still encrypted, do not mark as unsaved
         */
        if (currentVaultState?._cipher) {
            previousVaultState = currentVaultState;
            return next(action);
        }

        /**
         * Check if the vault data has changed
         */
        const hasVaultChanged =
            currentVaultState !== null && JSON.stringify(previousVaultState) !== JSON.stringify(currentVaultState);

        /**
         * If changed, dispatch an action to set unsaved changes to true
         */
        if (hasVaultChanged) {
            store.dispatch(setUnsaved(true));
        }

        /**
         * Update the previous state reference
         */
        previousVaultState = currentVaultState;
        return next(action);
    };
};

export default VaultChangeMiddleware;
