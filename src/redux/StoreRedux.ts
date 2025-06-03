import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import vaultReducer from './features/vaultSlice';
import appReducer from './features/appSlice';
import tempReducer from './features/tempSlice';
import VaultChangeMiddleware from './middlewares/VaultChangeMiddleware';

// @ts-expect-error : No types found for this lib
import storage from 'redux-persist-indexeddb-storage';

/**
 * Reducers
 */
const rootReducer = combineReducers({
    vault: vaultReducer,
    app: appReducer,
    temp: tempReducer,
});

/**
 * Configuration persistance
 */
const persistConfig = {
    key: 'root',
    storage: storage('ptk'),
    blacklist: ['temp'],
};

/**
 * Combine reducers
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Store Redux
 */
const StoreRedux = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(VaultChangeMiddleware),
});

/**
 * Types
 */
export type StoreState = ReturnType<typeof StoreRedux.getState>;
export type StoreDispatch = typeof StoreRedux.dispatch;

/**
 * Persistor
 */
export const StorePersistor = persistStore(StoreRedux);

/**
 * Export
 */
export default StoreRedux;
