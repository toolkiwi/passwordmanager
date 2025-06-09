import type { ReactElement } from 'react';

/**
 * Interface for props components
 */
interface ComponentProps {
    textarea: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    wrapperClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
    rightElement?: ReactElement;
}

/**
 * Styled textarea component used in forms
 * @param {ComponentProps} props
 * @returns {ReactElement}
 */
export default function StyledTextArea(props: ComponentProps): ReactElement {
    return (
        <div className={`${CN.wrapper} ${props.wrapperClassName}`}>
            <textarea
                {...props.textarea}
                className={`${CN.textarea} ${props.textarea.className}`}
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
        'h-full border  rounded-xl group focus-within:bg-foreground/5 focus-within:border-foreground/5! transition flex flex-1 items-center',
    textarea:
        'h-full w-full p-5 outline-0 text-foreground/80 bg-transparent min-h-[65px] max-sm:min-h-[40px]! placeholder:text-foreground/25',
};
