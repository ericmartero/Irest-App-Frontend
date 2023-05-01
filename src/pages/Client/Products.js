import React, { useState, useEffect } from 'react';
import { useCategory } from '../../hooks';
import { useParams } from 'react-router-dom';

export function Products() {

    const paramsURL = useParams();
    const { getCategoryById } = useCategory();
    const [productsCateogry, setProductsCateogry] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getCategoryById(paramsURL.idCategory);
            setProductsCateogry(response.products);
        })();
    }, [paramsURL.idCategory, getCategoryById]);

    return (
        <div>Products</div>
    )
}
