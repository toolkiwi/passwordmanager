import { TAG_COLORS } from '@/constants/TagColors';
import CommonUtils from '@/utils/commonUtils';
import { ReactElement } from 'react';
import { TbColorSwatch } from 'react-icons/tb';

export default function TagColorPickerCustomColor({
    customColor,
    handleColorChange,
}: {
    customColor: string;
    handleColorChange: (color: string) => void;
}): ReactElement {
    /**
     * Determine if it is a custom color
     */
    const isSelected =
        !TAG_COLORS.includes(customColor) && customColor.length > 0;
    /**
     * Render JSX
     */
    return (
        <div
            className={CN.customColorPicker}
            style={{
                borderColor: isSelected ? customColor : 'rgba(255,255,255,.1)',
                opacity: isSelected ? 1 : 0.65,
            }}
        >
            <input
                type='color'
                value={customColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleColorChange(e.currentTarget.value)
                }
                className={CN.colorInput}
            />
            <div
                className={CN.colorInner}
                style={{
                    backgroundColor: isSelected
                        ? customColor
                        : 'rgba(255,255,255,.05)',
                    color:
                        isSelected && CommonUtils.isColorLight(customColor)
                            ? '#000'
                            : '#fff',
                }}
            >
                <TbColorSwatch size={20} />
            </div>
        </div>
    );
}

const CN = {
    colorInner: 'w-full h-full rounded-full flex items-center justify-center',
    customColorPicker:
        'relative w-10 h-10 rounded-full border-2 p-1 cursor-pointer hover:opacity-100! overflow-hidden',
    colorInput: 'w-full h-full opacity-0 absolute',
};
