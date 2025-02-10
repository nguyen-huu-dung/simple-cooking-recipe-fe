import { cn } from '@/utils/utils';
import { CircleCheckIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Slide, toast, ToastOptions, Zoom } from 'react-toastify';

type ToastifyType = 'success' | 'error' | 'warn' | 'info' | 'custom';

const toastifyOptionsDefault: ToastOptions = {
    position: 'top-right',
    autoClose: 1500,
    delay: 0,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    transition: Slide
};

const toastifyOptionsAlert: ToastOptions = {
    className: 'toastify-position-center-center m-0 rounded-md min-h-[100px] max-w-[310px] shadow-[0px_2px_8px_0px_rgba(99,_99,_99,_0.2)]',
    position: 'top-center',
    autoClose: 1500,
    delay: 0,
    pauseOnHover: false,
    pauseOnFocusLoss: true,
    icon: false,
    closeButton: false,
    hideProgressBar: true,
    transition: Zoom
};

interface ToastifyAlertProps {
    content: ReactNode,
    contentClassName?: string,
    icon?: ReactNode,
    hideIcon?: boolean
}

const ToastifyAlert = ({
    content,
    contentClassName,
    icon,
    hideIcon
}: ToastifyAlertProps) => {
    return (
        <div className='flex flex-col items-center gap-3'>
            {
                !hideIcon && (icon ?? <CircleCheckIcon className='text-green-500 w-12 h-12' />)
            }
            <div className={cn('text-center font-normal whitespace-pre-line leading-4', contentClassName)}>{content}</div>
        </div>
    );
};

export const toastify = (
    type: ToastifyType | 'alert',
    content: ReactNode,
    options?: ToastOptions & Pick<ToastifyAlertProps, 'icon' | 'hideIcon'>
) => {
    let toastifyOptionsAll = Object.assign(toastifyOptionsDefault, options);

    switch (type) {
        case 'success':
            toast.success(content, toastifyOptionsAll);
            break;

        case 'error':
            toast.error(content, toastifyOptionsAll);
            break;

        case 'warn':
            toast.warn(content, toastifyOptionsAll);
            break;

        case 'info':
            toast.info(content, toastifyOptionsAll);
            break;

        case 'alert':
            toastifyOptionsAll = Object.assign(toastifyOptionsAlert, options);
            toast.success(<ToastifyAlert content={content} />, toastifyOptionsAll);
            break;

        default:
            toast(content, toastifyOptionsAll);
            break;
    }
};
