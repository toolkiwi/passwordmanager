import { StoreState } from '@/redux/StoreRedux';
import CommonUtils from '@/utils/commonUtils';
import clsx from 'clsx';
import { type ReactElement, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TbLink } from 'react-icons/tb';
import { useSelector } from 'react-redux';

interface ComponentProps {
    label: string;
    emptyText?: string;
    rightAction?: ReactNode;
    value: string | null | undefined;
    type?: 'url' | 'note' | 'tag'; // For custom style fields
}

export default function RenderField(props: ComponentProps): ReactElement {
    /**
     * Checks if the value is either null, undefined, or an empty string.
     */
    const isValueEmpty = !props.value || props.value.length === 0;

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Render tag field
     */
    const RenderTag = (): ReactElement | undefined => {
        /**
         * Get tags form vault data
         */
        const VaultTags = useSelector((state: StoreState) => state.vault._d?.tags);

        /**
         * Verifications and TagIndex
         */
        const TagIndex = VaultTags?.findIndex((i) => i.id === props.value);
        if (!VaultTags || TagIndex === undefined || TagIndex === -1) return;

        /**
         * Render JSX
         */
        return (
            <div
                className={clsx([CN.field_value, CN.field_tag])}
                style={{
                    color: VaultTags[TagIndex].color,
                }}
            >
                <div className={CN.field_tag_dot} style={{ backgroundColor: VaultTags[TagIndex].color }} />
                <div
                    className={CN.field_tag_bg}
                    style={{
                        backgroundColor: VaultTags[TagIndex].color,
                        border: VaultTags[TagIndex].color,
                    }}
                />
                <div>{CommonUtils.limitTextLength(VaultTags[TagIndex].title)}</div>
            </div>
        );
    };

    /**
     * Render value by type
     */
    const RenderValue = useCallback(() => {
        switch (props.type) {
            case 'url': {
                const format_value = props.value!.replace(/^(https?:\/\/)?(www\.)?/, '');

                /**
                 * Show empty render
                 */
                if (isValueEmpty) {
                    return (
                        <div
                            className={clsx(CN.field_value, {
                                [CN.field_value_empty]: isValueEmpty,
                            })}
                        >
                            {props.emptyText ?? t('common:empty')}
                        </div>
                    );
                }

                return (
                    <div className={clsx(CN.field_value)}>
                        <a
                            href={props.value as string}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='border-b-[3px] pr-1 hover:border-foreground/5! border-transparent! hover:text-foreground hover:bg-neutral inline-flex flex-row items-center gap-1 max-sm:block truncate!'
                        >
                            <TbLink size={16} className='max-sm:inline-block max-sm:mr-1' />
                            {CommonUtils.limitTextLength(format_value)}
                        </a>
                    </div>
                );
            }

            case 'tag':
                return <RenderTag />;
            default:
                return (
                    <div
                        className={clsx(CN.field_value, {
                            [CN.field_value_empty]: isValueEmpty,
                            [CN.field_value_note]: props.type === 'note',
                        })}
                    >
                        {!isValueEmpty
                            ? props.type !== 'note'
                                ? CommonUtils.limitTextLength(props.value!)
                                : props.value
                            : (props.emptyText ?? t('common:empty'))}
                    </div>
                );
        }
    }, [props.type, props.value]);

    /**
     * Render JSX
     */
    return (
        <div className={CN.field}>
            <div className={CN.field_main}>
                {/* Label for the field */}
                <label className={CN.field_label}>{props.label}</label>
                {/* Field value; displays the value if available, otherwise shows the emptyText or a default message */}
                <RenderValue />
            </div>
            {props.rightAction && !isValueEmpty && <div className={CN.rightaction_wrapper}>{props.rightAction}</div>}
        </div>
    );
}

/**
 * Custon style classnames object
 */
const CN = {
    field: 'p-5 border-b flex flex-row items-center relative max-sm:flex-col w-full max-sm:p-4',
    field_main: 'flex-1 flex flex-col gap-1.5 relative w-full',
    field_label: 'text-xs uppercase font-semibold text-neutral-500 truncate!',
    field_value: 'text-foreground/80 font-semibold flex-1 truncate!',
    field_value_note: 'text-foreground/50 font-normal! italic whitespace-break-spaces text-wrap',
    field_value_empty: 'text-foreground/25! font-normal!',
    field_tag: 'inline-flex flex-row items-center rounded-xl relative w-fit p-1 px-2',
    field_tag_bg: 'absolute w-full h-full top-0 left-0 rounded-lg opacity-10',
    field_tag_dot: 'w-4 h-4 rounded-full border-2 p-1 mr-2 border-white/20',
    rightaction_wrapper: 'mx-5 max-sm:self-start max-sm:mt-2.5 max-sm:mx-0',
};
