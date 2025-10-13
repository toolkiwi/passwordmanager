import { useCallback, useEffect, useRef, useState } from 'react';
import { TbCheck, TbX } from 'react-icons/tb';
import StyledInput from './styled/form/StyledInput';
import { useTranslation } from 'react-i18next';

export function ComboBox({
    data,
    handleChange,
    currentState,
    isMultiple,
    placeholder,
}: {
    data: { label: string; value: string }[];
    handleChange: (value: string) => void;
    currentState?: string;
    isMultiple?: boolean;
    placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    /**
     * Handles click on each item in the dropdown list
     */
    const handleClickRenderItemList = useCallback(
        (item: { label: string; value: string }) => {
            if (isMultiple) {
                if (selected.includes(item.value)) {
                    setSelected(selected.filter((s) => s !== item.value));
                } else {
                    setSelected([...selected, item.value]);
                }
            } else {
                setSelected([item.value]);
                setShow(false);
                if (inputRef.current) {
                    inputRef.current.blur();
                }
            }
        },
        [selected, isMultiple],
    );

    /**
     * @returns JSX for the selected items list
     */
    const RenderSelectedList = useCallback(() => {
        if (!isMultiple && selected.length === 1) return null;
        return (
            <div className={CN.selected_list}>
                {selected.map((item, index) => {
                    const label = data.find((d) => d.value === item)?.label || item;
                    return (
                        <div key={index} className={CN.selected_item}>
                            <span>{label}</span>
                            <button
                                type='button'
                                className={CN.selected_item_remove}
                                onClick={() => {
                                    setSelected(selected.filter((s) => s !== item));
                                }}
                            >
                                <TbX size={15} />
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    }, [data, selected, isMultiple]);

    /**
     * @returns JSX for each item in the dropdown list
     */
    const RenderItemList = useCallback(
        ({ item }: { item: { label: string; value: string } }) => {
            return (
                <div className={CN.item} onClick={() => handleClickRenderItemList(item)}>
                    <div className={CN.item_icon}>
                        {selected.includes(item.value) && (
                            <div className={CN.item_selected}>
                                <TbCheck className='text-muted' size={14} />
                            </div>
                        )}
                    </div>
                    <div className={CN.item_label}>{item.label}</div>
                </div>
            );
        },
        [selected, isMultiple],
    );

    /**
     * Effect to update the parent component when selected changes
     */
    useEffect(() => {
        if (selected.length > 0) {
            handleChange(isMultiple ? selected.join(',') : selected[0]);
        } else {
            handleChange('');
        }
    }, [selected, isMultiple]);

    /**
     * Initialize selected state from currentState if provided
     */
    useEffect(() => {
        if (currentState && selected.length === 0) {
            const currentValues = currentState
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean);
            setSelected(isMultiple ? currentValues : currentValues.slice(0, 1));
        }
    }, []);

    /**
     * Render JSX
     */
    return (
        <div className={CN.container} onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
            <div>
                <StyledInput
                    inputRef={inputRef}
                    input={{
                        className: CN.input,
                        placeholder: isMultiple
                            ? selected.length > 0
                                ? selected.length + ' selected'
                                : (placeholder ?? t('common:search'))
                            : selected.length === 1
                              ? data.find((d) => d.value === selected[0])?.label || (placeholder ?? t('common:search'))
                              : (placeholder ?? t('common:search')),
                        onChange: (e) => setSearch(e.currentTarget.value),
                        value: search,
                    }}
                />
            </div>
            {show && (
                <div className={CN.dropdown}>
                    <div className={CN.list} onMouseDown={(e) => e.preventDefault()}>
                        {isMultiple && selected.length > 0 && <RenderSelectedList />}

                        {data
                            .filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
                            .map((item, index) => {
                                return <RenderItemList key={index} item={item} />;
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}

const CN = {
    container: 'relative flex-1 flex-1',
    input: 'flex-1',
    dropdown: 'absolute z-10 mt-2 bg-background border  border-foreground/10 rounded-md shadow-lg overflow-hidden',
    list: 'bg-foreground/3 p-2 w-[300px] flex flex-col gap-2',
    selected_list: 'flex flex-row items-center flex-wrap border-b border-foreground/10 pb-2 mb-2',
    selected_item: 'bg-foreground/10 text-foreground px-2 py-1 rounded-md mr-2 mb-2 text-sm flex items-center',
    selected_item_remove: 'ml-2 text-foreground hover:text-foreground/60 cursor-pointer',
    item: 'cursor-pointer flex items-center text-foreground flex-row p-2 cursor-pointer rounded-md  hover:bg-foreground/5!',
    item_selected: 'bg-foreground text-muted w-full h-full flex items-center justify-center rounded-sm',
    item_icon: 'w-5.5 h-5.5 border-2 border-foreground/10! rounded-md relative rounded-md',
    item_label: 'ml-2',
};

export default ComboBox;
