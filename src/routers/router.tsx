import App from '@/App';
import { ROUTES } from '@/configs/constants';
import withAuthentication from '@/hooks/withAuthentication';
import { GeneralPanelLayout } from '@/layouts';
import MyManagePanelLayout from '@/layouts/MyManagePanelLayout';
import { CookingRecipeManagementPage, HomePage, NotFoundPage, ProfilePage } from '@/pages';
import CookingRecipeDetail from '@/pages/cooking-recipe-detail';
import SettingCookingRecipe from '@/pages/my-cooking-recipe/SettingCookingRecipe';
import { MODE_FORM } from '@/types/enums';
import { createBrowserRouter } from 'react-router';

const MyManagePanelLayoutWithAuthentication = withAuthentication(MyManagePanelLayout);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <GeneralPanelLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />
                    },
                    {
                        path: ROUTES.cookingRecipeDetail.href,
                        element: <CookingRecipeDetail />
                    }
                ]

            },
            {
                path: '/',
                element: <MyManagePanelLayoutWithAuthentication />,
                children: [
                    {
                        path: ROUTES.profile.href,
                        element: <ProfilePage />
                    },
                    {
                        path: ROUTES.myCookingRecipeManagement.href,
                        children: [
                            {
                                index: true,
                                element: <CookingRecipeManagementPage />
                            },
                            {
                                path: ':code',
                                element: <SettingCookingRecipe mode={MODE_FORM.Edit} />
                            }
                        ]
                    },
                    {
                        path: ROUTES.createMyCookingRecipe.href,
                        element: <SettingCookingRecipe mode={MODE_FORM.Create} />
                    }
                ]

            },
            {
                path: '*',
                element: <GeneralPanelLayout />,
                children: [
                    {
                        path: '*',
                        element: <NotFoundPage />
                    }
                ]
            }
        ]
    }
]);
