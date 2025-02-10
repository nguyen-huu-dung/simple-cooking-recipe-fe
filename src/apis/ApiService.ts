import { axiosApi } from '@/services/axios';
import i18n from '@/services/i18n';
import { AxiosResponseApi } from '@/types/axios';
import { HttpMethodSupport } from '@/types/http';
import { getStorage } from '@/utils/browsers';
import { AxiosHeaderValue, AxiosInstance, RawAxiosRequestHeaders, ResponseType } from 'axios';

interface HeadersProps extends RawAxiosRequestHeaders {
    [key: string]: AxiosHeaderValue | undefined
}

interface ApiConfigs {
    headers?: HeadersProps,
    responseType?: ResponseType
}

export default class ApiService {
    axiosInstance: AxiosInstance;
    url?: string;
    headers: HeadersProps;
    get = this.createRequestMethod('get');
    post = this.createRequestMethod('post');
    put = this.createRequestMethod('put');
    delete = this.createRequestMethod('delete');
    patch = this.createRequestMethod('patch');

    constructor(url?: string, headers: HeadersProps = {}) {
        this.axiosInstance = axiosApi;
        this.headers = headers;
        this.url = url ? `/${url}` : '';
    }

    createRequestMethod(method: HttpMethodSupport) {
        return (url: string, body?: any, apiConfigs?: ApiConfigs): Promise<AxiosResponseApi> => {
            return this.callApi(method, url, body, apiConfigs);
        };
    }

    callApi(
        method: HttpMethodSupport,
        url: string = '',
        body?: any,
        { headers, responseType }: ApiConfigs = {}
    ) {
        let dataForm = body;
        if (
            headers?.['Content-Type'] === 'multipart/form-data' &&
            method !== 'get' &&
            body &&
            body instanceof Object
        ) {
            dataForm = this.processBodyData(body);
        }

        return this.axiosInstance({
            url: `${this.url}/${url}`,
            method,
            headers: Object.assign(
                {
                    'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                    'Authorization': getStorage('token'),
                    'Locale': i18n.language
                },
                this.headers,
                headers
            ),
            params: method === 'get' && (body ?? {}),
            data: method !== 'get' && (dataForm ?? {}),
            responseType: responseType ?? 'json'
        });
    }

    processBodyData(body) {
        if (!body) return body;
        Object.entries(body).forEach(([key, value]) => {
            body[key] = value === null || value === undefined ? '' : value;
        });

        return body;
    }
}
