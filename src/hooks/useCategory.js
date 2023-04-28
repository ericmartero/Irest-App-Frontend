import { useState, useCallback } from "react";
import { getCategoriesApi, addCategoryApi, updateCategoryApi, deleteCategoryApi } from '../api/category';
import { useAuth } from './';

export function useCategory() {

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

            if (response.error) {
                setError(response.error);
            } else {
                setCategories(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token]);

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
            const response = await getCategoriesApi(authClient.clientToken);
            setLoading(false);

            if (response.error) {
                setError(response.error);
            } else {
                setCategories(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [authClient?.clientToken]);

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
    }
}