import * as React from 'react';
import { GoogleLoginButton, GoogleLoginButtonProps } from './GoogleLoginButton';
import {
    GoogleOneTapButton,
    GoogleOneTapButtonProps,
} from './GoogleOneTapButton';
import { googleAuthProvider } from './googleAuthProvider';
import { googleHttpClient } from './googleHttpClient';
import { IdConfiguration } from './types';
import { TokenStore, localStorageTokenStore } from './tokenStore';

/**
 * Use `initGoogleAuthProvider` to create an authProvider, a login button, a One Tap button and an `httpClient` from a single configuration object.
 *
 * @param client_id *Optional* - The Google API client ID of your application. Tries to use the `GOOGLE_CLIENT_ID` environment variable if not provided.
 * @param tokenStore *Optional* - The token store to use to store the token. Defaults to `localStorageTokenStore`.
 * @param rest *Optional* - All the other parameters are passed to the Google Identity Services library. See the [documentation](https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#IdConfiguration) for the full list of supported parameters.
 *
 * @example
 * ```ts
 * const { authProvider, LoginButton, OneTapButton, httpClient } = initGoogleAuthProvider();
 * ```
 *
 * @example
 * ```ts
 * const { authProvider, LoginButton, OneTapButton, httpClient } = initGoogleAuthProvider({
 *   client_id: "my-application-client-id.apps.googleusercontent.com",
 *   context: "use",
 *   tokenStore: myTokenStore,
 * });
 * ```
 */
export const initGoogleAuthProvider = (
    params?: InitGoogleAuthProviderParams
) => {
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

    const LoginButton = (
        props: Partial<Omit<GoogleLoginButtonProps, 'gsiParams'>>
    ) => (
        <GoogleLoginButton
            gsiParams={{ ux_mode, client_id, ...rest }}
            {...props}
        />
    );

    const OneTapButton = (props: Partial<GoogleOneTapButtonProps>) => (
        <GoogleOneTapButton
            ux_mode={ux_mode}
            client_id={client_id}
            {...rest}
            {...props}
        />
    );

    const authProvider = googleAuthProvider({
        gsiParams: { ux_mode, client_id, ...rest },
        tokenStore,
    });

    const httpClient = googleHttpClient({ tokenStore });

    return {
        authProvider,
        LoginButton,
        OneTapButton,
        httpClient,
    };
};

export interface InitGoogleAuthProviderParams
    extends Omit<IdConfiguration, 'callback' | 'client_id'> {
    client_id?: string;
    tokenStore?: TokenStore;
}
