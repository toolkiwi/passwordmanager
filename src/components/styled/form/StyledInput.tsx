import type { ReactElement } from 'react';

/**
 * Interface for props components
 */
interface ComponentProps {
    input: React.InputHTMLAttributes<HTMLInputElement>;
    wrapperClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
    rightElement?: ReactElement;
}

/**
 * Styled input component used in forms
 * @param {ComponentProps} props
 * @returns {ReactElement}
 */
export default function StyledInput(props: ComponentProps): ReactElement {
    return (
        <div className={`${CN.wrapper} ${props.wrapperClassName}`}>
            <input
                {...props.input}
                className={`${CN.input} ${props.input.className}`}
            />
            {props.rightElement && props.rightElement}
        </div>
    );
}

/**
 * Object contains tailwind classes
 */
const CN = {
    wrapper:
        'h-full w-full border rounded-lg group focus-within:bg-foreground/5 focus-within:border-foreground/5! transition flex flex-1 items-center',
    input: 'w-full h-[50px] max-sm:h-[45px] px-3.5 outline-0 text-foreground/80 bg-transparent placeholder:text-foreground/25',
};
