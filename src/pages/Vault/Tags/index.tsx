import EmptyList from '@/components/list/EmptyList';
import ListHeader from '@/components/list/Header';
import PageHead from '@/components/PageHead';
import { StoreState } from '@/redux/StoreRedux';

import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import TagsList from './__partials/TagsList';
import CommonUtils from '@/utils/commonUtils';

export default function Index(): ReactElement {
    /**
     * Get Vault State
     */
    const Vault = useSelector((state: StoreState) => state.vault._d);
    /**
     * Search state
     */
    const [search, setSearch] = useState<string>('');
    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();

    /**
     * Filter passwords by string
     */
    const SearchFilter =
        Vault?.tags?.filter((i) =>
            [i.title, i.color].some((v) =>
                v.toLowerCase().includes(search.trim().toLowerCase()),
            ),
        ) || [];

    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(
        t('page:titles.tags') + ` (${Vault?.tags?.length})`,
    );

    return (
        <div className='page-container'>
            <PageHead title={t('page:titles.tags')} />
            <ListHeader
                onSearch={setSearch}
                layout='tags'
                searchPlaceholder={t('page:tags.search_placeholder')}
            />
            {!SearchFilter || SearchFilter.length === 0 ? (
                <EmptyList title={t('common:tag_not_found')} />
            ) : (
                <TagsList SearchFilter={SearchFilter} />
            )}
        </div>
    );
}
