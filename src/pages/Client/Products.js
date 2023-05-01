import React, { useState, useEffect } from 'react';
import { useCategory } from '../../hooks';
import { useParams, useHistory } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
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

    const itemTemplate = (product) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={product.image} alt={product.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.title}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                        <DataView value={productsCateogry} itemTemplate={itemTemplate} emptyMessage='No se han encontrado productos' />
                    </div>
                </>
            }
        </>
    )
}
