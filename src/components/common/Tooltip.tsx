import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import React from 'react';
import { cn } from '@/utils/utils';

interface TooltipProps
    extends Omit<TooltipPrimitive.TooltipProps, 'children'>,
    Pick<
        TooltipPrimitive.TooltipContentProps,
        'side' | 'sideOffset' | 'align' | 'alignOffset'
    > {
    children: React.ReactNode,
    content?: React.ReactNode,
    triggerAsChild?: TooltipPrimitive.TooltipTriggerProps['asChild'],
    triggerClassName?: TooltipPrimitive.TooltipTriggerProps['className'],
    triggerType?: TooltipPrimitive.TooltipTriggerProps['type'],
    contentClassName?: TooltipPrimitive.TooltipContentProps['className'],
    arrow?: boolean,
    arrowWidth?: number,
    arrowHeight?: number,
    arrowClassname?: string
}

export default function Tooltip({
    children,
    content,
    triggerAsChild = false,
    triggerClassName,
    triggerType,
    contentClassName,
    open,
    defaultOpen,
    onOpenChange,
    disableHoverableContent = true,
    delayDuration = 100,
    side,
    sideOffset = 4,
    align,
    alignOffset,
    arrow = false,
    arrowHeight,
    arrowWidth,
    arrowClassname
}: TooltipProps) {
    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root
                open={open}
                defaultOpen={defaultOpen}
                onOpenChange={onOpenChange}
                delayDuration={delayDuration}
                disableHoverableContent={disableHoverableContent}
            >
                <TooltipPrimitive.Trigger
                    className={triggerClassName}
                    asChild={triggerAsChild}
                    type={triggerType}
                >
                    {children}
                </TooltipPrimitive.Trigger>
                {content && (
                    <TooltipPrimitive.Portal>
                        <TooltipPrimitive.Content
                            className={cn(
                                'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                                contentClassName
                            )}
                            side={side}
                            sideOffset={sideOffset}
                            align={align}
                            alignOffset={alignOffset}
                        >
                            {content}
                            {
                                arrow && (
                                    <TooltipPrimitive.Arrow
                                        width={arrowWidth}
                                        height={arrowHeight}
                                        className={cn('fill-white absolute top-[-3px] z-10', arrowClassname)}
                                    />
                                )
                            }
                        </TooltipPrimitive.Content>
                    </TooltipPrimitive.Portal>
                )}
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
