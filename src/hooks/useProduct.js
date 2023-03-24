import { useState, useCallback } from "react";
import { getProductsApi, addProductApi, updateProductApi, deleteProductApi } from '../api/product';
import { useAuth } from './';

export function useProduct() {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
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
            setLoadingCrud(true);
            await addProductApi(data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const updateProduct = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateProductApi(id, data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const deleteProduct = async (id) => {
        try {
            setLoadingCrud(true);
            await deleteProductApi(id, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    return {
        products,
        loading,
        loadingCrud,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
    }
}