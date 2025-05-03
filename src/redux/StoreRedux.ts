import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import vaultReducer from './features/vaultSlice';
import appReducer from './features/appSlice';
import VaultChangeMiddleware from './middlewares/VaultChangeMiddleware';

/**
 * Configuration persistance
 */
const persistConfig = {
    key: 'root',
    storage,
};

/**
 * Combine reducers
 */
const rootReducer = {
    vault: vaultReducer,
    app: appReducer,
};

/**
 * Apply persistence on rootReducer
 */
const persistedReducer = persistReducer(
    persistConfig,
    combineReducers(rootReducer),
);

/**
 * Configurate the store
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
