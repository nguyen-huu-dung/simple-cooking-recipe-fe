import Calendar from '@/components/calendar/Calendar';
import { Button } from '@/components/common/Button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/Select';
import { toastify } from '@/components/common/Toastify';
import WrapperSection from '@/components/layout/WrapperSection';
import { GENDER_MAPPER, MAX_LENGTH_DEFAULT } from '@/configs/constants';
import { useStore } from '@/hooks/useStore';
import yup from '@/services/yup';
import { GENDER } from '@/types/enums';
import { yupResolver } from '@hookform/resolvers/yup';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default observer(function Profile() {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        authStore: { getProfile, updateProfile }
    } = useStore();

    // validate schema
    const validateSchema = yup.object().shape({
        fullName: yup.string().trim().max(MAX_LENGTH_DEFAULT.INPUT, t('form_error_validate.max_characters', {
            max: MAX_LENGTH_DEFAULT.INPUT
        })),
        email: yup.string(),
        gender: yup.string(),
        birthday: yup.string()
    });

    type FormData = yup.InferType<typeof validateSchema>;

    // state
    const form = useForm<FormData>({
        resolver: yupResolver(validateSchema),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            email: '',
            gender: '',
            birthday: ''
        }
    });

    // lifecycle
    useEffect(() => {
        getDataForm();
    }, []);

    // function
    const getDataForm = async () => {
        const res = await flowResult(getProfile());

        if (res) {
            const { fullName, email, gender, birthday } = res;

            form.reset({
                fullName: fullName ?? '',
                email,
                gender: gender ? gender.toString() : '',
                birthday: birthday ?? ''
            });
        }
    };

    const onUpdateProfile = async (data: FormData) => {
        const { fullName, gender, birthday } = data;

        const res = await flowResult(updateProfile({
            fullName: fullName ?? '',
            gender: gender ? Number(gender) : null,
            birthday: birthday ?? ''
        }));

        if (res) {
            toastify('success', t('messages.update_success'));
            getDataForm();
        }
    };

    return (
        <WrapperSection className='flex-1 py-8'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onUpdateProfile)}
                    className='grid grid-cols-1 md:grid-cols-4'
                >
                    <div className='md:col-start-2 md:col-span-2'>
                        {/* Form Field */}
                        <section className='space-y-4'>
                            {/* full name */}
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <Label>{t('words_title.profile_fullname')}</Label>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* email */}
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <Label>{t('words_title.email')}</Label>
                                        <FormControl>
                                            <Input type='text' disabled {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* gender */}
                            <FormField
                                control={form.control}
                                name='gender'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <Label>{t('words_title.gender')}</Label>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                {...field}
                                            >
                                                <SelectTrigger
                                                    value={field.value}
                                                    onClear={() => {
                                                        field.onChange('');
                                                    }}
                                                >
                                                    <SelectValue placeholder={t('words_title.select')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        Object.values(GENDER).map(gender => (
                                                            <SelectItem key={gender} value={gender.toString()}>{t(GENDER_MAPPER[gender]?.label)}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* birthday */}
                            <FormField
                                control={form.control}
                                name='birthday'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <Label>{t('words_title.birthday')}</Label>
                                        <FormControl>
                                            <Calendar
                                                type='datePicker'
                                                mode='single'
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(value) => {
                                                    field.onChange(value ? value.toString() : '');
                                                }}
                                                inputClassName='w-full'
                                                disabled={{
                                                    after: new Date()
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </section>

                        {/* Action */}
                        <section className='flex justify-center mt-6'>
                            <Button
                                type='submit'
                                className='px-6'
                            >
                                {t('words_title.update_profile')}
                            </Button>
                        </section>
                    </div>
                </form>
            </Form>
        </WrapperSection>
    );
});
