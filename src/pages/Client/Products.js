import React, { useState, useEffect } from 'react';
import { useCategory } from '../../hooks';
import { useParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../scss/AlignComponent.scss';

export function Products() {

    const paramsURL = useParams();
    const { loading, getCategoryById } = useCategory();
    const [productsCateogry, setProductsCateogry] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getCategoryById(paramsURL.idCategory);
            setProductsCateogry(response.products);
        })();
    }, [paramsURL.idCategory, getCategoryById]);

    return (
        <>
            {loading ?
                <div className="align-content-mobile">
                    <ProgressSpinner />
                </div>
                :
                <div>Products</div>
            }
        </>
    )
}
