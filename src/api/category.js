import { updateImage } from "../helpers/updateImage";

const HOST_API = process.env.REACT_APP_HOST_API;

export const getCategoriesApi = async() => {
    try {
        const url = `${HOST_API}/api/categories`;
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const addCategoryApi = async(dtoAddCategory, token) => {
    const { image, title } = dtoAddCategory;

    try {
        // Cloudinary API
        const urlImage = await updateImage(image);

        // iRest API
        const url = `${HOST_API}/api/categories`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                image: urlImage
            })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const updateCategoryApi = async(id, dtoUpdateCategory, token) => {
    const { image, title } = dtoUpdateCategory;

    try {
        let urlImage;
        let bodyCategory;

        // Cloudinary API
        if (image) {
            urlImage = await updateImage(image);
            bodyCategory = {
                title,
                image: urlImage
            }
        } else {
            bodyCategory = {
                title,
            }
        }

        // iRest API
        const url = `${HOST_API}/api/categories/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyCategory)
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
        const url = `${HOST_API}/api/categories/${id}`;
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
        const url = `${HOST_API}/api/categories/${id}`;
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}