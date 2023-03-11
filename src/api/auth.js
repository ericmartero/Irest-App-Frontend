import { BASE_API } from "../utils/constants";

export const loginApi = async(dtoLogin) => {
    try {
        const url = `${BASE_API}/api/auth/login`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoLogin)
        }

        const resp = await fetch(url, params);

        if (resp.status !== 201) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const getMeApi = async(token) => {
    try {
        const url = `${BASE_API}/api/auth/me`;
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