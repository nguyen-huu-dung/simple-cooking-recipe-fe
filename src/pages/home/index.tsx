import { useStore } from '@/hooks/useStore';
import ListCookingRecipe from './components/ListCookingRecipe';
import { useEffect } from 'react';
import RecommendCookingRecipe from './components/RecommendCookingRecipe';

export default function HomePage() {
    // store
    const {
        cookingRecipeStore: { setKeySearch }
    } = useStore();

    // lifecycle
    useEffect(() => {
        return () => {
            setKeySearch();
        };
    }, []);

    return (
        <section className='grid grid-cols-1 gap-8'>
            <RecommendCookingRecipe />
            <ListCookingRecipe />
        </section>
    );
}
