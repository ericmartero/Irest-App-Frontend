import { updateImage } from "../helpers/updateImage";

const HOST_API = process.env.REACT_APP_HOST_API;

export const getCategoriesApi = async(token) => {
    try {
        const url = `${HOST_API}/api/categories`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const addCategoryApi = async(dtoAddCategory, token) => {
    const { image, chefVisible, title } = dtoAddCategory;

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
                chefVisible,
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
    const { image, chefVisible, title } = dtoUpdateCategory;

    try {
        let urlImage;
        let bodyCategory;

        // Cloudinary API
        if (image) {
            urlImage = await updateImage(image);
            bodyCategory = {
                title,
                chefVisible,
                image: urlImage
            }
        } else {
            bodyCategory = {
                title,
                chefVisible,
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

        if (resp.status === 409) {
            throw new Error("No se puede borrar la categoría seleccionada debido a que tiene productos asignados.");
        }  
        
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const getCategoryByIdApi = async(id, token) => {
    try {
        const url = `${HOST_API}/api/categories/${id}`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}