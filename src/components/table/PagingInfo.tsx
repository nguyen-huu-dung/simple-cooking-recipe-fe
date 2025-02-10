import { useTranslation } from 'react-i18next';

interface PagingInfoProps {
    pageIndex: number,
    pageSize: number,
    totalRecords: number
}

export default function PagingInfo({ pageIndex, pageSize, totalRecords }: PagingInfoProps) {
    // hooks
    const { t } = useTranslation();

    // variables
    let to = (pageIndex + 1) * pageSize;
    if (to > totalRecords) {
        to = totalRecords;
    }

    return (
        <span>
            {t('table.paging_info', {
                from: pageIndex * pageSize + 1,
                to,
                total: totalRecords
            })}
        </span>
    );
}
