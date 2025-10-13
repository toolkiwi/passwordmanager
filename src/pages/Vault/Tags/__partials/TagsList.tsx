import { type ReactElement, useEffect, useRef } from 'react';
import ActionButton from '@/components/styled/ActionButton';
import { VaultInterface } from '@/interfaces/VaultInterface';
import { deleteTag } from '@/redux/features/vaultSlice';
import ListCN from '@/styles/CN/ListCN';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { StoreDispatch } from '@/redux/StoreRedux';
import { useTranslation } from 'react-i18next';
import useIsMobile from '@/hooks/useIsMobile';

interface PropsComponent {
    SearchFilter: VaultInterface.Tag[];
}
export default function TagsList(props: PropsComponent): ReactElement {
    /**
     * Instance of navigate hook
     */
    const navigate = useNavigate();
    /**
     * Instance of dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();
    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();
    /**
     * Ref for virtualizer
     */
    const parentRef = useRef<HTMLDivElement>(null);
    /**
     * Instance useIsMobile hook
     */
    const isMobile = useIsMobile();

    /**
     * Virtualize Row
     */
    const rowVirtualizer = useVirtualizer({
        count: props.SearchFilter.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => (isMobile ? 100 : 115),
        overscan: 5,
    });

    const handleDeleteTag = (uuid: VaultInterface.Tag['id']) => {
        const ask = window.confirm(t('page:tags.delete_tag'));

        if (ask) {
            dispatch(deleteTag(uuid));
        }

        return;
    };

    /**
     * Re-measure row sizes and update virtualizer when the mobile state changes.
     */
    useEffect(() => {
        rowVirtualizer.measure();
    }, [isMobile]);

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
                        const item = props.SearchFilter[virtualRow.index];

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
                                data-index={'T-' + virtualRow.index}
                                onClick={() => navigate(`/vault/passwords?tag_id=${item.id}`)}
                            >
                                <div className={ListCN.list_item_content}>
                                    <div className={ListCN.favicon_container}>
                                        <div
                                            className={clsx([ListCN.favicon, CN.tag_favicon])}
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                    </div>
                                    <div className={ListCN.text_container}>
                                        <div className={ListCN.title}>{item.title}</div>
                                    </div>
                                </div>
                                <button type='button' className={ListCN.actions} onClick={(e) => e.stopPropagation()}>
                                    <ActionButton onClick={() => navigate(`/vault/tags/${item.id}/edit`)}>
                                        <TbEdit size={18} />
                                    </ActionButton>
                                    <ActionButton onClick={() => handleDeleteTag(item.id)}>
                                        <TbTrash size={18} />
                                    </ActionButton>
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
    tag_favicon: 'rounded-full! border-2 w-[80%]! h-[80%]!',
};
