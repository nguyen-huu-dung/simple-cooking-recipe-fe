import { DEFAULT_SELECT_PAGE_SIZES } from '@/configs/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { PaginationState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface SelectPageSizeProps {
    selectPageSizes?: number[],
    pageSize: number,
    setPagination: (pagination: PaginationState) => void
}

export default function SelectPageSize({ pageSize, setPagination, selectPageSizes = DEFAULT_SELECT_PAGE_SIZES }: SelectPageSizeProps) {
    // hooks
    const { t } = useTranslation();

    return (
        <Select
            value={pageSize.toString()}
            onValueChange={(page: string) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: Number(page)
                });
            }}
        >
            <SelectTrigger className='w-48'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {
                    selectPageSizes.map(size => (
                        <SelectItem key={size} value={size.toString()}>
                            {
                                t('table.show_info', {
                                    value: size
                                })
                            }
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    );
}
