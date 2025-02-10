import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Outlet } from 'react-router';

export default function GeneralPanelLayout() {
    return (
        <>
            {/* Header */}
            <Header />

            {/* Body Content */}
            <main className='bg-gray-100 flex flex-col min-h-[calc(100vh-12rem)] md:min-h-[calc(100vh-9rem)]'>
                <div className='container flex-1 flex flex-col py-4 px-0 xlg:px-4'>
                    <Outlet />
                </div>
            </main>

            {/* footer */}
            <Footer className='container' />
        </>
    );
}
