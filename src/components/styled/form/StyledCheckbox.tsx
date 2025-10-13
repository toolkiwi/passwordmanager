import React from 'react';
import { TbCheck } from 'react-icons/tb';

export default function StyledCheckbox({
    title,
    subtitle,
    onChange,
    value,
    wrapperClassName,
}: {
    title: string;
    subtitle?: string;
    onChange: (checked: boolean) => void;
    value?: boolean;
    wrapperClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
}): React.ReactElement {
    const [checked, setChecked] = React.useState(value ?? false);
    const [initialized, setInitialized] = React.useState(false);

    /**
     * Callback when checked state changes
     * Only call onChange if component is initialized to avoid calling onChange on mount
     */
    React.useEffect(() => {
        if (initialized) {
            onChange(checked);
        } else {
            setInitialized(true);
        }
    }, [checked, initialized, onChange]);

    /**
     * Update checked state when value prop changes
     */
    React.useEffect(() => {
        if (value !== undefined) {
            setChecked(value);
        }
    }, [value]);

    return (
        <div
            className={`flex flex-row items-center gap-3 border hover:bg-foreground/2 rounded-lg p-2 cursor-pointer select-none ${wrapperClassName ? wrapperClassName : ''}`}
            onClick={() => setChecked(!checked)}
        >
            <div className='w-5 h-5 rounded-md border border-foreground/10! flex items-center justify-center cursor-pointer'>
                {checked && <TbCheck className='text-foreground w-3 h-3' />}
            </div>
            <div>
                <div className='text-foreground text-sm'>{title}</div>
                {subtitle && subtitle.length > 0 && (
                    <div className='text-foreground/50 text-sm'>{subtitle}</div>
                )}
            </div>
        </div>
    );
}
