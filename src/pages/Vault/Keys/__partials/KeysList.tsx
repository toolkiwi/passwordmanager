import { type ReactElement, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TbKey } from 'react-icons/tb';

import CopyAction from '@/components/CopyAction';
import EmptyList from '@/components/list/EmptyList';
import useIsMobile from '@/hooks/useIsMobile';
import CommonUtils from '@/utils/commonUtils';
import ListCN from '@/styles/CN/ListCN';
import FormCN from '@/styles/CN/FormCN';
import type { StoreState } from '@/redux/StoreRedux';
import type { VaultInterface } from '@/interfaces/VaultInterface';

interface PropsComponent {
    data: VaultInterface.Key[] | null | undefined;
}

export default function KeysList({ data }: PropsComponent): ReactElement {
    /**
     * Get tags from vault state data
     */
    const Tags = useSelector((state: StoreState) => state.vault._d?.tags);
    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();
    /**
     * Instance translation hook
     */
    const { t } = useTranslation();
    /**
     * Instance of useIsMobile hook
     */
    const isMobile = useIsMobile();
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
        estimateSize: () => (isMobile ? 85 : 100),
        gap: isMobile ? 10 : 15,
        overscan: 5,
    });

    /**
     * Build the subtitle with the key type and its target
     */
    const KeySubtitle = (item: VaultInterface.Key): string => {
        const target = [item.username, item.host].filter((value) => value.trim().length > 0).join('@');
        return target.length > 0 ? `${item.type} • ${target}` : item.type;
    };

    /**
     * Renders a small colored badge on the key element if it has an associated tag
     */
    const RenderKeyTag = ({ keyItem }: { keyItem: VaultInterface.Key }): ReactElement | undefined => {
        if (!Tags || !keyItem.tag_id) return;

        const Tag = Tags[Tags.findIndex((i) => i.id === keyItem.tag_id)];
        if (!Tag) return;

        return (
            <button
                type='button'
                className={CN.tag_wrapper}
                data-tooltip-content={Tag.title}
                data-tooltip-delay-show={150}
                data-tooltip-offset={3}
                data-tooltip-id='default-tooltip'
            >
                <div className={CN.tag} style={{ backgroundColor: Tag.color }} />
            </button>
        );
    };

    /**
     * Re-measure row sizes and update virtualizer when the mobile state changes
     */
    useEffect(() => {
        rowVirtualizer.measure();
    }, [isMobile]);

    /**
     * Render when empty or null
     */
    if (!data || data.length === 0) {
        return <EmptyList title={t('common:key_not_found')} />;
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
                                data-index={item.id}
                                onClick={() => navigate(item.id)}
                            >
                                <div className={ListCN.list_item_content}>
                                    <div className={FormCN.favicon_container}>
                                        <TbKey size={22} className='text-foreground/30' />
                                        <RenderKeyTag keyItem={item} />
                                    </div>
                                    <div className={ListCN.text_container}>
                                        <div className={ListCN.title}>
                                            {CommonUtils.limitTextLength(item.title, 35)}
                                        </div>
                                        <div className='flex items-center'>
                                            <div className={FormCN.sub_label}>
                                                {CommonUtils.limitTextLength(KeySubtitle(item), 35)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type='button' className={ListCN.actions} onClick={(e) => e.stopPropagation()}>
                                    <CopyAction value={item.private_key} tooltip={t('page:keys.copy_private_key')} />
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
