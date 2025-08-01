import { StoreDispatch, type StoreState } from '@/redux/StoreRedux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { type ReactElement, useEffect, useState } from 'react';
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

export default function Index(): ReactElement | null {
    /**
     * Password data state;
     */
    const [password, setPassword] = useState<VaultInterface.Password | null>(
        null,
    );
    /**
     * State of delete modal display
     */
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    /**
     * Show password;
     */
    const [showPassword, setShowPassword] = useState<boolean>(false);

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
    const VaultPasswords = useSelector(
        (state: StoreState) => state.vault._d?.passwords,
    );

    /**
     * Instance of navigate hook;
     */
    const navigate = useNavigate();
    /**
     * On modal callback
     */
    function handleDeletePassword() {
        if (!password) return;
        dispatch(deletePassword(password));
        navigate('/vault', { replace: true });
    }

    /**
     * On mount;
     */
    useEffect(() => {
        /**
         * Try to get password with the uuid;
         */
        const password =
            VaultPasswords![VaultPasswords!.findIndex((i) => i.id === uuid)];
        /**
         * Verify if the uuid and password exist;
         */
        if (uuid && password) {
            setPassword(password);
            /**
             * Set document title
             */
            CommonUtils.DocumentTitle(password.title);
        } else {
            navigate(-1);
        }
    }, []);

    /**
     * Render password details;
     */
    return (
        password && (
            <div className='page-container'>
                <PageHead
                    title={password.title}
                    beforeTitle={
                        <div className='w-8 h-8 fex items-center justify-center mr-3'>
                            <SmartFavicon
                                url={password.url}
                                title={password.title}
                                className={ListCN.favicon}
                            />
                        </div>
                    }
                    goBack
                />
                <section className='p-5 flex flex-1 flex-col max-sm:p-3'>
                    <div className='flex-1'>
                        <RenderField
                            label={t('common:login')}
                            value={password.login}
                            rightAction={<CopyAction value={password.login} />}
                        />
                        <RenderField
                            label={t('common:password')}
                            value={
                                showPassword
                                    ? password.password
                                    : '*'.repeat(password.password.length)
                            }
                            rightAction={
                                <div className='flex flex-row items-center gap-2'>
                                    <ActionButton
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    >
                                        {showPassword ? (
                                            <TbEyeOff size={18} />
                                        ) : (
                                            <TbEye size={18} />
                                        )}
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
                        {password.tag_id && (
                            <RenderField
                                label={t('common:tag')}
                                type='tag'
                                value={password.tag_id}
                            />
                        )}
                        <RenderField
                            label={t('common:note')}
                            value={password.note}
                            type='note'
                        />
                    </div>
                    <div className={ListCN.footer}>
                        <StyledButton
                            button={{
                                className: 'flex-1 p-3 w-full max-sm:order-1',
                                onClick: () => setModalDelete(true),
                            }}
                            variant='danger'
                        >
                            {t('common:delete')}
                        </StyledButton>
                        <StyledButton
                            button={{
                                className: 'flex-1 p-3 w-full max-sm:order-0',
                                onClick: () => navigate('edit'),
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
                    submitCallback={() => handleDeletePassword()}
                    show={modalDelete}
                    setShow={setModalDelete}
                />
            </div>
        )
    );
}
