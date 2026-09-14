import { type ReactElement } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { TbArrowsSort, TbCheck, TbChevronDown } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { SORT_OPTIONS, type SortOption } from '@/constants/Sort';

interface PropsComponent {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: PropsComponent): ReactElement {
    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Render JSX
     */
    return (
        <Listbox value={value} onChange={onChange}>
            <div className={CN.wrapper}>
                <ListboxButton
                    className={CN.button}
                    data-tooltip-id='default-tooltip'
                    data-tooltip-content={t('common:sort_by')}
                    data-tooltip-place='bottom'
                >
                    <span className={CN.button_content}>
                        <TbArrowsSort size={16} className='text-foreground/25' />
                        <span className={CN.selected_title}>{t(`common:sort.${value}`)}</span>
                    </span>
                    <TbChevronDown className={CN.chevron_icon} />
                </ListboxButton>

                <ListboxOptions transition className={CN.options}>
                    {SORT_OPTIONS.map((option) => (
                        <ListboxOption key={option} value={option} className={CN.option}>
                            <span className={CN.option_title}>{t(`common:sort.${option}`)}</span>
                            <span className={CN.check_icon_wrapper}>
                                <TbCheck className={CN.check_icon} />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

const CN = {
    wrapper: 'relative',
    button: 'flex flex-row items-center justify-between w-full cursor-default rounded-lg px-3.5 h-[50px] max-sm:h-[45px] text-left text-foreground/80 outline-1 sm:text-sm/6',
    button_content: 'flex items-center gap-2 truncate',
    selected_title: 'block truncate text-foreground',
    chevron_icon: 'size-5 self-center justify-self-end text-foreground/25 sm:size-4',
    options:
        'absolute z-10 my-2 max-h-56 w-full overflow-auto rounded-md bg-background border hover:border-foreground/8! text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm',
    option: 'group relative cursor-default p-3 text-foreground/50 select-none data-focus:bg-foreground/2 data-focus:text-foreground data-focus:outline-hidden',
    option_title: 'block truncate font-normal group-data-selected:font-semibold group-data-selected:text-foreground',
    check_icon_wrapper:
        'absolute inset-y-0 right-0 flex items-center pr-4 text-foreground group-not-data-selected:hidden group-data-focus:text-foreground',
    check_icon: 'size-5',
};
