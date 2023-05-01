import React, { useState, useEffect } from 'react';
import { useCategory } from '../../hooks';
import { useParams, useHistory } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { map } from "lodash";
import '../../scss/AlignComponent.scss';

export function Products() {

    const paramsURL = useParams();
    const history = useHistory();
    const { loading, getCategoryById } = useCategory();
    const [productsCateogry, setProductsCateogry] = useState([]);
    const [categoryName, setCategoryName] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await getCategoryById(paramsURL.idCategory);
            setCategoryName(response.title);
            setProductsCateogry(response.products);
        })();
    }, [paramsURL.idCategory, getCategoryById]);

    const goBack = () => {
        history.push(`/client/${paramsURL.idTable}`);
    };

    return (
        <>
            {loading ?
                <div className="align-content-mobile">
                    <ProgressSpinner />
                </div>
                :
                <>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                            <h2>{categoryName}</h2>
                        </div>
                        <div>
                            {map(productsCateogry, (product) => (
                                <div key={product.id} style={{ backgroundColor: "white", marginBottom: "1rem", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: 'center',  width: "100%" }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img className="w-4 sm:w-8rem xl:w-8rem shadow-2 block xl:block border-round" src={product.image} alt={product.name} />
                                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "1rem" }}>
                                            <span className="font-bold text-900">{product.title}</span>
                                            <span>{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                                        </div>
                                    </div>
                                    <Button icon="pi pi-plus" className="layout-button p-button-secondary mr-1" style={{ flexShrink: 0 }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }
        </>
    )
}
