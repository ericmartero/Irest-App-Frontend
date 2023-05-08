const HOST_API = process.env.REACT_APP_HOST_API;

export const getUsersApi = async(token) => {
    try {
        const url = `${HOST_API}/api/users`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);

        if (resp.status === 403) {
            return { error: 'No tienes permiso para acceder a esta página' };
        }
        
        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const addUserApi = async(dtoAddUser, token) => {
    try {
        const url = `${HOST_API}/api/users`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoAddUser)
        }

        const resp = await fetch(url, params);

        if (resp.status === 400) {
            throw new Error('No se ha podido añadir el usuario. El correo del usuario a añadir ya existe');
        }

        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const updateUserApi = async(id, dtoUpdateUser, token) => {
    try {
        const url = `${HOST_API}/api/users/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoUpdateUser)
        }

        const resp = await fetch(url, params);

        if (resp.status === 400) {
            throw new Error('No se ha podido actualizar el usuario. El correo del usuario a actualizar ya existe');
        }

        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const deleteUserApi = async(id, token) => {
    try {
        const url = `${HOST_API}/api/users/${id}`;
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

export const getUsersAllApi = async(token) => {
    try {
        const url = `${HOST_API}/api/users/all`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);

        if (resp.status === 403) {
            return { error: 'No tienes permiso para acceder a esta página' };
        }
        
        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const addUserAllApi = async(dtoAddUser, token) => {
    try {
        const url = `${HOST_API}/api/users/all`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoAddUser)
        }

        const resp = await fetch(url, params);

        if (resp.status === 400) {
            throw new Error('No se ha podido añadir el usuario. El correo del usuario a añadir ya existe');
        }

        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const updateUserAllApi = async(id, dtoUpdateUser, token) => {
    try {
        const url = `${HOST_API}/api/users/all/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoUpdateUser)
        }

        const resp = await fetch(url, params);

        if (resp.status === 400) {
            throw new Error('No se ha podido actualizar el usuario. El correo del usuario a actualizar ya existe');
        }

        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const deleteUserAllApi = async(id, token) => {
    try {
        const url = `${HOST_API}/api/users/all/${id}`;
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