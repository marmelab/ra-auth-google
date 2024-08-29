import * as React from 'react';
import { createContext, ReactNode, useContext } from 'react';
import { IdConfiguration } from './types';

export type GoogleAuthContextValue = Omit<IdConfiguration, 'callback'>;

export const GoogleAuthContext = createContext<
    GoogleAuthContextValue | undefined
>(undefined);

export const GoogleAuthContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value?: GoogleAuthContextValue;
}) => (
    <GoogleAuthContext.Provider value={value}>
        {children}
    </GoogleAuthContext.Provider>
);

export const useGoogleAuthContext = () => {
    return useContext<GoogleAuthContextValue | undefined>(GoogleAuthContext);
};
