import { Link } from 'react-router';
import { useState } from 'react';
import { ChevronDown, Dot, LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/common/Collapsible';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/utils';
import { WrapperSheetClose } from '../SheetMenu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/common/DropdownMenu';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import Tooltip from '@/components/common/Tooltip';

interface Submenu {
    href: string,
    label: string,
    active: boolean
}

interface CollapseMenuButtonProps {
    icon: LucideIcon,
    label: string,
    active: boolean,
    submenus: Submenu[],
    isOpen?: boolean,
    useSheetClose?: boolean
}

export default function CollapseMenuButton({
    icon: Icon,
    label,
    active,
    submenus,
    isOpen,
    useSheetClose
}: CollapseMenuButtonProps) {
    // hooks
    const { t } = useTranslation();

    // state
    const isSubmenuActive = submenus.some(submenu => submenu.active);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

    return isOpen ?
        (
            <Collapsible
                open={isCollapsed}
                onOpenChange={setIsCollapsed}
                className='w-full'
            >
                <CollapsibleTrigger
                    className='[&[data-state=open]>div>div>svg]:rotate-180 mb-1'
                    asChild
                >
                    <Button
                        variant={active ? 'secondary' : 'ghost'}
                        className='w-full justify-start h-10'
                    >
                        <div className='w-full items-center flex justify-between'>
                            <div className='flex items-center'>
                                <span className='mr-4'>
                                    <Icon size={18} />
                                </span>
                                <p
                                    className={cn(
                                        'max-w-[150px] truncate',
                                        isOpen ?
                                            'translate-x-0 opacity-100' :
                                            '-translate-x-96 opacity-0'
                                    )}
                                >
                                    {t(label)}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    'whitespace-nowrap',
                                    isOpen ?
                                        'translate-x-0 opacity-100' :
                                        '-translate-x-96 opacity-0'
                                )}
                            >
                                <ChevronDown
                                    size={18}
                                    className='transition-transform duration-200'
                                />
                            </div>
                        </div>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className='overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                    {submenus.map(({ href, label, active }, index) => (
                        <WrapperSheetClose
                            key={index}
                            useSheetClose={useSheetClose}
                        >
                            <Button
                                variant={active ? 'secondary' : 'ghost'}
                                className='w-full justify-start h-10 mb-1'
                                asChild
                            >
                                <Link to={href}>
                                    <span className='mr-4 ml-2'>
                                        <Dot size={18} />
                                    </span>
                                    <p
                                        className={cn(
                                            'max-w-[170px] truncate',
                                            isOpen ?
                                                'translate-x-0 opacity-100' :
                                                '-translate-x-96 opacity-0'
                                        )}
                                    >
                                        {t(label)}
                                    </p>
                                </Link>
                            </Button>
                        </WrapperSheetClose>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        ) :
        (
            <DropdownMenu>
                <Tooltip
                    content={t(label)}
                    triggerAsChild={true}
                    side='right'
                    align='start'
                    alignOffset={2}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={active ? 'secondary' : 'ghost'}
                            className='w-full justify-start h-10 mb-1'
                        >
                            <div className='w-full items-center flex justify-between'>
                                <div className='flex items-center'>
                                    <span
                                        className={cn(
                                            isOpen === false ? '' : 'mr-4'
                                        )}
                                    >
                                        <Icon size={18} />
                                    </span>
                                    <p
                                        className={cn(
                                            'max-w-[200px] truncate',
                                            isOpen === false ?
                                                'opacity-0' :
                                                'opacity-100'
                                        )}
                                    >
                                        {t(label)}
                                    </p>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                </Tooltip>
                <DropdownMenuContent side='right' sideOffset={25} align='start'>
                    <DropdownMenuLabel className='max-w-[190px] truncate'>
                        {t(label)}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {submenus.map(({ href, label }, index) => (
                        <DropdownMenuItem key={index} asChild>
                            <Link className='cursor-pointer' to={href}>
                                <p className='max-w-[180px] truncate'>{t(label)}</p>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuArrow className='fill-border' />
                </DropdownMenuContent>
            </DropdownMenu>
        );
}
