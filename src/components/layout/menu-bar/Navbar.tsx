import { useTranslation } from 'react-i18next';
import SheetMenu from './SheetMenu';
import UserAvatar from '@/components/general/UserAvatar';
interface NavbarProps {
    title: string
}

export default function Navbar({ title }: NavbarProps) {
    // hooks
    const { t } = useTranslation();

    return (
        <header className='sticky z-10 top-0 w-full bg-background shadow backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:shadow-secondary'>
            <div className='mx-4 sm:mx-8 flex h-14 items-center'>
                <div className='flex items-center space-x-4 lg:space-x-0'>
                    <SheetMenu />
                    <h1 className='font-bold text-primary text-lg'>{t(title)}</h1>
                </div>
                <div className='flex flex-1 items-center space-x-2 justify-end'>
                    <UserAvatar />
                </div>
            </div>
        </header>
    );
}
