import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import CopyAction from '@/components/CopyAction';
import CommonUtils from '@/utils/commonUtils';

import { useNavigate } from 'react-router';
import { HiArrowUturnLeft, HiOutlineFolderOpen } from 'react-icons/hi2';

import type { VaultInterface } from '@/interfaces/VaultInterface';
import ActionButton from '../styled/ActionButton';
import { useDispatch } from 'react-redux';
import { StoreDispatch } from '@/redux/StoreRedux';
import { trashRestorePassword } from '@/redux/features/vaultSlice';
import { useTranslation } from 'react-i18next';
import ListCN from '@/styles/CN/ListCN';

/**
 * Interface for component props
 */
interface PropsComponent {
    data: VaultInterface.Password[] | null | undefined;
    layout?: 'dashboard' | 'trash';
}

export default function Passwords({
    data,
    layout = 'dashboard',
}: PropsComponent) {
    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();
    /**
     * Instance of dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Ref for virtualizer
     */
    const parentRef = useRef<HTMLDivElement>(null);

    /**
     * Virtualize row
     */
    const rowVirtualizer = useVirtualizer({
        count: data?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5,
    });

    /**
     * Restore a password from trash
     * @layout trash
     */
    const RestorePassword = (item: VaultInterface.Password) => {
        dispatch(trashRestorePassword(item));
    };

    /**
     * Render when empty or null
     */
    if (!data || data.length === 0) {
        return (
            <div className='flex-1 flex flex-col items-center justify-center mb-[95px]'>
                <div className='w-24 h-24 bg-neutral-950 rounded-full flex items-center justify-center mb-5'>
                    <HiOutlineFolderOpen
                        size={50}
                        className='text-neutral-700'
                    />
                </div>
                <div className='text-lg font-semibold text-neutral-800'>
                    {t('common:password_not_found')}
                </div>
            </div>
        );
    }

    return (
        <div className='relative flex-1'>
            <div
                ref={parentRef}
                className='p-5  overflow-auto flex-1'
                style={{
                    maxHeight: 'calc(100vh - 175px)',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const item = data[virtualRow.index];

                        return (
                            <div
                                role='button'
                                key={virtualRow.key}
                                ref={rowVirtualizer.measureElement}
                                className={ListCN.list_item}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                data-index={'P-' + virtualRow.index}
                                onClick={() =>
                                    layout === 'dashboard'
                                    && navigate('password/' + item.id)
                                }
                            >
                                <div className={ListCN.list_item_content}>
                                    <div className={CN.favicon_container}>
                                        <img
                                            alt='favicon url'
                                            src={CommonUtils.getWebsiteFavicon(
                                                item,
                                            )}
                                            className={CN.favicon}
                                        />
                                    </div>
                                    <div className={ListCN.text_container}>
                                        <div className={ListCN.title}>
                                            {CommonUtils.limitTextLength(
                                                item.title,
                                                35,
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className={CN.login}>
                                                {CommonUtils.limitTextLength(
                                                    item.login,
                                                    35,
                                                )}
                                            </div>
                                            <div className='text-neutral-700 text-lg'>
                                                ·
                                            </div>
                                            <div className='text-[10px] px-1 py-0.5 bg-green-700 rounded-md mr-1 text-white border border-white/20'>
                                                ToolKiwi
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type='button'
                                    className={CN.actions}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {layout === 'dashboard' && (
                                        <CopyAction
                                            value={item.password}
                                            tooltip={t('common:copy_password')}
                                        />
                                    )}
                                    {layout === 'trash' && (
                                        <ActionButton
                                            onClick={() =>
                                                RestorePassword(item)
                                            }
                                            tooltip={{
                                                content: t(
                                                    'common:recover_password',
                                                ),
                                            }}
                                        >
                                            <HiArrowUturnLeft size={18} />
                                        </ActionButton>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/**
 * Custom style classnames object
 */
const CN = {
    login: 'text-neutral-500 text-sm',
    favicon_container:
        'w-12 h-12 flex items-center justify-center bg-black/80 p-2 border-1 border-neutral-900 rounded-lg',
    favicon: 'w-full h-full rounded-md',
    actions: 'flex flex-row items-center gap-5 z-10',
};
