import { useCallback, useState } from 'react';
import { getMeApi } from '../api/auth';
import { getUsersApi, addUserApi, deleteUserApi, updateUserApi } from '../api/user';
import { useAuth } from '.';

export function useUser() {

    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const { auth } = useAuth();

    const getMe = async (token) => {
        try {
            const response = await getMeApi(token);
            return response;

        } catch (error) {
            throw error;
        }
    };

    const getUsers = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getUsersApi(auth.token);
            setLoading(false);
            setUsers(response);
        } catch (error) {
            setLoading(false);
            throw(error);
        }
    }, [auth?.token]);

    const addUser = async (data) => {
        try {
            setLoadingCrud(true);
            await addUserApi(data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const deleteUser = async (id) => {
        try {
            setLoadingCrud(true);
            await deleteUserApi(id, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw(error);
        }
    }

    const updateUser = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateUserApi(id, data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    return {
        users,
        loading,
        loadingCrud,
        getMe,
        getUsers,
        addUser,
        deleteUser,
        updateUser,
    };
}