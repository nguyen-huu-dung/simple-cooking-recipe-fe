import { ScrollArea } from '@/components/common/ScrollArea';
import Tooltip from '@/components/common/Tooltip';
import { getMenuList } from '@/utils/routes';
import { cn } from '@/utils/utils';
import { EllipsisIcon, Undo2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { WrapperSheetClose } from '../SheetMenu';
import { Button } from '@/components/common/Button';
import CollapseMenuButton from './CollapseMenuButton';
import { ROUTES } from '@/configs/constants';

interface MenuProps {
    isOpen?: boolean,
    useSheetClose?: boolean
}

export default function Menu({ isOpen, useSheetClose }: MenuProps) {
    // hooks
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const menuList = getMenuList(pathname);

    // function
    const onHandleBackToHome = () => {
        navigate(ROUTES.home.href);
    };

    return (
        <nav className='mt-4 h-full w-full px-2 flex flex-col justify-between'>
            <ScrollArea className='[&>div>div[style]]:!block'>
                <ul className='flex flex-col max-h-[calc(100vh-48px-36px-16px-32px-30px)] items-start space-y-1'>
                    {menuList.map(({ groupLabel, menus }, index) => (
                        <li
                            className={cn('w-full', groupLabel ? 'pt-5' : '')}
                            key={index}
                        >
                            {
                                (isOpen && groupLabel) || isOpen === undefined ?
                                    (
                                        <p className='text-sm font-medium text-muted-foreground px-4 pb-[7px] max-w-[248px] truncate'>
                                            {t(groupLabel)}
                                        </p>
                                    ) :
                                    (isOpen === false && groupLabel) ?
                                        (
                                            <Tooltip
                                                content={<p>{t(groupLabel)}</p>}
                                                triggerClassName='w-full'
                                                side='right'
                                            >
                                                <div className='w-full flex justify-center items-center'>
                                                    <EllipsisIcon className='h-5 w-5' />
                                                </div>
                                            </Tooltip>
                                        ) :
                                        (
                                            <p className='pb-2'></p>
                                        )
                            }
                            {
                                menus.map(({ href, label, icon: Icon, active, submenus }, index) => (
                                    submenus.length === 0 ?
                                        (
                                            <div className='w-full' key={index}>
                                                <Tooltip
                                                    content={isOpen === false && t(label)}
                                                    triggerAsChild={true}
                                                    side='right'
                                                >
                                                    <WrapperSheetClose useSheetClose={useSheetClose}>
                                                        <Button
                                                            variant={active ? 'default' : 'ghost'}
                                                            className='w-full justify-start h-10 mb-1'
                                                            asChild
                                                        >
                                                            <Link to={href}>
                                                                <span
                                                                    className={cn(isOpen === false ? '' : 'mr-4')}
                                                                >
                                                                    <Icon size={18} />
                                                                </span>
                                                                <p
                                                                    className={cn(
                                                                        'max-w-[200px] truncate font-medium',
                                                                        isOpen === false ?
                                                                            '-translate-x-96 opacity-0' :
                                                                            'translate-x-0 opacity-100'
                                                                    )}
                                                                >
                                                                    {t(label)}
                                                                </p>
                                                            </Link>
                                                        </Button>
                                                    </WrapperSheetClose>
                                                </Tooltip>
                                            </div>
                                        ) :
                                        (
                                            <div className='w-full' key={index}>
                                                <CollapseMenuButton
                                                    icon={Icon}
                                                    label={label}
                                                    active={active}
                                                    submenus={submenus}
                                                    isOpen={isOpen}
                                                    useSheetClose={useSheetClose}
                                                />
                                            </div>
                                        )
                                ))
                            }
                        </li>
                    ))}
                </ul>
            </ScrollArea>

            {/* back to home page button */}
            <ul>
                <li className='w-full grow flex items-end'>
                    <Tooltip
                        content={isOpen === false && t('words_title.back_to_home')}
                        triggerAsChild={true}
                        side='right'
                    >
                        <Button
                            onClick={onHandleBackToHome}
                            variant='outlinePrimary'
                            className='w-full justify-start h-10'
                        >
                            <span
                                className='flex items-center transition-all overflow-hidden mx-auto'
                            >
                                <span>
                                    <Undo2Icon size={18} />
                                </span>
                                <p
                                    className={cn(
                                        'whitespace-nowrap ml-4 transition-opacity',
                                        isOpen === false ?
                                            'opacity-0 delay-150' :
                                            'opacity-100'
                                    )}
                                >
                                    {t('words_title.back_to_home')}
                                </p>
                            </span>
                        </Button>
                    </Tooltip>
                </li>
            </ul>
        </nav>
    );
}
