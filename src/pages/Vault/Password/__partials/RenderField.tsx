import CommonUtils from '@/utils/commonUtils';
import clsx from 'clsx';
import { useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TbLink } from 'react-icons/tb';

interface ComponentProps {
    label: string;
    emptyText?: string;
    rightAction?: ReactNode;
    value: string | null | undefined;
    type?: 'url' | 'note'; // For custom style fields
}

export default function RenderField(props: ComponentProps) {
    /**
     * Checks if the value is either null, undefined, or an empty string.
     */
    const isValueEmpty = !props.value || props.value.length === 0;

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Render value by type
     */
    const RenderValue = useCallback(() => {
        switch (props.type) {
            case 'url': {
                const format_value = props.value!.replace(
                    /^(https?:\/\/)?(www\.)?/,
                    '',
                );

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
                    <div className={CN.field_value}>
                        <a
                            href={props.value as string}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='border-b-[3px] pr-1 hover:border-neutral-800 border-transparent hover:text-white hover:bg-neutral inline-flex flex-row items-center gap-1'
                        >
                            <TbLink size={16} />
                            {CommonUtils.limitTextLength(format_value)}
                        </a>
                    </div>
                );
            }
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
            {props.rightAction && !isValueEmpty && (
                <div className='rightaction_wrapper'>{props.rightAction}</div>
            )}
        </div>
    );
}

/**
 * Custon style classnames object
 */
const CN = {
    field: 'p-5 border-b border-neutral-900 flex flex-row items-center',
    field_main: 'flex-1 flex flex-col gap-1.5',
    field_label: 'text-xs uppercase font-semibold text-neutral-500',
    field_value: 'text-neutral-200 font-semibold flex-1',
    field_value_note:
        'text-neutral-400 font-normal! italic whitespace-break-spaces text-wrap',
    field_value_empty: 'text-neutral-600 font-normal!',
    rightaction_wrapper: 'mx-5',
};
