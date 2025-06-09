import { useTranslation } from 'react-i18next';
import { TbArrowLeft } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router';

export default function RenderGoBack() {
    /**
     * Instance of navigate hook
     */
    const navigate = useNavigate();
    /**
     * Instance of location hook
     */
    const location = useLocation();
    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();

    /**
     * Render JSX
     */
    return (
        location.key
        && location.key !== 'default' && (
            <button
                type='button'
                className={CN.goback}
                onClick={() => navigate(-1)}
            >
                <TbArrowLeft size={24} />
                <div className={CN.goback_text}>{t('common:goback')}</div>
            </button>
        )
    );
}

const CN = {
    goback: 'inline-flex flex-row items-center py-4 px-5 -ml-5 my-3 rounded-full hover:bg-neutral-800/35 cursor-pointer select-none max-sm:ml-2',
    goback_text: 'text-lg text-foreground font-semibold ml-3',
};
