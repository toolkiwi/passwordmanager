import { TbArrowsShuffle2 } from 'react-icons/tb';
import { type ReactElement, useCallback, useState } from 'react';
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
import FormCN from '@/styles/CN/FormCN';
import StyledCheckbox from './styled/form/StyledCheckbox';
import { ComboBox } from './ComboBox';
import clsx from 'clsx';
import { usePasswordFormValidation } from '@/hooks/usePasswordFormValidation';
import { TOTP_DEFAUL } from '@/constants/Form';

interface PropsComponent {
    default?: VaultInterface.Form.Password;
    type: 'create' | 'edit';
    password_id?: VaultInterface.Password['id'];
}

export default function PasswordForm(props: PropsComponent): ReactElement {
    /**
     * Form default settings
     */
    const FORM_DEFAULT_SETTINGS: VaultInterface.Form.Password = props.default ?? {
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
    const [form, setForm] = useState<VaultInterface.Form.Password>(FORM_DEFAULT_SETTINGS);
    /**
     * Get tags from vault data state
     */
    const VaultTags = useSelector((state: StoreState) => state.vault._d?.tags);
    /**
     * Boolean state to enable TOTP
     */
    const isTotpEnabled = !!form.totp;

    /**
     * Disable the save button in the form until all required fields are filled
     */
    const { isSaveDisabled } = usePasswordFormValidation({
        form,
        defaultForm: FORM_DEFAULT_SETTINGS,
        mode: props.type,
    });

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
    const FormFieldUpdate = (field: keyof VaultInterface.Form.Password, value: string) => {
        if (isCreated) setIsCreated(false);
        setForm((state) => {
            return { ...state, [field]: value };
        });
    };

    /**
     * Update a TOTP field of form state
     */
    const FormTotpFieldUpdate = (field: keyof VaultInterface.TOTP, value: string | number) => {
        if (isCreated) setIsCreated(false);
        setForm((state) => {
            const temp = { ...state.totp! };
            temp[field] = value as never;
            return { ...state, totp: temp };
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
        if (!(form.title.trim().length > 0) || !(form.password.trim().length > 0)) return;

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
                        data: {
                            ...form,
                            url: CommonUtils.formatUrl(form.url),
                            totp: form.totp,
                        },
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

    /**
     * Handle TOTP enable/disable
     */
    const handleTotpToggle = useCallback(
        (status: boolean) => {
            setForm((prevState) => {
                if (status) {
                    return {
                        ...prevState,
                        totp: {
                            secret: prevState.totp?.secret ?? TOTP_DEFAUL.secret,
                            algorithm: prevState.totp?.algorithm ?? TOTP_DEFAUL.algorithm,
                            digits: prevState.totp?.digits ?? TOTP_DEFAUL.digits,
                            period: prevState.totp?.period ?? TOTP_DEFAUL.period,
                        },
                    };
                } else {
                    const { totp: _totp, ...rest } = prevState;
                    return rest;
                }
            });
        },
        [isTotpEnabled],
    );

    return (
        <div className='page-container'>
            <PageHead
                title={props.type === 'edit' ? FORM_DEFAULT_SETTINGS.title : t('page:titles.create_password')}
                goBack
            />
            <form
                onSubmit={handleSubmit}
                onReset={handleReset}
                className='h-full relative flex flex-col place-content-between'
            >
                <div className='p-5 flex flex-col gap-5'>
                    {isCreated && (
                        <Alert type='SUCCESS' text={t('alert:password.created')} onClose={() => setIsCreated(false)} />
                    )}
                    <StyledInput
                        input={{
                            placeholder: t('common:title'),
                            onChange: (e) => FormFieldUpdate('title', e.currentTarget.value),
                            value: form.title,
                        }}
                    />
                    <div className='flex flex-row items-center gap-3 max-sm:flex-col! max-sm:gap-5'>
                        <StyledInput
                            input={{
                                placeholder: t('common:login'),
                                onChange: (e) => FormFieldUpdate('login', e.currentTarget.value),
                                value: form.login,
                            }}
                        />
                        <StyledInput
                            input={{
                                placeholder: t('common:password'),
                                onChange: (e) => FormFieldUpdate('password', e.currentTarget.value),
                                value: form.password,
                            }}
                            rightElement={
                                <ActionButton
                                    wrapperClassName='mr-1.5 max-sm:mr-[3.5px]'
                                    onClick={() => handleRandomPassword()}
                                    tooltip={{
                                        content: t('common:generate_password'),
                                    }}
                                >
                                    <TbArrowsShuffle2
                                        size={18}
                                        className='text-foreground/10 group-hover/copy:text-foreground/80 '
                                    />
                                </ActionButton>
                            }
                        />
                    </div>
                    <StyledInput
                        input={{
                            placeholder: t('common:url'),
                            onChange: (e) => FormFieldUpdate('url', e.currentTarget.value),
                            value: form.url,
                        }}
                    />

                    {VaultTags && VaultTags.length > 0 && (
                        <TagSelect
                            value={form.tag_id}
                            onChange={(tag_id: VaultInterface.Tag['id']) => FormFieldUpdate('tag_id', tag_id)}
                        />
                    )}

                    <StyledCheckbox
                        title={t('page:form.enable_totp')}
                        subtitle={t('page:form.enable_totp_subtitle')}
                        value={isTotpEnabled}
                        onChange={handleTotpToggle}
                        wrapperClassName={clsx(isTotpEnabled && 'bg-foreground/5! border-foreground/5!')}
                    />
                    {isTotpEnabled && (
                        <div className='p-5 border rounded-lg flex flex-col gap-3 bg-foreground/2'>
                            <StyledInput
                                input={{
                                    placeholder: t('page:form.totp_secret'),
                                    onChange: (e) => FormTotpFieldUpdate('secret', e.currentTarget.value),
                                    value: form.totp?.secret,
                                }}
                            />

                            <div className='h-[1px] w-full bg-foreground/5 my-3' />
                            <div className='flex flex-row items-center gap-3 max-sm:flex-col! max-sm:gap-5'>
                                <div className={FormCN.input_group}>
                                    <label className={clsx(FormCN.label, 'text-xs')}>
                                        {t('page:form.totp_digits')}
                                    </label>
                                    <StyledInput
                                        input={{
                                            placeholder: t('page:form.totp_digits'),
                                            type: 'number',
                                            min: 1,
                                            onChange: (e) => FormTotpFieldUpdate('digits', e.currentTarget.value),
                                            value: form.totp?.digits,
                                        }}
                                    />
                                </div>
                                <div className={FormCN.input_group}>
                                    <label className={clsx(FormCN.label, 'text-xs')}>
                                        {t('page:form.totp_duration')}
                                    </label>
                                    <StyledInput
                                        input={{
                                            placeholder: t('page:form.totp_duration'),
                                            type: 'number',
                                            min: 1,
                                            onChange: (e) => FormTotpFieldUpdate('period', e.currentTarget.value),
                                            value: form.totp?.period,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={FormCN.input_group}>
                                <label className={clsx(FormCN.label, 'text-xs')}>{t('page:form.totp_algorithm')}</label>
                                <ComboBox
                                    data={[
                                        { label: 'SHA-1', value: 'SHA1' },
                                        { label: 'SHA-256', value: 'SHA256' },
                                        { label: 'SHA-512', value: 'SHA512' },
                                    ]}
                                    placeholder={t('page:form.totp_algorithm')}
                                    currentState={form.totp?.algorithm}
                                    handleChange={(value) => FormTotpFieldUpdate('algorithm', value)}
                                />
                            </div>
                            <p className='text-foreground/50 text-sm italic'>{t('page:form.totp_default_info')}</p>
                        </div>
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
                        disabled={isSaveDisabled}
                    >
                        {t('common:save')}
                    </StyledButton>
                </div>
            </form>
        </div>
    );
}
