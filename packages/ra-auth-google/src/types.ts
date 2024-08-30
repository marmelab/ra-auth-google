// https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#IdConfiguration
export interface IdConfiguration {
    client_id: string;
    auto_select?: boolean;
    callback: (handleCredentialResponse: CredentialResponse) => void;
    login_uri?: string;
    native_callback?: (...args: unknown[]) => void;
    cancel_on_tap_outside?: boolean;
    prompt_parent_id?: string;
    nonce?: string;
    context?: 'signin' | 'signup' | 'use';
    state_cookie_domain?: string;
    ux_mode?: 'popup' | 'redirect';
    allowed_parent_origin?: string | string[];
    itp_support?: boolean;
    login_hint?: string;
    hd?: string;
    use_fedcm_for_prompt?: boolean;
}

// https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#GsiButtonConfiguration
export interface GsiButtonConfiguration {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string;
    locale?: string;
}

// https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#CredentialResponse
export interface CredentialResponse {
    credential?: string;
    select_by?:
        | 'auto'
        | 'user'
        | 'user_1tap'
        | 'user_2tap'
        | 'btn'
        | 'btn_confirm'
        | 'brn_add_session'
        | 'btn_confirm_add_session';
}

// https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#credential
export interface UserPayload {
    iss: string;
    nbf: number;
    aud: string;
    sub: string;
    hd: string;
    email: string;
    email_verified: boolean;
    azp: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
}

// https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#RevocationResponse
export interface RevocationResponse {
    successful?: boolean;
    error?: string;
}

export interface Google {
    accounts: {
        id: {
            initialize: (config: IdConfiguration) => void;
            renderButton: (
                parent: HTMLElement,
                options: GsiButtonConfiguration
            ) => void;
            revoke: (
                login_hint: string,
                callback?: (done: RevocationResponse) => void
            ) => void;
            prompt: () => void;
        };
    };
}

declare global {
    interface Window {
        google?: Google;
    }
}
