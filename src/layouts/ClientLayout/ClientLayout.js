import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useTable, useOrder, usePayment } from '../../hooks';
import { HomeClient } from '../../pages/Client';
import { TopMenu, FooterMenu } from '../../components/Client';
import { size } from 'lodash';
import './ClientLayout.scss';

export function ClientLayout(props) {

    const { children } = props;

    const paramsURL = useParams();
    const { authClient } = useAuth();
    const { tables, getTableClient } = useTable();
    const { loading, orders, getOrdersByTableClient } = useOrder();
    const { getPaymentByIdClient } = usePayment();

    const [table, setTable] = useState(null);
    const [ordersTable, setOrdersTable] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [refreshOrders, setRefreshOrders] = useState(false);
    const [refreshPayment, setRefreshPayment] = useState(false);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

    useEffect(() => {
        if (tables) {
            setTable(tables);
        }
    }, [tables]);

    useEffect(() => {
        (async () => {
            if (tables?.tableBooking) {
                getOrdersByTableClient(tables.tableBooking.id);
            }
        })();
    }, [tables, getOrdersByTableClient, refreshOrders]);

    useEffect(() => {
        if (orders) {
            setOrdersTable(orders);
        }
    }, [orders]);

    useEffect(() => {
        if (size(orders) > 0) {
            if (size(orders[0]?.payment) > 0) {
                (async () => {
                    const response = await getPaymentByIdClient(orders[0].payment.id);
                    setPaymentData(response);
                })();
            }
        }
    }, [orders, getPaymentByIdClient, refreshPayment]);

    const onRefreshOrders = () => setRefreshOrders((prev) => !prev);
    const onRefreshPayment = () => setRefreshPayment((prev) => !prev);

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
                            loadingOrders: loading,
                            payment: paymentData
                        })}
                </div>
            </div>

            <FooterMenu idTable={paramsURL.idTable} table={table} orders={ordersTable} payment={paymentData} onRefreshPayment={onRefreshPayment} />
        </div>
    )
}
