import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VaultInterface } from '../../interfaces/VaultInterface';
import CommonUtils from '../../utils/commonUtils';
import { getRandomTagColor } from '@/constants/TagColors';

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
        createVault: (state: VaultInterface.State | null, action: PayloadAction<{ title: string; master: string }>) => {
            state = {
                _d: {
                    name: action.payload.title,
                    logo: new Date().getTime() / 1000,
                    algo: 'AES',
                    passwords: [],
                    trash: [],
                    tags: [],
                    master: action.payload.master,
                    created_at: new Date().getTime() / 1000,
                },
                _v: 1,
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
        addPassword: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Form.Password>) => {
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
            const index: number | undefined = state?._d?.passwords.findIndex((e) => e.id === action.payload.id);
            /**
             * If not exist return;
             */
            if (index !== -1) {
                state._d.passwords[index] = {
                    ...state?._d?.passwords[index],
                    updated_at: new Date().getDate(),
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
                    updated_at: new Date().getDate(),
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
                updated_at: new Date().getDate(),
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
                    updated_at: new Date().getDate(),
                };
            }

            return state;
        },
        deleteTag: (state: VaultInterface.State | null, action: PayloadAction<VaultInterface.Tag['id']>) => {
            if (!state || !state._d || !state._d.tags) return;

            const index = state._d.tags.findIndex((e) => e.id === action.payload);

            if (index !== -1) {
                /**
                 * Remove tag_id for all passwords
                 */
                state._d.passwords.forEach((p) => {
                    if (p.tag_id === action.payload) {
                        delete p.tag_id;
                    }
                });
                /**
                 * Remove tag from state
                 */
                state._d.tags.splice(index, 1);
            }

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
    addTag,
    setTag,
    deleteTag,
} = vaultSlice.actions;
/**
 * Export reducer
 */
export default vaultSlice.reducer;
