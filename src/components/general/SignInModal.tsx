import { EMAIL_REGEX } from '@/configs/constants';
import yup from '@/services/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../common/Form';
import { FloatingLabelInput } from '../common/Input';
import { Button } from '../common/Button';
import { flowResult } from 'mobx';
import { useStore } from '@/hooks/useStore';
import ConfirmSignInWithOTPModal from './ConfirmSignInWithOTPModal';

export default function SignInModal() {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        authStore: { signInWithOTP },
        modalStore: { showModal, hideModal }
    } = useStore();

    // validate schema
    const validateSchema = yup.object().shape({
        email: yup.string().trim().matches(EMAIL_REGEX, 'form_error_validate.email').required('form_error_validate.required')
    });

    type FormData = yup.InferType<typeof validateSchema>;

    // state
    const form = useForm({
        resolver: yupResolver(validateSchema),
        mode: 'onChange',
        defaultValues: {
            email: ''
        }
    });

    // function
    const onHandleSubmitSignInWithOTP = async (data: FormData) => {
        const { email } = data;

        const result = await flowResult(signInWithOTP({
            email
        }));

        if (result) {
            hideModal();
            showModal({
                id: 'sign-in-confirm-otp',
                showHeader: true,
                showFooter: false,
                headerClassName: 'border-none',
                contentClassName: 'pb-6',
                content: <ConfirmSignInWithOTPModal email={email} uuid={result.uuid} />
            });
        }
    };

    return (
        <div>
            <h3 className='title-primary text-center'>{t('words_title.sign_in')}</h3>
            <Form {...form}>
                <form
                    className='mt-6'
                    onSubmit={form.handleSubmit(onHandleSubmitSignInWithOTP)}
                >
                    {/* Email */}
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormControl>
                                    <FloatingLabelInput
                                        type='text'
                                        label={t('words_title.email')}
                                        required
                                        className='h-12'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Action */}
                    <Button
                        className='w-full mt-4'
                        type='submit'
                        disabled={!form.getValues('email') || !!form.formState.errors.email}
                    >
                        {t('words_title.next')}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
