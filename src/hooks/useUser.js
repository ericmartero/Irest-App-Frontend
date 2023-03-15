import { useState } from 'react';
import { getMeApi } from '../api/auth';
import { getUsersApi, addUserApi, deleteUserApi, updateUserApi } from '../api/user';
import { useAuth } from '.';

export function useUser() {

    const [error, setError] = useState(null);
    const [users, setUsers] = useState(null);
    const { auth } = useAuth();

    const getMe = async (token) => {
        try {
            const response = await getMeApi(token);
            return response;

        } catch (error) {
            throw error;
        }
    };

    const getUsers = async () => {
        try {
            const response = await getUsersApi(auth.token);
            setUsers(response);
        } catch (error) {
            setError(error);
        }
    };

    const addUser = async (data) => {
        try {
            await addUserApi(data, auth.token);
        } catch (error) {
            setError(error);
        }
    }

    const deleteUser = async (id) => {
        try {
            await deleteUserApi(id, auth.token);
        } catch (error) {
            setError(error); 
        }
    }

    const updateUser = async (id, data) => {
        try {
            await updateUserApi(id, data, auth.token);
        } catch (error) {
            setError(error); 
        }
    }

    return {
        error,
        users,
        getMe,
        getUsers,
        addUser,
        deleteUser,
        updateUser,
    };
}