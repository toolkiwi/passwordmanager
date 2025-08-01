import { useEffect, useState } from 'react';
import { UnlockVault } from './UnlockPage';
import { CreateVault } from './CreatePage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';
import RenderFooterLinks from './__partials/RenderFooterLinks';

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
            <RenderFooterLinks />
        </main>
    );
}

const CN = {
    main: 'relative h-full items-center flex flex-col justify-center max-w-[450px] m-auto max-sm:p-4',
    container: 'w-full mb-5',
    title: 'text-4xl text-foreground text-center max-sm:text-3xl',
    subtitle: 'text-2xl text-foreground mt-2 text-center max-sm:text-xl',
    tabs_wrapper:
        'mt-8 border border-neutral-900 rounded-lg flex flex-row items-center p-2 max-sm:mt-4',
    tab: 'flex-1 text-foreground p-3 text-center rounded-md cursor-pointer max-sm:p-2! truncate',
    active_tab: 'bg-foreground/5',
    content_wrapper: 'mt-10 w-full max-sm:mt-5',
    footer: 'mt-5',
    footer_text: 'text-[12px] font-semibold text-foreground/20 text-center',
    footer_strong: 'font-bold text-foreground/25',
};
