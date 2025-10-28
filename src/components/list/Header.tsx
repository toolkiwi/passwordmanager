import React, { useCallback } from 'react';
import StyledInput from '@/components/styled/form/StyledInput';
import StyledButton from '@/components/styled/StyledButton';
import { useNavigate } from 'react-router';
import { HiPlus } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { VaultInterface } from '@/interfaces/VaultInterface';
import TagSelect from '../tags/TagSelect';
import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';

interface PropsComponent {
    onSearch: React.Dispatch<React.SetStateAction<string>>;
    onFilterTag?: React.Dispatch<VaultInterface.Tag['id']>;
    filterTag?: VaultInterface.Tag['id'] | undefined;
    searchPlaceholder?: string;
    settings?: ['create'];
}

export default function ListHeader({ onSearch, onFilterTag, filterTag, settings, searchPlaceholder }: PropsComponent) {
    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();
    /**
     * Instance vault data
     */
    const Vault = useSelector((state: StoreState) => state.vault._d);
    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Renders the left-side button
     */
    const RenderLeft = useCallback(() => {
        if (settings?.includes('create')) {
            return (
                <StyledButton
                    variant='secondary'
                    button={{
                        'data-tooltip-content': t('common:add_password'),
                        'data-tooltip-place': 'bottom',
                        className: CN.add_button,
                        onClick: () => navigate('create'),
                    }}
                >
                    <HiPlus size={22} color='inherit' />
                </StyledButton>
            );
        }
    }, [settings, navigate]);

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
    }, [Vault]);

    /**
     * Render Header
     */
    return (
        <div className={CN.container}>
            <div className={CN.header}>
                <RenderLeft />
                <StyledInput
                    input={{
                        placeholder: searchPlaceholder ?? t('common:search'),
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.currentTarget.value),
                    }}
                />
                <RenderRight />
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
    add_button: 'flex items-center justify-center h-13 max-sm:h-[45px] aspect-square',
};
