import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import KeyForm from '@/components/keys/KeyForm';
import CommonUtils from '@/utils/commonUtils';
import type { StoreState } from '@/redux/StoreRedux';
import type { VaultInterface } from '@/interfaces/VaultInterface';

export default function Index() {
    /**
     * State of key data from the uuid
     */
    const [data, setData] = useState<VaultInterface.Key | null>(null);
    /**
     * Get key uuid from url
     */
    const { uuid } = useParams();
    /**
     * Instance of Vault state
     */
    const VaultKeys = useSelector((state: StoreState) => state.vault._d?.keys);

    /**
     * On mount
     */
    useEffect(() => {
        /**
         * Try to get the key with the uuid
         */
        const key = VaultKeys?.find((i) => i.id === uuid);
        /**
         * Verify if the uuid and key exist
         */
        if (uuid && key) {
            setData(key);
            /**
             * Set document title
             */
            CommonUtils.DocumentTitle(key.title);
        }
    }, [uuid, VaultKeys]);

    if (!data) {
        return <Fragment />;
    }

    /**
     * Render key form with the data
     */
    return <KeyForm type='edit' default={data as VaultInterface.Form.Key} key_id={uuid} />;
}
