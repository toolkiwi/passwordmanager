import {
    TbInfoCircleFilled,
    TbAlertHexagonFilled,
    TbCircleCheckFilled,
    TbX,
} from 'react-icons/tb';
import clsx from 'clsx';

/**
 * Interface for props components
 */
interface ComponentProps {
    type?: 'DEFAULT' | 'SUCCESS' | 'ERROR' | 'WARNING';
    noRounded?: boolean;
    text: string;
    onClose?: () => void;
}

export default function Alert({
    type = 'DEFAULT',
    noRounded,
    text,
    onClose,
}: ComponentProps) {
    /**
     * Custom colors
     */
    const TYPE_COLOR =
        {
            DEFAULT: 'white',
            SUCCESS: 'green',
            ERROR: 'red',
            WARNING: 'orange',
        }[type] || 'white';

    /**
     * Custom icons by type of alert
     */
    const TYPE_ICON = {
        DEFAULT: (
            <TbInfoCircleFilled
                size={22}
                className={`text-${TYPE_COLOR}-500`}
            />
        ),
        SUCCESS: (
            <TbCircleCheckFilled
                size={22}
                className={`text-${TYPE_COLOR}-500`}
            />
        ),
        ERROR: (
            <TbAlertHexagonFilled
                size={22}
                className={`text-${TYPE_COLOR}-500`}
            />
        ),
        WARNING: (
            <TbAlertHexagonFilled
                size={22}
                className={`text-${TYPE_COLOR}-500`}
            />
        ),
    };

    return (
        <div
            className={clsx(CN.wrapper, {
                'bg-white/5': type === 'DEFAULT',
                'bg-green-500/5': type === 'SUCCESS',
                'bg-red-500/5': type === 'ERROR',
                'bg-orange-500/5': type === 'WARNING',
                'rounded-xl': !noRounded,
            })}
        >
            <div
                className={clsx(CN.icon, {
                    'bg-white/25 text-white': type === 'DEFAULT',
                    'bg-green-500/25 text-green-500': type === 'SUCCESS',
                    'bg-red-500/25 text-red-500': type === 'ERROR',
                    'bg-orange-500/25 text-orange-500': type === 'WARNING',
                })}
            >
                {TYPE_ICON[type]}
            </div>
            <div
                className={clsx(CN.text, {
                    'text-white': type === 'DEFAULT',
                    'text-green-500': type === 'SUCCESS',
                    'text-red-500': type === 'ERROR',
                    'text-orange-500': type === 'WARNING',
                })}
            >
                {text}
            </div>
            {onClose && (
                <button
                    type='button'
                    onClick={onClose}
                    className={clsx(CN.close, {
                        'text-white hover:bg-white/10': type === 'DEFAULT',
                        'text-green-500 hover:bg-green-500/10':
                            type === 'SUCCESS',
                        'text-red-500 hover:bg-red-500/10': type === 'ERROR',
                        'text-orange-500 hover:bg-orange-500/10':
                            type === 'WARNING',
                    })}
                >
                    <TbX size={18} />
                </button>
            )}
        </div>
    );
}

const CN = {
    wrapper: 'p-4 flex flex-row items-center',
    icon: 'w-9 h-9 rounded-full flex items-center justify-center',
    text: 'font-semibold ml-3 text-md flex-1',
    close: 'w-8 h-8 flex items-center justify-center rounded-full cursor-pointer',
};
