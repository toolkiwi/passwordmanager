import { useTranslation } from 'react-i18next';
import StyledButton from './styled/StyledButton';
import type React from 'react';

/**
 * All component props
 */
interface PropsComponent {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    subtitle?: string;
    cancelText?: string;
    submitText?: string;
    submitCallback: () => void;
}

export default function Modal(props: PropsComponent) {
    /**
     * On user press cancel button
     */
    function onCancel() {
        props.setShow(false);
    }

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * On user press submit button
     */
    function onSubmit() {
        if (!props.submitCallback) return;
        props.setShow(false);
        props.submitCallback();
    }

    /**
     * Render JSX
     */
    return (
        props.show && (
            <div className={CN.container}>
                <div className={CN.wrapper}>
                    <div className={CN.modal}>
                        <div className={CN.header}>
                            <h2 className={CN.title}>{props.title ?? 'Error'}</h2>
                            {props.subtitle && (
                                <p className='text-md text-foreground/25 text-center'>{props.subtitle}</p>
                            )}
                        </div>
                        <div className={CN.footer}>
                            <StyledButton
                                button={{
                                    className: 'p-3 flex-1',
                                    onClick: onCancel,
                                }}
                                variant='secondary'
                            >
                                {props.cancelText ?? t('common:cancel')}
                            </StyledButton>
                            <StyledButton
                                button={{
                                    className: 'p-3 flex-1',
                                    onClick: onSubmit,
                                }}
                            >
                                {props.submitText ?? t('common:save')}
                            </StyledButton>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

const CN = {
    container: 'absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md flex items-center justify-center',
    wrapper: 'p-5 h-full relative w-full',
    modal: 'flex flex-col h-full w-full',
    header: 'flex-1 justify-center items-center self-center content-center leading-13',
    footer: 'flex flex-row items-center justify-center gap-5',
    title: 'text-2xl font-bold text-foreground text-center',
};
