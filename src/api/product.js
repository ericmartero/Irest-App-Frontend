import { BASE_API } from '../utils/constants';

export const getProductsApi = async() => {
    try {
        const url = `${BASE_API}/api/products`;
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const addProductApi = async(dtoAddProduct, token) => {
    try {
        const url = `${BASE_API}/api/products`;
    } catch (error) {
        throw error;
    }
}

export const deleteProductApi = async(id, token) => {
    try {
        const url = `${BASE_API}/api/products/${id}`;
        const params = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const getProductByIdApi = async(id) => {
    try {
        const url = `${BASE_API}/api/products/${id}`;
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}