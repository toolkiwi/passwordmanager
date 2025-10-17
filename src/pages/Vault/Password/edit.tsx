import PasswordForm from '@/components/PasswordForm';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import type { StoreState } from '@/redux/StoreRedux';
import { Fragment, useEffect, useState } from 'react';
import { VaultInterface } from '@/interfaces/VaultInterface';
import CommonUtils from '@/utils/commonUtils';

export default function Index() {
    /**
     * State of password data from the uuid
     */
    const [data, setData] = useState<VaultInterface.Password | null>(null);
    /**
     * Get password uuid from url
     */
    const { uuid } = useParams();
    /**
     * Instance of Vault state
     */
    const VaultPasswords = useSelector((state: StoreState) => state.vault._d?.passwords);

    /**
     * On mount
     */
    useEffect(() => {
        /**
         * Try to get password with the uuid
         */
        const password = VaultPasswords ? VaultPasswords![VaultPasswords!.findIndex((i) => i.id === uuid)] : undefined;
        /**
         * Verify if the uuid and password exist
         */
        if (uuid && password) {
            setData(password);
            /**
             * Set document title
             */
            CommonUtils.DocumentTitle(password.title);
        }
    }, [VaultPasswords]);

    if (!data) {
        return <Fragment />;
    }

    /**
     * Render Password Form with the data
     */
    return data && <PasswordForm type='edit' default={data as VaultInterface.Form.Password} password_id={uuid} />;
}
