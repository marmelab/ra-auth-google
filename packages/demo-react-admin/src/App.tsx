import {
    googleAuthProvider,
    googleHttpClient,
    LoginButton,
    OneTapButton,
} from 'ra-auth-google';
import jsonServerProvider from 'ra-data-json-server';
import React from 'react';
import { Admin, CustomRoutes, Login, Resource } from 'react-admin';
import { Route } from 'react-router-dom';
import Layout from './Layout';
import comments from './comments';
import CustomRouteLayout from './customRouteLayout';
import CustomRouteNoLayout from './customRouteNoLayout';
import i18nProvider from './i18nProvider';
import posts from './posts';
import tags from './tags';
import users from './users';

const authProvider = googleAuthProvider();
const httpClient = googleHttpClient();

const App = () => {
    const dataProvider = jsonServerProvider(
        'http://localhost:3000',
        httpClient
    );

    const LoginPage = () => (
        <Login>
            <LoginButton />
        </Login>
    );

    return (
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            title="Example Admin"
            layout={Layout}
            loginPage={LoginPage}
        >
            {permissions => (
                <>
                    <CustomRoutes noLayout>
                        <Route
                            path="/custom"
                            element={
                                <CustomRouteNoLayout title="Posts from /custom" />
                            }
                        />
                    </CustomRoutes>
                    <Resource name="posts" {...posts} />
                    <Resource name="comments" {...comments} />
                    <Resource name="tags" {...tags} />
                    {permissions ? (
                        <>
                            {permissions.includes('admin') ? (
                                <Resource name="users" {...users} />
                            ) : null}
                            <CustomRoutes noLayout>
                                <Route
                                    path="/custom1"
                                    element={
                                        <OneTapButton>
                                            <CustomRouteNoLayout title="Posts from /custom1" />
                                        </OneTapButton>
                                    }
                                />
                            </CustomRoutes>
                            <CustomRoutes>
                                <Route
                                    path="/custom2"
                                    element={
                                        <CustomRouteLayout title="Posts from /custom2">
                                            <OneTapButton />
                                        </CustomRouteLayout>
                                    }
                                />
                            </CustomRoutes>
                        </>
                    ) : null}
                    <CustomRoutes>
                        <Route
                            path="/custom3"
                            element={
                                <CustomRouteLayout title="Posts from /custom3">
                                    <OneTapButton />
                                </CustomRouteLayout>
                            }
                        />
                    </CustomRoutes>
                </>
            )}
        </Admin>
    );
};
export default App;
