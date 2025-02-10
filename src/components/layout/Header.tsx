import Logo from '@/assets/images/logo.png';
import SearchInput from '../general/SearchInput';
import { Button } from '../common/Button';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/hooks/useStore';
import SignInModal from '../general/SignInModal';
import { observer } from 'mobx-react-lite';
import UserAvatar from '../general/UserAvatar';
import { Link } from 'react-router';
import { ROUTES } from '@/configs/constants';

export default observer(function Header() {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        authStore: { token },
        modalStore: { showModal }
    } = useStore();

    // function
    const onShowModalSignIn = () => {
        showModal({
            id: 'sign-in',
            showHeader: true,
            showFooter: false,
            headerClassName: 'border-none',
            contentClassName: 'pb-6',
            content: <SignInModal />
        });
    };

    return (
        <header className='w-full sticky top-0 left-0 z-50 bg-background overflow-hidden shadow-sm'>
            <div className='container h-32 md:h-20 flex flex-col items-center justify-between md:flex-row md:gap-8'>
                {/* left header */}
                <div className='h-20 md:h-full'>
                    {/* logo */}
                    <Link to={ROUTES.home.href} reloadDocument>
                        <img src={Logo} alt='logo' className='h-full scale-125 hover:cursor-pointer' />
                    </Link>
                </div>

                <div className='flex w-full flex-1 items-start justify-between gap-4 md:items-center'>
                    {/* search */}
                    <SearchInput
                        className='flex-1 md:flex-initial md:w-80'
                    />

                    {/* right header */}
                    {
                        !token ?
                            (
                                <Button
                                    type='button'
                                    className='rounded-full'
                                    onClick={onShowModalSignIn}
                                >
                                    {t('words_title.sign_in')}
                                </Button>
                            ) :
                            (
                                <UserAvatar />
                            )
                    }
                </div>
            </div>
        </header>
    );
});
