import { useState, useCallback } from "react";
import { getCategoriesApi, addCategoryApi, updateCategoryApi, deleteCategoryApi } from '../api/category';
import { useAuth } from './';

export function useCategory() {

    const [categories, setCategories] = useState(null);
    const { auth } = useAuth();

    const getCategories = useCallback( async () => {
        try {
            const response = await getCategoriesApi();
            setCategories(response);
        } catch (error) {
            throw error;
        }
    }, []);

    const addCategory = async (data) => {
        try {
            await addCategoryApi(data, auth.token);
        } catch (error) {
            throw error;
        }
    }

    const updateCategory = async (id, data) => {
        try {
            await updateCategoryApi(id, data, auth.token);
        } catch (error) {
            throw error;
        }
    }

    const deleteCategory = async (id) => {
        try {
            await deleteCategoryApi(id, auth.token);
        } catch (error) {
            throw error;
        }
    }

    return {
        categories,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
    }
}