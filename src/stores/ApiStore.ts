import { action, makeObservable, observable } from 'mobx';
import RootStore from '.';
import BaseStore from './BaseStore';
import { handleSaveFile } from '@/utils/file';
import { AxiosErrorApi, AxiosRequestApi, AxiosResponseApi } from '@/types/axios';
import ApiService from '@/apis/ApiService';
import { t } from 'i18next';
import { ResponseData } from '@/types/http';
import { toastify } from '@/components/common/Toastify';
import { ROUTES } from '@/configs/constants';

export interface CallApiOptions {
    handleErrorBySelf?: boolean,
    callbackError?: (response: AxiosResponseApi) => void,
    disableAlertError?: boolean,
    hideLoading?: boolean
}

export default class ApiStore extends BaseStore {
    isLoading: boolean = false;
    requestCount: number = 0;

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            isLoading: observable,
            showLoading: action.bound,
            hideLoading: action.bound,
            setLoading: action.bound,
            handlerGeneralResponseSuccess: action.bound,
            handlerGeneralResponseError: action.bound,
            call: action.bound
        });
    }

    showLoading() {
        this.isLoading = true;
    }

    hideLoading() {
        this.isLoading = false;
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    handlerGeneralResponseSuccess = (response: AxiosResponseApi): ResponseData => {
        if (response && response.status === 200) {
            const type = response.headers['content-type'];
            const isExport = [
                'application/pdf',
                'application/zip',
                'text/csv; charset=utf-8',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ''
            ].includes(type);
            if (isExport) {
                handleSaveFile(response);
            }
            return response.data;
        }

        throw response;
    };

    handlerGeneralResponseError = (
        response?: AxiosResponseApi,
        { handleErrorBySelf, callbackError, disableAlertError }: Partial<CallApiOptions> = {}
    ): ResponseData => {
        if (handleErrorBySelf || !response) {
            throw response;
        }

        try {
            if (response.status === 401 || response.status === 403) {
                this.rootStore.modalStore.showAlertModal({
                    content: response.data.message || t('messages.api_response_no_message'),
                    saveButton: t('words_title.back_to_home'),
                    onSave: () => {
                        this.rootStore.authStore.clearAuthentication();
                        window.location.href = ROUTES.home.href;
                    }
                });
            } else if (response.status === 404) {
                this.rootStore.modalStore.showAlertModal({
                    content: response.data.message || t('messages.api_response_no_message'),
                    saveButton: t('words_title.back_to_home'),
                    onSave: () => {
                        window.location.href = ROUTES.home.href;
                    }
                });
            } else if (response.status >= 500) {
                toastify('error', response.data.message || t('messages.api_response_no_network_or_server_error'));
            } else if (response.status) {
                if (!disableAlertError) {
                    this.rootStore.modalStore.showAlertModal({
                        content: response.data.message || t('messages.api_response_no_message')
                    });
                }
                callbackError && callbackError(response);
            }
        } catch (error) {
            toastify('error', t('messages.api_response_no_network_or_server_error'));
        } finally {
            throw response;
        }
    };

    call(
        contextRequest: ApiService,
        request: AxiosRequestApi,
        payload?: any,
        { handleErrorBySelf, callbackError, disableAlertError, hideLoading }: CallApiOptions = {}
    ): Promise<ResponseData> {
        this.requestCount += 1;
        if (!hideLoading) this.showLoading();
        return request.apply(contextRequest, [payload])
            .then(this.handlerGeneralResponseSuccess)
            .catch((response: AxiosErrorApi) => this.handlerGeneralResponseError(response.response, { handleErrorBySelf, callbackError, disableAlertError }))
            .finally(() => {
                this.requestCount -= 1;
                if (this.requestCount === 0) {
                    this.hideLoading();
                }
            });
    }
}
