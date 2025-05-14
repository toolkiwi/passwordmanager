import { TAG_COLORS } from '@/constants/TagColors';
import { TagFormInterface } from '@/interfaces/TagFormInterface';
import { ReactElement, useState } from 'react';
import TagColorPickercolor from './TagColorPickerCustomColor';

export default function ColorPicker({
    FormFieldUpdate,
    form,
}: TagFormInterface.ColorPicker): ReactElement {
    /**
     * Color choosed state
     */
    const [color, setColor] = useState(form.color!);

    /**
     * Update color state
     * @param {string} color
     */
    const handleColorChange = (color: string) => {
        setColor(color);
        FormFieldUpdate('color', color);
    };

    /**
     * Render JSX
     */
    return (
        <div className={CN.wrapper}>
            <TagColorPickercolor
                customColor={color}
                handleColorChange={handleColorChange}
            />
            {TAG_COLORS.map((color, index) => {
                const isSelected = form.color === color;
                return (
                    <div
                        role='button'
                        key={index}
                        className={CN.colorOption}
                        onClick={() => handleColorChange(color)}
                        style={{
                            borderColor: isSelected
                                ? color
                                : 'rgba(255,255,255,.1)',
                            opacity: isSelected ? 1 : 0.65,
                        }}
                    >
                        <div
                            className={CN.colorInner}
                            style={{ backgroundColor: color }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

const CN = {
    wrapper:
        'mt-3 p-5 bg-neutral-950 rounded-lg border border-neutral-800 flex flex-row items-center flex-wrap gap-3 place-content-center',
    colorOption:
        'w-10 h-10 rounded-full border-2 p-1 cursor-pointer transition-all hover:opacity-100!',
    colorInner: 'w-full h-full rounded-full flex items-center justify-center',
};
