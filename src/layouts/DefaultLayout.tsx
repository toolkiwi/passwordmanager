import { Outlet, useNavigate } from 'react-router';
import SidebarNav from '../components/nav/SidebarNav';
import { useSelector } from 'react-redux';
import { type StoreState } from '@/redux/StoreRedux';
import { type ReactElement, useEffect } from 'react';
import ConsoleCommandUtils from '@/utils/consoleCommandUtils';
import { Tooltip } from 'react-tooltip';
import useIsMobile from '@/hooks/useIsMobile';
import clsx from 'clsx';

/**
 * Provides the main dashboard structure including sidebar navigation
 * and secured access based on app unlocking state.
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
        <main className='relative h-full w-full flex flex-row items-start overflow-auto bg-muted/30 max-sm:bg-background max-sm:p-0'>
            <SidebarNav />
            <section
                className={clsx(
                    'overflow-hidden p-3 w-full h-full relative',
                    'max-sm:p-0',
                )}
            >
                <div
                    className={clsx(
                        'relative h-full w-full bg-foreground/3 rounded-2xl',
                        'max-sm:bg-transparent max-sm:rounded-none',
                    )}
                >
                    <div
                        className={clsx(
                            'max-w-[1250px] w-full mx-auto relative h-full overflow-hidden lg:max-w-[800px] md:max-w-[600px] max-md:border-0 p-3',
                            'max-sm:max-w-none max-sm:p-0 max-sm:mx-0',
                        )}
                    >
                        <div
                            className={clsx(
                                'overflow-auto rounded-2xl border h-full',
                                'max-sm:rounded-none max-sm:border-0',
                            )}
                        >
                            <Outlet />
                        </div>
                    </div>
                </div>
            </section>

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
