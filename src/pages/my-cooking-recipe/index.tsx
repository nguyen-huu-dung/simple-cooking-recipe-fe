import { Button } from '@/components/common/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/common/DropdownMenu';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { toastify } from '@/components/common/Toastify';
import WrapperSection from '@/components/layout/WrapperSection';
import Table from '@/components/table/Table';
import { DISPLAY_MOMENT_DATE_YMDHM, MAX_LENGTH_DEFAULT, ROUTES } from '@/configs/constants';
import { useStore } from '@/hooks/useStore';
import yup from '@/services/yup';
import { CookingRecipe } from '@/types/cookingRecipe';
import { STATUS } from '@/types/enums';
import { CookingRecipeDeleteRequest, CookingRecipeStatusPutRequest } from '@/types/http-payload/cookingRecipe';
import { formatDateTime } from '@/utils/datetime';
import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef, TableState, Updater } from '@tanstack/react-table';
import { CheckIcon, EditIcon, EyeIcon, EyeOffIcon, MoreHorizontalIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default observer(function CookingRecipeManagement() {
    // hooks
    const { t, i18n: { language } } = useTranslation();

    // store
    const {
        cookingRecipeStore: {
            cookingRecipes, paging, totalRecord, getMyListCookingRecipe, clean,
            updateStatusMyCookingRecipe, deleteMyCookingRecipe
        },
        modalStore: {
            showWarningModal
        }
    } = useStore();

    // validate schema
    const validateSchema = yup.object().shape({
        code: yup.string().trim().max(MAX_LENGTH_DEFAULT.INPUT, t('form_error_validate.max_characters', {
            max: MAX_LENGTH_DEFAULT.INPUT
        })),
        name: yup.string().trim().max(MAX_LENGTH_DEFAULT.INPUT, t('form_error_validate.max_characters', {
            max: MAX_LENGTH_DEFAULT.INPUT
        }))
    });

    type FormData = yup.InferType<typeof validateSchema>;

    // state
    const form = useForm<FormData>({
        resolver: yupResolver(validateSchema),
        mode: 'onSubmit',
        defaultValues: {
            code: '',
            name: ''
        }
    });

    // lifecycle
    useEffect(() => {
        onSearch();
    }, []);

    // function
    const onSearch = (searchParams?: FormData) => {
        clean();
        getMyListCookingRecipe(searchParams);
    };

    const onStateChange = (stateUpdater: Updater<TableState>) => {
        const newPaging = stateUpdater instanceof Function ? stateUpdater(paging) : stateUpdater;
        getMyListCookingRecipe(form.getValues(), newPaging);
    };

    const onSubmitUpdateStatusMyCookingRecipe = async (data: CookingRecipeStatusPutRequest) => {
        const res = await flowResult(updateStatusMyCookingRecipe(data));
        if (res) {
            toastify('success', t('messages.update_success'));
            getMyListCookingRecipe(form.getValues(), paging);
        }
    };

    const onShowConfirmUpdateStatusMyCookingRecipe = (data: CookingRecipeStatusPutRequest) => {
        showWarningModal({
            content: data.status === STATUS.Active ? t('messages.confirm_display_cooking_recipe') : t('messages.confirm_hide_cooking_recipe'),
            onSave: () => onSubmitUpdateStatusMyCookingRecipe(data)
        });
    };

    const onSubmitDeleteMyCookingRecipe = async (data: CookingRecipeDeleteRequest) => {
        const res = await flowResult(deleteMyCookingRecipe(data));
        if (res) {
            toastify('success', t('messages.delete_success'));
            getMyListCookingRecipe(form.getValues(), paging);
        }
    };

    const onShowConfirmDeleteMyCookingRecipe = (data: CookingRecipeDeleteRequest) => {
        showWarningModal({
            content: t('messages.confirm_delete_cooking_recipe'),
            onSave: () => onSubmitDeleteMyCookingRecipe(data)
        });
    };

    // columns
    const columns: ColumnDef<CookingRecipe>[] = [
        {
            accessorKey: 'code',
            header: t('words_title.code'),
            size: 150,
            enableSorting: false
        },
        {
            accessorKey: 'name',
            header: t('words_title.cooking_recipe_name'),
            size: 300
        },
        {
            accessorKey: 'status',
            header: t('words_title.display_view'),
            size: 150,
            enableSorting: false,
            cell: ({ row: { original } }) => {
                return (
                    <div>
                        {
                            original?.status === STATUS.Active &&
                            <CheckIcon />
                        }
                    </div>
                );
            }
        },
        {
            accessorKey: 'created_at',
            header: t('words_title.created_at'),
            size: 200,
            cell: ({ row: { original } }) => {
                return (
                    <div>
                        {
                            original?.createdAt ?
                                formatDateTime(original.createdAt, DISPLAY_MOMENT_DATE_YMDHM[language]) :
                                ''
                        }
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: t('words_title.action'),
            size: 150,
            cell: ({ row: { original } }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontalIcon className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            {
                                original?.status === STATUS.Inactive && (
                                    <DropdownMenuItem
                                        className='flex items-center gap-2'
                                        onClick={() => onShowConfirmUpdateStatusMyCookingRecipe({
                                            code: original.code,
                                            status: STATUS.Active
                                        })}
                                    >
                                        <EyeIcon className='w-4 h-4' />
                                        <span>{t('words_title.display_cooking_recipe')}</span>
                                    </DropdownMenuItem>
                                )
                            }
                            {
                                original?.status === STATUS.Active && (
                                    <DropdownMenuItem
                                        className='flex items-center gap-2'
                                        onClick={() => onShowConfirmUpdateStatusMyCookingRecipe({
                                            code: original.code,
                                            status: STATUS.Inactive
                                        })}
                                    >
                                        <EyeOffIcon className='w-4 h-4' />
                                        <span>{t('words_title.hide_cooking_recipe')}</span>
                                    </DropdownMenuItem>
                                )
                            }
                            <Link to={`${ROUTES.myCookingRecipeManagement.href}/${original.code}`}>
                                <DropdownMenuItem className='flex items-center gap-2'>
                                    <EditIcon className='w-4 h-4' />
                                    <span>{t('words_title.update_cooking_recipe')}</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                                className='flex items-center gap-2'
                                onClick={() => onShowConfirmDeleteMyCookingRecipe({
                                    code: original.code
                                })}
                            >
                                <TrashIcon className='w-4 h-4' />
                                <span>{t('words_title.delete_cooking_recipe')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    return (
        <>
            {/* Search */}
            <WrapperSection>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSearch)}>
                        <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 mg:gap-10'>
                            {/* code */}
                            <FormField
                                control={form.control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem className='space-y-1 flex flex-col lg:flex-row lg:items-center'>
                                        <Label className='w-36'>{t('words_title.code')}</Label>
                                        <div className='flex-1'>
                                            <FormControl>
                                                <Input type='text' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* name */}
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='space-y-1 flex flex-col lg:flex-row lg:items-center'>
                                        <Label className='w-36'>{t('words_title.cooking_recipe_name')}</Label>
                                        <div className='flex-1'>
                                            <FormControl>
                                                <Input type='text' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </section>

                        {/* action search */}
                        <section className='flex justify-center mt-10'>
                            <Button
                                type='submit'
                                variant='outlinePrimary'
                                className='w-40'
                            >
                                <SearchIcon />
                                <span>{t('words_title.search')}</span>
                            </Button>
                        </section>
                    </form>
                </Form>
            </WrapperSection>

            <WrapperSection>
                {/* Action */}
                <div className='flex justify-end mb-4'>
                    <Link to={ROUTES.createMyCookingRecipe.href}>
                        <Button>
                            {t('words_title.create_cooking_recipe')}
                        </Button>
                    </Link>
                </div>

                {/* List */}
                <Table
                    columns={columns}
                    data={cookingRecipes}
                    state={paging}
                    rowCount={totalRecord}
                    onStateChange={onStateChange}
                    loadingData={cookingRecipes === undefined}
                />
            </WrapperSection>
        </>
    );
});
