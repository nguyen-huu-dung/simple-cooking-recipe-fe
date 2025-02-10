import WrapperSection from '@/components/layout/WrapperSection';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SortCookingRecipe from './SortCookingRecipe';
import { Button } from '@/components/common/Button';
import CookingRecipeCard from '@/components/general/CookingRecipeCard';
import FiltercookingRecipe from './FiltercookingRecipe';
import { CircleXIcon } from 'lucide-react';

export default observer(function ListCookingRecipe() {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        cookingRecipeStore: {
            cookingRecipes, totalCookingRecipes, getListCookingRecipe, clean,
            keySearch, setKeySearch
        }
    } = useStore();

    // lifecycle
    useEffect(() => {
        onSearch();
    }, [keySearch]);

    // function
    const onSearch = () => {
        clean();
        getListCookingRecipe();
    };

    const onGetViewMoreCookingRecipes = () => {
        getListCookingRecipe(undefined, undefined, true);
    };

    return (
        <WrapperSection>
            {/* search value */}
            {
                keySearch && (
                    <div className='flex items-center gap-4 mb-4'>
                        <div className='font-medium text-base'>
                            {t('messages.search_value', {
                                value: keySearch
                            })}
                        </div>
                        <CircleXIcon
                            className='w-5 h-5 hover:cursor-pointer hover:text-primary'
                            onClick={() => setKeySearch()}
                        />
                    </div>
                )
            }

            {/* sort & filter */}
            <div className='flex items-center justify-between border-b pb-4 flex-wrap gap-4'>
                {/* total cooking recipes by search & filter */}
                <h3 className='flex-none'>
                    <span className='text-primary text-xl font-semibold'>{totalCookingRecipes}</span>
                    <span className='ml-1'>{t('messages.delicious_food_every_day')}</span>
                </h3>
                <div className='flex items-center gap-4'>
                    <FiltercookingRecipe />
                    <SortCookingRecipe />
                </div>
            </div>

            {/* list cooking recipes */}
            <div className='mt-6'>
                {/* no data */}
                {
                    cookingRecipes?.length === 0 && (
                        <div className='text-center'>{t('messages.no_cooking_recipes')}</div>
                    )
                }

                {/* skeleton & render list */}
                {
                    (cookingRecipes === undefined || cookingRecipes.length > 0) && (
                        <div className='grid grid-col-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>
                            {
                                // skeleton
                                cookingRecipes === undefined ?
                                    (
                                        Array.from({ length: 8 }).map((_, index) => <CookingRecipeCard key={index} skeleton />)
                                    ) :
                                    (
                                        cookingRecipes.map(cookingRecipe => <CookingRecipeCard key={cookingRecipe.code} cookingRecipe={cookingRecipe} />)
                                    )
                            }
                        </div>
                    )
                }

                {/* view more button */}
                {
                    (cookingRecipes && cookingRecipes.length > 0 && totalCookingRecipes > 0 && cookingRecipes.length < totalCookingRecipes) && (
                        <div className='mt-8 flex justify-center'>
                            <Button
                                variant='outlinePrimary'
                                className='rounded-full px-8'
                                onClick={onGetViewMoreCookingRecipes}
                            >
                                {t('messages.view_more_cooking_recipes', {
                                    text: `(${cookingRecipes.length}/${totalCookingRecipes})`
                                })}
                            </Button>
                        </div>
                    )
                }
            </div>
        </WrapperSection>
    );
});
