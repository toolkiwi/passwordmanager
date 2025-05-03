import { LuFileText, LuKeyRound, LuLogOut, LuTrash2 } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CommonUtils from '@/utils/commonUtils';

import type { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { resetVault } from '@/redux/features/vaultSlice';
import { setUnlocked, setUnsaved } from '@/redux/features/appSlice';

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

        dispatch(setUnlocked(false));
        dispatch(resetVault());
        dispatch(setUnsaved(false));
    };

    /**
     * Render JSX
     */
    return (
        <nav className={CN.sidebar}>
            <div className={CN.sidebar_h_wrapper}>
                <button
                    type='button'
                    className={CN.sidebar_h}
                    onClick={() => navigate('/vault/settings')}
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
                <button
                    type='button'
                    className={CN.list_item}
                    onClick={() => navigate('/vault')}
                    data-tooltip-id='default-tooltip'
                    data-tooltip-content={t('page:titles.dashboard')}
                >
                    <LuKeyRound className={CN.list_item_icon} size={18} />
                </button>
                <button
                    type='button'
                    className={CN.list_item}
                    onClick={() => navigate('/vault/trash')}
                    data-tooltip-id='default-tooltip'
                    data-tooltip-content={t('page:titles.trash')}
                >
                    <LuTrash2 className={CN.list_item_icon} size={18} />
                </button>
            </div>
            <div className={CN.list_item_bottom}>
                <button
                    type='button'
                    className={CN.list_item}
                    onClick={() => navigate('/changelog')}
                    data-tooltip-id='default-tooltip'
                    data-tooltip-content='Changelog'
                    data-tooltip-place='right'
                >
                    <LuFileText className={CN.list_item_icon} size={18} />
                </button>
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
        </nav>
    );
}

/**
 * Classnames object
 */
const CN = {
    sidebar:
        'w-[90px] h-full relative flex flex-col top-0 border-r border-solid border-neutral-900',
    sidebar_h_wrapper:
        'h-[80px] flex items-center justify-center border-b border-neutral-900 mb-5',
    sidebar_h:
        'self-center flex items-center justify-center w-13 h-13 rounded-2xl cursor-pointer hover:brightness-[125%] border-1 border-neutral-900 p-1 rounded-2xl overflow-hidden my-5',
    sidebar_h_img: 'w-full h-full rounded-xl bg-neutral-950',
    list: 'w-full flex flex-col items-center flex-1 gap-5',
    list_item:
        'w-12 h-12 rounded-xl hover:bg-white/5 active:bg-white/10 cursor-pointer flex flex-row items-center justify-center border border-white/5 transition-all group',
    list_item_icon: 'text-neutral-300 group-hover:text-white',
    list_item_warning:
        ' !border-orange-500/50 !bg-orange-500/25 hover:!border-orange-500 hover:!bg-orange-500/40 active:!bg-orange-500/50',
    list_item_warning_icon: ' !text-orange-500',
    list_item_bottom: 'w-full flex flex-col items-center mb-5 gap-5',
};
