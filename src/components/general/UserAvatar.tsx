import { LogOutIcon, UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/common/DropdownMenu';
import Tooltip from '@/components/common/Tooltip';
import { Button } from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import { Link } from 'react-router';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { getAvatarFallbackName } from '@/utils/utils';
import { ROUTES } from '@/configs/constants';

export default observer(function UserAvatar() {
    // hooks
    const { t } = useTranslation();

    // store
    const { authStore: { signOut, profile } } = useStore();

    return (
        <DropdownMenu>
            <Tooltip
                content={t('words_title.profile')}
                triggerAsChild={true}
                side='bottom'
                align='end'
            >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='outline'
                        className='relative h-8 w-8 rounded-full'
                    >
                        <Avatar fallback={getAvatarFallbackName(profile?.fullName ?? profile?.code)} randomColor />
                    </Button>
                </DropdownMenuTrigger>
            </Tooltip>

            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            {profile?.fullName}
                        </p>
                        <p className='text-xs leading-none text-muted-foreground'>
                            {profile?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to={ROUTES.profile.href} className='flex items-center'>
                            <UserIcon className='w-4 h-4 mr-3 text-muted-foreground' />
                            {t('words_title.account_management')}
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={signOut}
                >
                    <LogOutIcon className='w-4 h-4 mr-3 text-muted-foreground' />
                    {t('words_title.sign_out')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
