import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPortal, DialogTitle } from '../ui/DialogUI';
import { DialogClose } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import ModalFooter from './ModalFooter';
import { PropsWithChildren } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export const modalVariants = cva(
    '',
    {
        variants: {
            type: {
                default: '',
                success: '',
                error: '',
                info: '',
                warn: ''
            },
            size: {
                'default': 'max-w-lg',
                'alert': 'max-w-lg',
                'xs': 'max-w-xs',
                'sm': 'max-w-sm',
                'md': 'max-w-md',
                'lg': 'max-w-lg',
                'xl': 'max-w-xl',
                '2xl': 'max-w-2xl',
                '3xl': 'max-w-3xl',
                '4xl': 'max-w-4xl',
                '5xl': 'max-w-5xl',
                '6xl': 'max-w-6xl',
                '7xl': 'max-w-7xl',
                'auto': ''
            }
        },
        defaultVariants: {
            type: 'default',
            size: 'default'
        }
    }
);

interface RenderHeaderProps extends PropsWithChildren {
    showHeader?: boolean
}

export default observer(function Modals() {
    // store
    const { modalStore: { instances, hideModal } } = useStore();

    // render
    const RenderHeader = ({ children, showHeader }: RenderHeaderProps) => {
        if (showHeader) {
            return <>{children}</>;
        }

        return (
            <VisuallyHidden>
                {children}
            </VisuallyHidden>
        );
    };

    return (
        <>
            {
                instances.map((modal, index) => {
                    return (
                        <Dialog
                            key={modal.id ?? index}
                            open={true}
                            onOpenChange={() => { }}
                        >
                            <DialogPortal>
                                <DialogContent
                                    className={cn(
                                        'max-w-[90vw]',
                                        modalVariants({ size: modal.size }),
                                        modal.showHeader && !modal.title && !modal.description && !modal.header && 'gap-0'
                                    )}
                                    onPointerDownOutside={() => {
                                        modal.closeWhenOutside && hideModal(modal.id);
                                    }}
                                >
                                    <div className='relative'>
                                        <RenderHeader showHeader={modal.showHeader}>
                                            <DialogHeader className={modal.headerClassName}>
                                                <DialogTitle
                                                    className={cn(
                                                        !modal.title && 'hidden',
                                                        modalVariants({ type: modal.type }),
                                                        modal.titleClassName
                                                    )}
                                                >
                                                    {modal.title}
                                                </DialogTitle>
                                                <DialogDescription className={cn(
                                                    !modal.description && 'hidden',
                                                    modal.descriptionClassName
                                                )}
                                                >
                                                    {modal.description}
                                                </DialogDescription>
                                                {modal.header}
                                            </DialogHeader>
                                        </RenderHeader>
                                        {
                                            modal.showCloseIcon && (
                                                <DialogClose
                                                    className='absolute right-4 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
                                                    onClick={() => hideModal(modal.id)}
                                                >
                                                    <X className='h-5 w-5' />
                                                    <span className='sr-only'>
                                                        Close
                                                    </span>
                                                </DialogClose>
                                            )
                                        }
                                    </div>
                                    <div className={cn('px-4', modal.contentClassName)}>
                                        {modal.content}
                                    </div>
                                    {
                                        modal.showFooter && (
                                            <DialogFooter className={cn('flex items-center justify-end gap-4 px-4 pb-4', modal.footerClassName)}>
                                                {
                                                    modal.footer ??
                                                    (
                                                        <ModalFooter
                                                            cancelButton={modal.cancelButton}
                                                            cancelButtonClassName={modal.cancelButtonClassName}
                                                            onCancel={modal.onCancel}
                                                            saveButton={modal.saveButton}
                                                            saveButtonClassName={modal.saveButtonClassName}
                                                            onSave={modal.onSave}
                                                            variantCancelBtn={modal.variantCancelBtn}
                                                            variantSaveBtn={modal.variantSaveBtn}
                                                        />
                                                    )
                                                }
                                            </DialogFooter>
                                        )
                                    }

                                </DialogContent>
                            </DialogPortal>
                        </Dialog>
                    );
                })
            }
        </>
    );
});
