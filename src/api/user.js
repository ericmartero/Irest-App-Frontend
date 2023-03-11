import { BASE_API } from "../utils/constants";

export const getUsersApi = async(token) => {
    try {
        const url = `${BASE_API}/api/users`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);
        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const addUserApi = async(dtoAddUser, token) => {
    try {
        const url = `${BASE_API}/api/users`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoAddUser)
        }

        const resp = await fetch(url, params);
        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const updateUserApi = async(id, dtoUpdateUser, token) => {
    try {
        const url = `${BASE_API}/api/users/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoUpdateUser)
        }

        const resp = await fetch(url, params);
        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const deleteUserApi = async(id, token) => {
    try {
        const url = `${BASE_API}/api/users/${id}`;
        const params = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);
        return await resp.json();

    } catch (error) {
        throw error;
    }
}