import { Skeleton } from '@/components/common/Skeleton';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/utils/utils';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '@/assets/images/logo.png';
import { ClockIcon } from 'lucide-react';
import { convertMinutesToHours } from '@/utils/datetime';

interface CookingRecipeInfoProps {
    slug: string,
    containerClassName?: string
}

export default observer(function CookingRecipeInfo({
    slug,
    containerClassName
}: CookingRecipeInfoProps) {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        cookingRecipeStore: { clean, cookingRecipe, getCookingRecipe }
    } = useStore();

    // lifecycle
    useEffect(() => {
        if (slug) {
            getCookingRecipe({
                slug
            });
        }

        return () => {
            clean();
        };
    }, [slug]);

    return (
        <section className={cn('', containerClassName)}>
            {
                // skeleton
                cookingRecipe === undefined ?
                    <Skeleton className='w-full h-full' /> :
                    (
                        <>
                            {/* image */}
                            <img
                                className='w-full h-auto lg:h-[36rem] object-cover rounded-sm'
                                src={cookingRecipe.image ?? Logo}
                                alt='image-cooking-recipe'
                                loading='lazy'
                                onError={e => e.currentTarget.src = Logo}
                            />

                            {/* info */}
                            <div className='mt-4'>
                                {/* name */}
                                <h3 className='text-lg font-semibold'>{cookingRecipe.name}</h3>

                                <div className='text-muted-foreground'>
                                    {/* clock */}
                                    <div className='flex items-center gap-1'>
                                        <ClockIcon className='w-4 h-4' />
                                        <span>{convertMinutesToHours(cookingRecipe.totalTime)}</span>
                                    </div>
                                    {/* tag: menus, type dish, make way */}
                                    <div>
                                        {
                                            [...cookingRecipe.menus, cookingRecipe.typeDish, cookingRecipe.makeWay]
                                                .filter(e => e).map(e => e?.name).join(', ')
                                        }
                                    </div>
                                </div>

                                {/* introduce */}
                                <div className='mt-4 font-medium'>
                                    {cookingRecipe.introduce}
                                </div>

                                {/* ingredients */}
                                <div className='mt-8'>
                                    <div className='flex justify-between items-center'>
                                        <h3 className='text-lg font-semibold'>{t('words_title.cooking_recipe_ingredients')}</h3>
                                        <p className='text-muted-foreground'>
                                            {t('words_title.cooking_recipe_ration')}
                                            :
                                            {' '}
                                            {cookingRecipe.ration}
                                            {' '}
                                            {t('words_title.person')}
                                        </p>
                                    </div>
                                    <div className='mt-3 font-medium'>
                                        {
                                            cookingRecipe.ingredients.length > 0 && (
                                                cookingRecipe.ingredients.map((ingredient, index) => (
                                                    <p
                                                        key={index}
                                                        className='py-2 border-b'
                                                    >
                                                        {ingredient}
                                                    </p>
                                                ))
                                            )
                                        }
                                    </div>
                                </div>

                                {/* instructions */}
                                <div className='mt-8'>
                                    <div className='flex justify-between items-center'>
                                        <h3 className='text-lg font-semibold'>{t('words_title.cooking_recipe_instructions')}</h3>
                                        <p className='text-muted-foreground'>
                                            {cookingRecipe.instructions.length}
                                            {' '}
                                            {t('words_title.steps')}
                                        </p>
                                    </div>
                                    <div className='mt-3 font-medium flex flex-col gap-6'>
                                        {
                                            cookingRecipe.instructions.length > 0 && (
                                                cookingRecipe.instructions.map((ingredient, index) => (
                                                    <div
                                                        key={index}
                                                        className='flex items-center gap-4 group hover:text-primary'
                                                    >
                                                        <span className='w-10 aspect-square border rounded-full flex-none flex items-center justify-center group-hover:border-primary'>{index + 1}</span>
                                                        {ingredient}
                                                    </div>
                                                ))
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    )
            }
        </section>
    );
});
