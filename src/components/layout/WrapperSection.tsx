import { cn } from '@/utils/utils';
import { ComponentProps } from 'react';

interface WrapperSectionProps extends ComponentProps<'section'> { }

export default function WrapperSection({ className, children }: WrapperSectionProps) {
    return (
        <section className={cn('bg-background rounded p-4', className)}>
            {children}
        </section>
    );
}
