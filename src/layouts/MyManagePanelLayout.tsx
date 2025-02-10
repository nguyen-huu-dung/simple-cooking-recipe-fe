import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/menu-bar/Navbar';
import Sidebar from '@/components/layout/menu-bar/Sidebar';
import { useStore } from '@/hooks/useStore';
import { getTitlePage } from '@/utils/routes';
import { cn } from '@/utils/utils';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router';

export default observer(function MyManagePanelLayout() {
    // hooks
    const { pathname } = useLocation();

    // variables
    const title = getTitlePage(pathname);

    // store
    const {
        uiStore: { isOpenSidebar }
    } = useStore();

    return (
        <>
            <Sidebar />
            <main
                className={cn(
                    'bg-gray-100 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
                    isOpenSidebar === false ? 'lg:ml-[90px]' : 'lg:ml-72'
                )}
            >
                <Navbar title={title} />
                <section className='py-4 lg:px-4'>
                    <div className='min-h-[calc(100vh-9.5rem)] space-y-4 flex flex-col'>
                        <Outlet />
                    </div>
                </section>
                <Footer className='mx-4 sm:mx-8' />
            </main>
        </>
    );
});
