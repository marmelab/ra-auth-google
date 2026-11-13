## 4.0.0

- Publish modern ESM and CommonJS package exports ([#5](https://github.com/marmelab/ra-auth-google/pull/5))
- Target ES2020 instead of ES5 ([#5](https://github.com/marmelab/ra-auth-google/pull/5))

### Breaking Changes

`ra-auth-google` now publishes its ES modules and CommonJS builds in `dist/`, behind an [`exports`](https://nodejs.org/api/packages.html#package-entry-points) map. Only the package root can be imported, so these undocumented paths no longer resolve:

- the old build folders: `ra-auth-google/lib/*` and `ra-auth-google/esm/*`
- the sources: `ra-auth-google/src/*`, even though they are still published
- the manifest: `ra-auth-google/package.json`

The published code now targets ES2020 instead of ES5. If your app supports older browsers, transpile `ra-auth-google` with your bundler.

## 3.0.0

-   Simplify `ra-auth-google` usage
-   Remove `useGoogleAuthProvider` and the `GoogleAuthContext`
-   Make `googleAuthProvider` and `googleHttpClient` callable without any params
-   Simplify `googleAuthProvider` signature

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

+const authProvider = googleAuthProvider();
+const dataProvider = jsonServerProvider(
+   'http://localhost:3000',
+   googleHttpClient()
+);


const App = () => {
- const { authProvider, gsiParams, httpClient } = useGoogleAuthProvider();

- const dataProvider = jsonServerProvider(
-     'http://localhost:3000',
-     httpClient
- );

  const LoginPage = () => (
    <Login>
      <LoginButton />
    </Login>
  );

  return (
-   <GoogleAuthContextProvider value={gsiParams}>
      <Admin
        authProvider={authProvider}
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

-   Initial release
