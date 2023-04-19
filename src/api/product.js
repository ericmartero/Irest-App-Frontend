import { updateImage } from "../helpers/updateImage";

const HOST_API = process.env.REACT_APP_HOST_API;

export const getProductsApi = async(token) => {
    try {
        const url = `${HOST_API}/api/products`;
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

export const addProductApi = async(dtoAddProduct, token) => {
    const { image, title, price, active, categoryId } = dtoAddProduct;

    try {
        // Cloudinary API
        const urlImage = await updateImage(image);

        // iRest API
        const url = `${HOST_API}/api/products`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                image: urlImage,
                price,
                active,
                categoryId,
            })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const updateProductApi = async(id, dtoUpdateProduct, token) => {
    const { image, ...product } = dtoUpdateProduct;

    try {
        let urlImage;
        let bodyProduct;

        // Cloudinary API
        if (image) {
            urlImage = await updateImage(image);
            bodyProduct = {
                ...product,
                image: urlImage
            }
        } else {
            bodyProduct = {
                ...product
            }
        }

        // iRest API
        const url = `${HOST_API}/api/products/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyProduct)
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const deleteProductApi = async(id, token) => {
    try {
        const url = `${HOST_API}/api/products/${id}`;
        const params = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        const resp = await fetch(url, params);

        if (resp.status === 409) {
            throw new Error("No se puede borrar el producto seleccionado debido a que este producto está siendo utilizado en los pedidos.");
        }  

        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const getProductByIdApi = async(id, token) => {
    try {
        const url = `${HOST_API}/api/products/${id}`;
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