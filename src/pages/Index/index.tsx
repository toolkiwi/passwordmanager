import { useEffect, useState } from 'react';
import { UnlockVault } from './UnlockPage';
import { CreateVault } from './CreatePage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';

export default function IndexPage() {
    /**
     * Page state
     * Unlock Vault or Create Vault
     */
    const [page, setPage] = useState<0 | 1>(0);
    /**
     * Get vault state
     */
    const Vault = useSelector((state: StoreState) => state.vault);
    /**
     * Instance of navigation hook
     */
    const navigate = useNavigate();
    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * If a vault is set, redirect the user
     */
    useEffect(() => {
        if (Vault._d) {
            navigate('/vault/passwords', { replace: true });
        }
    }, []);

    /**
     * Render page
     */
    return (
        <main className={CN.main}>
            <div className={CN.container}>
                <h1 className={CN.title}>
                    <b>Tool</b>Kiwi
                </h1>
                <h2 className={CN.subtitle}>
                    {t('page:index.password_manager')}
                </h2>
                <div className={CN.tabs_wrapper}>
                    <div
                        className={`${CN.tab} ${page === 0 ? CN.active_tab : ''}`}
                        onClick={() => setPage(0)}
                    >
                        {t('common:unlock')}
                    </div>
                    <div
                        className={`${CN.tab} ${page === 1 ? CN.active_tab : ''}`}
                        onClick={() => setPage(1)}
                    >
                        {t('page:index.create_vault')}
                    </div>
                </div>
                <div className={CN.content_wrapper}>
                    {page === 0 ? <UnlockVault /> : <CreateVault />}
                </div>
            </div>
            <div className={CN.footer}>
                <p className={CN.footer_text}>
                    Powered by{' '}
                    <span className={CN.footer_strong}>ToolKiwi</span>
                </p>
                <p className={CN.footer_text}>
                    © {new Date().getFullYear()}.{' '}
                    {t('page:index.rights_reserved')}
                </p>
            </div>
        </main>
    );
}

const CN = {
    main: 'relative h-full items-center flex flex-col justify-center max-w-[450px] m-auto',
    container: 'w-full mb-5',
    title: 'text-4xl text-white text-center',
    subtitle: 'text-2xl text-white mt-2 text-center',
    tabs_wrapper:
        'mt-8 border border-neutral-900 rounded-lg flex flex-row items-center p-2 ',
    tab: 'flex-1 text-white p-3 text-center rounded-md cursor-pointer',
    active_tab: 'bg-neutral-900',
    content_wrapper: 'mt-10 w-full',
    footer: 'mt-5',
    footer_text: 'text-[12px] font-semibold text-white/20 text-center',
    footer_strong: 'font-bold text-neutral-600',
};
