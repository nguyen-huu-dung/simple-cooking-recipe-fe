import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import NumberFormat from '@/components/common/NumberFormat';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import { toastify } from '@/components/common/Toastify';
import WrapperSection from '@/components/layout/WrapperSection';
import { MAX_LENGTH_DEFAULT, ROUTES } from '@/configs/constants';
import { useStore } from '@/hooks/useStore';
import yup from '@/services/yup';
import { MODE_FORM, ModeForm } from '@/types/enums';
import { CookingRecipePostRequest, CookingRecipePutRequest } from '@/types/http-payload/cookingRecipe';
import { loadFilePreview } from '@/utils/file';
import { cn } from '@/utils/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircleXIcon, ImagePlusIcon, PlusCircleIcon } from 'lucide-react';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';

interface SettingCookingRecipe {
    mode: ModeForm
}

export default observer(function SettingCookingRecipe({ mode }: SettingCookingRecipe) {
    // hooks
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { code } = useParams();

    // store
    const {
        cookingRecipeStore: {
            cookingRecipeMenus,
            cookingRecipeTypeDishs,
            cookingRecipeMakeWays,
            getCookingRecipeSecondaryData,
            getMyCookingRecipe,
            createMyCookingRecipe,
            updateMyCookingRecipe,
            clean
        }
    } = useStore();

    // validate schema
    const validateSchema = yup.object().shape({
        name: yup.string().trim().required('form_error_validate.required').max(MAX_LENGTH_DEFAULT.INPUT, t('form_error_validate.max_characters', {
            max: MAX_LENGTH_DEFAULT.INPUT
        })),
        introduce: yup.string().trim().max(MAX_LENGTH_DEFAULT.TEXTAREA, t('form_error_validate.max_characters', {
            max: MAX_LENGTH_DEFAULT.TEXTAREA
        })).required('form_error_validate.required'),
        menus: yup.array().of(yup.object().shape({
            value: yup.number().required()
        })).required(),
        typeDish: yup.string(),
        makeWay: yup.string(),
        image: yup
            .mixed<string | File>()
            .notOneOf([''], 'form_error_validate.required')
            .required('form_error_validate.required')
            .checkFileTypeByExt('form_error_validate.image_invalid_ext')
            .checkFileSize('form_error_validate.image_invalid_size'),
        ingredients: yup.array().of(yup.object().shape({
            value: yup.string().trim().required('form_error_validate.required').max(MAX_LENGTH_DEFAULT.INPUT, t('form_error_validate.max_characters', {
                max: MAX_LENGTH_DEFAULT.INPUT
            }))
        })).min(1, 'form_error_validate.ingredients_min').required('form_error_validate.required'),
        ration: yup.string().required('form_error_validate.required'),
        totalTime: yup.string().required('form_error_validate.required'),
        instructions: yup.array().of(yup.object().shape({
            value: yup.string().trim().required('form_error_validate.required').max(MAX_LENGTH_DEFAULT.TEXTAREA, t('form_error_validate.max_characters', {
                max: MAX_LENGTH_DEFAULT.TEXTAREA
            }))
        })).min(1, 'form_error_validate.instructions_min').required('form_error_validate.required')
    });

    type FormData = yup.InferType<typeof validateSchema>;

    // state
    const form = useForm<FormData>({
        resolver: yupResolver(validateSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            introduce: '',
            menus: [],
            typeDish: '',
            makeWay: '',
            image: '',
            ingredients: [{
                value: ''
            }],
            ration: '',
            totalTime: '',
            instructions: [{
                value: ''
            }]
        }
    });

    const watchImageUpload = form.watch('image');

    const menusFields = useFieldArray({
        control: form.control,
        name: 'menus'
    });

    const ingredientsFields = useFieldArray({
        control: form.control,
        name: 'ingredients'
    });

    const instructionsFields = useFieldArray({
        control: form.control,
        name: 'instructions'
    });

    // lifecycle
    useEffect(() => {
        getDataForm();

        return () => {
            clean();
        };
    }, []);

    useEffect(() => {
        if (watchImageUpload && watchImageUpload instanceof File) {
            loadFilePreview(watchImageUpload, 'preview-image');
        }
    }, [watchImageUpload]);

    // function
    const getDataForm = async () => {
        await flowResult(getCookingRecipeSecondaryData({
            cookingRecipeMenu: true,
            cookingRecipeTypeDish: true,
            cookingRecipeMakeWay: true
        }));

        if (mode === MODE_FORM.Edit && code) {
            const res = await flowResult(getMyCookingRecipe({
                code
            }));

            if (res) {
                const { name, menus, typeDish, makeWay, image, introduce, ingredients, ration, totalTime, instructions } = res;

                form.reset({
                    name,
                    menus: menus?.length > 0 ? menus.map(menu => ({ value: menu.id })) : [],
                    typeDish: typeDish ? typeDish.id.toString() : '',
                    makeWay: makeWay ? makeWay.id.toString() : '',
                    image: image ?? '',
                    introduce,
                    ingredients: ingredients?.length > 0 ? ingredients.map(value => ({ value })) : [],
                    ration: ration.toString(),
                    totalTime: totalTime.toString(),
                    instructions: instructions?.length > 0 ? instructions.map(value => ({ value })) : []
                });
            }
        }
    };

    const onChangeCheckedMenus = (isChecked: boolean | string, value: number) => {
        if (isChecked) {
            menusFields.append({
                value
            });
        } else {
            menusFields.replace(menusFields.fields.filter(menu => menu.value !== value));
        }
    };

    const onHandleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files && e.target.files.length > 0 ? e.target.files[0] : '';
        form.setValue('image', image, { shouldValidate: true });
    };

    const onAddIngredient = () => {
        ingredientsFields.append({
            value: ''
        });
    };

    const onRemoveIngredient = (index) => {
        if (index !== 0) {
            ingredientsFields.remove(index);
        }
    };

    const onAddInstruction = () => {
        instructionsFields.append({
            value: ''
        });
    };

    const onRemoveInstruction = (index) => {
        if (index !== 0) {
            instructionsFields.remove(index);
        }
    };

    const onCreateMyCookingRecipe = async (data: CookingRecipePostRequest) => {
        const res = await flowResult(createMyCookingRecipe(data));

        if (res) {
            toastify('success', t('messages.create_success'));
            navigate(ROUTES.myCookingRecipeManagement.href);
        }
    };

    const onUpdateMyCookingRecipe = async (data: CookingRecipePutRequest) => {
        const res = await flowResult(updateMyCookingRecipe(data));

        if (res) {
            toastify('success', t('messages.update_success'));
            navigate(ROUTES.myCookingRecipeManagement.href);
        }
    };

    const onSubmitSettingCookingRecipe = (data: FormData) => {
        const { name, menus, typeDish, makeWay, image, introduce, ingredients, ration, totalTime, instructions } = data;

        const formatDataSubmit = {
            name,
            menus: menus.map(item => item.value),
            typeDish: typeDish ? Number(typeDish) : null,
            makeWay: makeWay ? Number(makeWay) : null,
            image,
            introduce,
            ingredients: ingredients.map(item => item.value),
            ration: Number(ration),
            totalTime: Number(totalTime),
            instructions: instructions.map(item => item.value)
        };

        if (mode === MODE_FORM.Create) {
            onCreateMyCookingRecipe(formatDataSubmit);
        } else if (code) {
            onUpdateMyCookingRecipe({
                code,
                ...formatDataSubmit
            });
        }
    };

    return (
        <WrapperSection className='flex-1 px-0 pb-0'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitSettingCookingRecipe)}>
                    {/* Form Field */}
                    <section className='grid grid-cols-1 lg:grid-cols-2 px-4 gap-4'>
                        <div className='space-y-4 order-2 lg:order-1'>
                            {/* name */}
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <Label required>{t('words_title.cooking_recipe_name')}</Label>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* menus */}
                            {
                                cookingRecipeMenus.length > 0 && (
                                    <FormField
                                        control={form.control}
                                        name='menus'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1'>
                                                <Label>{t('words_title.cooking_recipe_menu')}</Label>
                                                <div className='grid grid-cols-2 gap-3'>
                                                    {
                                                        cookingRecipeMenus.map(menu => (
                                                            <div
                                                                key={menu.id}
                                                                className='flex items-center gap-2'
                                                            >
                                                                <Checkbox
                                                                    id={`menus-${menu.id}`}
                                                                    checked={!!field.value.find(val => val.value === menu.id)}
                                                                    onCheckedChange={checked => onChangeCheckedMenus(checked, menu.id)}
                                                                />
                                                                <Label htmlFor={`menus-${menu.id}`}>{menu.name}</Label>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                )
                            }

                            {/* type of dish */}
                            {
                                cookingRecipeTypeDishs.length > 0 && (
                                    <FormField
                                        control={form.control}
                                        name='typeDish'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1'>
                                                <Label>{t('words_title.cooking_recipe_type_dish')}</Label>
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
                                                                cookingRecipeTypeDishs.map(type => (
                                                                    <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }

                            {/* make way */}
                            {
                                cookingRecipeMakeWays.length > 0 && (
                                    <FormField
                                        control={form.control}
                                        name='makeWay'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1'>
                                                <Label>{t('words_title.cooking_recipe_make_way')}</Label>
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
                                                                cookingRecipeMakeWays.map(type => (
                                                                    <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }
                        </div>
                        <div className='order-1 lg:order-2 flex flex-col gap-4 items-center justify-center'>
                            {
                                watchImageUpload && (
                                    <img
                                        id='preview-image'
                                        className='w-72 aspect-square object-cover'
                                        alt='image-preview'
                                        src={typeof watchImageUpload === 'string' ? watchImageUpload : undefined}
                                    />
                                )
                            }
                            {/* image */}
                            <FormField
                                control={form.control}
                                name='image'
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                id='select-image'
                                                type='file'
                                                accept='.jpg, .jpeg, .png, .webp'
                                                onChange={onHandleChangeImage}
                                                className='hidden'
                                            />
                                        </FormControl>
                                        <Label
                                            htmlFor='select-image'
                                            className='w-fit px-8 py-2 mx-auto flex items-center justify-center gap-2 cursor-pointer border border-input rounded-lg hover:text-primary hover:border-primary'
                                            required
                                        >
                                            <ImagePlusIcon className='h-6 w-6' />
                                            <span>{t('words_title.select_image')}</span>
                                        </Label>
                                        <FormDescription className='text-xs mt-2'>{t('messages.image_format_size_support')}</FormDescription>
                                        <FormDescription className='text-xs mt-2'>{t('messages.recommend_image_ratio')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </section>

                    {/* Form Field */}
                    <section className='mt-4 space-y-4 px-4'>
                        {/* introduce */}
                        <FormField
                            control={form.control}
                            name='introduce'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <Label required>{t('words_title.cooking_recipe_introduce')}</Label>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ingredients */}
                        {
                            ingredientsFields.fields.length > 0 && (
                                <FormItem>
                                    <Label required>{t('words_title.cooking_recipe_ingredients')}</Label>
                                    <div className='mt-2 grid grid-cols-1 gap-2'>
                                        {
                                            ingredientsFields.fields.map((ingredientField, index) => (
                                                <div key={ingredientField.id} className='flex items-center justify-between'>
                                                    {/*  ingredient name */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`ingredients.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem className='flex-1'>
                                                                <FormControl>
                                                                    <Input
                                                                        type='text'
                                                                        placeholder={t('placeholder.ingredients_input')}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className={cn('w-12 md:w-20 flex flex-none justify-center', index === 0 && 'invisible')}>
                                                        <CircleXIcon className='cursor-pointer hover:text-red-500' onClick={() => onRemoveIngredient(index)} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </FormItem>
                            )
                        }

                        {/* add ingredient */}
                        <Button
                            className='px-4 gap-2'
                            type='button'
                            variant='outline'
                            onClick={() => onAddIngredient()}
                        >
                            <PlusCircleIcon />
                            <span>{t('words_title.add_ingredients')}</span>
                        </Button>

                        {/* ration */}
                        <FormField
                            control={form.control}
                            name='ration'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <Label required>{t('words_title.cooking_recipe_ration')}</Label>
                                    <FormControl>
                                        <div className='flex items-center'>
                                            <NumberFormat
                                                displayType='input'
                                                value={field.value}
                                                isAllowed={(values) => {
                                                    const { floatValue } = values;
                                                    return floatValue === undefined || floatValue >= 1;
                                                }}
                                                onValueChange={value => field.onChange(value.floatValue)}
                                            />
                                            <span className='w-12 md:w-20 flex-none text-center'>{t('words_title.person')}</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* total time */}
                        <FormField
                            control={form.control}
                            name='totalTime'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <Label required>{t('words_title.cooking_recipe_total_time')}</Label>
                                    <FormControl>
                                        <div className='flex items-center'>
                                            <NumberFormat
                                                displayType='input'
                                                value={field.value}
                                                isAllowed={(values) => {
                                                    const { floatValue } = values;
                                                    return floatValue === undefined || floatValue >= 1;
                                                }}
                                                onValueChange={value => field.onChange(value.floatValue)}
                                            />
                                            <span className='w-12 md:w-20 flex-none text-center'>{t('words_title.minutes')}</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* instructions */}
                        {
                            instructionsFields.fields.length > 0 && (
                                <FormItem>
                                    <Label required>{t('words_title.cooking_recipe_instructions')}</Label>
                                    <div className='mt-2 grid grid-cols-1 gap-2'>
                                        {
                                            instructionsFields.fields.map((instructionField, index) => (
                                                <div key={instructionField.id} className='flex items-center justify-between'>
                                                    {/*  instruction name */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`instructions.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem className='flex-1'>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder={t('placeholder.instructions_input', {
                                                                            step: index + 1
                                                                        })}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className={cn('w-12 md:w-20 flex flex-none justify-center', index === 0 && 'invisible')}>
                                                        <CircleXIcon className='cursor-pointer hover:text-red-500' onClick={() => onRemoveInstruction(index)} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </FormItem>
                            )
                        }

                        {/* add instruction */}
                        <Button
                            className='px-4 gap-2'
                            type='button'
                            variant='outline'
                            onClick={() => onAddInstruction()}
                        >
                            <PlusCircleIcon />
                            <span>{t('words_title.add_instructions')}</span>
                        </Button>
                    </section>

                    {/* Action */}
                    <section className='sticky bottom-0 flex justify-center items-center mt-10 p-4 bg-background gap-16 border-t border-input'>
                        <Link to={ROUTES.myCookingRecipeManagement.href}>
                            <Button
                                type='button'
                                variant='outlinePrimary'
                                className='w-40'
                            >
                                {t('words_title.back')}
                            </Button>
                        </Link>

                        <Button
                            type='submit'
                            className='w-40'
                        >
                            {
                                mode === MODE_FORM.Create ? t('words_title.create') : t('words_title.update')
                            }
                        </Button>
                    </section>
                </form>
            </Form>
        </WrapperSection>
    );
});
