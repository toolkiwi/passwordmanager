import { Outlet, useNavigate } from 'react-router';
import SidebarNav from '../components/nav/SidebarNav';
import { useSelector } from 'react-redux';
import { type StoreState } from '@/redux/StoreRedux';
import { type ReactElement, useEffect } from 'react';
import ConsoleCommandUtils from '@/utils/consoleCommandUtils';
import { Tooltip } from 'react-tooltip';
import useIsMobile from '@/hooks/useIsMobile';

/**
 * Provides the main dashboard structure including sidebar navigation
 * and secured access based on app unlocking state.
 *
 * @returns {ReactElement | null} The dashboard layout if unlocked, otherwise null.
 */
export default function DashboardLayout(): ReactElement | null {
    /**
     * Get all redux states
     */
    const App = useSelector((state: StoreState) => state.app);
    const Vault = useSelector((state: StoreState) => state.vault);

    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();
    /**
     * Insatance of useIsMobile hook
     */
    const isMobile = useIsMobile();

    /**
     * On App.unlocked update
     */
    useEffect(() => {
        if (!App.unlocked) {
            navigate('/', { replace: true });
        }
        ConsoleCommandUtils.RegisterVaultInformations(Vault, App);
    }, [App.unlocked, Vault]);

    /**
     *  If the application is not unlocked, prevent rendering of the dashboard layout
     */
    if (!App.unlocked) {
        return null;
    }

    /**
     * Render layout
     */
    return (
        <main className='relative h-full w-full flex flex-row items-start overflow-auto'>
            <SidebarNav />
            <div className='max-w-[1250px] w-full mx-auto relative h-full overflow-auto border-l border-r lg:max-w-[800px] md:max-w-[600px] max-md:border-0'>
                <Outlet />
            </div>
            <Tooltip
                id='default-tooltip'
                hidden={isMobile}
                noArrow
                style={{ borderRadius: 8, zIndex: 10000 }}
                delayShow={400}
            />
        </main>
    );
}
