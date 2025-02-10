import { GENDER, LANGUAGES_SUPPORTED, LanguagesSupported } from '@/types/enums';
import { LanguageInfo } from '@/types/language';
import { Route } from '@/types/routes';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { vi } from 'date-fns/locale';

// #region Routes
enum RoutesKey {
    home,
    profile,
    myCookingRecipeManagement,
    createMyCookingRecipe,
    cookingRecipeDetail
};

export const ROUTES: Record<keyof typeof RoutesKey, Route> = {
    home: {
        href: '/',
        title: 'words_title.home',
        menuLabel: 'words_title.home',
        breadcrumbLabel: 'words_title.home'
    },
    profile: {
        href: '/profile',
        title: 'words_title.profile',
        menuLabel: 'words_title.profile',
        breadcrumbLabel: 'words_title.profile'
    },
    myCookingRecipeManagement: {
        href: '/my-cooking-recipe-management',
        title: 'words_title.cooking_recipe_management',
        menuLabel: 'words_title.cooking_recipe_management',
        breadcrumbLabel: 'words_title.cooking_recipe_management'
    },
    createMyCookingRecipe: {
        href: '/create-my-cooking-recipe',
        title: 'words_title.create_cooking_recipe',
        menuLabel: 'words_title.create_cooking_recipe',
        breadcrumbLabel: 'words_title.create_cooking_recipe'
    },
    cookingRecipeDetail: {
        href: '/cooking-recipe/:slug',
        title: '',
        menuLabel: ''
    }
};

// #endregion Routes

// #region Languages
export const DEFAULT_LANGUAGE: LanguagesSupported = LANGUAGES_SUPPORTED.Vietnamese;

export const LANGUAGES_MAPPER: {
    vietnamese: LanguageInfo
} = {
    vietnamese: {
        code: LANGUAGES_SUPPORTED.Vietnamese,
        fullName: 'words_title.vietnamese',
        shortName: 'VI',
        flag: 'vn',
        dateFns: vi
    }
};

// #endredion

// #region Dates

export const DISPLAY_FNS_DATE_YMD = {
    [LANGUAGES_SUPPORTED.Vietnamese]: 'dd/MM/yyyy'
};

export const DISPLAY_FNS_DATE_YM = {
    [LANGUAGES_SUPPORTED.Vietnamese]: 'MM/yyyy'
};

export const DISPLAY_MOMENT_DATE_YMDHM = {
    [LANGUAGES_SUPPORTED.Vietnamese]: 'DD/MM/YYYY HH:mm'
};

// use for submit api
export const SUBMIT_MOMENT_DATE_YMD = 'YYYY-MM-DD';

// #endregion

// #region Table

export const DEFAULT_SELECT_PAGE_SIZES: number[] = [10, 20, 50, 100, 200, 500, 1000];

export const DEFAULT_PAGINATION: PaginationState = {
    pageIndex: 0,
    pageSize: 10
};

// #endregion

// #region Regex
export const EMAIL_REGEX = /^(?=[\s\S]{1,320}$)([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9.-]{1,255})\.[a-zA-Z]{2,}$/;
export const ONLY_NUMBER_REGEX = /^\d+$/;

// #endregion

// #region other
export const MAX_LENGTH_DEFAULT = {
    INPUT: 255,
    TEXTAREA: 5000
};
export const FILE_SIZE_IMAGE = 5 * 1024 * 1024; // 5 MB
export const ALLOW_FILE_IMAGES_EXT = ['jpg', 'png', 'jpeg', 'webp'];

// #endregion

// #region gender
export const GENDER_MAPPER = {
    [GENDER.Male]: {
        label: 'words_title.male'
    },
    [GENDER.Female]: {
        label: 'words_title.female'
    }
};

// #endregion

// #region sort cooking recipe
export const COOKING_RECIPE_SORT_OPTIONS: (ColumnSort & { label: string })[] = [
    {
        id: 'created_at', // default
        desc: true,
        label: 'words_title.sort_new'
    },
    {
        id: 'shuffle',
        desc: true,
        label: 'words_title.sort_shuffle'
    }
];

// #endregion
