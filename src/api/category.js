import { updateImage } from "../helpers/updateImage";
import { BASE_API } from "../utils/constants";

export const getCategoriesApi = async() => {
    try {
        const url = `${BASE_API}/api/categories`;
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const addCategoryApi = async(dtoAddCategory, token) => {
    const { image, ...category } = dtoAddCategory;

    try {
        // Cloudinary API
        const urlImage = await updateImage(image);

        // iRest API
        const url = `${BASE_API}/api/categories`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: {
                ...category,
                urlImage
            }
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const updateCategoryApi = async(id, dtoUpdateCategory, token) => {
    const { image, ...category } = dtoUpdateCategory;

    try {
        let urlImage;
        let bodyCategory;

        if (image) {
            urlImage = await updateImage(image);
            bodyCategory = {
                ...category,
                urlImage
            }
        } else {
            bodyCategory = {
                ...category
            }
        }

        // iRest API
        const url = `${BASE_API}/api/categories/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: bodyCategory
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const deleteCategoryApi = async(id, token) => {
    try {
        const url = `${BASE_API}/api/categories/${id}`;
        const params = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const getCategoryByIdApi = async(id) => {
    try {
        const url = `${BASE_API}/api/categories/${id}`;
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}