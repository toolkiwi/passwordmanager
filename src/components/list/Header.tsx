import React, { useCallback } from 'react';
import StyledInput from '@/components/styled/form/StyledInput';
import StyledButton from '@/components/styled/StyledButton';
import { useNavigate } from 'react-router';
import { HiPlus } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

interface PropsComponent {
    onSearch: React.Dispatch<React.SetStateAction<string>>;
    layout?: 'dashboard';
}

export default function ListHeader({ onSearch, layout }: PropsComponent) {
    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Renders the left-side button
     */
    const RenderLeft = useCallback(() => {
        switch (layout) {
            default:
                return;
            case 'dashboard':
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
    }, [layout, navigate]);

    /**
     * Render Header
     */
    return (
        <div className={CN.container}>
            <div className={CN.header}>
                <RenderLeft />
                <StyledInput
                    input={{
                        placeholder: t('common:search'),
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                            onSearch(e.currentTarget.value),
                    }}
                />
            </div>
        </div>
    );
}

/**
 * Custom style classnames object
 */
const CN = {
    container: 'p-5 border-b border-neutral-900',
    header: 'flex flex-row items-center',
    add_button:
        'h-[50px] aspect-square h-13 items-center justify-center flex mr-2',
};
