export interface TokenStore {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
}

export const localStorageTokenStore: TokenStore = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};
