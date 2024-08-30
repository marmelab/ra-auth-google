import { AuthProvider } from 'react-admin';
import jwt_decode from 'jwt-decode';
import { CredentialResponse, IdConfiguration, UserPayload } from './types';
import { TokenStore, localStorageTokenStore } from './tokenStore';

/**
 * Returns an authProvider that can be used with react-admin.
 *
 * @param gsiParams **Required** - Parameters for the Google Identity Services library. See the [documentation](https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#IdConfiguration) for the full list of supported parameters.
 * @param tokenStore *Optional* - The token store to use to store the token. Defaults to `localStorageTokenStore`.
 *
 * @example
 * ```ts
 * const authProvider = googleAuthProvider({
 *   gsiParams: {
 *     client_id: "my-application-client-id.apps.googleusercontent.com",
 *     ux_mode: "popup",
 *   },
 *   tokenStore: myTokenStore,
 * });
 * ```
 */
export const googleAuthProvider = ({
    gsiParams,
    tokenStore = localStorageTokenStore,
}: {
    gsiParams: Omit<IdConfiguration, 'callback'>;
    tokenStore?: TokenStore;
}): AuthProvider => {
    const authProvider = {
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
    };

    return authProvider;
};
