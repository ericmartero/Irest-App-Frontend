import React, { useState, useEffect } from 'react';
import { ORDER_STATUS } from '../../../utils/constants';
import { useParams, useHistory } from 'react-router-dom';
import { useOrder, useTable } from '../../../hooks';
import { Header } from '../../../components/Client';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { map } from "lodash";
import '../../../scss/AlignComponent.scss';

export function OrdersTracking() {

    const paramsURL = useParams();
    const history = useHistory();
    const { tables, getTableClient } = useTable();
    const { loading, orders, getOrdersByTableClient } = useOrder();

    const [table, setTable] = useState(null);
    const [ordersTable, setOrdersTable] = useState(null);

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

    useEffect(() => {
        if (orders) {
            setOrdersTable(orders);
        }
    }, [orders])

    console.log(orders);

    const getSeverity = (order) => {
        switch (order.status) {
            case ORDER_STATUS.DELIVERED:
                return 'success';

            case ORDER_STATUS.PENDING:
                return 'warning';
            
            case ORDER_STATUS.PREPARED:
                return 'warning';

            default:
                return null;
        }
    };

    const goBack = () => {
        history.push(`/client/id_table=${paramsURL.idTable}`);
    };

    return (
        <>
            {loading ?
                <div className="align-content-mobile">
                    <ProgressSpinner />
                </div>
                :
                <div className="card">
                    <Header name="Pedidos" isMain={false} goBack={goBack} paramsURL={paramsURL} />
                    <div className='products-container'>
                        {map(ordersTable, (order) => (
                            <div key={order.id} className='product_container'>
                                <div className='content_product'>
                                    <img className="w-4 sm:w-8rem xl:w-8rem block xl:block border-round" src={order.product.image} alt={order.product.title} />
                                    <div className='content_product_info'>
                                        <span className="font-bold text-900">{order.product.title}</span>
                                        <span>{order.product.price}</span>
                                    </div>
                                </div>
                                <Tag value={order.status === ORDER_STATUS.PENDING ? 'PENDIENTE'
                                    : order.status === ORDER_STATUS.DELIVERED ? 'ENTREGADO' : 'PREPARADO'}
                                    severity={getSeverity(order)}
                                ></Tag>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}
