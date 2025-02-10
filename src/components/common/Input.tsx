import { MAX_LENGTH_DEFAULT } from '@/configs/constants';
import { cn } from '@/utils/utils';
import { DotIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { FloatingLabel } from './Label';

// #region normal input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    preventCopy?: boolean,
    preventCut?: boolean,
    onlyNumber?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        maxLength = MAX_LENGTH_DEFAULT.INPUT,
        type,
        preventCopy,
        preventCut,
        onlyNumber,
        onKeyDown,
        onCopy,
        onCut,
        ...props
    }, ref) => {
        const onHandleKeyDown = (e, maxLength?: number) => {
            if (onlyNumber) {
                if (
                    e.key === 'Backspace' ||
                    e.key === 'Delete' ||
                    e.key === 'Tab' ||
                    e.key === 'Escape' ||
                    e.key === 'Enter' ||
                    (e.key === 'a' && e.ctrlKey === true) ||
                    (e.key === 'c' && e.ctrlKey === true) ||
                    (e.key === 'v' && e.ctrlKey === true) ||
                    (e.key === 'x' && e.ctrlKey === true) ||
                    (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
                ) {
                    return;
                }

                if (e.target && maxLength && e.target.value?.length >= maxLength) {
                    e.preventDefault();
                    return;
                }

                if (!(e.key >= '0' && e.key <= '9')) {
                    e.preventDefault();
                    return;
                }
            }
            onKeyDown?.(e);
        };

        const onHandleCopy = (e) => {
            preventCopy ? e.preventDefault() : onCopy?.(e);
        };

        const onHandleCut = (e) => {
            preventCopy ? e.preventDefault() : onCut?.(e);
        };

        return (
            <input
                type={type}
                className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                onKeyDown={onHandleKeyDown}
                onCopy={onHandleCopy}
                onCut={onHandleCut}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

// #endregion

// #region input with icon

export interface InputWithIconProps
    extends InputProps {
    icon?: React.ReactNode
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
    ({ type, icon, className, ...props }, ref) => {
        return (
            <div className='relative w-full'>
                <Input
                    ref={ref}
                    type={type}
                    className={cn(icon && 'pr-10', className)}
                    {...props}
                />
                {icon}
            </div>
        );
    }
);
InputWithIcon.displayName = 'InputWithIcon';

// #endregion

// #region input otp

const InputOTP = React.forwardRef<
    React.ElementRef<typeof OTPInput>,
    React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
    <OTPInput
        ref={ref}
        containerClassName={cn(
            'flex items-center gap-2 has-[:disabled]:opacity-50 w-full',
            containerClassName
        )}
        className={cn('disabled:cursor-not-allowed', className)}
        {...props}
    />
));
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<
    React.ElementRef<'div'>,
    React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center', className)} {...props} />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
    React.ElementRef<'div'>,
    React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex sm:h-16 sm:w-16 xsm:h-12 xsm:w-12 h-10 w-10 text-input-form-1 font-semibold items-center justify-center border border-border-2 rounded-lg transition-all',
                isActive && 'z-10 border border-active',
                className
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <div className='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
                </div>
            )}
        </div>
    );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<
    React.ElementRef<'div'>,
    React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
    <div ref={ref} role='separator' {...props}>
        <DotIcon />
    </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

// #endregion

// #region input with floating label

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return <Input placeholder='' className={cn('peer pt-6 pb-1.75', className)} ref={ref} {...props} />;
    }
);
FloatingInput.displayName = 'FloatingInput';

type FloatingLabelInputProps = InputProps & {
    label?: string,
    icon?: React.ReactNode,
    required?: boolean
};

const FloatingLabelInput = React.forwardRef<
    React.ElementRef<typeof FloatingInput>,
    React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, icon, className, required, ...props }, ref) => {
    return (
        <div className='relative detect-autofill'>
            <FloatingInput
                ref={ref}
                id={id}
                className={cn(icon && 'pr-10', className)}
                {...props}
            />
            <FloatingLabel htmlFor={id} required={required}>{label}</FloatingLabel>
            {icon}
        </div>
    );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

// #endregion

// #region input password

export interface PasswordInputProps
    extends InputProps {
    useIcon?: boolean,
    defaultShow?: boolean,
    onClickIcon?: (isShow?: boolean) => void
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({
        useIcon = true,
        defaultShow = false,
        onClickIcon,
        className,
        ...props
    }, ref) => {
        // state
        const [isShow, setIsShow] = React.useState<boolean>(defaultShow);

        // function
        const onHandleClickIcon = (show: boolean) => {
            setIsShow(show);
            onClickIcon?.(show);
        };

        return (
            <div className='relative'>
                <Input ref={ref} type={isShow ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
                {
                    useIcon ?
                        (
                            !isShow ?
                                <EyeOffIcon className='icon-right-input hover:cursor-pointer' onClick={() => onHandleClickIcon(true)} /> :
                                <EyeIcon className='icon-right-input hover:cursor-pointer' onClick={() => onHandleClickIcon(false)} />
                        ) :
                        <></>
                }
            </div>
        );
    }
);
PasswordInput.displayName = 'PasswordInput';

// #endregion

export { Input, InputWithIcon, FloatingLabelInput, PasswordInput, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
