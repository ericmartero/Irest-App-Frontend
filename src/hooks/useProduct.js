import { useState, useCallback } from "react";
import { getProductsApi, addProductApi } from '../api/product';
import { useAuth } from './';

export function useProduct() {

    const [products, setProducts] = useState(null);
    const { auth } = useAuth();

    const getProducts = useCallback( async () => {
        try {
            const response = await getProductsApi();
            setProducts(response);
        } catch (error) {
            throw error;
        }
    }, []);

    const addProduct = async (data) => {
        try {
            await addProductApi(data, auth.token);
        } catch (error) {
            throw error;
        }
    }

    return {
        products,
        getProducts,
        addProduct,
    }
}