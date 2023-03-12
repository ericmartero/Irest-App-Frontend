const HOST_API = process.env.REACT_APP_HOST_API;

export const getTablesApi = async(token) => {
    try {
        const url = `${HOST_API}/api/tables`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const addTableApi = async(dtoAddTable, token) => {
    try {
        const url = `${HOST_API}/api/tables`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoAddTable)
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const updateTableApi = async(id, dtoUpdateTable, token) => {
    try {
        const url = `${HOST_API}/api/tables/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoUpdateTable)
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const deleteTableApi = async(id, token) => {
    try {
        const url = `${HOST_API}/api/tables/${id}`;
        const params = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const getTableApi = async(idOrNumberTable) => {
    try {
        const url = `${HOST_API}/api/tables/${idOrNumberTable}`;

        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}