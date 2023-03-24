import { useState, useCallback } from "react";
import { getCategoriesApi, addCategoryApi, updateCategoryApi, deleteCategoryApi } from '../api/category';
import { useAuth } from './';

export function useCategory() {

    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const { auth } = useAuth();

    const getCategories = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getCategoriesApi();
            setLoading(false);
            setCategories(response);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, []);

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

    return {
        categories,
        loading,
        loadingCrud,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
    }
}