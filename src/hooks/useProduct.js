import { useState } from "react";
import { getProductsApi } from '../api/product';

export function useProduct() {

    const [products, setProducts] = useState(null);

    const getProducts = async () => {
        try {
            const response = await getProductsApi();
            setProducts(response);
        } catch (error) {
            throw error;
        }
    }

    return {
        products,
        getProducts,
    }
}