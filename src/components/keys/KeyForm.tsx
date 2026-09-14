import { type ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import PageHead from '@/components/PageHead';
import Alert from '@/components/Alert';
import StyledInput from '@/components/styled/form/StyledInput';
import StyledTextArea from '@/components/styled/form/StyledTextArea';
import StyledButton from '@/components/styled/StyledButton';
import { ComboBox } from '@/components/ComboBox';
import TagSelect from '@/components/tags/TagSelect';
import FormCN from '@/styles/CN/FormCN';
import { KEY_FORM_DEFAULT, KEY_TYPES } from '@/constants/Form';
import { addKey, setKey } from '@/redux/features/vaultSlice';
import type { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import type { VaultInterface } from '@/interfaces/VaultInterface';

interface PropsComponent {
    default?: VaultInterface.Form.Key;
    type: 'create' | 'edit';
    key_id?: VaultInterface.Key['id'];
}

export default function KeyForm(props: PropsComponent): ReactElement {
    /**
     * Form default settings
     */
    const FORM_DEFAULT_SETTINGS: VaultInterface.Form.Key = props.default ?? { ...KEY_FORM_DEFAULT };

    /**
     * Boolean state to show an alert message
     */
    const [isCreated, setIsCreated] = useState<boolean>(false);
    /**
     * Form state contains all inputs
     */
    const [form, setForm] = useState<VaultInterface.Form.Key>(FORM_DEFAULT_SETTINGS);
    /**
     * Get tags from vault data state
     */
    const VaultTags = useSelector((state: StoreState) => state.vault._d?.tags);

    /**
     * Disable the save button in the form until all required fields are filled
     */
    const IS_SAVE_BUTTON_DISABLED =
        !form.title.trim()
        || !form.private_key.trim()
        || (props.type === 'edit' && JSON.stringify(form) === JSON.stringify(FORM_DEFAULT_SETTINGS));

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
    const FormFieldUpdate = (field: keyof VaultInterface.Form.Key, value: string) => {
        if (isCreated) setIsCreated(false);
        setForm((state) => {
            return { ...state, [field]: value };
        });
    };

    /**
     * Add the new key to the vault
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
        if (!(form.title.trim().length > 0) || !(form.private_key.trim().length > 0)) return;

        /**
         * Update vault state
         */
        switch (props.type) {
            default:
                dispatch(addKey({ ...form }));
                /**
                 * Update isCreated state and reset form
                 */
                setIsCreated(true);
                handleReset();
                break;
            case 'edit':
                if (!props.key_id) return;
                dispatch(
                    setKey({
                        id: props.key_id,
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
    const handleReset = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        setForm(FORM_DEFAULT_SETTINGS);
    };

    return (
        <div className='page-container'>
            <PageHead
                title={props.type === 'edit' ? FORM_DEFAULT_SETTINGS.title : t('page:titles.create_key')}
                goBack
            />
            <form onSubmit={handleSubmit} onReset={handleReset} className={FormCN.form}>
                <div className={FormCN.container}>
                    {isCreated && (
                        <Alert type='SUCCESS' text={t('alert:key.created')} onClose={() => setIsCreated(false)} />
                    )}

                    {props.type === 'create' && (
                        <div className='py-3'>
                            <p className='text-foreground/25 text-md'>{t('page:keys.create_introduction')}</p>
                        </div>
                    )}

                    <StyledInput
                        input={{
                            placeholder: t('common:title'),
                            onChange: (e) => FormFieldUpdate('title', e.currentTarget.value),
                            value: form.title,
                        }}
                    />

                    <div className={FormCN.input_group}>
                        <label className={clsx(FormCN.label, 'text-xs')}>{t('page:keys.type')}</label>
                        <ComboBox
                            data={KEY_TYPES.map((type) => ({
                                label: t(`page:keys.types.${type.toLowerCase()}`),
                                value: type,
                            }))}
                            placeholder={t('page:keys.type')}
                            currentState={form.type}
                            handleChange={(value) => FormFieldUpdate('type', value)}
                        />
                    </div>

                    <div className='flex flex-row items-center gap-3 max-sm:flex-col! max-sm:gap-5'>
                        <StyledInput
                            input={{
                                placeholder: t('page:keys.host'),
                                onChange: (e) => FormFieldUpdate('host', e.currentTarget.value),
                                value: form.host,
                            }}
                        />
                        <StyledInput
                            input={{
                                placeholder: t('common:login'),
                                onChange: (e) => FormFieldUpdate('username', e.currentTarget.value),
                                value: form.username,
                            }}
                        />
                    </div>

                    <div className={FormCN.input_group}>
                        <label className={clsx(FormCN.label, 'text-xs')}>{t('page:keys.private_key')}</label>
                        <StyledTextArea
                            textarea={{
                                onChange: (e) => FormFieldUpdate('private_key', e.currentTarget.value),
                                value: form.private_key,
                                placeholder: t('page:keys.private_key_placeholder'),
                                rows: 8,
                                className: 'font-mono text-sm max-h-[300px]',
                                spellCheck: false,
                            }}
                        />
                    </div>

                    <div className={FormCN.input_group}>
                        <label className={clsx(FormCN.label, 'text-xs')}>{t('page:keys.public_key')}</label>
                        <StyledTextArea
                            textarea={{
                                onChange: (e) => FormFieldUpdate('public_key', e.currentTarget.value),
                                value: form.public_key,
                                placeholder: t('page:keys.public_key_placeholder'),
                                rows: 4,
                                className: 'font-mono text-sm max-h-[200px]',
                                spellCheck: false,
                            }}
                        />
                    </div>

                    <StyledInput
                        input={{
                            placeholder: t('page:keys.passphrase'),
                            onChange: (e) => FormFieldUpdate('passphrase', e.currentTarget.value),
                            value: form.passphrase,
                        }}
                    />

                    {VaultTags && VaultTags.length > 0 && (
                        <TagSelect
                            value={form.tag_id}
                            onChange={(tag_id: VaultInterface.Tag['id']) => FormFieldUpdate('tag_id', tag_id)}
                        />
                    )}

                    <StyledTextArea
                        textarea={{
                            onChange: (e) => FormFieldUpdate('note', e.currentTarget.value),
                            value: form.note,
                            placeholder: t('common:add_note'),
                            rows: 5,
                            className: 'max-h-[250px]',
                        }}
                    />
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
