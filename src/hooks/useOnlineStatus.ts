import { useEffect, useState } from 'react';

/**
 * Custom hook to track the user's online status.
 */
function useOnlineStatus(): boolean {
    /**
     *  Initialize state based on the current online status of the user
     */
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        /**
         * Function to handle when the user goes online
         */
        const handleOnline = () => setIsOnline(true);
        /**
         * Function to handle when the user goes offline
         */
        const handleOffline = () => setIsOnline(false);
        /**
         * Add event listeners to detect changes in the online status
         */
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        /**
         * Cleanup function to remove event listeners when the component is unmounted
         */
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    /**
     * Return the current online status
     */
    return isOnline;
}

export default useOnlineStatus;
