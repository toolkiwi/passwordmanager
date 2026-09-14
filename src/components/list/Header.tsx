import React, { useCallback } from 'react';
import StyledInput from '@/components/styled/form/StyledInput';
import { useTranslation } from 'react-i18next';
import { VaultInterface } from '@/interfaces/VaultInterface';
import TagSelect from '../tags/TagSelect';
import SortSelect from './SortSelect';
import { SORT_DEFAULT, type SortOption } from '@/constants/Sort';
import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';

interface PropsComponent {
    onSearch: React.Dispatch<React.SetStateAction<string>>;
    onFilterTag?: React.Dispatch<VaultInterface.Tag['id']>;
    filterTag?: VaultInterface.Tag['id'] | undefined;
    onSort?: React.Dispatch<React.SetStateAction<SortOption>>;
    sort?: SortOption;
    searchPlaceholder?: string;
}

export default function ListHeader({
    onSearch,
    onFilterTag,
    filterTag,
    onSort,
    sort,
    searchPlaceholder,
}: PropsComponent) {
    /**
     * Instance vault data
     */
    const Vault = useSelector((state: StoreState) => state.vault._d);
    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Renders the right-side button
     */
    const RenderRight = useCallback(() => {
        /**
         * Show filtertag selector when is props is setup
         */
        if (onFilterTag) {
            return (
                Vault?.tags
                && Vault.tags.length > 0 && (
                    <div className='flex-row items-center w-full sm:flex-[0.5]'>
                        <TagSelect value={filterTag} onChange={(tag) => onFilterTag!(tag)} />
                    </div>
                )
            );
        }
    }, [Vault, onFilterTag, filterTag]);

    /**
     * Renders the sort selector
     */
    const RenderSort = useCallback(() => {
        if (!onSort) return;
        return (
            <div className={CN.sort_wrapper}>
                <SortSelect value={sort ?? SORT_DEFAULT} onChange={onSort} />
            </div>
        );
    }, [onSort, sort]);

    /**
     * Render Header
     */
    return (
        <div className={CN.container}>
            <div className={CN.header}>
                <StyledInput
                    input={{
                        placeholder: searchPlaceholder ?? t('common:search'),
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.currentTarget.value),
                    }}
                />
                <RenderRight />
                <RenderSort />
            </div>
        </div>
    );
}

/**
 * Custom style classnames object
 */
const CN = {
    container: 'p-5 border-b',
    header: 'flex flex-row items-center flex-wrap gap-2',
    sort_wrapper: 'flex-row items-center w-full sm:w-[200px]',
};
