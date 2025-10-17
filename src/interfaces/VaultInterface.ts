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
        totp?: TOTP;
        created_at: number;
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
    }
}
