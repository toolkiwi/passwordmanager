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
    const checked = value ?? false;

    return (
        <div
            className={`flex flex-row items-center gap-3 border hover:bg-foreground/2 rounded-lg p-2 cursor-pointer select-none ${wrapperClassName ? wrapperClassName : ''}`}
            onClick={() => onChange(!checked)}
        >
            <div className='w-5 h-5 rounded-md border border-foreground/10! flex items-center justify-center cursor-pointer'>
                {checked && <TbCheck className='text-foreground w-3 h-3' />}
            </div>
            <div>
                <div className='text-foreground text-sm'>{title}</div>
                {subtitle && subtitle.length > 0 && <div className='text-foreground/50 text-sm'>{subtitle}</div>}
            </div>
        </div>
    );
}
