import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useTable, useOrder } from '../../hooks';
import { HomeClient } from '../../pages/Client';
import { TopMenu, FooterMenu } from '../../components/Client';
import './ClientLayout.scss';

export function ClientLayout(props) {

    const { children } = props;

    const paramsURL = useParams();
    const { authClient } = useAuth();
    const { tables, getTableClient } = useTable();
    const { loading, orders, getOrdersByTableClient } = useOrder();

    const [table, setTable] = useState(null);
    const [ordersTable, setOrdersTable] = useState(null);
    const [refreshOrders, setRefreshOrders] = useState(false);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

    useEffect(() => {
        (async () => {
            if (table) {
                getOrdersByTableClient(table.tableBooking?.id);
            }
        })();
    }, [table, getOrdersByTableClient, refreshOrders]);

    useEffect(() => {
        if (tables) {
            setTable(tables);
        }
    }, [tables]);

    useEffect(() => {
        if (orders) {
            setOrdersTable(orders);
        }
    }, [orders]);

    const onRefreshOrders = () => setRefreshOrders((prev) => !prev);

    if (!authClient) {
        return <HomeClient />;
    }

    return (
        <div>
            <TopMenu table={table} idTable={paramsURL.idTable} />

            <div className="layout-main-container layout-main-mobile">
                <div className="layout-main children-margin">
                    {React.cloneElement(children,
                        {
                            table: table,
                            orders: ordersTable,
                            onRefreshOrders: onRefreshOrders,
                            loadingOrders: loading
                        })}
                </div>
            </div>

            <FooterMenu idTable={paramsURL.idTable} table={table} orders={ordersTable} />
        </div>
    )
}
