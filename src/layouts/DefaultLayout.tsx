import { Outlet, useNavigate } from 'react-router';
import SidebarNav from '../components/nav/SidebarNav';
import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/StoreRedux';
import { ReactElement, useEffect } from 'react';
import ConsoleCommandUtils from '@/utils/consoleCommandUtils';

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
        <main className='relative h-screen w-screen flex flex-row items-start overflow-auto'>
            <SidebarNav />
            <div className='max-w-[1250px] w-full mx-auto relative h-screen overflow-auto border-l border-r border-neutral-900 lg:max-w-[800px] md:max-w-[600px] max-md:border-0'>
                <Outlet />
            </div>
        </main>
    );
}
