import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useOrder, useTable } from '../../../hooks';
import { Header } from '../../../components/Client';

export function OrdersTracking() {

    const paramsURL = useParams();
    const history = useHistory();
    const { tables, getTableClient } = useTable();
    const { loading, orders, getOrdersByTableClient } = useOrder();

    const [table, setTable] = useState(null);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

    useEffect(() => {
        if (tables) {
            setTable(tables);
        }
    }, [tables])

    useEffect(() => {
        (async () => {
            getOrdersByTableClient(table.tableBooking.id);
        })();
    }, [table, getOrdersByTableClient]);

    console.log(orders);
    
    const goBack = () => {
        history.push(`/client/id_table=${paramsURL.idTable}`);
    };

    return (
        <div className="card">
            <Header name="Pedidos" isMain={false} goBack={goBack} paramsURL={paramsURL} />
        </div>
    )
}
