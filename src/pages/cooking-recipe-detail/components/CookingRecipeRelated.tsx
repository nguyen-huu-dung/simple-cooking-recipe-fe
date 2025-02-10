import { Skeleton } from '@/components/common/Skeleton';
import CookingRecipeCard from '@/components/general/CookingRecipeCard';
import { COOKING_RECIPE_SORT_OPTIONS } from '@/configs/constants';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/utils/utils';
import { TableState } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CookingRecipeRelatedProps {
    slug: string,
    containerClassName?: string
}

export default observer(function CookingRecipeRelated({
    slug,
    containerClassName
}: CookingRecipeRelatedProps) {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        cookingRecipeStore: { clean, cookingRecipes, getListCookingRecipe }
    } = useStore();

    // lifecycle
    useEffect(() => {
        if (slug) {
            getListCookingRecipe({
                slug,
                isRelated: true
            }, {
                pagination: {
                    pageIndex: 1,
                    pageSize: 6
                },
                sorting: [{
                    id: COOKING_RECIPE_SORT_OPTIONS[1].sortKey,
                    desc: true
                }]
            } as TableState);
        }

        return () => {
            clean();
        };
    }, [slug]);

    return (
        <section className={cn('', containerClassName)}>
            {
                // skeleton
                cookingRecipes === undefined ?
                    <Skeleton className='w-full h-full' /> :
                    (
                        <div>
                            <h3 className='text-lg font-semibold'>{t('words_title.cooking_recipes_related')}</h3>
                            <div className='mt-4'>
                                {/* no data */}
                                {
                                    cookingRecipes.length === 0 && (
                                        <div className='text-center'>{t('messages.no_cooking_recipes')}</div>
                                    )
                                }

                                {/* render list */}
                                {
                                    cookingRecipes.length > 0 && (
                                        <div className='grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4'>
                                            {
                                                cookingRecipes.map(cookingRecipe => (
                                                    <CookingRecipeCard
                                                        key={cookingRecipe.code}
                                                        cookingRecipe={cookingRecipe}
                                                        isRelated
                                                    />
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
            }
        </section>
    );
});
