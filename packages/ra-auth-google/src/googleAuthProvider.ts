import { AuthProvider } from 'react-admin';
import jwt_decode from 'jwt-decode';
import { CredentialResponse, IdConfiguration, UserPayload } from './types';
import { TokenStore, localStorageTokenStore } from './tokenStore';

/**
 * Returns an authProvider that can be used with react-admin.
 *
 * @param client_id *Required* - The Google API client ID of your application.
 *   Tries to use the `GOOGLE_CLIENT_ID` environment variable if not provided.
 *   *Optional* if the `GOOGLE_CLIENT_ID` environment variable is set.
 * @param ux_mode *Optional* - The display mode ('popup' or 'redirect).
 *   Defaults to `popup`.
 * @param tokenStore *Optional* - The token store to use to store the token.
 *  Defaults to `localStorageTokenStore`.
 *
 * @example
 * ```ts
 * const authProvider = googleAuthProvider({
 *   client_id: "my-application-client-id.apps.googleusercontent.com",
 *   ux_mode: "popup",
 *   tokenStore: myTokenStore,
 * });
 * ```
 */
export const googleAuthProvider = ({
    client_id = process.env.GOOGLE_CLIENT_ID,
    ux_mode = 'popup',
    tokenStore = localStorageTokenStore,
    ...rest
}: GoogleAuthProviderParams = {}): AuthProvider => {
    if (!client_id) {
        throw new Error(
            'Missing Google Client ID. Pass it as prop or set the GOOGLE_CLIENT_ID env variable.'
        );
    }

    const gsiParams = { client_id, ux_mode, ...rest };

    return {
        async login(authResponse: CredentialResponse) {
            const token = authResponse?.credential;
            if (token) {
                tokenStore.setToken(token);
                const user: UserPayload = jwt_decode(token);
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        id: user.sub,
                        fullName: user.name,
                        avatar: user.picture,
                    })
                );
            }
            if (
                ['auto', 'user', 'user_1tap', 'user_2tap'].includes(
                    authResponse.select_by
                )
            ) {
                return { redirectTo: false };
            }
        },

        async logout() {
            const token = tokenStore.getToken();
            if (token) {
                const user: UserPayload = jwt_decode(token);
                tokenStore.removeToken();
                localStorage.removeItem('user');

                window?.google?.accounts.id.initialize({
                    ...gsiParams,
                    callback: () => {},
                });
                window?.google?.accounts.id.revoke(user.email);
            }
        },

        async checkError({ status }) {
            if (status === 401 || status === 403) {
                throw new Error('Unauthorized');
            }
        },

        async checkAuth() {
            if (!tokenStore.getToken()) {
                // Throwing { message: false } allows to tell react-admin the user is not authenticated
                // but without displaying an error message
                // eslint-disable-next-line no-throw-literal
                throw { message: false };
            }
        },

        async getPermissions() {
            // not supported
            return [];
        },

        async getIdentity() {
            return localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user'))
                : undefined;
        },

        gsiParams,
    };
};

export interface GoogleAuthProviderParams
    extends Omit<IdConfiguration, 'callback' | 'client_id'> {
    client_id?: string;
    tokenStore?: TokenStore;
}
