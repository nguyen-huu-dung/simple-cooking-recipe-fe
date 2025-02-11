import * as React from 'react';
import { compareAsc, format } from 'date-fns';
import { Calendar as CalendarIcon, CircleXIcon } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '../common/Popover';
import { isDateRange } from 'react-day-picker';
import { ReactDayPickerProps, ReactDayPicker } from './ReactDayPicker';
import { useTranslation } from 'react-i18next';
import { getLocaleDateFns } from '@/utils/language';
import { Button } from '../common/Button';
import { cn } from '@/utils/utils';
import { DISPLAY_FNS_DATE_YMD } from '@/configs/constants';

type CalendarProps = ReactDayPickerProps & {
    mode: 'single' | 'multiple' | 'range',
    selected: any,
    onSelect: any,
    type?: 'calendar' | 'datePicker',
    placeholder?: string,
    useIconRemove?: boolean,
    formatDate?: string,
    inputClassName?: string
};

export default function Calendar({
    type = 'datePicker',
    mode,
    selected,
    onSelect,
    onDayClick,
    placeholder = 'Select date',
    useIconRemove = true,
    formatDate,
    inputClassName,
    required,
    ...props
}: CalendarProps) {
    // hooks
    const { i18n: { language } } = useTranslation();
    const localeDateFns = getLocaleDateFns(language);
    const useFormatDate = formatDate ?? DISPLAY_FNS_DATE_YMD[language] ?? DISPLAY_FNS_DATE_YMD.vi;

    // state
    const [openCalendar, setOpenCalendar] = React.useState<boolean>(false);
    const [countClickDays, setCountClickDays] = React.useState<number>(0);

    // function
    const onCheckCloseCalendarRange = (date: Date) => {
        if (countClickDays > 0 && selected?.from && compareAsc(selected.from, date) !== 0) {
            setOpenCalendar(false);
            setCountClickDays(0);
        } else {
            setCountClickDays(state => state + 1);
        }
    };

    // render
    const CalendarChildren = () => {
        const defaultMonth = mode === 'single' ?
            selected :
            (
                mode === 'range' ?
                    (selected?.from ?? selected?.to) :
                    (
                        mode === 'multiple' ? selected?.[selected?.length - 1] : undefined
                    )
            );

        return (
            <ReactDayPicker
                mode={mode}
                locale={localeDateFns}
                selected={selected}
                onSelect={onSelect}
                onDayClick={(date, modifiers, e) => {
                    onDayClick && onDayClick(date, modifiers, e);
                    mode === 'single' && setOpenCalendar(false);
                    mode === 'range' && onCheckCloseCalendarRange(date);
                }}
                defaultMonth={defaultMonth}
                required={required}
                {...props}
            />
        );
    };

    if (type === 'calendar') {
        return <CalendarChildren />;
    }

    return (
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    className={cn(
                        'relative justify-start text-left font-normal',
                        'min-w-[280px]',
                        !selected && 'text-muted-foreground',
                        selected && useIconRemove && 'pr-9',
                        inputClassName,
                        required && !selected && 'border-destructive'
                    )}
                >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {
                        selected && selected instanceof Date && format(selected, useFormatDate)
                    }
                    {
                        (selected instanceof Array && selected.length > 0) && (
                            selected.length > 3 ?
                                `${selected.length} selected date` :
                                selected.map(selectDate => format(selectDate, useFormatDate)).join(', '))
                    }
                    {
                        selected && isDateRange(selected) && selected.from &&
                        `${format(selected.from, useFormatDate)} ~ ${selected.to ? format(selected.to, useFormatDate) : ''}`
                    }
                    {
                        (!selected || (selected instanceof Array && selected.length === 0)) &&
                        <span>{placeholder}</span>
                    }
                    {
                        selected && useIconRemove && (
                            <CircleXIcon
                                className='h-4 w-4 absolute right-4 hover:text-red-500'
                                onPointerDown={() => {
                                    onSelect && onSelect(undefined);
                                    mode === 'range' && setCountClickDays(0);
                                }}
                            />
                        )
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0 shadow-none border-none'>
                <CalendarChildren />
            </PopoverContent>
        </Popover>
    );
}
