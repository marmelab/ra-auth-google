import * as React from 'react';
import { useLogin, useAuthState } from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';
import { IdConfiguration } from './types';

/**
 * The `<GoogleOneTapButton>` can be used either as a standalone component, or as a wrapper.
 *
 * The component itself doesn't render anything, but it triggers the Google API to display the One Tap prompt if the user is not yet signed in.
 *
 * Use it in the pages that you want to enable the One Tap feature on.
 *
 * @param children *Optional* - The children to render. If provided, the component will be used as a wrapper.
 * @param rest **Required** - All the other parameters are passed to the Google Identity Services library. See the [documentation](https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#IdConfiguration) for the full list of supported parameters.
 *
 * @example
 * ```tsx
 * const MyPage = () => (
 *   <div>
 *     <GoogleOneTapButton
 *       client_id="my-application-client-id.apps.googleusercontent.com"
 *     />
 *     <h1>My Page</h1>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const Standalone = () => (
 *   <div>
 *     <GoogleOneTapButton />
 *     <h1>My Page</h1>
 *   </div>
 * );
 *
 * const Wrapper = () => (
 *   <GoogleOneTapButton>
 *     <div>
 *       <h1>My Page</h1>
 *     </div>
 *   </GoogleOneTapButton>
 * );
 * ```
 */
export const GoogleOneTapButton = (props: GoogleOneTapButtonProps) => {
    const { children, ...rest } = props;
    const { isLoading, authenticated } = useAuthState();
    const login = useLogin();
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (!window?.google || isLoading || authenticated) {
            return;
        }

        window.google.accounts.id.initialize({
            ...rest,
            callback: credentials => {
                login(credentials).then(() => {
                    queryClient.invalidateQueries({
                        queryKey: ['auth', 'getIdentity'],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['auth', 'getPermissions'],
                    });
                });
            },
        });

        window.google.accounts.id.prompt();
    }, [isLoading, authenticated, rest, login, queryClient]);

    return children ? <>{children}</> : null;
};

export interface GoogleOneTapButtonProps
    extends Omit<IdConfiguration, 'callback'> {
    children?: React.ReactNode;
}
