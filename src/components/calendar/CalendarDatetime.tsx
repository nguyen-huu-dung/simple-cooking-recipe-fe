import Datetime, { DatetimepickerProps } from 'react-datetime';
import { Button } from '../common/Button';
import { cn } from '@/utils/utils';
import { CalendarIcon, CircleXIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES_SUPPORTED } from '@/types/enums';
import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import moment from 'moment';

import 'react-datetime/css/react-datetime.css';
import './style.scss';

type CalendarDatetimeProps = DatetimepickerProps & {
    useIconRemove?: boolean
};

export default function CalendarDatetime({
    dateFormat,
    timeFormat,
    useIconRemove = true,
    onChange,
    locale,
    ...props
}: CalendarDatetimeProps) {
    // hooks
    const { i18n: { language } } = useTranslation();

    // render custom
    const InputCustomRender = (inputProps) => {
        const { value, placeholder, onChange: onChangeInput, onClick, onFocus } = inputProps;

        return (
            <Button
                variant='outline'
                type='button'
                onClick={onClick}
                onFocus={onFocus}
                className={cn(
                    'relative justify-start text-left font-normal',
                    'min-w-[280px]',
                    !value && 'text-muted-foreground',
                    value && useIconRemove && 'pr-9'
                )}
            >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {
                    value ? value : <span>{placeholder}</span>
                }
                <div className='flex items-center gap-2'>
                    {
                        value && useIconRemove && (
                            <CircleXIcon
                                className='h-4 w-4 absolute right-4 hover:text-red-500'
                                onPointerDown={(e) => {
                                    e?.stopPropagation();
                                    onChangeInput?.('');
                                }}
                            />
                        )
                    }
                </div>
            </Button>
        );
    };

    const MonthCustomRender = (monthProps, month) => {
        const { key, ...otherMonthProps } = monthProps;
        const formatMonth = language === LANGUAGES_SUPPORTED.Vietnamese ?
            {
                previousLabel: 'Tháng',
                format: 'MMMM',
                locale: vi
            } :
            {
                previousLabel: '',
                format: 'MMM',
                locale: enUS
            };
        return (
            <td key={key} {...otherMonthProps}>
                {
                    format(moment().set('month', month).toDate(), formatMonth.format, {
                        locale: formatMonth.locale
                    })
                }
            </td>
        );
    };

    return (
        <Datetime
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            onChange={onChange}
            renderInput={InputCustomRender}
            renderMonth={MonthCustomRender}
            locale={locale}
            {...props}
        />
    );
}
