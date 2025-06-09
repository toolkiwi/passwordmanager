import { useSelector } from 'react-redux';
import PageHead from '@/components/PageHead';
import { useState } from 'react';
import ListHeader from '@/components/list/Header';
import ListPasswords from '@/components/list/Passwords';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { trashClearAll } from '@/redux/features/vaultSlice';

import type { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import StyledButton from '@/components/styled/StyledButton';
import CommonUtils from '@/utils/commonUtils';

export default function TrashPage() {
    /**
     * Text search to filter passwords
     */
    const [search, setSearch] = useState<string>('');

    /**
     * Get password from vault state
     */
    const DATA = useSelector((state: StoreState) => state.vault._d?.trash);
    /**
     * Instance of dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();

    /**
     * Instance useTranslation hook
     */
    const { t } = useTranslation();

    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(t('page:titles.trash') + ` (${DATA?.length})`);

    /**
     * Clear all passwords inside the trash state
     */
    const TrashClearAllPasswords = () => {
        const ask = window.confirm(t('common:trash_confirm'));

        if (ask) {
            dispatch(trashClearAll());
        }

        return;
    };

    /**
     * Filter passwords by string
     */
    const SearchFilter =
        DATA?.filter((i) =>
            [i.title, i.password, i.login, i.note].some((v) =>
                v.toLowerCase().includes(search.trim().toLowerCase()),
            ),
        ) || [];

    return (
        <div className={CN.page_container}>
            <PageHead
                title={t('page:titles.trash')}
                afterTitle={
                    <StyledButton
                        variant='secondary'
                        button={{
                            className: 'p-3 text-sm',
                            onClick: () => TrashClearAllPasswords(),
                        }}
                    >
                        {t('common:clear_trash')}
                    </StyledButton>
                }
            />
            <ListHeader onSearch={setSearch} />
            <ListPasswords data={SearchFilter} layout='trash' />
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
