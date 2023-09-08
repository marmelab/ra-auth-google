import { Box, SxProps, styled } from "@mui/material";
import * as React from "react";
import { useLogin } from "react-admin";
import { GsiButtonConfiguration, IdConfiguration } from "./types";

const GoogleButton = (props: Omit<GoogleLoginButtonProps, "sx">) => {
  const { gsiParams, ...buttonProps } = props;
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
      width: "300px",
      ...buttonProps,
    });
  }, [window?.google, divRef.current]);

  return <div ref={divRef} id="ra-google-login-button" />;
};

export const GoogleLoginButton = (props: GoogleLoginButtonProps) => {
  const { sx, ...rest } = props;

  return (
    <StyledBox sx={sx}>
      <GoogleButton {...rest} />
    </StyledBox>
  );
};

const PREFIX = "RaGoogleLoginButton";

const StyledBox = styled(Box, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export interface GoogleLoginButtonProps extends GsiButtonConfiguration {
  gsiParams: Omit<IdConfiguration, "callback">;
  sx?: SxProps;
}
