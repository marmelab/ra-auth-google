import { fetchUtils, Options } from "react-admin";
import { localStorageTokenStore, TokenStore } from "./tokenStore";

export const googleHttpClient = ({
  tokenStore = localStorageTokenStore,
}: {
  tokenStore?: TokenStore;
}) => async (url: string, options: Options = {}) => {
  const token = tokenStore.getToken();
  const user = {
    authenticated: !!token,
    token: `Bearer ${token}`,
  };
  return fetchUtils.fetchJson(url, { ...options, user });
};
