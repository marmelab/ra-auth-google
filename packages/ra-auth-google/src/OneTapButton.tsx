import * as React from 'react';
import { useLogin, useAuthState, useAuthProvider } from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';

/**
 * The `<OneTapButton>` can be used either as a standalone component, or as a wrapper.
 *
 * The component itself doesn't render anything, but it triggers the Google API to display the One Tap prompt if the user is not yet signed in.
 *
 * Use it in the pages that you want to enable the One Tap feature on.
 *
 * @param children *Optional* - The children to render. If provided, the component will be used as a wrapper.
 *
 * @example
 * ```tsx
 * const Standalone = () => (
 *   <div>
 *     <OneTapButton />
 *     <h1>My Page</h1>
 *   </div>
 * );
 *
 * const Wrapper = () => (
 *   <OneTapButton>
 *     <div>
 *       <h1>My Page</h1>
 *     </div>
 *   </OneTapButton>
 * );
 * ```
 */
export const OneTapButton = ({ children }: OneTapButtonProps) => {
    const authProvider = useAuthProvider();
    const gsiParams = authProvider.gsiParams;
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
        // we need to react on the presence of window.google
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        window?.google,
        isLoading,
        authenticated,
        gsiParams,
        login,
        queryClient,
    ]);

    return children ? <>{children}</> : null;
};

export interface OneTapButtonProps {
    children?: React.ReactNode;
}
