import KeyForm from '@/components/keys/KeyForm';
import CommonUtils from '@/utils/commonUtils';
import { useTranslation } from 'react-i18next';

export default function KeyCreate() {
    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();
    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(t('page:titles.create_key'));
    /**
     * Render Form
     */
    return <KeyForm type='create' />;
}
