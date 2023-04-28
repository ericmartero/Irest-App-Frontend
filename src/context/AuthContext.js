import React, { useState, useEffect, createContext, useRef } from 'react';
import { setToken, getToken, removeToken, setClientToken, getClientToken, removeClientToken } from '../api/token';
import { useUser } from '../hooks';
import { useHistory } from "react-router-dom";
import { Toast } from 'primereact/toast';
import '../scss/ToastCenterError.scss';

export const AuthContext = createContext({
    auth: undefined,
    login: () => null,
    logout: () => null,
    authClient: undefined,
    join: () => null,
    reserve: () => null,
    logoutClient: () => null,
})

export function AuthProvider(props) {

    const history = useHistory();
    const { children } = props;
    const [auth, setAuth] = useState(undefined);
    const [authClient, setAuthClient] = useState(undefined);
    const { getMe } = useUser();
    const toastError = useRef(null);

    const showError = (error) => {
        toastError.current.show({ severity: 'error', summary: 'Error al iniciar sessión', detail: error.message, life: 3000 });
    }

    useEffect(() => {
        (async () => {

            const token = getToken();
            const tokenClient = getClientToken();

            if (token) {
                const me = await getMe(token);

                if (me.statusCode === 401) {
                    setAuth(null);
                    return;
                }

                setAuth({ token, me });
            }

            else {
                setAuth(null);
            }

            if (tokenClient) {
                const me = await getMe(tokenClient);

                if (me.statusCode === 401) {
                    setAuthClient(null);
                    return;
                }

                setAuthClient({ token: tokenClient, me });
            }

            else {
                setAuthClient(null);
            }
        })()
    }, [getMe])

    const login = async (token) => {
        try {
            const me = await getMe(token);
            setToken(token);
            setAuth({ token, me });
        } catch (error) {
            showError(error);
        }
    };


    const logout = () => {
        if (auth) {
            removeToken();
            setAuth(null);
            history.push("/admin");
        }
    };

    const join = async (token) => {
        try {
            const me = await getMe(token);
            setClientToken(token);
            setAuthClient({ token, me });
        } catch (error) {
            showError(error);
        }
    };

    const reserve = async (token) => {
        try {
            const me = await getMe(token);
            setClientToken(token);
            setAuthClient({ token, me });
        } catch (error) {
            showError(error);
        }
    };

    const logoutClient = () => {
        if (authClient) {
            removeClientToken();
            setAuthClient(null);
            history.push("/");
        }
    };

    const valueContext = {
        auth,
        login,
        logout,
        authClient,
        join,
        reserve,
        logoutClient,
    };

    if (auth === undefined) return null;

    return (
        <AuthContext.Provider value={valueContext}>
            <Toast ref={toastError} position="bottom-center" className="toast" />
            {children}
        </AuthContext.Provider>
    );
}