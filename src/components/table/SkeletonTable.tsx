import { TableBody, TableCell, TableRow } from '../ui/TableUI';
import { Skeleton } from '../common/Skeleton';

export function SkeletonDataTable({ numCols, numRows = 5 }: { numCols: number, numRows?: number }) {
    return (
        <TableBody>
            {
                Array.from({ length: numRows }).map((_, indexRow) => (
                    <TableRow key={indexRow}>
                        {Array.from({ length: numCols }).map((_, indexCol) => (
                            <TableCell
                                key={indexCol}
                                className='text-center'
                            >
                                <Skeleton className='h-4 w-full' />
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            }
        </TableBody>
    );
}
