import ApiService from './ApiService';

export default class AuthApi extends ApiService {
    signInWithOTP(payload) {
        return this.post('sign-in-with-otp', payload);
    }

    confirmSignInWithOTP(payload) {
        return this.post('sign-in-with-otp/confirm', payload);
    }

    signOut() {
        return this.post('sign-out');
    }

    getProfile() {
        return this.get('profile');
    }

    updateProfile(payload) {
        return this.put('profile', payload);
    }
}
