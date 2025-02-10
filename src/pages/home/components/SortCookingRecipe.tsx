import { Button } from '@/components/common/Button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/common/DropdownMenu';
import { COOKING_RECIPE_SORT_OPTIONS } from '@/configs/constants';
import { useStore } from '@/hooks/useStore';
import { ColumnSort } from '@tanstack/react-table';
import { MoveVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SortCookingRecipe() {
    // hooks
    const { t } = useTranslation();

    // store
    const {
        cookingRecipeStore: { clean, getListCookingRecipe, setSortingSort }
    } = useStore();

    // state
    const [selectSortKey, setSelectSortKey] = useState<string>(COOKING_RECIPE_SORT_OPTIONS[0].id);

    // lifecycle
    useEffect(() => {
        return () => {
            setSortingSort([{}] as ColumnSort[]);
        };
    }, []);

    // function
    const onChangeSelectSort = (itemSort: ColumnSort) => {
        setSelectSortKey(itemSort.id);
        setSortingSort([{
            id: itemSort.id,
            desc: itemSort.desc
        }]);
        clean();
        getListCookingRecipe();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className='font-normal rounded-full min-w-12'
                >
                    <MoveVerticalIcon className='w-4 h-4' />
                    <span>{t(COOKING_RECIPE_SORT_OPTIONS.find(item => item.id === selectSortKey)?.label ?? t('words_title.sort'))}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                {
                    Object.values(COOKING_RECIPE_SORT_OPTIONS).map((item, index) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={item.id}
                                checked={item.id === selectSortKey}
                                onClick={() => onChangeSelectSort(item)}
                            >
                                {t(item.label)}
                            </DropdownMenuCheckboxItem>
                        );
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu>

    );
}
