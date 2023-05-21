import { useState, useCallback } from "react";
import { getCategoriesApi, addCategoryApi, updateCategoryApi, deleteCategoryApi, getCategoryByIdApi } from '../api/category';
import { useAuth } from './';
import { useHistory } from "react-router-dom";

export function useCategory() {

    const history = useHistory();
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const [error, setError] = useState(null);
    const { auth, authClient } = useAuth();

    const getCategories = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getCategoriesApi(auth.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            if (response.error) {
                setError(response.error);
            } else {
                setCategories(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token, history]);

    const addCategory = async (data) => {
        try {
            setLoadingCrud(true);
            await addCategoryApi(data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const updateCategory = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateCategoryApi(id, data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const deleteCategory = async (id) => {
        try {
            setLoadingCrud(true);
            await deleteCategoryApi(id, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    }

    const getCategoriesClient = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getCategoriesApi(authClient.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            if (response.error) {
                setError(response.error);
            } else {
                setCategories(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [authClient?.token, history]);

    const getCategoryById = useCallback(async (id) =>{
        try {
            setLoading(true);
            const response = await getCategoryByIdApi(id, authClient.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }
            
            return response;
        } catch (error) {
            setLoading(false);
            throw error;    
        }
    }, [authClient?.token, history])

    return {
        categories,
        loading,
        loadingCrud,
        error,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoriesClient,
        getCategoryById,
    }
}