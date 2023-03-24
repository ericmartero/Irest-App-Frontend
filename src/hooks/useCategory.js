import { useState, useCallback } from "react";
import { getCategoriesApi, addCategoryApi, updateCategoryApi, deleteCategoryApi } from '../api/category';
import { useAuth } from './';

export function useCategory() {

    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
            await addCategoryApi(data, auth.token);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const updateCategory = async (id, data) => {
        try {
            setLoading(true);
            await updateCategoryApi(id, data, auth.token);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const deleteCategory = async (id) => {
        try {
            setLoading(true);
            await deleteCategoryApi(id, auth.token);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    return {
        categories,
        loading,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
    }
}