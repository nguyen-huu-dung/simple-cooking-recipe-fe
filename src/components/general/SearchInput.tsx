import { useTranslation } from 'react-i18next';
import { InputWithIcon } from '../common/Input';
import { useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { ROUTES } from '@/configs/constants';
import { cn } from '@/utils/utils';
import { useStore } from '@/hooks/useStore';

interface SearchInputProps {
    className?: string,
    inputClassName?: string
}

export default function SearchInput({
    className,
    inputClassName
}: SearchInputProps) {
    // hooks
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const keySearch = searchParams.get('keySearch') || '';

    // store
    const {
        cookingRecipeStore: { setKeySearch }
    } = useStore();

    // state
    const [searchValue, setSearchValue] = useState<string>();

    // function
    const onChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const onHandleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onHandleSearch();
        }
    };

    const onHandleSearch = () => {
        if (searchValue === keySearch) {
            navigate(0);
        } else {
            if (!searchValue) {
                navigate(ROUTES.home.href, {
                    replace: true
                });
            } else {
                navigate(`${ROUTES.home.href}?keySearch=${encodeURIComponent(searchValue)}`);
            }
            setKeySearch(searchValue);
            setSearchValue('');
        }
    };

    return (
        <div className={cn('flex items-center', className)}>
            <InputWithIcon
                type='text'
                value={searchValue}
                placeholder={t('placeholder.search_recipe')}
                className={cn('border-primary', inputClassName)}
                onKeyDown={onHandleKeyDown}
                onChange={onChangeSearchValue}
                icon={(
                    <div
                        className='absolute icon-right-input right-1 flex justify-center items-center py-2 px-3 bg-primary rounded-md hover:bg-primary/90'
                        onClick={onHandleSearch}
                    >
                        <SearchIcon className='text-white' size={16} />
                    </div>
                )}
            />
        </div>
    );
}
