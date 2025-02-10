import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { cn } from '@/utils/utils';

interface NumberFormatProps extends NumericFormatProps { }

export default function NumberFormat({
    type = 'text',
    displayType = 'text',
    className,
    thousandSeparator = true,
    allowNegative = false,
    decimalSeparator = '.',
    ...props
}: NumberFormatProps) {
    return (
        <NumericFormat
            type={type}
            displayType={displayType}
            className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50', className)}
            thousandSeparator={thousandSeparator}
            allowNegative={allowNegative}
            decimalSeparator={decimalSeparator}
            {...props}
        />
    );
};
