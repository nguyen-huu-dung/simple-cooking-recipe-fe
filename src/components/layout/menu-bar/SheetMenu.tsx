import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';
import {
    Sheet,
    SheetHeader,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
    SheetClose
} from '@/components/common/Sheet';
import { ROUTES } from '@/configs/constants';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import React from 'react';
import { Link } from 'react-router';
import Menu from './_components/Menu';
import Logo from '@/assets/images/logo.png';

interface WrapperSheetCloseProps {
    useSheetClose?: boolean
}

export const WrapperSheetClose = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & WrapperSheetCloseProps
>(({ children, useSheetClose, ...props }, ref) => (
    <div ref={ref} {...props}>
        {
            !useSheetClose ?
                (
                    <>{children}</>
                ) :
                (
                    <SheetClose asChild>{children}</SheetClose>
                )
        }
    </div>
));
WrapperSheetClose.displayName = 'WrapperSheetClose';

export default function SheetMenu() {
    return (
        <Sheet>
            <SheetTrigger className='lg:hidden' asChild>
                <Button className='h-8' variant='outline' size='icon'>
                    <MenuIcon size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent
                className='sm:w-72 px-3 h-full flex flex-col'
                side='left'
            >
                <SheetHeader>
                    <SheetTitle>
                        <VisuallyHidden.Root>Sheet Menu</VisuallyHidden.Root>
                    </SheetTitle>
                    <SheetDescription>
                        <VisuallyHidden.Root>
                            Description goes here
                        </VisuallyHidden.Root>
                    </SheetDescription>
                    <WrapperSheetClose useSheetClose>
                        <Button
                            className='flex justify-center items-center pb-2 pt-1'
                            variant='link'
                            asChild
                        >
                            <Link
                                to={ROUTES.home.href}
                                className='flex items-center gap-2'
                            >
                                {/* logo */}
                                <img
                                    src={Logo}
                                    alt='logo'
                                    className='w-36 translate-y-3'
                                />
                            </Link>
                        </Button>
                    </WrapperSheetClose>
                </SheetHeader>
                <Menu useSheetClose />
            </SheetContent>
        </Sheet>
    );
}
