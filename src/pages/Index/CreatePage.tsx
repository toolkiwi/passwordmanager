import { useDispatch } from 'react-redux';
import React, { Fragment, useState } from 'react';
import { createVault } from '@/redux/features/vaultSlice.ts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import StyledButton from '@/components/styled/StyledButton';
import StyledInput from '@/components/styled/form/StyledInput';
import { setUnlocked } from '@/redux/features/appSlice';

type RegisterFormInputs = {
    title: string;
    master: string;
};

export const CreateVault = () => {
    /**
     * State of form fields
     */
    const [registerForm, setRegisterForm] = useState<RegisterFormInputs>({
        title: '',
        master: '',
    });

    /**
     * State of form error
     */
    const [error, setError] = useState<null | string>(null);

    /**
     * Instance of dispatch hook
     */
    const dispatch = useDispatch();

    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();

    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();

    /**
     * On form submit (create vault)
     */
    const handleCreateVault = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!(registerForm.master.length > 0)) {
            setError(t('errors:empty_master_vault'));
            return;
        }
        /**
         * Create Vault
         */
        dispatch(
            createVault({
                title: registerForm.title.length > 0 ? registerForm.title : t('page:index.default_vault_name'),
                master: registerForm.master,
            }),
        );
        /**
         * Go to vault
         */
        dispatch(setUnlocked(true));
        navigate('vault');
    };

    /**
     * On update field input value
     */
    const onInputRegisterChange = (field: keyof RegisterFormInputs, event: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterForm((state: RegisterFormInputs) => {
            return { ...state, [field]: event.target.value };
        });
    };

    return (
        <Fragment>
            {error && (
                <div className={CN.error_box}>
                    <p className={CN.error_text}>{error}</p>
                </div>
            )}

            <form onSubmit={handleCreateVault} className={CN.form}>
                <div className={CN.form_group}>
                    <label className={CN.label} htmlFor='title'>
                        {t('common:vault_title')}
                    </label>
                    <StyledInput
                        input={{
                            id: 'title',
                            type: 'text',
                            placeholder: t('common:vault_title'),
                            maxLength: 25,
                            required: true,
                            onChange: (e) => onInputRegisterChange('title', e),
                        }}
                    />
                </div>
                <div className={CN.form_group}>
                    <label className={CN.label} htmlFor='password'>
                        {t('common:password')} <span className={CN.required}>*</span>
                    </label>
                    <StyledInput
                        input={{
                            id: 'password',
                            type: 'password',
                            placeholder: t('common:master_password'),
                            minLength: 5,
                            required: true,
                            onChange: (e) => onInputRegisterChange('master', e),
                        }}
                    />
                </div>
                <StyledButton
                    button={{
                        type: 'submit',
                        className: CN.submit_button,
                    }}
                    variant='secondary'
                >
                    {t('page:index.create_the_vault')}
                </StyledButton>
            </form>
        </Fragment>
    );
};

const CN = {
    error_box: 'p-3 bg-red-500 text-foreground text-center rounded-md mb-5 max-sm:p-1!',
    error_text: 'font-bold',
    form: 'p-8 border border-solid mb-5 rounded-lg max-sm:p-5',
    form_group: 'mb-8 gap-3 flex flex-col',
    label: 'text-foreground font-semibold',
    required: 'text-red-600',
    submit_button: 'p-3 w-full',
};
