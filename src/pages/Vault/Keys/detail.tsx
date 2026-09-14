import { Fragment, type ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TbEye, TbEyeOff, TbKey } from 'react-icons/tb';

import PageHead from '@/components/PageHead';
import RenderField from '@/components/RenderField';
import CopyAction from '@/components/CopyAction';
import Modal from '@/components/Modal';
import ActionButton from '@/components/styled/ActionButton';
import StyledButton from '@/components/styled/StyledButton';
import CommonUtils from '@/utils/commonUtils';
import ListCN from '@/styles/CN/ListCN';
import { deleteKey } from '@/redux/features/vaultSlice';
import type { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import type { VaultInterface } from '@/interfaces/VaultInterface';

export default function Index(): ReactElement | null {
    /**
     * Key data state
     */
    const [item, setItem] = useState<VaultInterface.Key | null>(null);
    /**
     * State of delete modal display
     */
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    /**
     * Show the private key and the passphrase
     */
    const [showSecret, setShowSecret] = useState<boolean>(false);

    /**
     * Get uuid from URL
     */
    const { uuid } = useParams();

    /**
     * Instance of Redux Dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();

    /**
     * Instance translation hook
     */
    const { t } = useTranslation();

    /**
     * Instance of Vault state
     */
    const VaultKeys = useSelector((state: StoreState) => state.vault._d?.keys);

    /**
     * Instance of navigate hook
     */
    const navigate = useNavigate();

    /**
     * Hide a secret value behind dots while it is not revealed
     */
    const maskValue = (value: string): string => (value.length > 0 ? '•'.repeat(24) : value);

    /**
     * On modal callback
     */
    const handleDeleteKey = useCallback(() => {
        if (!item) return;
        dispatch(deleteKey(item.id));
        navigate('/vault/keys', { replace: true });
    }, [item, dispatch, navigate]);

    /**
     * On mount
     */
    useEffect(() => {
        /**
         * Try to get the key with the uuid
         */
        const key = VaultKeys?.find((i) => i.id === uuid);
        /**
         * Verify if the uuid and key exist
         */
        if (uuid && key) {
            setItem(key);
            /**
             * Set document title
             */
            CommonUtils.DocumentTitle(key.title);
        }
    }, [uuid, VaultKeys]);

    if (!item) {
        return <Fragment />;
    }

    /**
     * Render key details
     */
    return (
        <div className={CN.page_container}>
            <PageHead
                title={item.title}
                beforeTitle={
                    <div className={CN.icon_container}>
                        <TbKey size={22} className='text-foreground/30' />
                    </div>
                }
                goBack
            />
            <section className={CN.section}>
                <div className={CN.content}>
                    <RenderField label={t('page:keys.type')} value={t(`page:keys.types.${item.type.toLowerCase()}`)} />
                    <RenderField
                        label={t('page:keys.host')}
                        value={item.host}
                        rightAction={<CopyAction value={item.host} />}
                    />
                    <RenderField
                        label={t('common:login')}
                        value={item.username}
                        rightAction={<CopyAction value={item.username} />}
                    />
                    <RenderField
                        label={t('page:keys.private_key')}
                        type={showSecret ? 'note' : undefined}
                        value={showSecret ? item.private_key : maskValue(item.private_key)}
                        rightAction={
                            <div className={CN.actions_container}>
                                <ActionButton onClick={() => setShowSecret((state) => !state)}>
                                    {showSecret ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                                </ActionButton>
                                <CopyAction value={item.private_key} tooltip={t('page:keys.copy_private_key')} />
                            </div>
                        }
                    />
                    <RenderField
                        label={t('page:keys.public_key')}
                        type='note'
                        value={item.public_key}
                        rightAction={<CopyAction value={item.public_key} tooltip={t('page:keys.copy_public_key')} />}
                    />
                    <RenderField
                        label={t('page:keys.passphrase')}
                        value={showSecret ? item.passphrase : maskValue(item.passphrase)}
                        rightAction={<CopyAction value={item.passphrase} />}
                    />
                    {item.tag_id && <RenderField label={t('common:tag')} type='tag' value={item.tag_id} />}
                    <RenderField label={t('common:note')} value={item.note} type='note' />
                </div>
                <div className={CN.footer}>
                    <StyledButton
                        button={{
                            className: CN.delete_button,
                            onClick: () => setModalDelete(true),
                        }}
                        variant='danger'
                    >
                        {t('common:delete')}
                    </StyledButton>
                    <StyledButton
                        button={{
                            className: CN.edit_button,
                            onClick: () => navigate('edit'),
                        }}
                    >
                        {t('common:edit')}
                    </StyledButton>
                </div>
            </section>
            <Modal
                title={t('alert:key.confirm_delete')}
                subtitle={t('alert:key.confirm_delete_sub')}
                submitText={t('common:delete')}
                submitCallback={handleDeleteKey}
                show={modalDelete}
                setShow={setModalDelete}
            />
        </div>
    );
}

const CN = {
    page_container: 'page-container',
    icon_container: 'w-8 h-8 flex items-center justify-center mr-3',
    section: 'p-5 flex flex-1 flex-col max-sm:p-3',
    content: 'flex-1',
    actions_container: 'flex flex-row items-center gap-2',
    footer: ListCN.footer,
    delete_button: 'flex-1 p-3 w-full max-sm:order-1',
    edit_button: 'flex-1 p-3 w-full max-sm:order-0',
};
