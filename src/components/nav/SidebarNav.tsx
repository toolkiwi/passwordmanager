import {
    LuFileText,
    LuKeyRound,
    LuLogOut,
    LuTags,
    LuTrash2,
} from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import CommonUtils from '@/utils/commonUtils';

import type { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { resetVault } from '@/redux/features/vaultSlice';
import { setUnlocked, setUnsaved } from '@/redux/features/appSlice';
import clsx from 'clsx';
import useIsMobile from '@/hooks/useIsMobile';
import { setShowSidebar } from '@/redux/features/tempSlice';
import { useEffect } from 'react';

export default function SidebarNav() {
    /**
     * Instance of Vault state
     */
    const Vault = useSelector((state: StoreState) => state.vault._d);
    /**
     * Instance of App state
     */
    const App = useSelector((state: StoreState) => state.app);
    /**
     * Instance of Temp state
     */
    const Temp = useSelector((state: StoreState) => state.temp);
    /**
     * Retrieve the app version from the .env file
     */
    const APP_VERSION = import.meta.env.VITE_VERSION;
    /**
     * Instance useIsMobile hook
     */
    const isMobile = useIsMobile();
    /**
     * Instance Dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();
    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();

    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();

    /**
     * On user press logout button
     * Close the current vault
     */
    const handleLogout = () => {
        /**
         * Prompt the user to save the vault if it has unsaved changes
         * If already saved, simply exit
         */
        const ask = App.unsaved
            ? window.confirm(t('common:logout_vault_unsaved'))
            : undefined;
        if (App.unsaved === true && !ask) return;

        dispatch(resetVault());
        dispatch(setUnsaved(false));
        dispatch(setUnlocked(false));
    };

    useEffect(() => {}, []);

    /**
     * Render JSX
     */
    return (
        <>
            <nav
                className={clsx(
                    CN.sidebar,
                    isMobile && !Temp.show_sidebar && '-translate-x-[90px]',
                    isMobile && Temp.show_sidebar && 'translate-x-0',
                )}
            >
                <div className={CN.sidebar_h_wrapper}>
                    <button
                        type='button'
                        className={CN.sidebar_h}
                        onClick={() => {
                            navigate('/vault/settings');
                            dispatch(setShowSidebar(false));
                        }}
                        data-tooltip-id='default-tooltip'
                        data-tooltip-content={Vault?.name}
                        data-tooltip-place='right'
                    >
                        <img
                            alt='Vault icon'
                            src={CommonUtils.VaultIcon(Vault!.logo) ?? ''}
                            className={CN.sidebar_h_img}
                        />
                    </button>
                </div>
                <div className={CN.list}>
                    <NavLink
                        to='/vault/passwords'
                        className={({ isActive }: { isActive: boolean }) =>
                            clsx([
                                CN.list_item,
                                isActive ? CN.list_item_active : '',
                            ])
                        }
                        preventScrollReset
                        data-tooltip-id='default-tooltip'
                        data-tooltip-content={t('page:titles.dashboard')}
                        data-tooltip-place='right'
                        caseSensitive={true}
                        onClick={() => dispatch(setShowSidebar(false))}
                    >
                        <LuKeyRound className={CN.list_item_icon} size={18} />
                    </NavLink>
                    <NavLink
                        className={({ isActive }: { isActive: boolean }) =>
                            clsx([
                                CN.list_item,
                                isActive ? CN.list_item_active : '',
                            ])
                        }
                        to='/vault/tags'
                        data-tooltip-id='default-tooltip'
                        data-tooltip-place='right'
                        data-tooltip-content={t('page:titles.tags')}
                        onClick={() => dispatch(setShowSidebar(false))}
                    >
                        <LuTags className={CN.list_item_icon} size={18} />
                    </NavLink>
                    <NavLink
                        className={({ isActive }: { isActive: boolean }) =>
                            clsx([
                                CN.list_item,
                                isActive ? CN.list_item_active : '',
                            ])
                        }
                        to='/vault/trash'
                        data-tooltip-id='default-tooltip'
                        data-tooltip-content={t('page:titles.trash')}
                        data-tooltip-place='right'
                        onClick={() => dispatch(setShowSidebar(false))}
                    >
                        <LuTrash2 className={CN.list_item_icon} size={18} />
                    </NavLink>
                </div>
                <div className={CN.list_item_bottom}>
                    <button
                        type='button'
                        className={CN.list_item}
                        onClick={() => handleLogout()}
                        data-tooltip-id='default-tooltip'
                        data-tooltip-content={t('common:close_vault')}
                        data-tooltip-place='right'
                    >
                        <LuLogOut className={CN.list_item_icon} size={18} />
                    </button>
                </div>
                <a
                    className={CN.footer_version}
                    href={import.meta.env.VITE_CHANGELOG_URL}
                    target='_blank'
                    rel='noreferrer'
                >
                    <LuFileText size={10} />
                    <div className={CN.footer_version_text}>{APP_VERSION}</div>
                </a>
            </nav>
            {isMobile && Temp.show_sidebar && (
                <div
                    className='absolute top-0 left-0 w-full h-full bg-black/90 z-50'
                    onClick={() => dispatch(setShowSidebar(false))}
                />
            )}
        </>
    );
}

/**
 * Classnames object
 */
const CN = {
    sidebar:
        'w-[90px] h-full relative flex flex-col top-0 border-r border-solid border-neutral-900 max-sm:absolute top-0 left-0 z-100 bg-background transition-transform duration-250',
    sidebar_h_wrapper:
        'h-[80px] flex items-center justify-center border-b  mb-5',
    sidebar_h:
        'self-center flex items-center justify-center w-13 h-13 rounded-2xl cursor-pointer hover:brightness-[125%] border-1  p-1 rounded-2xl overflow-hidden my-5',
    sidebar_h_img: 'w-full h-full rounded-xl bg-foreground/5',
    list: 'w-full flex flex-col items-center flex-1 gap-5',
    list_item:
        'w-12 h-12 rounded-xl hover:bg-foreground/5 cursor-pointer flex flex-row items-center justify-center border border-foreground/5! transition-all group',
    list_item_active: 'bg-foreground/10! border-foreground/10!',
    list_item_icon: 'text-foreground/80 group-hover:text-foreground',
    list_item_warning:
        ' !border-orange-500/50 !bg-orange-500/25 hover:!border-orange-500 hover:!bg-orange-500/40 active:!bg-orange-500/50',
    list_item_warning_icon: ' !text-orange-500',
    list_item_bottom: 'w-full flex flex-col items-center mb-5 gap-5',
    footer_version:
        'flex flex-row items-center gap-[2px] justify-center bg-foreground/1 border-t  p-1 transition-all hover:text-white hover:bg-foreground/3 text-foreground/20 cursor-pointer',
    footer_version_text: 'text-[11px] text-center',
};
