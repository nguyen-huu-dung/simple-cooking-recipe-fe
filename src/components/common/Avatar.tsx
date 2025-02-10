import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/utils/utils';
import { getTextColorFromBgColor, useGenerateRandomColor } from '@/hooks/useGenerateRandomColor';

interface AvatarProps
    extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    Pick<AvatarPrimitive.AvatarImageProps, 'src' | 'alt'> {
    fallback?: React.ReactNode,
    imageClassName?: AvatarPrimitive.AvatarImageProps['className'],
    fallbackClassName?: AvatarPrimitive.AvatarFallbackProps['className'],
    randomColor?: boolean
}

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    AvatarProps
>(
    (
        {
            fallback,
            imageClassName,
            fallbackClassName,
            className,
            src,
            alt,
            randomColor,
            ...props
        },
        ref
    ) => {
        const { color } = useGenerateRandomColor({ isGetFirst: true });

        return (
            <AvatarPrimitive.Root
                ref={ref}
                className={cn(
                    'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full',
                    className
                )}
                {...props}
            >
                <AvatarPrimitive.Image
                    src={src}
                    alt={alt}
                    className={cn('aspect-square h-full w-full', imageClassName)}
                >
                </AvatarPrimitive.Image>
                <AvatarPrimitive.AvatarFallback
                    className={cn(
                        'flex h-full w-full items-center justify-center rounded-full bg-[#844642]',
                        fallbackClassName
                    )}
                    style={{
                        backgroundColor: randomColor ? color : 'transparent',
                        color: randomColor ? getTextColorFromBgColor(color) : 'inherit'
                    }}
                >
                    {fallback}
                </AvatarPrimitive.AvatarFallback>
            </AvatarPrimitive.Root>
        );
    }
);
Avatar.displayName = 'Avatar';

export default Avatar;
