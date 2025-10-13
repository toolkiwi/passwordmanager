import PageHead from '@/components/PageHead';
import { useSelector } from 'react-redux';
import type { StoreState } from '@/redux/StoreRedux';
import StyledButton from '@/components/styled/StyledButton';
import { TbArrowBackUp, TbEye, TbEyeClosed } from 'react-icons/tb';
import StyledInput from '@/components/styled/form/StyledInput';
import Alert from '@/components/Alert';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch, UnknownAction } from 'redux';
import { setVaultData } from '@/redux/features/vaultSlice';
import { createAvatar, Result } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import { useTranslation } from 'react-i18next';
import CommonUtils from '@/utils/commonUtils';
import ActionButton from '@/components/styled/ActionButton';
import FormCN from '@/styles/CN/FormCN';

interface FormInterface {
    name: string;
    logo: string | number;
    master: string;
}

export default function Index() {
    /**
     * State to show an alert when settings have been edited
     */
    const [isEdited, setIsEdited] = useState<boolean>(false);
    /**
     * Show or hide master password
     */
    const [showPassword, setShowPassword] = useState<boolean>(false);

    /**
     * Instance of vault state
     */
    const Vault = useSelector((state: StoreState) => state.vault._d);

    /**
     * Form default settings
     */
    const FORM_DEFAULT_SETTINGS: FormInterface = {
        name: Vault!.name,
        logo: Vault!.logo,
        master: Vault!.master,
    };

    /**
     * State of data form
     */
    const [form, setForm] = useState<FormInterface>(FORM_DEFAULT_SETTINGS);

    /**
     * Instance of dispatch hook
     */
    const dispatch: Dispatch<UnknownAction> = useDispatch();

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Set document title
     */
    CommonUtils.DocumentTitle(t('page:titles.settings'));

    /**
     * Update field inside form state with provided custom value
     */
    const handleUpdateField = (field: keyof FormInterface, value: string) => {
        setForm((state: FormInterface) => {
            return { ...state, [field]: value };
        });
    };

    /**
     * On form submit
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!Vault) return;
        /**
         * Dispatch
         */
        dispatch(
            setVaultData({
                ...Vault,
                name: form.name,
                logo: form.logo,
                master: form.master.length > 0 ? form.master : Vault.master,
            }),
        );
        /**
         * Update alert
         */
        setIsEdited(true);
    };

    /**
     * Update vault icon
     */
    const handleUpdateIcon = () => {
        setForm((state: FormInterface) => {
            return { ...state, logo: new Date().getTime() / 1000 };
        });
    };

    /**
     * Reset to default vault icon
     */
    const handleResetIcon = () => {
        setForm((state: FormInterface) => {
            return { ...state, logo: FORM_DEFAULT_SETTINGS.logo };
        });
    };

    /**
     * Reset all data
     */
    const handleResetAll = () => {
        setForm((state: FormInterface) => {
            return { ...state, ...FORM_DEFAULT_SETTINGS };
        });
    };

    /**
     * Generate the vault icon based on a seed
     */
    const VaultIcon: Result = createAvatar(identicon, {
        seed: form.logo.toString(),
    });

    /**
     * Auto remove alert
     */
    useEffect(() => {
        if (JSON.stringify(form) !== JSON.stringify(FORM_DEFAULT_SETTINGS) && isEdited) {
            setIsEdited(false);
        }
    }, [form]);

    return (
        <div className={CN.pageContainer}>
            <PageHead title={t('page:titles.settings')} goBack />
            {isEdited && (
                <div className={CN.alertContainer}>
                    <Alert type='SUCCESS' text={t('alert:edit_success')} onClose={() => setIsEdited(false)} noRounded />
                </div>
            )}
            <form className={FormCN.form} onSubmit={handleSubmit} onReset={handleResetAll}>
                <div className={CN.headerSection}>
                    <div className={CN.backgroundPattern} />
                    <div className={CN.iconContainer}>
                        <div className={CN.iconWrapper}>
                            <img src={VaultIcon.toDataUri()} alt='Vault icon' />
                        </div>
                    </div>
                    <div className={CN.buttonGroup}>
                        <StyledButton
                            button={{
                                className: CN.button,
                                onClick: handleUpdateIcon,
                            }}
                            variant='secondary'
                            blur
                        >
                            {t('page:settings.change_icon')}
                        </StyledButton>
                        <StyledButton
                            button={{
                                className: CN.iconButton,
                                onClick: handleResetIcon,
                                'data-tooltip-content': t('common:reset'),
                                'data-tooltip-place': 'bottom',
                            }}
                            variant='secondary'
                            blur
                        >
                            <TbArrowBackUp size={20} />
                        </StyledButton>
                    </div>
                </div>
                <div className={CN.contentContainer}>
                    <div className={CN.contentWrapper}>
                        <div className={FormCN.input_group}>
                            <label className={FormCN.label}>{t('common:vault_title')}</label>
                            <p className={FormCN.sub_label}>{t('page:settings.vault_title_desc')}</p>
                            <StyledInput
                                input={{
                                    placeholder: Vault!.name,
                                    defaultValue: Vault!.name,
                                    onChange: (e: ChangeEvent<HTMLInputElement>) =>
                                        handleUpdateField('name', e.currentTarget.value),
                                }}
                            />
                        </div>
                        <div className={FormCN.input_group}>
                            <label className={FormCN.label}>{t('common:password_master')}</label>
                            <p className={FormCN.sub_label}>{t('page:settings.password_master_desc')}</p>
                            <StyledInput
                                input={{
                                    placeholder: Vault!.master,
                                    defaultValue: Vault!.master,
                                    type: showPassword ? 'text' : 'password',
                                    onChange: (e: ChangeEvent<HTMLInputElement>) =>
                                        handleUpdateField('master', e.currentTarget.value),
                                }}
                                rightElement={
                                    <ActionButton
                                        wrapperClassName='mr-1.5 max-sm:mr-[3.5px]'
                                        onClick={() => setShowPassword((state) => !state)}
                                    >
                                        {showPassword ? (
                                            <TbEyeClosed
                                                size={18}
                                                className='text-neutral-800 group-hover/copy:text-foreground/80'
                                            />
                                        ) : (
                                            <TbEye
                                                size={18}
                                                className='text-neutral-800 group-hover/copy:text-foreground/80'
                                            />
                                        )}
                                    </ActionButton>
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className={CN.footer}>
                    <StyledButton button={{ className: CN.buttonFlex, type: 'reset' }} variant='secondary'>
                        {t('common:reset')}
                    </StyledButton>
                    <StyledButton
                        button={{ className: CN.buttonFlex, type: 'submit' }}
                        disabled={JSON.stringify(form) === JSON.stringify(FORM_DEFAULT_SETTINGS)}
                    >
                        {t('common:save')}
                    </StyledButton>
                </div>
            </form>
        </div>
    );
}

const CN = {
    pageContainer: 'page-container',
    alertContainer: 'p-0',
    headerSection:
        'w-full min-h-[250px] flex flex-col items-center justify-center m-auto border-b  py-10 gap-5 mb-3 relative overflow-hidden',
    backgroundPattern: 'absolute -top-10 left-0 w-full h-[120%] overflow-hidden bg-pattern-1',
    iconContainer: 'border  p-2.5 rounded-3xl z-10',
    iconWrapper: 'w-20 h-20 bg-white/5 rounded-xl overflow-hidden',
    buttonGroup: 'flex flex-row items-center justify-center gap-2 z-10',
    button: 'p-3 hover:text-foreground h-[50px]',
    iconButton: 'hover:text-foreground h-[50px] w-[50px] flex items-center justify-center',
    contentContainer: 'p-8 flex flex-col relative flex-1',
    contentWrapper: 'flex-1 flex flex-col gap-10',
    footer: 'mt-5 flex flex-row items-center gap-5 p-5 border-t ',
    buttonFlex: 'flex-1 p-3',
};
