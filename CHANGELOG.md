## 3.0.0

- Simplify `ra-auth-google` usage
- Remove `useGoogleAuthProvider` and the `GoogleAuthContext`
- Make `googleAuthProvider` and `googleHttpClient` callable without any params
- Simplify `googleAuthProvider` signature

### Breaking Changes

```diff
const autProvider = googleAuthProvider({
-   {
-     client_id: "my-application-client-id.apps.googleusercontent.com",
-     ux_mode: "popup",
-   },
+   client_id: "my-application-client-id.apps.googleusercontent.com",
+   ux_mode: "popup",
    tokenStore: myTokenStore,
  });
```

```diff
// in src/App.tsx
import React from "react";
import { Admin, Resource, Login } from "react-admin";
import { 
- useGoogleAuthProvider,
+ googleAuthProvider,
+ googleHttpClient,
  LoginButton,
  OneTapButton,
-  GoogleAuthContextProvider
} from "ra-auth-google";
import dataProvider from "./dataProvider";

const App = () => {
- const { authProvider, gsiParams, httpClient } = useGoogleAuthProvider();

  const dataProvider = jsonServerProvider(
      'http://localhost:3000',
-     httpClient
+     googleHttpClient()
  );

  const LoginPage = () => (
    <Login>
      <LoginButton />
    </Login>
  );

  return (
-   <GoogleAuthContextProvider value={gsiParams}>
      <Admin
-       authProvider={authProvider}
+       authProvider={googleAuthProvider()}
        dataProvider={dataProvider}
        title="Example Admin"
        loginPage={LoginPage}
      >
        // ...
      </Admin>
-   </GoogleAuthContextProvider>
  );
};
export default App;
```

## 2.0.0

-   Upgrade `react-admin` to v5
-   Remove prop-types

### Breaking Changes

The `initGoogleAuthProvider` helper has been replaced by a hook -- `useGoogleAuthProvider` -- and a React Context Provider -- `<GoogleAuthContextProvider>`.

Here is how to use them in replacement of the `initGoogleAuthProvider` helper:

```diff
// in src/App.tsx
import React from "react";
import { Admin, Resource, Login, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
-import { initGoogleAuthProvider } from "ra-auth-google";
+import { useGoogleAuthProvider, LoginButton, OneTapButton, GoogleAuthContextProvider } from "ra-auth-google";
import dataProvider from "./dataProvider";
import posts from "./posts";

const App = () => {
- const { authProvider, LoginButton, OneTapButton } = initGoogleAuthProvider();
+ const { authProvider, gsiParams } = useGoogleAuthProvider();

  const LoginPage = () => (
    <Login>
      <LoginButton />
    </Login>
  );

  return (
+   <GoogleAuthContextProvider value={gsiParams}>
      <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        title="Example Admin"
        loginPage={LoginPage}
      >
        <Resource name="posts" {...posts} />
        <CustomRoutes>
          <Route
            path="/custom"
            element={
              <div>
                <OneTapButton />
                <h1>My Page</h1>
              </div>
            }
          />
        </CustomRoutes>
      </Admin>
+   </GoogleAuthContextProvider>
  );
};
export default App;
```

**Tip:** The `useGoogleAuthProvider` hook accepts the same parameters as the `initGoogleAuthProvider` helper.

The (internal) `<GoogleLoginButton>` component was renamed to `<LoginButton>`.
The (internal) `<GoogleOneTapButton>` component was renamed to `<OneTapButton>`.

Both components now expect to be rendered inside a `<GoogleAuthContextProvider>`.

## 1.0.0

* Initial release
