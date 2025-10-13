import type { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Interface for props components
 */
interface ComponentProps {
    button: React.ButtonHTMLAttributes<HTMLButtonElement>;
    disabled?: boolean;
    children: ReactNode;
    blur?: boolean;
    variant?: 'default' | 'danger' | 'secondary';
}

/**
 * Styled button component
 */
export default function StyledButton({
    button,
    disabled,
    children,
    blur,
    variant = 'default',
}: ComponentProps): ReactElement {
    return (
        <button
            data-tooltip-id='default-tooltip'
            type='button'
            {...button}
            className={clsx(
                CN.button,
                CN.variants[variant],
                button.className,
                { 'opacity-30 pointer-events-none': disabled },
                { 'backdrop-blur-sm': blur },
            )}
        >
            {children}
        </button>
    );
}

/**
 * Object contains tailwind classes
 */
const CN = {
    button: 'cursor-pointer border rounded-lg  active:outline-4',
    variants: {
        default:
            'bg-foreground/2 text-neutral-600 outline-white/20 hover:bg-foreground/5 hover:border-foreground/10! hover:text-neutral-500',
        danger: 'border-foreground/5! text-neutral-600 hover:border-red-900! hover:bg-red-600/10 hover:text-red-500 outline-red-500!',
        secondary: 'border-neutral-900 text-neutral-600 outline-white/5 hover:text-neutral-400 hover:bg-foreground/2',
    },
};
