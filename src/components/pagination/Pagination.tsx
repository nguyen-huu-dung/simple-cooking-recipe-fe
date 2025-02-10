import { memo, ReactNode } from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/PaginationUI';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { getPagination } from './getPagination';
import { XOR } from '@/utils/utility-types';
import { cn } from '@/utils/utils';

interface BasePaginationProps {
    type?: string,
    currentPage: number,
    totalRecords: number,
    siblingCount?: number,
    pageSize: number,
    onPageChange: (pageIndex: number) => void,
    previousLabel?: ReactNode,
    nextLabel?: ReactNode,
    paginationClassName?: string,
    paginationContentClassName?: string,
    paginationItemClassName?: string,
    paginationPreviousClassName?: string,
    paginationNextClassName?: string
}

interface FullPaginationProps extends BasePaginationProps {
    type: 'full-pagination',
    breakLabel?: ReactNode,
    paginationBreakClassName?: string,
    paginationLinkClassName?: string,
    paginationLinkActiveClassName?: string
}

interface ShortPagination extends BasePaginationProps {
    type: 'short-pagination',
    label?: ReactNode,
    paginationLabelClassName?: string
}

type PaginationFunctionProps = XOR<FullPaginationProps, ShortPagination>;

function PaginationFunction({
    type,
    currentPage,
    totalRecords = 0,
    siblingCount = 1,
    pageSize,
    onPageChange,
    previousLabel,
    nextLabel,
    paginationClassName,
    paginationContentClassName,
    paginationItemClassName,
    paginationPreviousClassName,
    paginationNextClassName,
    // full pagination
    breakLabel,
    paginationBreakClassName,
    paginationLinkClassName,
    paginationLinkActiveClassName,
    // short
    label,
    paginationLabelClassName
}: PaginationFunctionProps) {
    const paginationRange = type === 'full-pagination' ?
        getPagination({
            currentPage,
            totalRecords,
            siblingCount,
            pageSize,
            breakLabel: 'break'
        }) :
        [];

    const totalPages = Math.ceil(totalRecords / pageSize);

    const onNext = () => {
        if (currentPage >= Math.ceil(totalRecords / pageSize)) return;
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        if (currentPage <= 1) return;
        onPageChange(currentPage - 1);
    };

    if (currentPage === 0 || totalRecords === 0 || (type === 'full-pagination' && paginationRange.length < 2)) {
        return <></>;
    }

    return (
        <Pagination className={paginationClassName}>
            <PaginationContent className={paginationContentClassName}>
                <PaginationItem className={paginationItemClassName}>
                    <PaginationPrevious
                        onClick={onPrevious}
                        disabled={currentPage === 1}
                        className={paginationPreviousClassName}
                    >
                        {
                            previousLabel ?? (
                                <>
                                    <ChevronLeft className='h-4 w-4' />
                                    <span>Previous</span>
                                </>
                            )
                        }
                    </PaginationPrevious>
                </PaginationItem>
                {
                    type === 'full-pagination' &&
                    paginationRange.map((page, index) => {
                        return (
                            <PaginationItem key={index} className={paginationItemClassName}>
                                {
                                    typeof page === 'string' ?
                                        (
                                            <PaginationEllipsis className={paginationBreakClassName}>
                                                {
                                                    breakLabel ?? (
                                                        <>
                                                            <MoreHorizontal className='h-4 w-4' />
                                                            <span className='sr-only'>More pages</span>
                                                        </>
                                                    )
                                                }
                                            </PaginationEllipsis>
                                        ) :
                                        (
                                            <PaginationLink
                                                onClick={() => onPageChange(page)}
                                                isActive={page === currentPage}
                                                className={cn(paginationLinkClassName, page === currentPage && paginationLinkActiveClassName)}
                                            >
                                                {page}
                                            </PaginationLink>
                                        )
                                }
                            </PaginationItem>
                        );
                    })
                }
                {
                    type === 'short-pagination' && (
                        <PaginationItem className={paginationItemClassName}>
                            {
                                label ?? (
                                    <span className={paginationLabelClassName}>
                                        { currentPage }
                                        /
                                        { Math.ceil(totalRecords / pageSize) }
                                    </span>
                                )
                            }
                        </PaginationItem>
                    )
                }
                <PaginationItem className={paginationItemClassName}>
                    <PaginationNext
                        onClick={onNext}
                        disabled={currentPage === totalPages}
                        className={paginationNextClassName}
                    >
                        {
                            nextLabel ?? (
                                <>
                                    <span>Next</span>
                                    <ChevronRight className='h-4 w-4' />
                                </>
                            )
                        }
                    </PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

const PaginationCommon = memo(PaginationFunction, (prevProps, nextProps) => {
    if (prevProps.currentPage !== nextProps.currentPage ||
        prevProps.totalRecords !== nextProps.totalRecords ||
        prevProps.pageSize !== nextProps.pageSize) return false;
    return true;
});

export default PaginationCommon;
