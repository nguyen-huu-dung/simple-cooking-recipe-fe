import { action, makeObservable, observable } from 'mobx';
import RootStore from '.';
import { PaginationState, TableState } from '@tanstack/react-table';
import { DEFAULT_PAGINATION } from '@/configs/constants';
import { PagingRequest, PagingResponse } from '@/types/http';

export default class BaseStore {
    rootStore: RootStore;
    defaultPaging: TableState = {
        pagination: DEFAULT_PAGINATION,
        sorting: [{}]
    } as TableState;

    totalRecord: number = 0;
    paging: TableState = this.defaultPaging;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            totalRecord: observable,
            paging: observable,
            clean: action.bound
        });
        this.rootStore = rootStore;
    }

    convertPagingFromTableToRequest(paging: TableState): PagingRequest {
        return {
            page: paging.pagination.pageIndex + 1,
            size: paging.pagination.pageSize,
            sorting: paging.sorting.filter(sort => sort.id).map(sort => ({
                sortKey: sort.id,
                sortDir: sort.desc ? 'DESC' : 'ASC'
            }))
        };
    }

    convertPaginationFromRequestToTable(pagination: PagingResponse): PaginationState {
        return {
            pageIndex: pagination.page - 1,
            pageSize: pagination.size
        };
    }

    clean() {
        this.paging = this.defaultPaging;
    }
}
