import * as React from 'react';
import { googleAuthProvider } from './googleAuthProvider';
import { googleHttpClient } from './googleHttpClient';
import { IdConfiguration } from './types';
import { TokenStore, localStorageTokenStore } from './tokenStore';

/**
 * Use `useGoogleAuthProvider` to create an authProvider, an `httpClient`,
 * and obtain a `gsiParams` object from a single configuration object.
 *
 * `gsiParams` are to be exposed to the children components by using the
 * `GoogleAuthContextProvider`.
 *
 * @param client_id *Optional* - The Google API client ID of your application.
 *   Tries to use the `GOOGLE_CLIENT_ID` environment variable if not provided.
 * @param tokenStore *Optional* - The token store to use to store the token.
 *   Defaults to `localStorageTokenStore`.
 * @param rest *Optional* - All the other parameters are passed to the
 *   Google Identity Services library. See the
 *   [documentation](https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#IdConfiguration)
 *   for the full list of supported parameters.
 *
 * @example
 * ```ts
 * const { authProvider, httpClient, gsiParams } = useGoogleAuthProvider();
 * ```
 *
 * @example
 * ```ts
 * const { authProvider, httpClient, gsiParams } = useGoogleAuthProvider({
 *   client_id: "my-application-client-id.apps.googleusercontent.com",
 *   context: "use",
 *   tokenStore: myTokenStore,
 * });
 * ```
 */
export const useGoogleAuthProvider = (params?: UseGoogleAuthProviderParams) => {
    const {
        tokenStore = localStorageTokenStore,
        ux_mode = 'popup',
        client_id = process.env.GOOGLE_CLIENT_ID,
        ...rest
    } = params || {};

    React.useEffect(() => {
        if (!client_id) {
            throw new Error(
                'Missing Google Client ID. Pass it as prop or set the GOOGLE_CLIENT_ID env variable.'
            );
        }
    }, [client_id]);

    const authProvider = googleAuthProvider({
        gsiParams: { ux_mode, client_id, ...rest },
        tokenStore,
    });

    const httpClient = googleHttpClient({ tokenStore });

    return {
        authProvider,
        gsiParams: { ux_mode, client_id, ...rest },
        httpClient,
    };
};

export interface UseGoogleAuthProviderParams
    extends Omit<IdConfiguration, 'callback' | 'client_id'> {
    client_id?: string;
    tokenStore?: TokenStore;
}
