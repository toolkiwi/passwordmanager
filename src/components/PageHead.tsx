import useIsMobile from '@/hooks/useIsMobile';
import { setShowSidebar } from '@/redux/features/tempSlice';
import { StoreState } from '@/redux/StoreRedux';
import CommonUtils from '@/utils/commonUtils';
import { ReactElement, ReactNode } from 'react';
import { GoChevronLeft } from 'react-icons/go';
import { TbMenu } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
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
    /**
     * Get sidebar state from temp
     */
    const SidebarState = useSelector(
        (state: StoreState) => state.temp.show_sidebar,
    );
    /**
     * Instance useIsMobile hook
     */
    const isMobile = useIsMobile();

    /**
     * Instance useNavigate hook
     */
    const navigate = useNavigate();
    /**
     * Instance useDispatch hook
     */
    const dispatch = useDispatch();

    /**
     * On press back button
     */
    const handleBack = () => {
        if (window.history?.length && window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/vault', { replace: true });
        }
    };

    /**
     * Renders the mobile sidebar toggle button (hamburger icon)
     * Only shown on mobile when there is no `goBack` prop provided.
     */
    const RenderSidebarToggleButton = (): ReactElement | undefined => {
        if (!(!goBack && isMobile)) return;
        return (
            <div
                className='w-[45px] h-[45px] flex items-center justify-center'
                onClick={() => dispatch(setShowSidebar(!SidebarState))}
            >
                <TbMenu size={24} className='text-white' />
            </div>
        );
    };

    /**
     * Render JSX
     */
    return (
        <div className='min-h-[80px] h-[80px] bg-background px-5 flex flex-row items-center border-b border-neutral-900 sticky top-0 z-30 max-sm:px-3!'>
            <RenderSidebarToggleButton />
            {goBack && (
                <button
                    type='button'
                    onClick={() => handleBack()}
                    className='w-10 h-10 aspect-square cursor-pointer rounded-lg border border-neutral-800 text-foreground/20 flex items-center justify-center hover:bg-neutral-900/80 mr-5'
                >
                    <GoChevronLeft size={22} color='inherite' />
                </button>
            )}
            {beforeTitle && beforeTitle}
            <h2 className='text-foreground/80 font-semibold text-lg max-sm:text-base flex-1 truncate! pr-2'>
                {CommonUtils.limitTextLength(title, 35)}
            </h2>
            {afterTitle && afterTitle}
        </div>
    );
}
