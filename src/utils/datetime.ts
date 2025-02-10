import { t } from 'i18next';
import moment from 'moment';

interface formatDateTimeOptions {
    returnDefault?: null | '',
    onlyTime?: boolean,
    currentformat?: string
}

export const formatDateTime = (datetime?: string | Date | null, format?: string, options?: formatDateTimeOptions) => {
    if (!datetime) return options?.returnDefault ?? null;
    if (options?.onlyTime && options?.currentformat) {
        return moment(datetime, [moment.ISO_8601, options.currentformat]).format(format);
    }
    if (datetime instanceof Date) return moment(datetime).format(format);
    return moment(datetime).format(format);
};

export const convertMinutesToHours = (minutes: number, hourLabel: string = t('words_title.hours'), minuteLabel: string = t('words_title.minutes')) => {
    if (typeof minutes !== 'number' || minutes < 0) {
        return '';
    }

    const duration = moment.duration(minutes, 'minutes');
    const hours = Math.floor(duration.asHours());
    const mins = duration.minutes();

    if (!hours) return `${mins} ${minuteLabel}`;

    if (!mins) return `${hours} ${hourLabel}`;

    return `${hours} ${hourLabel} ${mins} ${minuteLabel}`;
};
