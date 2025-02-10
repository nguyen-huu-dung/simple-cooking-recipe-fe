// #region Sign In
export interface SignInWithOTPPostRequest {
    email: string
}

export interface SignInWithOTPPostResponse {
    uuid: string
}

export interface ConfirmSignInWithOTPPostRequest {
    uuid: string,
    confirmOTP: string
}

export interface ConfirmSignInWithOTPPostResponse {
    token: string
}

// #endregion

// #region profile update
export interface ProfilePutRequest {
    fullName: string,
    gender: number | null,
    birthday: string
}

export interface ProfilePutResponse {
}
// #endregion
