import * as React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { DayPicker, useDayPicker } from 'react-day-picker';
import { cn } from '@/utils/utils';
import { format } from 'date-fns';
import { buttonVariants } from '../common/Button';
import { DISPLAY_FNS_DATE_YM, LANGUAGES_MAPPER } from '@/configs/constants';
import moment from 'moment';
import { LANGUAGES_SUPPORTED } from '@/types/enums';

export type ReactDayPickerProps = React.ComponentProps<typeof DayPicker>;

function ReactDayPicker({
    className,
    classNames,
    showOutsideDays = true,
    startMonth = moment().subtract(100, 'years').toDate(),
    endMonth = moment().add(10, 'years').toDate(),
    ...props
}: ReactDayPickerProps) {
    const navigationButtonStyles = cn(
        buttonVariants({ variant: 'outline' }),
        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
    );

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            startMonth={startMonth}
            endMonth={endMonth}
            captionLayout='dropdown'
            className={cn('p-3 rounded-md border', className)}
            classNames={{
                nav: 'flex items-center justify-between',
                chevron: 'w-4 h-4',
                button_next: navigationButtonStyles,
                button_previous: navigationButtonStyles,
                caption_label: 'text-sm font-medium hidden',
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 font-normal text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 hover:cursor-pointer'
                ),
                day_button: 'h-9 w-9',
                selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                disabled: 'text-muted-foreground opacity-50',
                focused: '',
                hidden: 'invisible',
                outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                today: 'bg-accent text-accent-foreground',
                dropdown: 'font-normal text-sm border-none outline-none hover:cursor-pointer',
                dropdown_root: '',
                dropdowns: 'flex flex-row-reverse gap-2 w-[196px] h-[28px] items-center justify-center',
                footer: '',
                month: 'w-full border-collapse',
                month_caption: 'absolute top-0 left-[28px]',
                month_grid: '',
                months: 'relative flex flex-col space-y-4',
                months_dropdown: '',
                root: '',
                week: 'flex w-full mt-2',
                week_number: '',
                week_number_header: '',
                weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                weekdays: 'flex',
                weeks: '',
                years_dropdown: '',
                ...classNames
            }}
            components={{
                Chevron: ({ className, orientation = 'down' }) => {
                    const iconChevron = {
                        'down': ChevronDown,
                        'up': ChevronUp,
                        'left': ChevronLeft,
                        'right': ChevronRight
                    };

                    const Comp = iconChevron[orientation];

                    return (
                        <Comp className={className} />
                    );
                },
                YearsDropdown: ({ options, ...props }) => {
                    const { components } = useDayPicker();
                    return <components.Dropdown {...props} options={options?.sort((a, b) => b.value - a.value)} />;
                },
                NextMonthButton: ({ className, disabled, ...props }) => {
                    const { components } = useDayPicker();
                    return <components.Button className={cn(className, disabled && 'invisible')} disabled={disabled} {...props} />;
                },
                PreviousMonthButton: ({ className, disabled, ...props }) => {
                    const { components } = useDayPicker();
                    return <components.Button className={cn(className, disabled && 'invisible')} disabled={disabled} {...props} />;
                }
            }}
            formatters={{
                formatMonthDropdown: (month, locale) => {
                    const formatMonth = locale?.code === LANGUAGES_MAPPER.vietnamese.code ? 'MM' : 'MMM';
                    return format(new Date().setMonth(month), formatMonth, {
                        locale
                    });
                },
                formatCaption: (date, options) => {
                    return format(date, DISPLAY_FNS_DATE_YM[options?.locale?.code ?? LANGUAGES_SUPPORTED.English]);
                }
            }}
            {...props}
        />
    );
}
ReactDayPicker.displayName = 'ReactDayPicker';

export { ReactDayPicker };
