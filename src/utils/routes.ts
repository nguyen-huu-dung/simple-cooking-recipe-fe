import { ROUTES } from '@/configs/constants';
import { GroupMenu, Route } from '@/types/routes';
import { CookingPotIcon, InfoIcon } from 'lucide-react';

// #region Title Page
export const getTitlePage = (pathname: string): string => {
    if (!pathname) {
        return '';
    }
    const findRoute = Object.values(ROUTES).find(value => value.href === pathname);
    return findRoute?.title ?? '';
};
// #rendregion

// #region Menu
export const getMenuList = (pathname: string): GroupMenu[] => {
    return [
        {
            groupLabel: '',
            menus: [
                {
                    href: ROUTES.profile.href,
                    label: ROUTES.profile.menuLabel,
                    active: pathname === ROUTES.profile.href,
                    icon: InfoIcon,
                    submenus: []
                }
            ]
        },
        {
            groupLabel: '',
            menus: [
                {
                    href: ROUTES.myCookingRecipeManagement.href,
                    label: ROUTES.myCookingRecipeManagement.menuLabel,
                    active: pathname.includes(ROUTES.myCookingRecipeManagement.href) || pathname === ROUTES.createMyCookingRecipe.href,
                    icon: CookingPotIcon,
                    submenus: []
                }
            ]
        }
    ];
};
// #endregion
