export {};
declare global {
    interface Window {
        GetVaultDetails?: () => void;
        GetVaultSize?: () => void;
    }
}
