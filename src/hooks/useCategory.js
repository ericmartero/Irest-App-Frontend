import { useState } from "react";
import { getCategoriesApi } from '../api/category';

export function useCategory() {
    const [categories, setCategories] = useState(null);

    const getCategories = async () => {
        try {
            const response = await getCategoriesApi();
            setCategories(response);
        } catch (error) {
            throw error;
        }
    };

    return {
        categories,
        getCategories,
    }
}