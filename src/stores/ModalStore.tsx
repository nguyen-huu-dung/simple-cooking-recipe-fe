import { ButtonProps } from '@/components/common/Button';
import { modalVariants } from '@/components/modal/Modals';
import { cn } from '@/utils/utils';
import { VariantProps } from 'class-variance-authority';
import { t } from 'i18next';
import { CircleAlertIcon, CircleCheckIcon, CircleHelpIcon } from 'lucide-react';
import { action, makeAutoObservable, observable } from 'mobx';
import React from 'react';

export default class ModalStore {
    instances: ModalInstance[] = [];

    constructor() {
        makeAutoObservable(this, {
            instances: observable,
            showModal: action.bound,
            hideModal: action.bound,
            hideAllModals: action.bound,
            showWarningModal: action.bound
        });
    }

    showModal(options?: ModalInstance) {
        const instance = new ModalInstance(options);
        this.instances.push(instance);
    }

    hideModal(id?: string) {
        if (id) {
            this.instances = this.instances.filter(ins => ins.id !== id);
        } else {
            this.instances.splice(-1, 1);
        }
    }

    hideModals(ids: string[]) {
        this.instances = this.instances.filter(ins => !ins?.id || !ids.includes(ins.id));
    }

    hideAllModals() {
        this.instances = [];
    }

    showWarningModal({
        id = 'warning-modal',
        type = 'warn',
        title = t('words_title.confirm'),
        content,
        footerClassName,
        saveButton = t('words_title.yes'),
        saveButtonClassName = 'w-1/2',
        onSave,
        cancelButton = t('words_title.no'),
        cancelButtonClassName = 'w-1/2 hover:text-active hover:bg-background',
        onCancel,
        ...options
    }: ModalInstance = {}) {
        this.showModal({
            id,
            type,
            title,
            footerClassName: cn('sm:justify-center', footerClassName),
            cancelButton,
            saveButton,
            onCancel: () => {
                this.hideModal(id);
                onCancel?.();
            },
            onSave: () => {
                this.hideModal(id);
                onSave?.();
            },
            content: (
                <div className='text-center py-2'>{content}</div>
            ),
            ...options
        });
    }

    showAlertModal({
        id = 'alert-modal',
        type = 'error',
        showHeader = false,
        showCloseIcon = false,
        content,
        contentClassName,
        hideIconCenter,
        cancelButton = false,
        onCancel,
        saveButton = t('words_title.close'),
        saveButtonClassName,
        variantSaveBtn = 'outline',
        onSave,
        ...options
    }: AlertModalInstance = {}) {
        this.showModal({
            id,
            type,
            showHeader,
            showCloseIcon,
            cancelButton,
            onCancel: () => {
                this.hideModal(id);
                onCancel?.();
            },
            saveButton,
            saveButtonClassName: cn('w-full', saveButtonClassName),
            variantSaveBtn,
            onSave: () => {
                this.hideModal(id);
                onSave?.();
            },
            content: (
                <div className='flex flex-col items-center pt-4'>
                    {
                        !hideIconCenter && (
                            <div className='mb-4'>
                                {
                                    type === 'error' && <CircleAlertIcon className='text-red-500 w-12 h-12' />
                                }
                                {
                                    type === 'success' && <CircleCheckIcon className='text-green-500 w-12 h-12' />
                                }
                                {
                                    type === 'warn' && <CircleHelpIcon className='text-yellow-500 w-12 h-12' />
                                }
                            </div>
                        )
                    }
                    <div className={cn('text-center text-sm font-medium whitespace-pre-line leading-6', contentClassName)}>
                        {content}
                    </div>
                </div>
            ),
            ...options
        });
    }
}

class ModalInstance {
    id?: string;
    type?: VariantProps<typeof modalVariants>['type'];
    size?: VariantProps<typeof modalVariants>['size'];
    closeWhenOutside?: boolean;
    // header
    showHeader?: boolean;
    headerClassName?: string;
    header?: React.ReactNode;
    title?: string;
    titleClassName?: string;
    description?: string;
    descriptionClassName?: string;
    // close button
    showCloseIcon?: boolean;
    // content
    content?: React.ReactNode;
    contentClassName?: string;
    // footer
    showFooter?: boolean;
    footer?: React.ReactNode;
    footerClassName?: string;
    cancelButton?: React.ReactNode;
    cancelButtonClassName?: string;
    onCancel?: Function;
    saveButton?: React.ReactNode;
    saveButtonClassName?: string;
    onSave?: Function;
    variantCancelBtn?: ButtonProps['variant'];
    variantSaveBtn?: ButtonProps['variant'];

    constructor({
        type = 'default',
        size = 'default',
        closeWhenOutside = false,
        showHeader = true,
        showCloseIcon = true,
        showFooter = true,
        variantCancelBtn = 'outline',
        variantSaveBtn = 'default',
        ...options
    }: ModalInstance = {}) {
        this.id = options.id;
        this.type = type;
        this.size = size;
        this.closeWhenOutside = closeWhenOutside;
        this.showHeader = showHeader;
        this.headerClassName = options.headerClassName;
        this.header = options.header;
        this.title = options.title;
        this.titleClassName = options.titleClassName;
        this.description = options.description;
        this.descriptionClassName = options.descriptionClassName;
        this.showCloseIcon = showCloseIcon;
        this.content = options.content;
        this.contentClassName = options.contentClassName;
        this.showFooter = showFooter;
        this.footer = options.footer;
        this.footerClassName = options.footerClassName;
        this.cancelButton = options.cancelButton;
        this.cancelButtonClassName = options.cancelButtonClassName;
        this.onCancel = options.onCancel;
        this.saveButton = options.saveButton;
        this.saveButtonClassName = options.saveButtonClassName;
        this.onSave = options.onSave;
        this.variantCancelBtn = variantCancelBtn;
        this.variantSaveBtn = variantSaveBtn;
    }
}

interface AlertModalInstance extends ModalInstance {
    hideIconCenter?: boolean
}
