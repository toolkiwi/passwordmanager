import { useEffect, useState } from 'react';
import ActionButton from './styled/ActionButton';
import { TbCheck, TbCopy } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';

export default function CopyAction({
    value,
    tooltip,
}: {
    value: string;
    tooltip?: string;
}) {
    /**
     * Coppied state;
     */
    const [coppied, setCoppied] = useState<boolean>(false);
    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();

    /**
     * On user press the Action Button;
     */
    const handleCopy = async (): Promise<void> => {
        setCoppied(true);
        if (navigator.clipboard) {
            /**
             * Clipboard API
             */
            await navigator.clipboard.writeText(value);
        } else {
            /**
             * Old browser method alternative for clipboard
             */
            const textarea: HTMLTextAreaElement =
                document.createElement('textarea');
            textarea.value = value;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        /**
         * Update state;
         */
        setCoppied(true);
    };

    /**
     * On copied state update;
     */
    useEffect(() => {
        /**
         * Timeout variable;
         */
        let Timeout: ReturnType<typeof setTimeout>;

        /**
         * On copied, set timeout to clear it;
         */
        if (coppied) {
            Timeout = setTimeout(() => {
                setCoppied(false);
            }, 1500);
        }

        /**
         * Clear Timeout variable;
         */
        return () => {
            clearTimeout(Timeout);
        };
    }, [coppied, setCoppied]);

    /**
     * Render ActionButton;
     */
    return (
        <ActionButton
            onClick={() => handleCopy()}
            variant={coppied ? 'success' : 'default'}
            tooltip={{
                content: coppied
                    ? t('common:copied')
                    : tooltip
                      ? tooltip
                      : t('common:copy'),
            }}
        >
            {coppied ? <TbCheck size={18} /> : <TbCopy size={18} />}
        </ActionButton>
    );
}
