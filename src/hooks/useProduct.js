import { useState, useCallback } from "react";
import { getProductsApi, addProductApi, updateProductApi, deleteProductApi, getProductByIdApi } from '../api/product';
import { useAuth } from './';
import { useHistory } from "react-router-dom";

export function useProduct() {

    const history = useHistory();
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const [error, setError] = useState(null);
    const { auth, authClient } = useAuth();

    const getProducts = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getProductsApi(auth.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            if (response.error) {
                setError(response.error);
            } else {
                setProducts(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token, history]);

    const addProduct = async (data) => {
        try {
            setLoadingCrud(true);
            const response = await addProductApi(data, auth.token);
            setLoadingCrud(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const updateProduct = async (id, data) => {
        try {
            setLoadingCrud(true);
            const response = await updateProductApi(id, data, auth.token);
            setLoadingCrud(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const deleteProduct = async (id) => {
        try {
            setLoadingCrud(true);
            const response = await deleteProductApi(id, auth.token);
            setLoadingCrud(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const getProductById = useCallback(async (id) =>{
        try {
            const response = await getProductByIdApi(id, auth.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
        } catch (error) {
            throw error;    
        }
    }, [auth?.token, history])

    const getClientProductById = useCallback(async (id) =>{
        try {
            const response = await getProductByIdApi(id, authClient.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
        } catch (error) {
            throw error;    
        }
    }, [authClient?.token, history])

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
        getClientProductById,
    }
}