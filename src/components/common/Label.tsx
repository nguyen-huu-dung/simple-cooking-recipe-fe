import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';

const labelVariants = cva(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> &
    { required?: boolean }
>(({ className, required, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), required && 'after:content-["_*"] after:text-red-700', className)}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

const FloatingLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
    return (
        <Label
            className={cn(
                'leading-4 absolute start-3 top-2 z-10 origin-left scale-75 text-label-1 duration-300',
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
                'peer-data-[placeholder]:top-1/2 peer-data-[placeholder]:-translate-y-1/2 peer-data-[placeholder]:scale-100',
                'peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:scale-75',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
FloatingLabel.displayName = 'FloatingLabel';

export { Label, FloatingLabel };
