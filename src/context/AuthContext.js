import React, { useState, useEffect, createContext, useRef } from 'react';
import { setToken, getToken, removeToken } from '../api/token';
import { useUser } from '../hooks';
import { useHistory } from "react-router-dom";
import { Toast } from 'primereact/toast';
import '../scss/ToastCenterError.scss';

export const AuthContext = createContext({
    auth: undefined,
    login: () => null,
    logout: () => null,
})

export function AuthProvider(props) {

    const history = useHistory();
    const { children } = props;
    const [auth, setAuth] = useState(undefined);
    const { getMe } = useUser();
    const toastError = useRef(null);

    const showError = (error) => {
      toastError.current.show({ severity: 'error', summary: 'Error al iniciar sessión', detail: error.message, life: 3000 });
    }

    useEffect(() => {
        (async () => {
            const token = getToken();
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

    const valueContext = {
        auth,
        login,
        logout,
    };

    if (auth === undefined) return null;

    return (
        <AuthContext.Provider value={valueContext}>
            <Toast ref={toastError} position="bottom-center" className="toast" />
            {children}
        </AuthContext.Provider>
    );
}