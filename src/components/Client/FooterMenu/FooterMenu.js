import React, { useState, useEffect } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { useOrder, useTable, usePayment } from '../../../hooks';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forEach } from 'lodash';
import QRCode from 'react-qr-code';
import './FooterMenu.scss';

export function FooterMenu(props) {

    const { idTable } = props;

    const paramsURL = useParams();
    const { createClientPayment } = usePayment();
    const { tables, getTableClient } = useTable();
    const { orders, getOrdersByTableClient, addPaymentToOrder } = useOrder();

    const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [table, setTable] = useState(null);
    const [ordersTable, setOrdersTable] = useState(null);

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
            if (table) {
                getOrdersByTableClient(table.tableBooking?.id);
            }
        })();
    }, [table, getOrdersByTableClient]);

    useEffect(() => {
        if (orders) {
            setOrdersTable(orders);
        }
    }, [orders]);

    const hideShowTableBookingQRDialog = () => {
        setShowTableBookingQRDialog(false);
    };

    const hideShowPaymentDialog = () => {
        setShowPaymentDialog(false);
    };

    const onCreatePayment = async (paymentType) => {
        setShowPaymentDialog(false);

        let totalPayment = 0;
        forEach(ordersTable, (order) => {
            totalPayment += order.product.price;
        });

        const paymentData = {
            table: table.tableBooking.id,
            totalPayment: Number(totalPayment.toFixed(2)),
            paymentType,
        };

        const payment = await createClientPayment(paymentData);

        for await (const order of ordersTable) {
            await addPaymentToOrder(order.id, payment.id);
        };
    };

    return (
        <>
            <div>
                <div className='fixed-button-container'>
                    <Button icon="pi pi-qrcode" className='footer-qr-button' rounded onClick={() => setShowTableBookingQRDialog(true)} />
                </div>
                <div className="footer-container">
                    <i className="pi pi-home" style={{ fontSize: '1.8rem' }} />
                    <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} onClick={() => setShowPaymentDialog(true)} />
                </div>
            </div>

            <Dialog visible={showTableBookingQRDialog} style={{ width: '90vw' }} header="Código QR de invitación" modal onHide={hideShowTableBookingQRDialog}>
                <div className='header-qrDialog-container'>
                    {idTable && <QRCode value={`https://irest.netlify.app/client-invite/id_table=${idTable}&key=${getBookingKey()}`} />}
                </div>
            </Dialog>

            <Dialog visible={showPaymentDialog} style={{ width: '90vw' }} header="Método de pago" modal onHide={hideShowPaymentDialog}>
                <div className='paymentDialog-container'>
                    <Button icon="pi pi-credit-card" label='Tarjeta' className='mr-1 paymentDialog-button' onClick={() => onCreatePayment(PAYMENT_TYPE.CARD)} />
                    <Button icon="pi pi-wallet" label='Efectivo' className='ml-1 paymentDialog-button' onClick={() => onCreatePayment(PAYMENT_TYPE.CASH)} />
                </div>
            </Dialog>
        </>
    )
}
