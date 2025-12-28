import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LuKeyRound, LuLock, LuLogOut, LuSave, LuTags, LuTrash2, LuLifeBuoy } from 'react-icons/lu';
import clsx from 'clsx';

import type { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import { resetVault, setUnsaved } from '@/redux/features/vaultSlice';
import { setUnlocked } from '@/redux/features/appSlice';
import { setShowSidebar } from '@/redux/features/tempSlice';
import useIsMobile from '@/hooks/useIsMobile';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import CommonUtils from '@/utils/commonUtils';
import StyledButton from '../styled/StyledButton';
import FileUtils from '@/utils/fileUtils';
import { TbDatabaseExclamation } from 'react-icons/tb';

/**
 * Navigation items for the sidebar
 */
const NAV_ITEMS = [
    {
        to: '/vault/passwords',
        icon: LuKeyRound,
        translationKey: 'page:titles.dashboard',
    },
    {
        to: '/vault/tags',
        icon: LuTags,
        translationKey: 'page:titles.tags',
    },
    {
        to: '/vault/totp',
        icon: LuLock,
        translationKey: 'page:titles.totp',
    },
    {
        to: '/vault/trash',
        icon: LuTrash2,
        translationKey: 'page:titles.trash',
    },
] as const;

export default function SidebarNav() {
    /**
     * Instance of Vault state
     */
    const Vault = useSelector((state: StoreState) => state.vault);

    /**
     * Instance of Temp state
     */
    const Temp = useSelector((state: StoreState) => state.temp);

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
     * Instance useIsMobile hook
     */
    const isMobile = useIsMobile();

    /**
     * Instance useOnlineStatus hook
     */
    const isOnline = useOnlineStatus();

    /**
     * State to track if screen is below 900px (but not mobile)
     */
    const [isCompact, setIsCompact] = useState(false);

    /**
     * Retrieve the app version from the .env file
     */
    const APP_VERSION = import.meta.env.VITE_VERSION;

    /**
     * On user press logout button
     * Close the current vault
     */
    const handleLogout = () => {
        /**
         * Prompt the user to save the vault if it has unsaved changes
         * If already saved, simply exit
         */
        const shouldConfirm = Vault._unsaved ? window.confirm(t('common:logout_vault_unsaved')) : true;

        if (!shouldConfirm) return;

        dispatch(resetVault());
        dispatch(setUnlocked(false));
    };

    /**
     * Get className for NavLink component
     */
    const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
        return clsx([
            isCompact ? CN.listItemCompact : CN.listItem,
            isActive && (isCompact ? CN.listItemCompactActive : CN.listItemActive),
        ]);
    };

    /**
     * Get tooltip props for compact mode
     */
    const getTooltipProps = (content: string) => ({
        ...(isCompact && {
            'data-tooltip-id': 'default-tooltip',
            'data-tooltip-content': content,
            'data-tooltip-place': 'right' as const,
        }),
    });

    /**
     * When the user presses the download button,
     * export the vault file.
     */
    const handleDownloadVaultFile = () => {
        if (!Vault) return;
        FileUtils.download(Vault);
        dispatch(setUnsaved(false));
    };

    /**
     * Effect to handle screen resizing for compact mode
     */
    useEffect(() => {
        const handleResize = () => {
            setIsCompact(!isMobile && window.innerWidth <= 900);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    /**
     * Render the vault header section
     */
    const RenderVaultHeader = () => (
        <div
            className={isCompact ? CN.sidebarHeaderWrapperCompact : CN.sidebarHeaderWrapper}
            onClick={() => {
                navigate('/vault/settings');
                dispatch(setShowSidebar(false));
            }}
            data-tooltip-id='default-tooltip'
            data-tooltip-content={Vault._d?.name}
            data-tooltip-place={isCompact ? 'right' : 'bottom'}
        >
            <div
                className={clsx(
                    isCompact
                        ? 'flex flex-col items-center justify-center w-full cursor-pointer'
                        : 'flex flex-row items-center justify-start gap-3 px-5 rounded-xl w-full border hover:bg-foreground/3 cursor-pointer transition-all',
                    isMobile && 'px-0',
                )}
            >
                <div className={CN.sidebarHeaderImage}>
                    <button type='button' className={CN.sidebarImageButton}>
                        <img
                            alt='Vault icon'
                            src={CommonUtils.VaultIcon(Vault._d?.logo ?? '') ?? ''}
                            className={CN.sidebarHeaderImg}
                        />
                    </button>
                </div>
                {!isCompact && <div className={CN.sidebarHeaderVaultName}>{Vault._d?.name}</div>}
            </div>
        </div>
    );
    /**
     * Render feedback button
     */
    const RenderFeedbackButton = () => {
        if (!isOnline) return null;

        return (
            <a
                href='https://bit.ly/4q7dUQL'
                target='_blank'
                rel='noopener noreferrer'
                className={clsx(isCompact ? CN.listItemCompact : CN.listItem)}
                {...getTooltipProps(t('common:feedback'))}
                onClick={() => dispatch(setShowSidebar(false))}
            >
                <LuLifeBuoy
                    className={clsx(
                        CN.listItemIcon,
                        isCompact ? 'text-blue-400!' : 'text-blue-500! group-hover:text-blue-400!',
                    )}
                    size={17}
                />
                {!isCompact && (
                    <span className='truncate text-blue-500 group-hover:text-blue-400'>{t('common:feedback')}</span>
                )}
            </a>
        );
    };

    /**
     * Render navigation items
     */
    const RenderNavItems = () => (
        <div className={isCompact ? CN.listCompact : CN.list}>
            {NAV_ITEMS.map(({ to, icon: Icon, translationKey }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={getNavLinkClassName}
                    preventScrollReset
                    caseSensitive
                    onClick={() => dispatch(setShowSidebar(false))}
                    {...getTooltipProps(t(translationKey))}
                >
                    <Icon className={clsx(CN.listItemIcon, isCompact && 'text-foreground!')} size={16} />
                    {!isCompact && <span>{t(translationKey)}</span>}
                </NavLink>
            ))}
            <RenderFeedbackButton />
        </div>
    );

    /**
     * Render logout button
     */
    const RenderLogoutButton = () => (
        <div className={isCompact ? CN.listItemBottomCompact : CN.listItemBottom}>
            <button
                type='button'
                className={clsx(isCompact ? CN.listItemCompact : CN.listItem, 'border border-neutral-800')}
                onClick={handleLogout}
                {...getTooltipProps(t('common:close_vault'))}
            >
                <LuLogOut className={clsx(CN.listItemIcon, isCompact && 'text-foreground!')} size={16} />
                {!isCompact && <span>{t('common:close_vault')}</span>}
            </button>
        </div>
    );

    /**
     * Render vault save section
     */
    const RenderVaultSave = () => {
        return (
            <div className='flex flex-row items-center justify-center px-5'>
                {Vault._unsaved && !isCompact && (
                    <div
                        className={CN.unsaved_button}
                        data-tooltip-id='default-tooltip'
                        data-tooltip-place='top'
                        data-tooltip-class-name='text-center'
                        data-tooltip-delay-show={0}
                        data-tooltip-html={t('common:vault_unsaved')}
                    >
                        <TbDatabaseExclamation size={18} className='text-yellow-500' />
                    </div>
                )}
                <StyledButton
                    button={{
                        className: isCompact
                            ? 'w-14 h-14 aspect-ratio flex items-center justify-center aspect-square'
                            : 'p-3 max-sm:p-2.5 text-sm flex-1',
                        onClick: () => handleDownloadVaultFile(),
                    }}
                >
                    {!isCompact ? t('common:save_vault') : <LuSave size={18} />}
                </StyledButton>
            </div>
        );
    };
    /**
     * Render footer section
     */
    const RenderFooter = () =>
        !isCompact && (
            <a className={CN.footerVersion} href={import.meta.env.VITE_CHANGELOG_URL} target='_blank' rel='noreferrer'>
                <div className={CN.footerVersionText}>Powered by ToolKiwi - V.{APP_VERSION}</div>
            </a>
        );

    /**
     * Render mobile overlay (when sidebar is open)
     */
    const RenderMobileOverlay = () =>
        isMobile
        && Temp.show_sidebar && (
            <div
                className='absolute top-0 left-0 w-full h-full bg-black/50 z-50'
                onClick={() => dispatch(setShowSidebar(false))}
            />
        );

    /**
     * Render JSX
     */
    return (
        <>
            <nav
                className={clsx(
                    isCompact ? CN.sidebarCompact : CN.sidebar,
                    isMobile && !Temp.show_sidebar && '-translate-x-80',
                    isMobile && Temp.show_sidebar && 'translate-x-0',
                    isMobile && 'bg-background',
                )}
            >
                {RenderVaultHeader()}
                {RenderNavItems()}
                <RenderVaultSave />
                <div className={clsx('w-[80%] h-[1px] bg-neutral-900 my-8 m-auto', isMobile && 'bg-neutral-800!')} />
                {RenderLogoutButton()}
                {RenderFooter()}
            </nav>
            {RenderMobileOverlay()}
        </>
    );
}

/**
 * Classnames object
 */
const CN = {
    /**
     * Sidebar container
     */
    sidebar:
        'w-76 min-w-76 h-full relative flex flex-col top-0 border-solid border-neutral-900 max-sm:absolute top-0 left-0 z-100 transition-transform duration-250 py-5',
    sidebarCompact:
        'w-[90px] min-w-[90px] h-full relative flex flex-col top-0 border-solid border-neutral-900 max-sm:absolute top-0 left-0 z-100 transition-transform duration-250 py-5',
    /**
     * Header style
     */
    sidebarHeaderWrapper: 'flex flex-row items-center justify-start mb-8 px-5',
    sidebarHeaderWrapperCompact: 'flex flex-col items-center justify-center mb-8 px-2',
    sidebarHeaderImage: 'flex items-center justify-center',
    sidebarImageButton:
        'self-center flex items-center justify-center w-13 rounded-2xl cursor-pointer hover:brightness-[125%] border-1 p-1 rounded-2xl overflow-hidden my-3',
    sidebarHeaderImg: 'w-full h-full rounded-xl bg-foreground/5',
    sidebarHeaderVaultName: 'text-center text-foreground/80 truncate font-semibold',
    /**
     * List style
     */
    list: 'w-full flex flex-col items-center flex-1 gap-5 px-5',
    listCompact: 'w-full flex flex-col items-center flex-1 gap-5 px-2',

    listItem:
        'h-14 w-full rounded-xl hover:bg-foreground/5 cursor-pointer flex flex-row items-center justify-start transition-all group gap-2 px-4 text-foreground/80 hover:text-foreground',
    listItemCompact:
        'h-14 w-14 rounded-xl hover:bg-foreground/5 cursor-pointer flex flex-col items-center justify-center transition-all group px-2 text-foreground/80 hover:text-foreground border',
    listItemActive: 'bg-foreground/10! text-foreground!',
    listItemCompactActive: 'bg-foreground/10! text-foreground!',
    listItemIcon: 'text-foreground/20',
    /**
     * Button style
     */
    listItemBottom: 'w-full flex flex-col items-center mb-5 gap-5 px-5',
    listItemBottomCompact: 'w-full flex flex-col items-center mb-5 gap-5 px-2',
    /**
     * Footer style
     */
    footerVersion: 'transition-all hover:text-white text-foreground/20 cursor-pointer',
    footerVersionText: 'text-[11px] text-center uppercase',

    unsaved_button:
        'w-9 h-9 flex items-center transition-opacity opacity-45 justify-center bg-yellow-500/10 rounded-full mr-3 border border-yellow-500/25! hover:opacity-100',
} as const;
