import { Button } from '@/components/common/Button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/common/Carousel';
import WrapperSection from '@/components/layout/WrapperSection';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Logo from '@/assets/images/logo.png';
import { cn } from '@/utils/utils';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router';
import { ClockIcon, CookingPotIcon, MoveRightIcon } from 'lucide-react';
import { convertMinutesToHours } from '@/utils/datetime';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/common/Skeleton';

export default observer(function RecommendCookingRecipe() {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        cookingRecipeStore: { recommendCookingRecipes, getRecommendListCookingRecipe }
    } = useStore();

    // state
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    // lifecycle
    useEffect(() => {
        getRecommendListCookingRecipe();
    }, []);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (recommendCookingRecipes === undefined) return <Skeleton className='max-sm:h-[20rem] h-[28rem]' />;

    if (!recommendCookingRecipes.length) return <></>;

    return (
        <WrapperSection className='p-0'>
            <Carousel
                setApi={setApi}
                className='w-full'
                opts={{
                    loop: true
                }}
                plugins={[
                    Autoplay({ playOnInit: false, delay: 3000 })
                ]}
            >
                <CarouselContent>
                    {
                        recommendCookingRecipes.map((cookingRecipe, index) => (
                            <CarouselItem key={cookingRecipe.code}>
                                <Link to={`/cooking-recipe/${cookingRecipe.slug}`}>
                                    <div className={cn(
                                        'relative w-full max-sm:h-[20rem] h-[28rem] overflow-hidden rounded',
                                        index % 2 ? 'bg-[#ffe8b2]' : 'bg-[#ffd2bf]'
                                    )}
                                    >
                                        <div className='absolute top-5 flex items-center gap-1 text-white font-semibold bg-primary px-3 py-1 rounded-r-full'>
                                            <CookingPotIcon className='w-4 h-4' />
                                            <span>{t('messages.recommend_good_cooking_recipe')}</span>
                                        </div>

                                        <div className='max-sm:h-2/3 max-lg:flex max-lg:w-[calc(100%-2rem)] max-lg:h-3/4 max-lg:items-center max-lg:bg-background max-lg:rounded-lg max-lg:absolute max-lg:top-1/2 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:-translate-y-1/2'>
                                            <div className='p-4 lg:w-1/3 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:bg-background lg:rounded-lg lg:p-4 lg:space-y-1 lg:translate-x-10'>
                                                {/* name */}
                                                <h3 className='font-semibold text-foreground text-base line-clamp-2'>
                                                    {cookingRecipe.name}
                                                </h3>

                                                {/* total time */}
                                                <div className='flex items-center gap-1'>
                                                    <ClockIcon className='w-4 h-4' />
                                                    <span>{convertMinutesToHours(cookingRecipe.totalTime)}</span>
                                                </div>

                                                {/* introduce */}
                                                <p className='line-clamp-3'>
                                                    {cookingRecipe.introduce}
                                                </p>

                                                <div className='pt-4 flex justify-center items-center text-primary font-semibold gap-1 hover:underline'>
                                                    <span>{t('words_title.watch_now')}</span>
                                                    <MoveRightIcon className='w-4 h-4' />
                                                </div>
                                            </div>
                                            <img
                                                className='max-sm:hidden max-lg:h-full max-lg:w-1/2 object-cover lg:w-1/2 lg:h-3/4 lg:rounded-full lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:-translate-x-10'
                                                src={cookingRecipe.image ?? Logo}
                                                alt='cooking-recipe-image-banner'
                                                loading='lazy'
                                                onError={e => e.currentTarget.src = Logo}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-2'>
                    {
                        Array.from({ length: recommendCookingRecipes.length }).map((_, index) => (
                            <Button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={cn(
                                    'h-2 rounded-md p-0',
                                    current === index + 1 ? 'bg-primary w-12' : 'bg-gray-200 w-8'
                                )}
                            />
                        ))
                    }
                </div>
            </Carousel>
        </WrapperSection>
    );
});
