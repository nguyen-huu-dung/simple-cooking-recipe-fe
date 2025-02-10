import { Card, CardContent, CardDescription } from '@/components/common/Card';
import { CookingRecipe } from '@/types/cookingRecipe';
import Logo from '@/assets/images/logo.png';
import { Skeleton } from '@/components/common/Skeleton';
import { ClockIcon } from 'lucide-react';
import { convertMinutesToHours } from '@/utils/datetime';
import { Link } from 'react-router';
import { cn } from '@/utils/utils';

interface CookingRecipeCardProps {
    cookingRecipe?: CookingRecipe,
    skeleton?: boolean,
    isRelated?: boolean
}

export default function CookingRecipeCard({
    cookingRecipe,
    skeleton = false,
    isRelated = false
}: CookingRecipeCardProps) {
    if (skeleton) return (
        <Card>
            <Skeleton className='h-60' />
        </Card>
    );

    if (!cookingRecipe) return <></>;

    return (
        <Link
            to={`/cooking-recipe/${cookingRecipe.slug}`}
            className='flex'
        >
            <Card className='group hover:cursor-pointer'>
                <CardContent className='pt-6'>
                    {/* image */}
                    <div className='overflow-hidden'>
                        <img
                            className='w-full aspect-square object-cover rounded-sm duration-1000 group-hover:scale-105'
                            src={cookingRecipe.image ?? Logo}
                            alt='image-cooking-recipe'
                            loading='lazy'
                            onError={e => e.currentTarget.src = Logo}
                        />
                    </div>

                    <CardDescription className='space-y-1'>
                        {/* name */}
                        <h2 className={cn(
                            'mt-3 font-semibold text-foreground text-base text-center line-clamp-2 hover:underline',
                            isRelated && 'text-left'
                        )}
                        >
                            {cookingRecipe.name}
                        </h2>

                        {/* total time */}
                        <div className={cn(
                            'flex items-center gap-1 justify-center',
                            isRelated && 'justify-start'
                        )}
                        >
                            <ClockIcon className='w-4 h-4' />
                            <span>{convertMinutesToHours(cookingRecipe.totalTime)}</span>
                        </div>

                        {/* introduce */}
                        {
                            !isRelated && (
                                <p className='line-clamp-2'>
                                    {cookingRecipe.introduce}
                                </p>
                            )
                        }
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
}
