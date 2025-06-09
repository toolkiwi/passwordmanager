import { ReactElement, useCallback } from 'react';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { TbCheck, TbChevronDown } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TagFormInterface } from '@/interfaces/TagFormInterface';
import type { VaultInterface } from '@/interfaces/VaultInterface';

export default function TagSelect(
    props: TagFormInterface.Select,
): ReactElement | undefined {
    /**
     * Get all tags from vault data
     */
    const VaultTags = useSelector((state: StoreState) => state.vault._d?.tags);
    /**
     * Hide if user doesn't have tags
     */
    if (!VaultTags) return;
    /**
     * Tag selected
     */

    const Selected =
        VaultTags[VaultTags.findIndex((i) => i.id === props.value)]
        ?? undefined;

    /**
     * Instance translation  hook
     */
    const { t } = useTranslation();

    /**
     * Render the tag selection button
     */
    const RenderTagSelected = useCallback(() => {
        if (!Selected) {
            return (
                <span className={CN.button_content}>
                    <span
                        className={clsx(CN.selected_title, 'text-neutral-600!')}
                    >
                        {t('common:choose_tag')}
                    </span>
                </span>
            );
        }
        return (
            <span className={CN.button_content}>
                <div
                    className={CN.tag_icon}
                    style={{ backgroundColor: Selected.color }}
                />
                <span className={CN.selected_title}>{Selected.title}</span>
            </span>
        );
    }, [Selected]);

    /**
     * Render the list of available tag options
     */
    const RenderTagsOptions = useCallback(() => {
        return VaultTags?.map((tag: VaultInterface.Tag, index: number) => (
            <ListboxOption key={index} value={tag} className={CN.option}>
                <div className={CN.option_content}>
                    <div
                        className={CN.tag_icon}
                        style={{ backgroundColor: tag.color }}
                    />
                    <span className={CN.optio_title}>{tag.title}</span>
                </div>

                <span className={CN.check_icon_wrapper}>
                    <TbCheck className={CN.check_icon} />
                </span>
            </ListboxOption>
        ));
    }, [VaultTags]);

    /**
     * Render JSX
     */
    return (
        <Listbox value={Selected} onChange={(tag) => props.onChange(tag.id)}>
            <div className={CN.wrapper}>
                <ListboxButton className={CN.button}>
                    <RenderTagSelected />
                    <TbChevronDown className={CN.chevron_icon} />
                </ListboxButton>

                <ListboxOptions transition className={CN.options}>
                    <ListboxOption value={String()} className={CN.option}>
                        <div className={CN.option_content}>
                            <div className={CN.tag_icon} />
                            <span className={CN.optio_title}>
                                {t('common:no_tag')}
                            </span>
                        </div>

                        <span className={CN.check_icon_wrapper}>
                            <TbCheck className={CN.check_icon} />
                        </span>
                    </ListboxOption>
                    <RenderTagsOptions />
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

const CN = {
    wrapper: 'relative',
    button: 'flex flex-row items-center justify-between w-full cursor-default grid-cols-1 rounded-lg px-3.5 h-[50px] max-sm:h-[45px] text-left text-gray-900 outline-1 -outline-offset-1 outline-neutral-900 focus:-outline-offset focus:outline-neutral-800 focus:bg-neutral-900 sm:text-sm/6',
    button_content: 'col-start-1 row-start-1 flex items-center gap-2',
    tag_icon: 'w-4 h-4 rounded-full border-2 border-white/10',
    selected_title: 'block truncate text-white',
    chevron_icon:
        'col-start-1 row-start-1 size-5 self-center justify-self-end text-neutral-600 sm:size-4',
    options:
        'absolute z-10 my-2 max-h-56 w-full overflow-auto rounded-md bg-neutral-900 border border-neutral-800 hover:border-neutral-700/65 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm',
    option: 'group relative cursor-default p-3 text-neutral-400 select-none data-focus:bg-neutral-800 data-focus:text-white data-focus:outline-hidden',
    option_content: 'flex items-center',
    optio_title:
        'ml-2 block truncate font-normal group-data-selected:font-semibold group-data-selected:text-white',
    check_icon_wrapper:
        'absolute inset-y-0 right-0 flex items-center pr-4 text-white group-not-data-selected:hidden group-data-focus:text-white',
    check_icon: 'size-5',
};
