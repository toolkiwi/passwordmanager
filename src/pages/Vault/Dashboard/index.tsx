import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';
import PageHead from '@/components/PageHead';
import { useEffect, useState } from 'react';
import ListHeader from '@/components/list/Header';
import ListPasswords from '@/components/list/Passwords';
import { useTranslation } from 'react-i18next';
import CommonUtils from '@/utils/commonUtils';
import { VaultInterface } from '@/interfaces/VaultInterface';
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
    const SearchFilter =
        Vault._d?.passwords
            ?.filter((i) => (filterTag ? i.tag_id === filterTag : true))
            .filter((i) =>
                [i.title, i.password, i.login, i.note].some((v) =>
                    v.toLowerCase().includes(search.trim().toLowerCase()),
                ),
            ) || [];

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
            <PageHead title={t('page:titles.dashboard')} />
            <ListHeader onSearch={setSearch} onFilterTag={setFilterTag} filterTag={filterTag} settings={['create']} />
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
