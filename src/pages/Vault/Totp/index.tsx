import { useSelector } from 'react-redux';
import PageHead from '@/components/PageHead';
import { ReactElement, useState } from 'react';
import ListHeader from '@/components/list/Header';
import { useTranslation } from 'react-i18next';

import type { StoreState } from '@/redux/StoreRedux';
import List from './__partials/List';
import { VaultInterface } from '@/interfaces/VaultInterface';
import CommonUtils from '@/utils/commonUtils';

export default function Index(): ReactElement {
    /**
     * Text search to filter passwords
     */
    const [search, setSearch] = useState<string>('');
    /**
     * Tag filter to filter passwords by tag
     */
    const [filterTag, setFilterTag] = useState<VaultInterface.Tag['id'] | undefined>(undefined);
    /**
     * Get password from vault state
     */
    const DATA = useSelector((state: StoreState) => state.vault._d?.passwords)?.filter((i) => i.totp);
    /**
     * Instance useTranslation hook
     */
    const { t } = useTranslation();

    /**
     * Filter passwords by string
     */
    const SearchFilter =
        DATA?.filter((i) => (filterTag ? i.tag_id === filterTag : true)).filter((i) =>
            [i.title, i.password, i.login, i.note].some((v) => v.toLowerCase().includes(search.trim().toLowerCase())),
        ) || [];
    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(t('page:titles.totp') + ` (${DATA?.length})`);

    /**
     * Render JSX
     */
    return (
        <div className={CN.page_container}>
            <PageHead title={t('page:titles.totp')} />
            <ListHeader onSearch={setSearch} onFilterTag={setFilterTag} filterTag={filterTag} />
            <List data={SearchFilter} />
        </div>
    );
}

/**
 * Custom style classnames object
 */
const CN = {
    page_container: 'page-container',
    header_separator: 'p-5 border-b ',
    header: 'flex flex-row items-center',
};
