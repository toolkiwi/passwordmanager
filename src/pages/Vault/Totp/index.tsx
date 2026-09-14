import { useSelector } from 'react-redux';
import PageHead from '@/components/PageHead';
import { ReactElement, useState } from 'react';
import ListHeader from '@/components/list/Header';
import { useTranslation } from 'react-i18next';

import type { StoreState } from '@/redux/StoreRedux';
import List from './__partials/List';
import { VaultInterface } from '@/interfaces/VaultInterface';
import CommonUtils from '@/utils/commonUtils';
import { SORT_DEFAULT, type SortOption } from '@/constants/Sort';

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
     * Sort option applied to the list
     */
    const [sort, setSort] = useState<SortOption>(SORT_DEFAULT);
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
    const SearchFilter = CommonUtils.sortItems(
        DATA?.filter((i) => (filterTag ? i.tag_id === filterTag : true)).filter((i) =>
            [i.title, i.password, i.login, i.note].some((v) => v.toLowerCase().includes(search.trim().toLowerCase())),
        ) || [],
        sort,
    );
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
            <ListHeader
                onSearch={setSearch}
                onFilterTag={setFilterTag}
                filterTag={filterTag}
                onSort={setSort}
                sort={sort}
            />
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
