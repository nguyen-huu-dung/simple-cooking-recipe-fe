import WrapperSection from '@/components/layout/WrapperSection';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import CookingRecipeInfo from './components/CookingRecipeInfo';
import CookingRecipeRelated from './components/CookingRecipeRelated';
import NotFoundPage from '../not-found';

export default observer(function CookingRecipeDetail() {
    // hooks
    const { slug } = useParams();

    if (!slug) return <NotFoundPage />;

    return (
        <WrapperSection className='flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4'>

            {/* cooking recipe info */}
            <CookingRecipeInfo
                slug={slug}
                containerClassName='col-span-1 lg:col-span-3'
            />

            {/* cooking recipe related */}
            <CookingRecipeRelated
                slug={slug}
                containerClassName='col-span-1 mt-10 lg:mt-0'
            />
        </WrapperSection>
    );
});
