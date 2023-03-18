import React, { useState, useEffect, createContext } from 'react';
import { setToken, getToken, removeToken } from '../api/token';
import { useUser } from '../hooks';
import { useHistory } from "react-router-dom";

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

    useEffect(() => {
        (async () => {
            const token = getToken();
            if (token) {
                const me = await getMe(token);

                if (me.statusCode === 401) {
                    setAuth(null);
                    return;
                }

                setAuth({token, me});
            }

            else {
                setAuth(null);
            }
        })()
    }, [getMe])

    const login = async (token) => {
        setToken(token);
        const me = await getMe(token);
        setAuth({ token, me });
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
            { children }
        </AuthContext.Provider>
    );
}