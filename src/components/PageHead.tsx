import CommonUtils from '@/utils/commonUtils';
import { ReactNode } from 'react';
import { GoChevronLeft } from 'react-icons/go';
import { useNavigate } from 'react-router';

interface PropsComponentInteface {
    title: string;
    beforeTitle?: ReactNode;
    afterTitle?: ReactNode;
    goBack?: boolean;
}

export default function PageHead({
    title,
    beforeTitle,
    afterTitle,
    goBack,
}: PropsComponentInteface) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history?.length && window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/vault', { replace: true });
        }
    };

    return (
        <div className='min-h-[80px] h-[80px] bg-background px-5 flex flex-row items-center border-b border-neutral-900 sticky top-0 z-30'>
            {goBack && (
                <button
                    type='button'
                    onClick={() => handleBack()}
                    className='w-10 h-10 aspect-square cursor-pointer rounded-lg border border-neutral-800 text-neutral-700 flex items-center justify-center hover:bg-neutral-900/80 mr-5'
                >
                    <GoChevronLeft size={22} color='inherite' />
                </button>
            )}
            {beforeTitle && beforeTitle}
            <h2 className='text-neutral-300 font-semibold text-lg flex-1'>
                {CommonUtils.limitTextLength(title, 35)}
            </h2>
            {afterTitle && afterTitle}
        </div>
    );
}
