import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import { VaultInterface } from '../../interfaces/VaultInterface';
import CommonUtils from '../../utils/commonUtils';
import { getRandomTagColor } from '@/constants/TagColors';
import { VAULT_SETTINGS_DEFAULT } from '@/constants/Vault';

/**
 * Initial State
 */
const initialState: VaultInterface.State = {
    _d: null,
    _v: null,
    _unsaved: false,
};

/**
 * Create Slice
 */
export const vaultSlice = createSlice({
    name: 'vault',
    initialState,
    reducers: {
        createVault: (state: VaultInterface.State | null, action: PayloadAction<{ title: string; master: string }>) => {
            state = {
                _d: {
                    name: action.payload.title,
                    logo: new Date().getTime() / 1000,
                    algo: 'AES',
                    passwords: [],
                    trash: [],
                    tags: [],
                    keys: [],
                    settings: { ...VAULT_SETTINGS_DEFAULT },
                    master: action.payload.master,
                    created_at: new Date().getTime() / 1000,
                },
                _v: 1,
                _unsaved: false,
            };
            return state;
        },
        setVault: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.State>) => {
            state = action.payload;
            return state;
        },
        setVaultData: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.State['_d']>) => {
            if (!state) return;
            state._d = action.payload;
            return state;
        },
        resetVault: (state: VaultInterface.State | null) => {
            state = initialState;
            return state;
        },
        /**
         * Encrypt the vault back into its cipher so the master password is required again
         */
        lockVault: (state: VaultInterface.State | null) => {
            if (!state?._d?.master || state._cipher) return;

            const data = current(state);
            const ciphertext = CryptoJS.AES.encrypt(
                JSON.stringify({ ...data, _cipher: null }),
                data._d!.master,
            ).toString();

            return {
                ...data,
                _d: {
                    name: data._d!.name,
                    logo: data._d!.logo,
                    algo: data._d!.algo,
                },
                _cipher: ciphertext,
            } as VaultInterface.State;
        },
        addPassword: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Form.Password>) => {
            if (!state) return;

            const payload: VaultInterface.Password = {
                ...action.payload,
                id: CommonUtils.generateShortUUID(),
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
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
            const index: number | undefined = state?._d?.passwords.findIndex((e) => e.id === action.payload.id);
            /**
             * If not exist return;
             */
            if (index !== -1) {
                state._d.passwords[index] = {
                    ...state?._d?.passwords[index],
                    updated_at: new Date().getTime(),
                    ...action.payload.data,
                };
            }

            return state;
        },
        deletePassword: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Password>) => {
            if (!state || !state._d) return;

            const index = state._d.passwords.findIndex((e) => e.id === action.payload.id);

            if (index !== -1) {
                state._d.passwords.splice(index, 1);
                state._d.trash.unshift({
                    ...action.payload,
                    updated_at: new Date().getTime(),
                });
            }

            return state;
        },
        trashRestorePassword: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Password>) => {
            if (!state || !state._d) return;

            const index = state._d.trash.findIndex((e) => e.id === action.payload.id);

            if (index !== -1) {
                state._d.trash.splice(index, 1);
                state._d.passwords.unshift({
                    ...action.payload,
                    updated_at: new Date().getTime(),
                });
            }

            return state;
        },
        trashClearAll: (state: VaultInterface.State | null) => {
            if (!state || !state._d) return;
            state._d.trash = [];
            return state;
        },
        addTag: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Form.Tag>) => {
            if (!state?._d || !action.payload.title) return;
            /**
             * Create the tags array in state if it doesn't exist yet
             */
            if (!state._d.tags) state._d.tags = [];
            /**
             * Tag schema
             */
            const payload: VaultInterface.Tag = {
                title: action.payload.title,
                color: action.payload.color ?? getRandomTagColor(),
                id: CommonUtils.generateShortUUID(10),
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
            };
            /**
             * Add to state
             */
            state._d?.tags.unshift(payload);
            return state;
        },
        setTag: (
            state: VaultInterface.State | null,
            action: PayloadAction<{
                id: VaultInterface.Tag['id'];
                data: VaultInterface.Form.Tag;
            }>,
        ) => {
            if (!state || !state._d || !state._d.tags) return;
            /**
             * Get the tag index
             */
            const index: number | undefined = state?._d?.tags.findIndex((e) => e.id === action.payload.id);
            /**
             * If not exist return;
             */
            if (index !== -1) {
                state._d.tags[index] = {
                    ...state?._d?.tags[index],
                    ...action.payload.data,
                    updated_at: new Date().getTime(),
                };
            }

            return state;
        },
        deleteTag: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Tag['id']>) => {
            if (!state || !state._d || !state._d.tags) return;

            const index = state._d.tags.findIndex((e) => e.id === action.payload);

            if (index !== -1) {
                /**
                 * Remove tag_id for all passwords and keys
                 */
                state._d.passwords.forEach((p) => {
                    if (p.tag_id === action.payload) {
                        delete p.tag_id;
                    }
                });
                state._d.keys?.forEach((k) => {
                    if (k.tag_id === action.payload) {
                        delete k.tag_id;
                    }
                });
                /**
                 * Remove tag from state
                 */
                state._d.tags.splice(index, 1);
            }

            return state;
        },
        addKey: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Form.Key>) => {
            if (!state?._d || !action.payload.title) return;
            /**
             * Create the keys array in state if it doesn't exist yet
             */
            if (!state._d.keys) state._d.keys = [];
            /**
             * Key schema
             */
            const payload: VaultInterface.Key = {
                ...action.payload,
                id: CommonUtils.generateShortUUID(),
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
            };
            /**
             * Add to state
             */
            state._d.keys.unshift(payload);
            return state;
        },
        setKey: (
            state: VaultInterface.State | null,
            action: PayloadAction<{
                id: VaultInterface.Key['id'];
                data: VaultInterface.Form.Key;
            }>,
        ) => {
            if (!state || !state._d || !state._d.keys) return;
            /**
             * Get the key index
             */
            const index: number = state._d.keys.findIndex((e) => e.id === action.payload.id);
            /**
             * If not exist return;
             */
            if (index !== -1) {
                state._d.keys[index] = {
                    ...state._d.keys[index],
                    ...action.payload.data,
                    updated_at: new Date().getTime(),
                };
            }

            return state;
        },
        deleteKey: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Key['id']>) => {
            if (!state || !state._d || !state._d.keys) return;

            const index = state._d.keys.findIndex((e) => e.id === action.payload);

            if (index !== -1) {
                state._d.keys.splice(index, 1);
            }

            return state;
        },
        setUnsaved: (state: VaultInterface.State | null, action: PayloadAction<boolean>) => {
            if (!state || !state._d) return;
            state._unsaved = action.payload;
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
    lockVault,
    addPassword,
    setPassword,
    deletePassword,
    trashRestorePassword,
    trashClearAll,
    addTag,
    setTag,
    deleteTag,
    addKey,
    setKey,
    deleteKey,
    setUnsaved,
} = vaultSlice.actions;
/**
 * Export reducer
 */
export default vaultSlice.reducer;
