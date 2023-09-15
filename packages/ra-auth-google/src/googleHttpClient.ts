import { fetchUtils, Options } from "react-admin";
import { localStorageTokenStore, TokenStore } from "./tokenStore";

/**
 * Returns an `httpClient` that can be used to make authenticated requests to your API.
 * @param tokenStore *Optional* - The token store to use to store the token. Defaults to `localStorageTokenStore`.
 * 
 * @example
 * ```ts
 * const httpClient = googleHttpClient({ tokenStore: myTokenStore });
 * ```
 */
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
