import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Header } from '../../../components/Client';

export function OrdersTracking() {

    const paramsURL = useParams();
    const history = useHistory();
    
    const goBack = () => {
        history.push(`/client/id_table=${paramsURL.idTable}`);
    };

    return (
        <div className="card">
            <Header name="Pedidos" isMain={false} goBack={goBack} paramsURL={paramsURL} />
        </div>
    )
}
