export const LANGUAGES_SUPPORTED = {
    Vietnamese: 'vi'
} as const;

export type LanguagesSupported = (typeof LANGUAGES_SUPPORTED)[keyof typeof LANGUAGES_SUPPORTED];

export const STATUS = {
    Active: 1,
    Inactive: 2
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const MODE_FORM = {
    Create: 1,
    Edit: 2
} as const;

export type ModeForm = (typeof MODE_FORM)[keyof typeof MODE_FORM];

export const GENDER = {
    Male: 1,
    Female: 2
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];
