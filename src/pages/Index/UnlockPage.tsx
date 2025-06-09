import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUnlocked } from '@/redux/features/appSlice.ts';
import { setVault } from '@/redux/features/vaultSlice.ts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import FileUtils from '@/utils/fileUtils';
import { TbFolderOpen } from 'react-icons/tb';
import StyledButton from '@/components/styled/StyledButton';
import StyledInput from '@/components/styled/form/StyledInput';
import Alert from '@/components/Alert';

export const UnlockVault = () => {
    /**
     * State file upload
     */
    const [file, setFile] = useState<File | null>(null);
    /**
     * Master key of the ciphered password file
     */
    const [master, setMaster] = useState<string>('');
    /**
     * State of form error
     */
    const [error, setError] = useState<null | string>(null);
    /**
     * State of drag over
     */
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

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
     * On File load
     * @param event
     */
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setError(null);
        const _file = event.target.files?.[0];

        if (_file) {
            if (_file.name.endsWith('.ptk')) {
                setFile(_file);
            } else {
                setError(t('error:upload.format'));
            }
        }
    };

    /**
     * On File load
     * @param event
     */
    const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setError(null);
        const _file = event.dataTransfer.files[0];

        if (_file) {
            if (_file.name.endsWith('.ptk')) {
                setFile(_file);
            } else {
                setError(t('error:upload.format'));
            }
        }
    };

    /**
     * On Drag Over
     * @param event
     */
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    };

    /**
     * On drag Leave
     * @param event
     */
    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    };

    /**
     * On unlock volt
     * @param e
     */
    const handleUnlockVault = async (
        e: React.ChangeEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();
        if (!file) return;

        await FileUtils.upload(file, master)
            .then((snap) => {
                dispatch(setUnlocked(true));
                dispatch(setVault(JSON.parse(snap as string)));
                navigate('/vault');
                return;
            })
            .catch((e: string) => setError(e));
    };

    return (
        <Fragment>
            {error && (
                <div className='mb-5'>
                    <Alert
                        type='ERROR'
                        text={error}
                        onClose={() => setError(null)}
                    />
                </div>
            )}

            {!file ? (
                <Fragment>
                    <label
                        className={`${CN.dropzone} ${isDragOver ? CN.dropzone_dragover : ''}`}
                        htmlFor='ciphered-file'
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <div className={CN.dropzone_meta}>
                            <div className={CN.dropzone_meta_icon}>
                                <TbFolderOpen
                                    className={CN.dropzone_meta_icon_svg}
                                />
                            </div>
                            <div className={CN.dropzone_meta_title}>
                                {t('page:index.drag_ciphered_file')}{' '}
                                <span className={CN.dropzone_meta_title_span}>
                                    (.ptk)
                                </span>
                            </div>
                        </div>
                        <div className={CN.dropzone_or}>
                            <div className={CN.dropzone_or_separator}></div>
                            <div className={CN.dropzone_or_span}>
                                {t('page:index.or')}
                            </div>
                            <div className={CN.dropzone_or_separator}></div>
                        </div>
                        <div className={CN.dropzone_browse}>
                            <div className={CN.dropzone_browse_button}>
                                {t('page:index.browse_files')}
                            </div>
                        </div>
                    </label>
                    <input
                        type='file'
                        id='ciphered-file'
                        accept='text/ptk'
                        hidden
                        onChange={handleFileChange}
                    />
                </Fragment>
            ) : (
                <form onSubmit={handleUnlockVault}>
                    <div className='p-10 border border-solid  mb-5 rounded-lg max-sm:p-5'>
                        <label
                            className='text-foreground font-semibold'
                            htmlFor='vault-master'
                        >
                            {t('page:index.enter_master_vault')}
                        </label>
                        <div className='mb-5 w-full flex-1 mt-2'>
                            <StyledInput
                                input={{
                                    id: 'vault-master',
                                    type: 'password',
                                    placeholder: t('common:password'),
                                    onChange: (e) =>
                                        setMaster(e.currentTarget.value),
                                }}
                            />
                        </div>
                        <StyledButton
                            button={{ type: 'submit', className: 'p-3 w-full' }}
                            variant='secondary'
                        >
                            {t('page:index.unlock_vault')}
                        </StyledButton>
                    </div>
                </form>
            )}
        </Fragment>
    );
};

const CN = {
    dropzone:
        'px-12 h-full border-[3px] border-dashed border-white/10 hover:bg-white/10 rounded-lg flex flex-col items-center justify-center text-foreground/30 cursor-pointer',
    dropzone_dragover: 'bg-white/10',
    dropzone_meta: 'flex flex-col items-center justify-center mt-5',
    dropzone_meta_title:
        'text-foreground font-bold text-xl text-center normal-case max-sm:text-lg',
    dropzone_meta_title_span: 'opacity-50',
    dropzone_meta_icon: 'mb-1',
    dropzone_meta_icon_svg: 'text-foreground size-16 opacity-25 max-sm:size-12',
    dropzone_or:
        'py-8 relative w-full text-center uppercase flex flex-row items-center max-sm:py-5',
    dropzone_or_span: 'px-3 z-10',
    dropzone_or_separator: 'flex-1 h-[1px] bg-white/10',
    dropzone_browse: 'mb-5',
    dropzone_browse_button:
        'bg-white/10 rounded-lg py-3 px-5 text-gray-400 text-sm font-extrabold normal-case',
};
