import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import type { StoreState } from '@/redux/StoreRedux';
import { Fragment, useEffect, useState } from 'react';
import { VaultInterface } from '@/interfaces/VaultInterface';
import CommonUtils from '@/utils/commonUtils';
import TagForm from '@/components/tags/TagForm';

export default function Index() {
    /**
     * State of tag data from the uuid
     */
    const [data, setData] = useState<VaultInterface.Tag | null>(null);
    /**
     * Get tag uuid from url
     */
    const { uuid } = useParams();
    /**
     * Instance of Vault state
     */
    const VaultTags = useSelector((state: StoreState) => state.vault._d?.tags);

    /**
     * On mount
     */
    useEffect(() => {
        /**
         * Try to get tag with the uuid
         */
        const tag = VaultTags ? VaultTags![VaultTags!.findIndex((i) => i.id === uuid)] : undefined;
        /**
         * Verify if the uuid and tag exist
         */
        if (uuid && tag) {
            setData(tag);
            /**
             * Set document title
             */
            CommonUtils.DocumentTitle(tag.title);
        }
    }, [VaultTags]);

    if (!data) {
        return <Fragment />;
    }
    /**
     * Render tag Form with the data
     */
    return data && <TagForm type='edit' default={data} tag_id={uuid} />;
}
