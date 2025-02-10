export type HttpMethodSupport = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type ResponseData<T = any> = {
    ok: boolean,
    message: string | null,
    data: T
};

export interface PagingRequest {
    size: number,
    page: number,
    sorting: Array<{
        sortKey: string,
        sortDir: 'ASC' | 'DESC'
    }>
}

export interface PagingResponse {
    page: number,
    size: number,
    totalPage: number,
    totalRecord: number
}
