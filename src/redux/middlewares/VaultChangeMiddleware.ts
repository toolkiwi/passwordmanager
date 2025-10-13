import { Middleware } from '@reduxjs/toolkit';
import { VaultInterface } from '../../interfaces/VaultInterface';

/**
 * Middleware to detect changes in the Vault state
 * It dispatches an action to indicate unsaved changes if the Vault state changes
 */
const VaultChangeMiddleware: Middleware = (store) => {
    /**
     * Store the previous state of the vault to detect changes
     */
    let previousVaultState: VaultInterface.State | null = store.getState().vault;

    return (next) => (action) => {
        /**
         * Only process actions related to 'vault'
         */
        // @ts-expect-error: Can't catch the right type from redux persist
        if (!action.type.startsWith('vault/')) {
            return next(action);
        }

        /**
         * Get the current state of the vault
         */
        const currentVaultState: VaultInterface.State | null = store.getState().vault;
        /**
         *  Check if the vault state has changed, excluding the '_d' property
         */
        const hasVaultChanged =
            currentVaultState?._d !== null && JSON.stringify(previousVaultState) !== JSON.stringify(currentVaultState);

        if (hasVaultChanged) {
            /**
             * Dispatch action to indicate that there are unsaved changes
             */
            store.dispatch({ type: 'app/setUnsaved', payload: true });
        }

        /**
         * Update the previousVaultState to the current state for the next action
         */
        previousVaultState = currentVaultState;
        /**
         * Return
         */
        return next(action);
    };
};

export default VaultChangeMiddleware;
