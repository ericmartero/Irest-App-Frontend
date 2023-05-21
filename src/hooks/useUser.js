import { useCallback, useState } from 'react';
import { getMeApi } from '../api/auth';
import {
    getUsersApi,
    addUserApi,
    deleteUserApi,
    updateUserApi,
    getUsersAllApi,
    addUserAllApi,
    updateUserAllApi,
    deleteUserAllApi,
} from '../api/user';
import { useAuth } from '.';
import { useHistory } from "react-router-dom";

export function useUser() {

    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    const getMe = useCallback(async (token) => {
        try {
            return await getMeApi(token);

        } catch (error) {
            throw error;
        }
    }, []);

    const getUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getUsersApi(auth.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            if (response.error) {
                setError(response.error);
            } else {
                setUsers(response);
            }

        } catch (error) {
            setLoading(false);
            throw (error);
        }
    }, [auth?.token, history]);

    const addUser = async (data) => {
        try {
            setLoadingCrud(true);
            await addUserApi(data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const deleteUser = async (id) => {
        try {
            setLoadingCrud(true);
            await deleteUserApi(id, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw (error);
        }
    };

    const updateUser = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateUserApi(id, data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const getUsersAll = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getUsersAllApi(auth.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            if (response.error) {
                setError(response.error);
            } else {
                setUsers(response);
            }

        } catch (error) {
            setLoading(false);
            throw (error);
        }
    }, [auth?.token, history]);

    const addUserAll = async (data) => {
        try {
            setLoadingCrud(true);
            await addUserAllApi(data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const updateUserAll = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateUserAllApi(id, data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const deleteUserAll = async (id) => {
        try {
            setLoadingCrud(true);
            await deleteUserAllApi(id, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw (error);
        }
    };

    return {
        users,
        loading,
        loadingCrud,
        error,
        getMe,
        getUsers,
        addUser,
        deleteUser,
        updateUser,
        getUsersAll,
        addUserAll,
        updateUserAll,
        deleteUserAll
    };
}