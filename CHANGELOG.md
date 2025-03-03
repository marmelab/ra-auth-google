## 3.0.0

- Simplify `ra-auth-google` usage
- Transform the `useGoogleAuthProvider` into a function
- Rename `useGoogleAuthProvider` into `initGoogleAuthProvider`

### Breaking Changes

```diff
// in src/App.tsx
import React from "react";
import { Admin, Resource, Login } from "react-admin";
import { 
- useGoogleAuthProvider,
+ initGoogleAuthProvider,
  LoginButton,
  OneTapButton,
  GoogleAuthContextProvider
} from "ra-auth-google";
import dataProvider from "./dataProvider";

const App = () => {
- const { authProvider, gsiParams } = useGoogleAuthProvider();
+ const { authProvider, gsiParams } = initGoogleAuthProvider();

  const LoginPage = () => (
    <Login>
      <LoginButton />
    </Login>
  );

  return (
   <GoogleAuthContextProvider value={gsiParams}>
      <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        title="Example Admin"
        loginPage={LoginPage}
      >
        // ...
      </Admin>
   </GoogleAuthContextProvider>
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
