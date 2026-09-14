import { type ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PageHead from '@/components/PageHead';
import CreateButton from '@/components/CreateButton';
import ListHeader from '@/components/list/Header';
import KeysList from './__partials/KeysList';
import CommonUtils from '@/utils/commonUtils';
import { SORT_DEFAULT, type SortOption } from '@/constants/Sort';
import type { StoreState } from '@/redux/StoreRedux';
import type { VaultInterface } from '@/interfaces/VaultInterface';

export default function Index(): ReactElement {
    /**
     * Text search to filter keys
     */
    const [search, setSearch] = useState<string>('');
    /**
     * Tag filter to filter keys by tag
     */
    const [filterTag, setFilterTag] = useState<VaultInterface.Tag['id'] | undefined>(undefined);
    /**
     * Sort option applied to the list
     */
    const [sort, setSort] = useState<SortOption>(SORT_DEFAULT);
    /**
     * Get keys from vault state
     */
    const DATA = useSelector((state: StoreState) => state.vault._d?.keys);
    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Filter keys by string
     */
    const SearchFilter = CommonUtils.sortItems(
        DATA?.filter((i) => (filterTag ? i.tag_id === filterTag : true)).filter((i) =>
            [i.title, i.host, i.username, i.note].some((v) => v.toLowerCase().includes(search.trim().toLowerCase())),
        ) || [],
        sort,
    );

    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(t('page:titles.keys') + ` (${DATA?.length ?? 0})`);

    /**
     * Render JSX
     */
    return (
        <div className='page-container'>
            <PageHead
                title={t('page:titles.keys')}
                afterTitle={<CreateButton to='create' label={t('page:titles.create_key')} />}
            />
            <ListHeader
                onSearch={setSearch}
                onFilterTag={setFilterTag}
                filterTag={filterTag}
                onSort={setSort}
                sort={sort}
                searchPlaceholder={t('page:keys.search_placeholder')}
            />
            <KeysList data={SearchFilter} />
        </div>
    );
}
