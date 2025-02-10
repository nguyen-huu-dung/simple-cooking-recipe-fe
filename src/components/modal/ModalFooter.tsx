import { cn } from '@/utils/utils';
import { Button, ButtonProps } from '../common/Button';

interface ModalFooterProps {
    footerClassName?: string,
    cancelButton?: React.ReactNode,
    cancelButtonClassName?: string,
    onCancel?: Function,
    saveButton?: React.ReactNode,
    saveButtonClassName?: string,
    onSave?: Function,
    variantCancelBtn?: ButtonProps['variant'],
    variantSaveBtn?: ButtonProps['variant']
}

export default function ModalFooter({
    cancelButton,
    cancelButtonClassName,
    onCancel,
    saveButton,
    saveButtonClassName,
    onSave,
    variantCancelBtn = 'outline',
    variantSaveBtn = 'default'
}: ModalFooterProps) {
    return (
        <>
            {
                cancelButton && (
                    <Button
                        variant={variantCancelBtn}
                        className={cn('w-32', cancelButtonClassName)}
                        onClick={() => onCancel?.()}
                    >
                        {cancelButton}
                    </Button>
                )
            }
            {
                saveButton && (
                    <Button
                        variant={variantSaveBtn}
                        className={cn('w-32', saveButtonClassName)}
                        onClick={() => onSave?.()}
                    >
                        {saveButton}
                    </Button>
                )
            }
        </>
    );
}
