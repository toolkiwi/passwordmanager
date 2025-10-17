import { resetVault, setVault } from '@/redux/features/vaultSlice';
import { StoreDispatch, StoreState } from '@/redux/StoreRedux';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import CryptoJS from 'crypto-js';
import CommonUtils from '@/utils/commonUtils';
import StyledButton from './styled/StyledButton';
import { TbExclamationCircle } from 'react-icons/tb';
import { FormEvent, useState } from 'react';
import Alert from './Alert';
import { setUnlocked } from '@/redux/features/appSlice';
import { useTranslation } from 'react-i18next';

export default function UnlockVaultScreen() {
    /**
     * Master password state
     */
    const [master, setMaster] = useState<string>('');
    /**
     * Error state
     */
    const [error, setError] = useState<boolean>(false);

    /**
     * Vault from redux store
     */
    const Vault = useSelector((state: StoreState) => state.vault);
    /**
     * Instance of Redux Dispatch hook
     */
    const dispatch = useDispatch<StoreDispatch>();
    /**
     * Instance of translation hook
     */
    const { t } = useTranslation();

    /**
     * Handle form submission to unlock the vault
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (master.length === 0) return;
        setError(false);
        const encryptedText = Vault._cipher!;
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedText, master);
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

            if (decryptedText) {
                const parsedVault = JSON.parse(decryptedText);
                delete parsedVault._cipher;
                dispatch(setVault(parsedVault));
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        }
    };

    /**
     * Handle user leaving the unlock screen
     */
    const handleLeave = () => {
        const isConfirmed = confirm(t('common:exit_when_vault_ciphered_confirm'));
        if (!isConfirmed) return;

        dispatch(resetVault());
        dispatch(setUnlocked(false));
    };

    return (
        Vault._cipher && (
            <div className={CN.root}>
                <div className={CN.overlay}></div>
                <div className={CN.container}>
                    {error && (
                        <div className={CN.alert_wrapper}>
                            <Alert type='ERROR' text={t('error:upload.error')} onClose={() => setError(false)} />
                        </div>
                    )}
                    <div className={CN.header_center}>
                        <div className={CN.vault_icon_wrapper}>
                            <img
                                alt='Vault icon'
                                src={CommonUtils.VaultIcon(Vault._d?.logo ?? '') ?? ''}
                                className={CN.vault_icon_img}
                            />
                        </div>
                        <div className={CN.vault_name}>{Vault._d?.name}</div>
                    </div>
                    <div className={CN.warning_row}>
                        <TbExclamationCircle className='text-yellow-400' size={22} />
                        <span className={CN.warning_text}>{t('common:vault_ciphered_message')}</span>
                    </div>
                    <div className={CN.form_wrapper}>
                        <form onSubmit={handleSubmit}>
                            <div className={CN.input_wrapper}>
                                <input
                                    type='password'
                                    placeholder='Enter master password'
                                    className={CN.input}
                                    onChange={(e) => setMaster(e.currentTarget.value)}
                                />
                            </div>
                            <div className={CN.buttons_row}>
                                <StyledButton
                                    variant='danger'
                                    button={{
                                        className: 'p-3 w-full',
                                        onClick: () => handleLeave(),
                                    }}
                                >
                                    {t('common:leave')}
                                </StyledButton>
                                <StyledButton
                                    button={{
                                        type: 'submit',
                                        className: 'p-3 w-full',
                                    }}
                                >
                                    {t('common:unlock')}
                                </StyledButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}

const CN = {
    root: 'fixed inset-0 z-[1000] flex items-center justify-center',
    overlay: 'absolute inset-0 bg-white/1 backdrop-blur-md',
    container: 'max-w-[800px] p-5 z-10 flex flex-col gap-8',
    alert_wrapper: 'mb-5',
    header_center: 'mb-5 items-center justify-center flex flex-col gap-2',
    vault_icon_wrapper:
        'self-center flex items-center justify-center w-20 rounded-3xl cursor-pointer border-1 border-neutral-700! p-1 rounded-2xl overflow-hidden my-3',
    vault_icon_img: 'w-full h-full rounded-2xl bg-foreground/5',
    vault_name: 'text-2xl text-white font-bold',
    warning_row: 'flex flex-row items-center justify-center gap-2 bg-neutral-800 p-3 rounded-lg',
    warning_text: 'text-neutral-200 font-medium',
    form_wrapper: 'w-92 m-auto',
    input_wrapper:
        'w-full border border-border rounded-xl bg-black/25 text-center focus-within:border-neutral-700/65! transition-colors',
    input: 'w-full h-full bg-transparent border-0 focus:ring-0 text-white placeholder:text-white/50 text-center p-4 outline-none',
    buttons_row: 'flex flex-row items-center gap-2 mt-5',
};
