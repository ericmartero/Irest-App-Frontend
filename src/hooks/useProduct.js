import { useState, useCallback } from "react";
import { getProductsApi, addProductApi, updateProductApi, deleteProductApi } from '../api/product';
import { useAuth } from './';

export function useProduct() {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    const getProducts = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getProductsApi();
            setLoading(false);
            setProducts(response);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, []);

    const addProduct = async (data) => {
        try {
            setLoading(true);
            await addProductApi(data, auth.token);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const updateProduct = async (id, data) => {
        try {
            setLoading(true);
            await updateProductApi(id, data, auth.token);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const deleteProduct = async (id) => {
        try {
            setLoading(true);
            await deleteProductApi(id, auth.token);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    return {
        products,
        loading,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
    }
}