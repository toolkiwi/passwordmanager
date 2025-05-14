import TagForm from '@/components/tags/TagForm';
import CommonUtils from '@/utils/commonUtils';
import { useTranslation } from 'react-i18next';

export default function TagCreate() {
    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();
    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(t('page:tags.create_tag'));
    /**
     * Render Form
     */
    return <TagForm type='create' />;
}
