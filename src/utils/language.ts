import { LANGUAGES_MAPPER } from '@/configs/constants';
import { Locale } from 'date-fns';

export const getLocaleDateFns = (locale: string): Locale => {
    switch (locale) {
        // TO DO: thêm language khác vào đây

        default:
            return LANGUAGES_MAPPER.vietnamese.dateFns;
    }
};
