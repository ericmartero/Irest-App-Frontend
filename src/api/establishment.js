const HOST_API = process.env.REACT_APP_HOST_API;

export const getEstablishmentsApi = async(token) => {
    try {
        const url = `${HOST_API}/api/establishments`;
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

export const addEstablishmentApi = async(dtoAddEstablishment, token) => {
    try {
        const url = `${HOST_API}/api/establishments`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoAddEstablishment)
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}