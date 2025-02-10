import { action, flow, makeObservable, observable } from 'mobx';
import RootStore from '.';
import BaseStore from './BaseStore';
import { getStorage, removeStorage, saveLocalStorage } from '@/utils/browsers';
import { AuthApi } from '@/apis';
import { Profile } from '@/types/auth';
import { ResponseData } from '@/types/http';
import { ConfirmSignInWithOTPPostRequest, ConfirmSignInWithOTPPostResponse, ProfilePutRequest, ProfilePutResponse, SignInWithOTPPostRequest, SignInWithOTPPostResponse } from '@/types/http-payload/auth';
import { ROUTES } from '@/configs/constants';

export default class AuthStore extends BaseStore {
    api: AuthApi;
    profile: Profile | undefined;
    token: string = getStorage('token');

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            profile: observable,
            token: observable,
            signInWithOTP: flow.bound,
            confirmSignInWithOTP: flow.bound,
            signOut: action.bound,
            getProfile: flow.bound,
            updateProfile: flow.bound,
            clearAuthentication: action.bound
        });
        this.api = new AuthApi();
    }

    *signInWithOTP(payload: SignInWithOTPPostRequest) {
        try {
            const res: ResponseData<SignInWithOTPPostResponse> = yield this.rootStore.apiStore.call(this.api, this.api.signInWithOTP, payload);
            if (res?.ok) {
                return res.data;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    *confirmSignInWithOTP(payload: ConfirmSignInWithOTPPostRequest) {
        try {
            const res: ResponseData<ConfirmSignInWithOTPPostResponse> = yield this.rootStore.apiStore.call(this.api, this.api.confirmSignInWithOTP, payload);
            if (res?.ok) {
                this.token = res.data.token;
                saveLocalStorage('token', res.data.token);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    *getProfile() {
        try {
            const res: ResponseData<Profile> = yield this.rootStore.apiStore.call(this.api, this.api.getProfile);
            if (res?.ok) {
                this.profile = res.data;
                return res.data;
            }
            return undefined;
        } catch (error) {
        }
    }

    *updateProfile(payload: ProfilePutRequest) {
        try {
            const res: ResponseData<ProfilePutResponse> = yield this.rootStore.apiStore.call(this.api, this.api.updateProfile, payload);
            return !!res?.ok;
        } catch (error) {
        }
    }

    signOut() {
        try {
            this.rootStore.apiStore.call(this.api, this.api.signOut);
            this.clearAuthentication();
            window.location.href = ROUTES.home.href;
        } catch (error) {
        }
    }

    clearAuthentication() {
        removeStorage(['token', 'profile']);
    }
}
