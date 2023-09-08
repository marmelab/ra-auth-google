import { fetchUtils, Options } from "react-admin";

export const googleHttpClient = async (url: string, options: Options = {}) => {
  const token = localStorage.getItem("token");
  const user = {
    authenticated: !!token,
    token: `Bearer ${token}`,
  };
  return fetchUtils.fetchJson(url, { ...options, user });
};
