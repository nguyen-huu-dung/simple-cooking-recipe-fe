import yup from '@/services/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form, FormControl, FormField, FormItem } from '../common/Form';
import { Button } from '../common/Button';
import { InputOTP, InputOTPSlot } from '../common/Input';
import { flowResult } from 'mobx';
import { useStore } from '@/hooks/useStore';
import { toastify } from '../common/Toastify';
import { ONLY_NUMBER_REGEX } from '@/configs/constants';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

interface ConfirmSignInWithOTPModalProps {
    email: string,
    uuid: string
}

export default function ConfirmSignInWithOTPModal({
    email,
    uuid
}: ConfirmSignInWithOTPModalProps) {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        authStore: { confirmSignInWithOTP },
        modalStore: { hideModal }
    } = useStore();

    // validate schema
    const validateSchema = yup.object().shape({
        confirmOTP: yup.string().trim().min(6).required('form_error_validate.required')
    });

    type FormData = yup.InferType<typeof validateSchema>;

    // state
    const form = useForm({
        resolver: yupResolver(validateSchema),
        mode: 'onChange',
        defaultValues: {
            confirmOTP: ''
        }
    });

    // function
    const onHandleSubmitConfirmSignInWithOTP = async (data: FormData) => {
        const { confirmOTP } = data;

        const result = await flowResult(confirmSignInWithOTP({
            uuid,
            confirmOTP
        }));

        if (result) {
            hideModal();
            toastify('alert', t('messages.sign_in_success'));
        }
    };

    return (
        <div>
            <p>
                {t('messages.sign_in_confirm_otp', {
                    email
                })}
            </p>
            <Form {...form}>
                <form
                    className='mt-6'
                    onSubmit={form.handleSubmit(onHandleSubmitConfirmSignInWithOTP)}
                >
                    {/* Confirm OTP */}
                    <FormField
                        control={form.control}
                        name='confirmOTP'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        containerClassName='justify-between'
                                        pattern={REGEXP_ONLY_DIGITS}
                                        {...field}
                                    >
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTP>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Action */}
                    <Button
                        className='w-full mt-4'
                        type='submit'
                        disabled={!form.getValues('confirmOTP') || !!form.formState.errors.confirmOTP}
                    >
                        {t('words_title.confirm')}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
