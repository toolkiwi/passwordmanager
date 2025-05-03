import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VaultInterface } from '../../interfaces/VaultInterface';
import CommonUtils from '../../utils/commonUtils';

/**
 * Initial State
 */
const initialState: VaultInterface.State = {
    _d: null,
    _v: null,
};

/**
 * Create Slice
 */
export const vaultSlice = createSlice({
    name: 'vault',
    initialState,
    reducers: {
        createVault: (
            state: VaultInterface.State | null,
            action: PayloadAction<{ title: string; master: string }>,
        ) => {
            state = {
                _d: {
                    name: action.payload.title,
                    logo: new Date().getTime() / 1000,
                    algo: 'AES',
                    passwords: [],
                    trash: [],
                    master: action.payload.master,
                    created_at: new Date().getTime() / 1000,
                },
                _v: 1,
            };
            return state;
        },
        setVault: (
            state: VaultInterface.State | null,
            action: PayloadAction<VaultInterface.State>,
        ) => {
            state = action.payload;
            return state;
        },
        setVaultData: (
            state: VaultInterface.State | null,
            action: PayloadAction<VaultInterface.State['_d']>,
        ) => {
            if (!state) return;
            state._d = action.payload;
            return state;
        },
        resetVault: (state: VaultInterface.State | null) => {
            state = initialState;
            return state;
        },
        addPassword: (
            state: VaultInterface.State | null,
            action: PayloadAction<VaultInterface.Form.Password>,
        ) => {
            if (!state) return;

            const payload: VaultInterface.Password = {
                ...action.payload,
                id: CommonUtils.generateShortUUID(),
                created_at: new Date().getTime(),
                updated_at: new Date().getDate(),
            };
            state._d?.passwords.unshift(payload);
            return state;
        },
        setPassword: (
            state: VaultInterface.State | null,
            action: PayloadAction<{
                id: VaultInterface.Password['id'];
                data: VaultInterface.Form.Password;
            }>,
        ) => {
            if (!state || !state._d) return;
            /**
             * Get the password index
             */
            const _P_INDEX: number | undefined = state?._d?.passwords.findIndex(
                (e) => e.id === action.payload.id,
            );
            /**
             * If not exist return;
             */
            if (_P_INDEX !== -1) {
                state._d.passwords[_P_INDEX] = {
                    ...state?._d?.passwords[_P_INDEX],
                    updated_at: new Date().getDate(),
                    ...action.payload.data,
                };
            }

            return state;
        },
        deletePassword: (
            state: VaultInterface.State | null,
            action: PayloadAction<VaultInterface.Password>,
        ) => {
            if (!state || !state._d) return;

            const index = state._d.passwords.findIndex(
                (e) => e.id === action.payload.id,
            );

            if (index !== -1) {
                state._d.passwords.splice(index, 1);
                state._d.trash.unshift({
                    ...action.payload,
                    updated_at: new Date().getDate(),
                });
            }

            return state;
        },
        trashRestorePassword: (
            state: VaultInterface.State | null,
            action: PayloadAction<VaultInterface.Password>,
        ) => {
            if (!state || !state._d) return;

            const index = state._d.trash.findIndex(
                (e) => e.id === action.payload.id,
            );

            if (index !== -1) {
                state._d.trash.splice(index, 1);
                state._d.passwords.unshift({
                    ...action.payload,
                    updated_at: new Date().getDate(),
                });
            }

            return state;
        },
        trashClearAll: (state: VaultInterface.State | null) => {
            if (!state || !state._d) return;
            state._d.trash = [];
            return state;
        },
    },
});

/**
 * Export all actions
 */
export const {
    createVault,
    setVault,
    setVaultData,
    resetVault,
    addPassword,
    setPassword,
    deletePassword,
    trashRestorePassword,
    trashClearAll,
} = vaultSlice.actions;
/**
 * Export reducer
 */
export default vaultSlice.reducer;
