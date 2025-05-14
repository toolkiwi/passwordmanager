import { ReactElement, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import CopyAction from '@/components/CopyAction';
import CommonUtils from '@/utils/commonUtils';

import { useNavigate } from 'react-router';
import { HiArrowUturnLeft } from 'react-icons/hi2';

import type { VaultInterface } from '@/interfaces/VaultInterface';
import ActionButton from '../styled/ActionButton';
import { useDispatch } from 'react-redux';
import { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import { trashRestorePassword } from '@/redux/features/vaultSlice';
import { useTranslation } from 'react-i18next';
import ListCN from '@/styles/CN/ListCN';
import FormCN from '@/styles/CN/FormCN';
import EmptyList from './EmptyList';
import { useSelector } from 'react-redux';

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
     * Get tags from vault state data
     */
    const Tags = useSelector((state: StoreState) => state.vault._d?.tags);

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
        estimateSize: () => 115,
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
     * Renders a small colored badge on the password element if it has an associated tag.
     *
     * @param {Object} props - Component props
     * @param {VaultInterface.Password} props.password - The password object
     * @returns {JSX.Element | undefined}
     */
    const RenderPasswordTag = ({
        password,
    }: {
        password: VaultInterface.Password;
    }): ReactElement | undefined => {
        /**
         *  Return nothing if Tags array is unavailable or the password has no tag ID
         */
        if (!Tags || !password.tag_id) return;
        /**
         * Get the object tag from the tags state
         */
        const Tag = Tags[Tags.findIndex((i) => i.id === password.tag_id)];
        /**
         * Render a colored circle based on the tag's color, positioned at the bottom-right
         */
        return (
            <button
                type='button'
                className={CN.tag_wrapper}
                data-tooltip-content={Tag.title}
                data-tooltip-delay-show={150}
                data-tooltip-offset={3}
                data-tooltip-id='default-tooltip'
            >
                <div
                    className={CN.tag}
                    style={{
                        backgroundColor: Tag.color,
                    }}
                />
            </button>
        );
    };

    /**
     * Render when empty or null
     */
    if (!data || data.length === 0) {
        return <EmptyList title={t('common:password_not_found')} />;
    }

    return (
        <div className={ListCN.container}>
            <div ref={parentRef} className={ListCN.wrapper}>
                <div
                    className={ListCN.rows_virtualizer}
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
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
                                    layout === 'dashboard' && navigate(item.id)
                                }
                            >
                                <div className={ListCN.list_item_content}>
                                    <div className={FormCN.favicon_container}>
                                        <img
                                            alt='favicon url'
                                            src={CommonUtils.getWebsiteFavicon(
                                                item,
                                            )}
                                            className={FormCN.favicon}
                                        />
                                        <RenderPasswordTag password={item} />
                                    </div>
                                    <div className={ListCN.text_container}>
                                        <div className={ListCN.title}>
                                            {CommonUtils.limitTextLength(
                                                item.title,
                                                35,
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className={FormCN.sub_label}>
                                                {CommonUtils.limitTextLength(
                                                    item.login,
                                                    35,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type='button'
                                    className={ListCN.actions}
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

const CN = {
    tag_wrapper: 'absolute -bottom-0.5 -right-0.5',
    tag: 'w-4 h-4 rounded-full border-3 border-black transition-all hover:scale-120',
};
