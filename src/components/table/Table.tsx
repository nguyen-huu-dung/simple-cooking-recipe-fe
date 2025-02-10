import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    RowData,
    TableOptions,
    useReactTable
} from '@tanstack/react-table';

import {
    TableRoot,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/TableUI';
import React, { useMemo } from 'react';
import SelectPageSize from './SelectPageSize';
import { cn } from '@/utils/utils';
import PagingInfo from './PagingInfo';
import Paginate from '../pagination/Paginate';
import { observer } from 'mobx-react-lite';
import { SkeletonDataTable } from './SkeletonTable';
import { useTranslation } from 'react-i18next';
import { ArrowDownZAIcon, ArrowUpDownIcon, ArrowUpZAIcon } from 'lucide-react';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line
    interface ColumnMeta<TData extends RowData, TValue> {
        headerClassName: string,
        cellClassName: string
    }
}

interface TableProps<TData, TValue> extends Partial<TableOptions<TData>> {
    columns: ColumnDef<TData, TValue>[],
    data?: TData[],
    containerClassName?: string,
    headerClassName?: string,
    cellClassName?: string,
    noData?: React.ReactNode,
    isManualAll?: boolean,
    showTableFooter?: boolean,
    showPagination?: boolean,
    showPagingInfo?: boolean,
    showSelectPageSize?: boolean,
    loadingData?: boolean,
    selectPageSizes?: number[],
    defaultContentPosition?: 'left' | 'right' | 'center'
}

export default observer(function Table<TData, TValue>({
    columns,
    data,
    containerClassName,
    headerClassName,
    cellClassName,
    noData,
    isManualAll = true,
    showTableFooter = true,
    showPagination = true,
    showPagingInfo = true,
    showSelectPageSize = true,
    loadingData = false,
    selectPageSizes,
    // select row
    enableRowSelection = false,
    defaultContentPosition = 'left',
    ...props
}: TableProps<TData, TValue>) {
    // variables
    const columnSelect: ColumnDef<TData> = {
        accessorKey: 'select-box',
        header: ({ table }) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomePageRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler()
                }}
            />
        ),
        cell: ({ row }) => (
            <IndeterminateCheckbox
                {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler()
                }}
            />
        ),
        enableSorting: false,
        minSize: 10,
        size: 10,
        maxSize: 10
    };

    const headerPosition = useMemo(() => {
        switch (defaultContentPosition) {
            case 'left':
                return 'justify-start';

            case 'right':
                return 'justify-end';

            case 'center':
                return 'justify-center';

            default:
                break;
        }
    }, [defaultContentPosition]);

    const cellPosition = useMemo(() => {
        switch (defaultContentPosition) {
            case 'left':
                return 'text-left';

            case 'right':
                return 'text-right';

            case 'center':
                return 'text-center';

            default:
                break;
        }
    }, [defaultContentPosition]);

    // hooks
    const { t } = useTranslation();

    // init table
    const table = useReactTable({
        data: data ?? [],
        columns: !enableRowSelection ?
            columns :
            [
                columnSelect,
                ...columns
            ],
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection,
        ...(isManualAll ?
            {
                manualExpanding: true,
                manualFiltering: true,
                manualGrouping: true,
                manualPagination: true,
                manualSorting: true
            } :
            {}),
        ...props
    });

    return (
        <div className={containerClassName}>
            {
                showSelectPageSize && (
                    <div className='flex mb-4'>
                        <SelectPageSize
                            pageSize={table.getState().pagination.pageSize}
                            setPagination={table.setPagination}
                            selectPageSizes={selectPageSizes}
                        />
                    </div>
                )
            }
            <div className='rounded-md border overflow-x-auto'>
                <TableRoot>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                header.column.getCanSort() && 'cursor-pointer select-none'
                                            )}
                                            style={{ width: header.getSize(), minWidth: header.getSize() }}
                                            onClick={header.column.getToggleSortingHandler()}
                                            title={
                                                header.column.getCanSort() ?
                                                    header.column.getNextSortingOrder() === 'asc' ?
                                                        t('table.sort.ascending') :
                                                        header.column.getNextSortingOrder() === 'desc' ?
                                                            t('table.sort.descending') :
                                                            t('table.sort.clear') :
                                                    undefined
                                            }
                                        >
                                            {
                                                header.isPlaceholder ?
                                                    null :
                                                    (
                                                        <div className={cn(
                                                            'flex items-center gap-1 text-primary font-semibold',
                                                            headerPosition,
                                                            headerClassName,
                                                            header.column.columnDef.meta?.headerClassName
                                                        )}
                                                        >
                                                            {
                                                                flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )
                                                            }
                                                            {
                                                                header.column.getCanSort() &&
                                                                (
                                                                    {
                                                                        asc: <ArrowUpZAIcon className='inline-block w-4 h-4' />,
                                                                        desc: <ArrowDownZAIcon className='inline-block w-4 h-4' />
                                                                    }[header.column.getIsSorted() as string] ?? <ArrowUpDownIcon className='inline-block w-4 h-4' />
                                                                )
                                                            }
                                                        </div>
                                                    )
                                            }
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {
                        !loadingData && (
                            <TableBody>
                                {table.getRowModel().rows?.length ?
                                    (
                                        table.getRowModel().rows.map(row => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && 'selected'}
                                            >
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className={cn(cellPosition, cellClassName, cell.column.columnDef.meta?.cellClassName)}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) :
                                    (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className='h-24 text-center'>
                                                {noData ?? t('words_title.no_data')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                            </TableBody>
                        )
                    }
                    {
                        loadingData && <SkeletonDataTable numCols={table.getAllColumns().length} />
                    }
                </TableRoot>
            </div>
            {
                !loadingData && showTableFooter && table.getRowCount() > 0 && (
                    <div className='mt-4 flex flex-col lg:flex-row lg:justify-between lg:items-center flex-wrap gap-6'>
                        <div>
                            {
                                showPagingInfo && (
                                    <PagingInfo
                                        pageIndex={table.getState().pagination.pageIndex}
                                        pageSize={table.getState().pagination.pageSize}
                                        totalRecords={table.getRowCount()}
                                    />
                                )
                            }
                        </div>
                        <div className='mx-auto lg:mx-0'>
                            {
                                showPagination && (
                                    <Paginate
                                        forcePage={table.getState().pagination.pageIndex}
                                        pageCount={table.getPageCount()}
                                        onPageChange={({ selected }) => table.setPageIndex(selected)}
                                        marginPagesDisplayed={2}
                                        pageLinkClassName='hidden md:inline-flex'
                                        activeLinkClassName='!inline-flex'
                                        containerClassName='gap-0 md:gap-1'
                                    />
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
});

function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return (
        <input
            type='checkbox'
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    );
}
