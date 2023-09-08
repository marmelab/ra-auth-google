import * as React from "react";
import { useLogin, useAuthState } from "react-admin";
import { useQueryClient } from "react-query";
import { IdConfiguration } from "./types";

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
      callback: (credentials) => {
        login(credentials).then(() => {
          queryClient.invalidateQueries(["auth", "getIdentity"]);
          queryClient.invalidateQueries(["auth", "getPermissions"]);
        });
      },
    });

    window.google.accounts.id.prompt();
  }, [window?.google, isLoading, authenticated]);

  return children ? <>{children}</> : null;
};

export interface GoogleOneTapButtonProps
  extends Omit<IdConfiguration, "callback"> {
  children?: React.ReactNode;
}
