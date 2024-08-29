import * as React from 'react';
import { useLogin, useAuthState } from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';
import { useGoogleAuthContext } from './GoogleAuthContext';

/**
 * The `<GoogleOneTapButton>` can be used either as a standalone component, or as a wrapper.
 *
 * The component itself doesn't render anything, but it triggers the Google API to display the One Tap prompt if the user is not yet signed in.
 *
 * Use it in the pages that you want to enable the One Tap feature on.
 *
 * `<GoogleOneTapButton>` requires to be used inside a `<GoogleAuthContextProvider>`.
 *
 * @param children *Optional* - The children to render. If provided, the component will be used as a wrapper.
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
export const GoogleOneTapButton = ({ children }: GoogleOneTapButtonProps) => {
    const gsiParams = useGoogleAuthContext();
    if (!gsiParams) {
        throw new Error(
            'GoogleOneTapButton must be used inside a GoogleAuthContextProvider'
        );
    }
    const { isLoading, authenticated } = useAuthState();
    const login = useLogin();
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (!window?.google || isLoading || authenticated) {
            return;
        }

        window.google.accounts.id.initialize({
            ...gsiParams,
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
    }, [isLoading, authenticated, gsiParams, login, queryClient]);

    return children ? <>{children}</> : null;
};

export interface GoogleOneTapButtonProps {
    children?: React.ReactNode;
}
