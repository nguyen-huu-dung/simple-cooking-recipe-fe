import { AxiosError, AxiosResponse } from 'axios';
import { ResponseData } from './http';

export type AxiosResponseApi = AxiosResponse<ResponseData, any>;

export type AxiosErrorApi = AxiosError<ResponseData, any>;

export type AxiosRequestApi = (payload) => Promise<AxiosResponseApi>;
