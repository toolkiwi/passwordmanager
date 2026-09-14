import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lockVault } from '@/redux/features/vaultSlice';
import type { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import { AUTOLOCK_ACTIVITY_EVENTS, AUTOLOCK_INACTIVITY_DELAY } from '@/constants/Vault';

/**
 * Lock the vault automatically depending on the vault settings
 * Both triggers (inactivity and page leaving) can be enabled independently
 */
export default function useAutoLock(): void {
    /**
     * Get the autolock settings from the vault data
     */
    const Settings = useSelector((state: StoreState) => state.vault._d?.settings);
    /**
     * The vault is already locked when a cipher is present
     */
    const isLocked = useSelector((state: StoreState) => !!state.vault._cipher);
    /**
     * Instance of dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();
    /**
     * Ref holding the current inactivity timer
     */
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Encrypt the vault again, the master password will be asked back
     */
    const handleLock = useCallback(() => {
        dispatch(lockVault());
    }, [dispatch]);

    /**
     * Lock the vault after a period without any user interaction
     */
    useEffect(() => {
        if (!Settings?.autolock_inactivity || isLocked) return;

        const resetTimer = () => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(handleLock, AUTOLOCK_INACTIVITY_DELAY);
        };

        resetTimer();
        AUTOLOCK_ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));

        return () => {
            if (timer.current) clearTimeout(timer.current);
            AUTOLOCK_ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [Settings?.autolock_inactivity, isLocked, handleLock]);

    /**
     * Lock the vault as soon as the page is hidden (tab change, minimized window...)
     */
    useEffect(() => {
        if (!Settings?.autolock_on_leave || isLocked) return;

        const handleVisibilityChange = () => {
            if (document.hidden) handleLock();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [Settings?.autolock_on_leave, isLocked, handleLock]);
}
