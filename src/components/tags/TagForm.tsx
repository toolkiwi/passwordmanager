import { useState } from 'react';
import PageHead from '@/components/PageHead';
import StyledInput from '@/components/styled/form/StyledInput';
import { StoreDispatch } from '@/redux/StoreRedux';
import { useDispatch } from 'react-redux';
import { VaultInterface } from '@/interfaces/VaultInterface';
import StyledButton from '@/components/styled/StyledButton';
import Alert from '@/components/Alert';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { addTag, setTag } from '@/redux/features/vaultSlice';
import { TagFormInterface } from '@/interfaces/TagFormInterface';
import ColorPicker from '@/components/tags/TagColorPicker';
import FormCN from '@/styles/CN/FormCN';
import ListCN from '@/styles/CN/ListCN';

interface PropsComponent {
    default?: VaultInterface.Form.Tag;
    type: 'create' | 'edit';
    tag_id?: VaultInterface.Tag['id'];
}

export default function TagForm(props: PropsComponent) {
    /**
     * Form default settings
     */
    const FORM_DEFAULT_SETTINGS: VaultInterface.Form.Tag = props.default ?? {
        title: '',
        color: '',
    };

    /**
     * Boolean state to show an alert message
     */
    const [isCreated, setIsCreated] = useState<boolean>(false);
    /**
     * Form state contains all inputs
     */
    const [form, setForm] = useState<VaultInterface.Form.Tag>(FORM_DEFAULT_SETTINGS);

    /**
     * Disable the save button in the form until all required fields are filled
     */
    const IS_SAVE_BUTTON_DISABLED =
        props.type === 'create'
            ? !form.title || !form.color
            : !form.title || !form.color || JSON.stringify(form) == JSON.stringify(FORM_DEFAULT_SETTINGS);

    /**
     * Instance of dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();

    /**
     * Update a field of form state
     */
    const FormFieldUpdate = (
        field: TagFormInterface.FormFieldUpdate['field'],
        value: TagFormInterface.FormFieldUpdate['value'],
    ): void => {
        if (isCreated) setIsCreated(false);
        setForm((state) => {
            return { ...state, [field]: value };
        });
    };

    /**
     * Add the new password to the vault
     * On submit form
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        /**
         * Prevent sending form
         */
        e.preventDefault();
        /**
         * This fields need to be filled
         */
        if (!(form.title.trim().length > 0) || !(form.color!.trim().length > 0)) return;

        /**
         * Update vault state
         */
        switch (props.type) {
            default:
                dispatch(addTag({ ...form }));
                setIsCreated(true);
                setForm(FORM_DEFAULT_SETTINGS);
                break;
            case 'edit':
                if (!props.tag_id) return;
                dispatch(
                    setTag({
                        id: props.tag_id,
                        data: { ...form },
                    }),
                );
                navigate(-1);
                break;
        }
    };

    /**
     * Set default form on reset
     */
    const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setForm(FORM_DEFAULT_SETTINGS);
    };

    return (
        <div className='page-container'>
            <PageHead title={props.type === 'edit' ? FORM_DEFAULT_SETTINGS.title : t('page:tags.create_tag')} goBack />
            <form onSubmit={handleSubmit} onReset={handleReset} className={FormCN.form}>
                <div className={FormCN.container}>
                    {isCreated && (
                        <Alert type='SUCCESS' text={t('alert:tag_created')} onClose={() => setIsCreated(false)} />
                    )}

                    {props.type === 'create' && (
                        <div className='py-3'>
                            <p className={ListCN.sub_title}>{t('page:tags.create_introduction')}</p>
                        </div>
                    )}

                    <StyledInput
                        input={{
                            placeholder: t('common:title'),
                            onChange: (e) => FormFieldUpdate('title', e.currentTarget.value),
                            value: form.title,
                        }}
                    />

                    <ColorPicker form={form} FormFieldUpdate={FormFieldUpdate} />
                </div>
                <div className={FormCN.footer}>
                    <StyledButton
                        button={{
                            type: 'reset',
                            className: 'p-3 w-full max-sm:order-1',
                        }}
                        variant='secondary'
                    >
                        {t('common:reset')}
                    </StyledButton>
                    <StyledButton
                        button={{
                            type: 'submit',
                            className: 'p-3 w-full max-sm:order-0',
                        }}
                        disabled={IS_SAVE_BUTTON_DISABLED}
                    >
                        {t('common:save')}
                    </StyledButton>
                </div>
            </form>
        </div>
    );
}
