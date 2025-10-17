import { StoreDispatch, type StoreState } from '@/redux/StoreRedux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { type ReactElement, useEffect, useState, useCallback, Fragment } from 'react';
import PageHead from '@/components/PageHead';
import CommonUtils from '@/utils/commonUtils';
import RenderField from './__partials/RenderField';
import ActionButton from '@/components/styled/ActionButton';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import StyledButton from '@/components/styled/StyledButton';
import CopyAction from '@/components/CopyAction';
import Modal from '@/components/Modal';
import { useDispatch } from 'react-redux';
import { deletePassword } from '@/redux/features/vaultSlice';
import { useTranslation } from 'react-i18next';
import type { VaultInterface } from '@/interfaces/VaultInterface';
import ListCN from '@/styles/CN/ListCN';
import SmartFavicon from '@/components/SmartFavicon';
import TotpUtils from '@/utils/totpUtils';
import TotpTimer from '@/components/TotpCircleTimer';

export default function Index(): ReactElement | null {
    /**
     * Password data state;
     */
    const [password, setPassword] = useState<VaultInterface.Password | null>(null);
    /**
     * State of delete modal display
     */
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    /**
     * Show password;
     */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    /**
     * TOTP code state
     */
    const [totpCode, setTotpCode] = useState<string>('');
    /**
     * TOTP remaining time state
     */
    const [totpRemaining, setTotpRemaining] = useState<number>(30);

    /**
     * Get uuid from URL;
     */
    const { uuid } = useParams();

    /**
     * Instance of Redux Dispatch hook;
     */
    const dispatch = useDispatch<StoreDispatch>();

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Instance of Vault state;
     */
    const VaultPasswords = useSelector((state: StoreState) => state.vault._d?.passwords);

    /**
     * Instance of navigate hook;
     */
    const navigate = useNavigate();

    /**
     * On modal callback
     */
    const handleDeletePassword = useCallback(() => {
        if (!password) return;
        dispatch(deletePassword(password));
        navigate('/vault', { replace: true });
    }, [password, dispatch, navigate]);

    /**
     * Toggle password visibility
     */
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    /**
     * Show delete modal
     */
    const handleShowDeleteModal = useCallback(() => {
        setModalDelete(true);
    }, []);

    /**
     * Navigate to edit page
     */
    const handleNavigateToEdit = useCallback(() => {
        navigate('edit');
    }, [navigate]);

    /**
     * Generate and update TOTP code
     */
    useEffect(() => {
        if (!password?.totp) return;

        const generateTotpCode = async () => {
            try {
                const code = await TotpUtils.GenerateTOTP(password.totp!);
                setTotpCode(code);
            } catch {
                setTotpCode('000000');
            }
        };

        const updateTimer = () => {
            const period = password.totp!.period || 30;
            const remaining = TotpUtils.GetRemainingSeconds(period);
            setTotpRemaining(remaining);

            if (remaining === period) {
                generateTotpCode();
            }
        };

        generateTotpCode();
        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [password]);

    /**
     * On mount;
     */
    useEffect(() => {
        /**
         * Try to get password with the uuid;
         */
        const password = VaultPasswords ? VaultPasswords![VaultPasswords!.findIndex((i) => i.id === uuid)] : undefined;
        /**
         * Verify if the uuid and password exist;
         */
        if (uuid && password) {
            setPassword(password);
            /**
             * Set document title
             */
            CommonUtils.DocumentTitle(password.title);
        }
    }, [uuid, VaultPasswords]);

    if (!password) {
        return <Fragment />;
    }

    /**
     * Render password details;
     */
    return (
        <div className={CN.page_container}>
            <PageHead
                title={password.title}
                beforeTitle={
                    <div className={CN.favicon_container}>
                        <SmartFavicon url={password.url} title={password.title} className={ListCN.favicon} />
                    </div>
                }
                goBack
            />
            <section className={CN.section}>
                <div className={CN.content}>
                    <RenderField
                        label={t('common:login')}
                        value={password.login}
                        rightAction={<CopyAction value={password.login} />}
                    />
                    <RenderField
                        label={t('common:password')}
                        value={showPassword ? password.password : '*'.repeat(password.password.length)}
                        rightAction={
                            <div className={CN.actions_container}>
                                <ActionButton onClick={togglePasswordVisibility}>
                                    {showPassword ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                                </ActionButton>
                                <CopyAction value={password.password} />
                            </div>
                        }
                    />
                    <RenderField
                        label={t('common:url')}
                        type='url'
                        value={password.url}
                        rightAction={<CopyAction value={password.url} />}
                    />
                    {password.totp && (
                        <RenderField
                            label='TOTP'
                            value={totpCode.replace(/(.{3})/g, '$1 ').trim()}
                            rightAction={
                                <div className={CN.totp_actions}>
                                    <TotpTimer
                                        remaining={totpRemaining}
                                        period={password.totp.period || 30}
                                        size={32}
                                    />
                                    <CopyAction value={totpCode} />
                                </div>
                            }
                        />
                    )}

                    {password.tag_id && <RenderField label={t('common:tag')} type='tag' value={password.tag_id} />}
                    <RenderField label={t('common:note')} value={password.note} type='note' />
                </div>
                <div className={CN.footer}>
                    <StyledButton
                        button={{
                            className: CN.delete_button,
                            onClick: handleShowDeleteModal,
                        }}
                        variant='danger'
                    >
                        {t('common:delete')}
                    </StyledButton>
                    <StyledButton
                        button={{
                            className: CN.edit_button,
                            onClick: handleNavigateToEdit,
                        }}
                    >
                        {t('common:edit')}
                    </StyledButton>
                </div>
            </section>
            <Modal
                title={t('alert:password.confirm_delete')}
                subtitle={t('alert:password.confirm_delete_sub')}
                submitText={t('common:delete')}
                submitCallback={handleDeletePassword}
                show={modalDelete}
                setShow={setModalDelete}
            />
        </div>
    );
}

const CN = {
    page_container: 'page-container',
    favicon_container: 'w-8 h-8 fex items-center justify-center mr-3',
    section: 'p-5 flex flex-1 flex-col max-sm:p-3',
    content: 'flex-1',
    actions_container: 'flex flex-row items-center gap-2',
    totp_actions: 'flex flex-row items-center gap-2',
    footer: ListCN.footer,
    delete_button: 'flex-1 p-3 w-full max-sm:order-1',
    edit_button: 'flex-1 p-3 w-full max-sm:order-0',
};
