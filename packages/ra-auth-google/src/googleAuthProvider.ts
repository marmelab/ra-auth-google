import { AuthProvider } from "react-admin";
import jwt_decode from "jwt-decode";
import { CredentialResponse, IdConfiguration, UserPayload } from "./types";

export const googleAuthProvider = ({
  gsiParams,
}: {
  gsiParams: Omit<IdConfiguration, "callback">;
}): AuthProvider => {
  const authProvider = {
    async login(authResponse: CredentialResponse) {
      const token = authResponse?.credential;
      if (token) {
        localStorage.setItem("token", token);
        const user: UserPayload = jwt_decode(token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.sub,
            fullName: user.name,
            avatar: user.picture,
          })
        );
      }
      if (
        ["auto", "user", "user_1tap", "user_2tap"].includes(
          authResponse.select_by
        )
      ) {
        return { redirectTo: false };
      }
    },

    async logout() {
      const token = localStorage.getItem("token");
      if (token) {
        const user: UserPayload = jwt_decode(token);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window?.google?.accounts.id.initialize({
          ...gsiParams,
          callback: () => {},
        });
        window?.google?.accounts.id.revoke(user.email);
      }
    },

    async checkError({ status }) {
      if (status === 401 || status === 403) {
        throw new Error("Unauthorized");
      }
    },

    async checkAuth() {
      if (!localStorage.getItem("token")) {
        throw { message: false };
      }
    },

    async getPermissions() {
      // not supported
      return [];
    },

    async getIdentity() {
      return localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : undefined;
    },
  };

  return authProvider;
};
