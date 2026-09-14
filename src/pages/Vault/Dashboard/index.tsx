import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';
import PageHead from '@/components/PageHead';
import CreateButton from '@/components/CreateButton';
import { useEffect, useState } from 'react';
import ListHeader from '@/components/list/Header';
import ListPasswords from '@/components/list/Passwords';
import { useTranslation } from 'react-i18next';
import CommonUtils from '@/utils/commonUtils';
import { VaultInterface } from '@/interfaces/VaultInterface';
import { SORT_DEFAULT, type SortOption } from '@/constants/Sort';
import { useSearchParams } from 'react-router';

export default function VaultPage() {
    /**
     * Retrieves URL parameters
     * Used to check if the URL contains a `tag_id` parameter
     */
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Text search to filter passwords
     */
    const [search, setSearch] = useState<string>('');

    const [filterTag, setFilterTag] = useState<VaultInterface.Tag['id'] | undefined>(undefined);
    /**
     * Sort option applied to the list
     */
    const [sort, setSort] = useState<SortOption>(SORT_DEFAULT);
    /**
     * Get password from vault state
     */
    const Vault = useSelector((state: StoreState) => state.vault);
    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Filter passwords by string
     */
    const SearchFilter = CommonUtils.sortItems(
        Vault._d?.passwords
            ?.filter((i) => (filterTag ? i.tag_id === filterTag : true))
            .filter((i) =>
                [i.title, i.password, i.login, i.note].some((v) =>
                    v.toLowerCase().includes(search.trim().toLowerCase()),
                ),
            ) || [],
        sort,
    );

    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(t('page:titles.dashboard') + ` (${Vault._d?.passwords?.length})`);

    /**
     * On load, if there is a tag_id in the query parameters, apply filter
     */
    useEffect(() => {
        const tag_id = searchParams.get('tag_id');
        if (tag_id) {
            setFilterTag(tag_id);
        }
    }, []);

    /**
     * When the tag filter changes, update the URL query parameters accordingly
     */
    useEffect(() => {
        if (filterTag) {
            setSearchParams({ tag_id: filterTag });
        } else {
            setSearchParams();
        }
    }, [setFilterTag, filterTag]);

    return (
        <div className={CN.page_container}>
            <PageHead
                title={t('page:titles.dashboard')}
                afterTitle={<CreateButton to='create' label={t('common:add_password')} />}
            />
            <ListHeader
                onSearch={setSearch}
                onFilterTag={setFilterTag}
                filterTag={filterTag}
                onSort={setSort}
                sort={sort}
            />
            <ListPasswords data={SearchFilter} />
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
    unsaved_button:
        'w-9 h-9 flex items-center transition-opacity opacity-60 justify-center bg-yellow-500/10 rounded-full mr-3 border border-yellow-500/25! hover:opacity-100',
};
