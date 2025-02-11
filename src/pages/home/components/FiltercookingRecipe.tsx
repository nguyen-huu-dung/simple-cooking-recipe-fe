import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Form, FormField, FormItem } from '@/components/common/Form';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/common/Sheet';
import { useStore } from '@/hooks/useStore';
import yup from '@/services/yup';
import { cn } from '@/utils/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Label } from '@radix-ui/react-label';
import { SlidersHorizontalIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default observer(function FiltercookingRecipe() {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        cookingRecipeStore: {
            clean, cookingRecipeMenus, cookingRecipeTypeDishs, cookingRecipeMakeWays, filterSearch,
            getCookingRecipeSecondaryData, setFilterSearch, getListCookingRecipe
        }
    } = useStore();

    // validate schema
    const validateSchema = yup.object().shape({
        menus: yup.array().of(yup.object().shape({
            value: yup.number().required()
        })).required(),
        typeDishs: yup.array().of(yup.object().shape({
            value: yup.number().required()
        })).required(),
        makeWays: yup.array().of(yup.object().shape({
            value: yup.number().required()
        })).required()
    });

    type FormData = yup.InferType<typeof validateSchema>;

    // state
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const form = useForm<FormData>({
        resolver: yupResolver(validateSchema),
        mode: 'onSubmit',
        defaultValues: {
            menus: [],
            typeDishs: [],
            makeWays: []
        }
    });

    const menusFields = useFieldArray({
        control: form.control,
        name: 'menus'
    });

    const typeDishsFields = useFieldArray({
        control: form.control,
        name: 'typeDishs'
    });

    const makeWaysFields = useFieldArray({
        control: form.control,
        name: 'makeWays'
    });

    // lifecycle
    useEffect(() => {
        getCookingRecipeSecondaryData({
            cookingRecipeMenu: true,
            cookingRecipeTypeDish: true,
            cookingRecipeMakeWay: true
        });
    }, []);

    useEffect(() => {
        return () => {
            setFilterSearch({
                menus: [],
                typeDishs: [],
                makeWays: []
            });
        };
    }, []);

    // function
    const onToggleSheet = () => {
        if (!isOpen) {
            form.reset({
                menus: (filterSearch.menus && filterSearch.menus.length > 0) ? filterSearch.menus.map(menuId => ({ value: menuId })) : [],
                typeDishs: (filterSearch.typeDishs && filterSearch.typeDishs.length > 0) ? filterSearch.typeDishs.map(typeDishId => ({ value: typeDishId })) : [],
                makeWays: (filterSearch.makeWays && filterSearch.makeWays.length > 0) ? filterSearch.makeWays.map(makeWayId => ({ value: makeWayId })) : []
            });
        }
        setIsOpen(!isOpen);
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

    const onChangeCheckedTypeDishs = (isChecked: boolean | string, value: number) => {
        if (isChecked) {
            typeDishsFields.append({
                value
            });
        } else {
            typeDishsFields.replace(typeDishsFields.fields.filter(menu => menu.value !== value));
        }
    };

    const onChangeCheckedMakeWays = (isChecked: boolean | string, value: number) => {
        if (isChecked) {
            makeWaysFields.append({
                value
            });
        } else {
            makeWaysFields.replace(makeWaysFields.fields.filter(menu => menu.value !== value));
        }
    };

    const onFilterCookingRecipes = async (data: FormData) => {
        const { menus, typeDishs, makeWays } = data;
        const formatData = {
            menus: menus.map(item => item.value),
            typeDishs: typeDishs.map(item => item.value),
            makeWays: makeWays.map(item => item.value)
        };

        setFilterSearch(formatData);
        onToggleSheet();
        clean();
        getListCookingRecipe();
    };

    return (
        <Sheet open={isOpen}>
            <SheetTrigger asChild>
                <Button
                    variant='outline'
                    className={cn(
                        'font-normal rounded-full',
                        ((filterSearch.menus && filterSearch.menus.length > 0) ||
                            (filterSearch.typeDishs && filterSearch.typeDishs.length > 0) ||
                            (filterSearch.makeWays && filterSearch.makeWays.length > 0)) && 'text-primary border-primary'
                    )}
                    onClick={onToggleSheet}
                >
                    <SlidersHorizontalIcon className='w-4 h-4' />
                    <span className='ml-1'>{t('words_title.filter')}</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                className='px-3 h-full flex flex-col'
                side='center'
                onPointerDownOutside={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onClickCloseIcon={() => onToggleSheet()}
            >
                <SheetTitle>
                    {t('words_title.filter_1')}
                </SheetTitle>

                {/* form filter */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onFilterCookingRecipes)}
                        className='flex flex-col overflow-hidden'
                    >
                        <div className='flex-1 overflow-x-hidden overflow-y-auto scrollbar-width-2 pb-6 space-y-8'>
                            {/* menus */}
                            {
                                cookingRecipeMenus.length > 0 && (
                                    <FormField
                                        control={form.control}
                                        name='menus'
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className='font-semibold text-base inline-block'>{t('words_title.cooking_recipe_menu')}</Label>
                                                <hr className='mt-3 mb-4' />
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

                            {/* type dish */}
                            {
                                cookingRecipeTypeDishs.length > 0 && (
                                    <FormField
                                        control={form.control}
                                        name='typeDishs'
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className='font-semibold text-base inline-block'>{t('words_title.cooking_recipe_type_dish')}</Label>
                                                <hr className='mt-3 mb-4' />
                                                <div className='grid grid-cols-2 gap-3'>
                                                    {
                                                        cookingRecipeTypeDishs.map(typeDish => (
                                                            <div
                                                                key={typeDish.id}
                                                                className='flex items-center gap-2'
                                                            >
                                                                <Checkbox
                                                                    id={`type-dishs-${typeDish.id}`}
                                                                    checked={!!field.value.find(val => val.value === typeDish.id)}
                                                                    onCheckedChange={checked => onChangeCheckedTypeDishs(checked, typeDish.id)}
                                                                />
                                                                <Label htmlFor={`type-dishs-${typeDish.id}`}>{typeDish.name}</Label>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
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
                                        name='makeWays'
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className='font-semibold text-base inline-block'>{t('words_title.cooking_recipe_make_way')}</Label>
                                                <hr className='mt-3 mb-4' />
                                                <div className='grid grid-cols-2 gap-3'>
                                                    {
                                                        cookingRecipeMakeWays.map(makeWay => (
                                                            <div
                                                                key={makeWay.id}
                                                                className='flex items-center gap-2'
                                                            >
                                                                <Checkbox
                                                                    id={`make-way-${makeWay.id}`}
                                                                    checked={!!field.value.find(val => val.value === makeWay.id)}
                                                                    onCheckedChange={checked => onChangeCheckedMakeWays(checked, makeWay.id)}
                                                                />
                                                                <Label htmlFor={`make-way-${makeWay.id}`}>{makeWay.name}</Label>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                )
                            }
                        </div>

                        {/* action */}
                        <div className='flex items-center gap-6 pt-6 border-t justify-center'>
                            <Button
                                variant='outline'
                                type='button'
                                onClick={() => form.reset({
                                    menus: [],
                                    typeDishs: [],
                                    makeWays: []
                                })}
                                className='min-w-32'
                            >
                                {t('words_title.reset')}
                            </Button>

                            <Button
                                variant='default'
                                type='submit'
                                className='min-w-32'
                            >
                                {t('words_title.apply')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
});
