import { TbArrowsShuffle2 } from 'react-icons/tb';
import { type ReactElement, useState } from 'react';
import ActionButton from '@/components/styled/ActionButton';
import PageHead from '@/components/PageHead';
import StyledInput from '@/components/styled/form/StyledInput';
import StyledTextArea from '@/components/styled/form/StyledTextArea';
import { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import { useDispatch } from 'react-redux';
import StyledButton from '@/components/styled/StyledButton';
import { addPassword, setPassword } from '@/redux/features/vaultSlice';
import Alert from '@/components/Alert';
import CommonUtils from '@/utils/commonUtils';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import TagSelect from './tags/TagSelect';
import type { VaultInterface } from '@/interfaces/VaultInterface';
import { useSelector } from 'react-redux';

interface PropsComponent {
    default?: VaultInterface.Form.Password;
    type: 'create' | 'edit';
    password_id?: VaultInterface.Password['id'];
}

export default function PasswordForm(props: PropsComponent): ReactElement {
    /**
     * Form default settings
     */
    const FORM_DEFAULT_SETTINGS: VaultInterface.Form.Password =
        props.default ?? {
            title: '',
            login: '',
            password: '',
            url: '',
            note: '',
            tag_id: '',
        };

    /**
     * Boolean state to show an alert message
     */
    const [isCreated, setIsCreated] = useState<boolean>(false);
    /**
     * Form state contains all inputs
     */
    const [form, setForm] = useState<VaultInterface.Form.Password>(
        FORM_DEFAULT_SETTINGS,
    );

    /**
     * Get tags from vault data state
     */
    const VaultTags = useSelector((state: StoreState) => state.vault._d?.tags);

    /**
     * Disable the save button in the form until all required fields are filled
     */
    const IS_SAVE_BUTTON_DISABLED =
        props.type === 'create'
            ? !form.password || !form.title
            : !form.password
              || !form.title
              || JSON.stringify(form) == JSON.stringify(FORM_DEFAULT_SETTINGS);

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
        field: keyof VaultInterface.Form.Password,
        value: string,
    ) => {
        if (isCreated) setIsCreated(false);
        setForm((state) => {
            return { ...state, [field]: value };
        });
    };

    /**
     * Add the new password to the vault
     * On submit form
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        /**
         * Prevent sending form
         */
        e.preventDefault();
        /**
         * This fields need to be filled
         */
        if (
            !(form.title.trim().length > 0)
            || !(form.password.trim().length > 0)
        )
            return;

        /**
         * Update vault state
         */
        switch (props.type) {
            default:
                dispatch(addPassword({ ...form }));
                /**
                 * Update isCreated state and reset form
                 */
                setIsCreated(true);
                setForm(FORM_DEFAULT_SETTINGS);
                break;
            case 'edit':
                if (!props.password_id) return;
                dispatch(
                    setPassword({
                        id: props.password_id,
                        data: { ...form, url: CommonUtils.formatUrl(form.url) },
                    }),
                );
                navigate(-1);
                break;
        }
    };

    /**
     * Set default form on reset
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setForm(FORM_DEFAULT_SETTINGS);
    };

    /**
     * Generate a random password
     */
    const handleRandomPassword = (): void => {
        setForm((state: VaultInterface.Form.Password) => {
            return {
                ...state,
                password: CommonUtils.generateRandomPassword(24),
            };
        });
        return;
    };

    return (
        <div className='page-container'>
            <PageHead
                title={
                    props.type === 'edit'
                        ? FORM_DEFAULT_SETTINGS.title
                        : t('page:titles.create_password')
                }
                goBack
            />
            <form
                onSubmit={handleSubmit}
                onReset={handleReset}
                className='h-full relative flex flex-col place-content-between'
            >
                <div className='p-5 flex flex-col gap-5'>
                    {isCreated && (
                        <Alert
                            type='SUCCESS'
                            text={t('alert:password.created')}
                            onClose={() => setIsCreated(false)}
                        />
                    )}
                    <StyledInput
                        input={{
                            placeholder: t('common:title'),
                            onChange: (e) =>
                                FormFieldUpdate('title', e.currentTarget.value),
                            value: form.title,
                        }}
                    />
                    <div className='flex flex-row items-center gap-3'>
                        <StyledInput
                            input={{
                                placeholder: t('common:login'),
                                onChange: (e) =>
                                    FormFieldUpdate(
                                        'login',
                                        e.currentTarget.value,
                                    ),
                                value: form.login,
                            }}
                        />
                        <StyledInput
                            input={{
                                placeholder: t('common:password'),
                                onChange: (e) =>
                                    FormFieldUpdate(
                                        'password',
                                        e.currentTarget.value,
                                    ),
                                value: form.password,
                            }}
                            rightElement={
                                <ActionButton
                                    wrapperClassName='mr-1.5'
                                    onClick={() => handleRandomPassword()}
                                    tooltip={{
                                        content: t('common:generate_password'),
                                    }}
                                >
                                    <TbArrowsShuffle2
                                        size={18}
                                        className='text-neutral-800 group-hover/copy:text-neutral-300'
                                    />
                                </ActionButton>
                            }
                        />
                    </div>
                    <StyledInput
                        input={{
                            placeholder: t('common:url'),
                            onChange: (e) =>
                                FormFieldUpdate('url', e.currentTarget.value),
                            value: form.url,
                        }}
                    />

                    {VaultTags && VaultTags.length > 0 && (
                        <TagSelect
                            value={form.tag_id}
                            onChange={(tag_id: VaultInterface.Tag['id']) =>
                                FormFieldUpdate('tag_id', tag_id)
                            }
                        />
                    )}

                    <StyledTextArea
                        textarea={{
                            onChange: (e) =>
                                FormFieldUpdate('note', e.currentTarget.value),
                            value: form.note,
                            placeholder: t('common:add_note'),
                            rows: 5,
                            className: 'max-h-[250px]',
                        }}
                    />
                </div>
                <div className='p-5 flex flex-row items-center gap-5'>
                    <StyledButton
                        button={{
                            type: 'reset',
                            className: 'p-3 w-full',
                        }}
                        variant='secondary'
                    >
                        {t('common:reset')}
                    </StyledButton>
                    <StyledButton
                        button={{
                            type: 'submit',
                            className: 'p-3 w-full',
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
