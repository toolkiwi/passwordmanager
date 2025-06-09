import type { ReactElement, ReactNode } from 'react';

/**
 * Interface for props components
 */
interface ComponentProps {
    children: ReactNode;
    onClick?: React.DOMAttributes<HTMLDivElement>['onClick'];
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
    wrapperClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
    tooltip?: {
        content: string;
        place?: React.HTMLAttributes<HTMLDivElement>['data-tooltip-place'];
    };
    variant?: 'default' | 'success' | 'danger';
}

/**
 * Action Button
 * @param {ComponentProps} props
 * @returns {ReactElement}
 */
export default function ActionButton({
    children,
    onClick,
    className = '',
    wrapperClassName = '',
    tooltip,
    variant = 'default',
}: ComponentProps): ReactElement {
    return (
        <div
            data-tooltip-id='default-tooltip'
            data-tooltip-content={tooltip?.content}
            data-tooltip-place={tooltip?.place}
            className={wrapperClassName}
        >
            <div
                role='button'
                className={`${CN.button} ${CN.variants[variant]} ${className}`}
                onClick={onClick}
            >
                {children}
            </div>
        </div>
    );
}

const CN = {
    button: 'w-10 h-10 border flex items-center active:outline-3 outline-white/15 justify-center rounded-md group/copy relative cursor-pointer',
    variants: {
        default:
            'dark:text-neutral-700 hover:bg-foreground/10 hover:border-foreground/5! hover:text-foreground/80!',
        success: 'bg-neutral-800 hover:border-foreground/5! text-foreground',
        danger: 'border-red-600 text-red-600 hover:bg-red-600 hover:border-red-500 hover:text-foreground!',
    },
};
