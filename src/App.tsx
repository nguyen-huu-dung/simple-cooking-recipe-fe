import './services/i18n';
import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingApi from './components/loading/LoadingApi';
import Modals from './components/modal/Modals';
import { ToastContainer } from 'react-toastify';
import { useStore } from './hooks/useStore';
import { observer } from 'mobx-react-lite';
import { scrollToTop } from './utils/utils';

import '/node_modules/flag-icons/css/flag-icons.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.scss';

export default observer(function App() {
    // hooks
    const { i18n } = useTranslation();
    const location = useLocation();

    // store
    const {
        authStore: { token, getProfile }
    } = useStore();

    // lifecycle
    useEffect(() => {
        // Set initial language
        handleLanguageChange(i18n.language);

        // Listen for language changes
        i18n.on('languageChanged', handleLanguageChange);

        // Clean up listener on unmount
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    useEffect(() => {
        !!token && getProfile();
    }, [token]);

    useEffect(() => {
        scrollToTop();
    }, [location.pathname]);

    // function
    const handleLanguageChange = (lng: string) => {
        document.documentElement.lang = lng;
    };

    return (
        <div className='app'>
            <Outlet />
            <LoadingApi />
            <ToastContainer />
            <Modals />
        </div>
    );
});
