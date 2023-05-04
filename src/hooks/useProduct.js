import { useState, useCallback } from "react";
import { getProductsApi, addProductApi, updateProductApi, deleteProductApi, getProductByIdApi } from '../api/product';
import { useAuth } from './';

export function useProduct() {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    const getProducts = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getProductsApi(auth.token);
            setLoading(false);

            if (response.error) {
                setError(response.error);
            } else {
                setProducts(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token]);

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

    const getProductById = useCallback(async (id) =>{
        try {
            setLoading(true);
            const product = await getProductByIdApi(id, auth.token);
            setLoading(false);
            return product;
        } catch (error) {
            setLoading(false);
            throw error;    
        }
    }, [auth?.token])

    return {
        products,
        loading,
        loadingCrud,
        error,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
    }
}