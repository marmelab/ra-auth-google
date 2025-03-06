import { Box, SxProps, styled } from '@mui/material';
import * as React from 'react';
import { useLogin, useAuthProvider } from 'react-admin';
import { GsiButtonConfiguration } from './types';

const GoogleButton = (props: Omit<LoginButtonProps, 'sx'>) => {
    const authProvider = useAuthProvider();
    const gsiParams = authProvider.gsiParams;
    const login = useLogin();
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!window?.google || !divRef.current) {
            return;
        }

        window.google.accounts.id.initialize({
            ...gsiParams,
            callback: login,
        });

        window.google.accounts.id.renderButton(divRef.current, {
            width: '300px',
            ...props,
        });
        // we need to react on the presence of window.google
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window?.google, gsiParams, login, props]);

    return <div ref={divRef} id="ra-google-login-button" />;
};

/**
 * Returns a component that can be used to render the
 * [Sign in with Google button](https://developers.google.com/identity/gsi/web/guides/offerings?hl=en#sign_in_with_google_button).
 *
 * @param sx *Optional* - Allows to customize the MUI `<Box>` inside which the button is rendered.
 *   See [MUI `sx` prop](https://mui.com/system/basics/#the-sx-prop) for more information.
 * @param rest *Optional* - All the other parameters are passed to the Sign in with Google button,
 *   and allow for customization. See the
 *   [documentation](https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en#GsiButtonConfiguration)
 *   for the full list of supported parameters.
 *
 * @example
 * ```tsx
 * const MyLoginButton = () => (
 *   <LoginButton
 *     theme="filled_black"
 *   />
 * );
 * ```
 */
export const LoginButton = (props: LoginButtonProps) => {
    const { sx, ...rest } = props;

    return (
        <StyledBox sx={sx}>
            <GoogleButton {...rest} />
        </StyledBox>
    );
};

const PREFIX = 'RaGoogleLoginButton';

const StyledBox = styled(Box, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    marginTop: theme.spacing(4),
}));

export interface LoginButtonProps extends GsiButtonConfiguration {
    sx?: SxProps;
}
