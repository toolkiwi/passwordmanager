export namespace VaultInterface {
    /**
     * Interface of the main object of the vault state
     */
    export interface State {
        _d: Data | null;
        _v: number | null;
        _unsaved: boolean;
        _cipher?: string | null;
    }
    /**
     * Interface for the data inside the vault state
     */
    export interface Data {
        name: string;
        logo: number | string;
        algo: 'AES';
        master: string;
        trash: Password[];
        passwords: Password[];
        tags?: Tag[];
        keys?: Key[];
        totp?: TOTP;
        settings?: Settings;
        created_at: number;
    }

    /**
     * Interface for the vault settings stored inside the vault data
     */
    export interface Settings {
        autolock_inactivity: boolean;
        autolock_on_leave: boolean;
        autolock_on_reload: boolean;
    }

    /**
     * Interface for the password inside vault data state
     */
    export interface Password {
        id: string;
        title: string;
        login: string;
        password: string;
        url: string;
        note: string;
        tag_id?: VaultInterface.Tag['id'];
        created_at: Date | number | string;
        updated_at: Date | number | string;
        totp?: TOTP;
    }

    /**
     * Tag interface
     */
    export interface Tag {
        id: string;
        title: string;
        color: string;
        created_at: Date | number | string;
        updated_at: Date | number | string;
    }

    /**
     * Interface for a stored key (SSH, API token, PGP...)
     */
    export interface Key {
        id: string;
        title: string;
        type: KeyType;
        host: string;
        username: string;
        private_key: string;
        public_key: string;
        passphrase: string;
        note: string;
        tag_id?: VaultInterface.Tag['id'];
        created_at: Date | number | string;
        updated_at: Date | number | string;
    }

    /**
     * Available key types
     */
    export type KeyType = 'SSH' | 'API' | 'PGP' | 'OTHER';
    /**
     * Interface for TOTP (Time-based One-Time Password) configuration
     */
    export interface TOTP {
        secret: string;
        algorithm: 'SHA1' | 'SHA256' | 'SHA512';
        digits: number;
        period: number;
    }

    /**
     * Interfaces for the form
     */
    export namespace Form {
        export interface Password {
            title: string;
            login: string;
            password: string;
            url: string;
            note: string;
            totp?: TOTP;
            tag_id: VaultInterface.Tag['id'];
        }
        export interface Tag {
            title: string;
            color?: string;
        }
        export interface Key {
            title: string;
            type: VaultInterface.KeyType;
            host: string;
            username: string;
            private_key: string;
            public_key: string;
            passphrase: string;
            note: string;
            tag_id: VaultInterface.Tag['id'];
        }
    }
}
