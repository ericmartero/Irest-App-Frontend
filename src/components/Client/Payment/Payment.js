import React, { useState, useEffect } from 'react';
import { useOrder, usePayment } from '../../../hooks';
import { StripePayment } from '../StripePayment';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { forEach, size } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import '../../../scss/Dialogs.scss';
import './Payment.scss';

export function Payment(props) {

    const { table, orders, payment, isPaidToast, noOrdersToPaymentToast, requestedAccount, onRefreshPayment } = props;

    const { createClientPayment } = usePayment();
    const { addPaymentToOrderClient } = useOrder();

    const [ordersTable, setOrdersTable] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [totalPayment, setTotalPayment] = useState(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] = useState(false);
    const [showStripePaymentDialog, setShowStripePaymentDialog] = useState(false);
    const [showAcountPaymentDialog, setShowAcountPaymentDialog] = useState(false);

    useEffect(() => {
        if (orders) {
            setOrdersTable(orders);
        }
    }, [orders]);

    useEffect(() => {
        let totalPayment = 0;

        forEach(orders, (order) => {
            totalPayment += order.product.price;
        });

        setTotalPayment(Number(totalPayment.toFixed(2)));
    }, [orders]);

    const onShowPaymentDialog = () => {
        if (payment) {
            isPaidToast();
        }

        else if (size(ordersTable) === 0) {
            noOrdersToPaymentToast();
        }

        else {
            setShowPaymentDialog(true);
        }
    };

    const hideShowPaymentDialog = () => {
        setShowPaymentDialog(false);
    };

    const createPayment = async () => {

        if (paymentType === PAYMENT_TYPE.APP) {
            setShowStripePaymentDialog(true);
            setShowAcountPaymentDialog(false);
        }

        else {
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
                await addPaymentToOrderClient(order.id, payment.id);
            };

            onRefreshPayment();
            requestedAccount();
        }

        setShowConfirmPaymentDialog(false);
    };

    const groupOrdersStatus = (data) => {
        return data.reduce((acc, order) => {
            const existingOrder = acc.find((o) => o.product.id === order.product.id);
            if (existingOrder) {
                existingOrder.quantity += 1;
            } else {
                acc.push({ id: order.id, product: order.product, status: order.status, tableBooking: order.tableBooking, quantity: 1, createdAt: order.createdAt });
            }
            return acc;
        }, []);
    };

    const formatCurrency = (value) => {
        return value?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.product.price * rowData.quantity);
    };

    const onPaymentDialog = async (paymentType) => {
        setShowPaymentDialog(false);
        setPaymentType(paymentType);

        if (paymentType === PAYMENT_TYPE.APP) {
            setShowAcountPaymentDialog(true);
        }

        else {
            setShowConfirmPaymentDialog(true);
        }
    };

    const hideShowConfirmPaymentDialog = () => {
        setShowConfirmPaymentDialog(false);
        setShowPaymentDialog(true);
    };

    const hideShowStripePaymentDialog = () => {
        setShowPaymentDialog(true);
        setShowStripePaymentDialog(false);
    };

    const hideShowAcountPaymentDialog = () => {
        setShowAcountPaymentDialog(false);
        setShowPaymentDialog(true);
    };

    const showConfirmPaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideShowConfirmPaymentDialog} style={{ marginTop: "10px" }} />
            <Button label="Si" icon="pi pi-check" onClick={createPayment} />
        </React.Fragment>
    );

    const showAcountPaymentDialogFooter = (
        <div className='footerBill'>
            <Button label="Realizar el pago" className="bttnFoot" onClick={createPayment} />
        </div>
    );

    return (
        <>
            <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} onClick={onShowPaymentDialog} />

            <Dialog visible={showPaymentDialog} style={{ width: '90vw' }} header="Método de pago" modal onHide={hideShowPaymentDialog}
                className='footer-orders-pay-container'>
                <div className='paymentDialog-top-buttons'>
                    <Button icon="pi pi-credit-card" label='Tarjeta' className='mr-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CARD)} />
                    <Button icon="pi pi-wallet" label='Efectivo' className='ml-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CASH)} />
                </div>

                <div className='paymentDialog-bottom-buttons'>
                    <Button icon="pi pi-credit-card" label='Aplicación' className='paymentDialog-button' style={{ width: "49%" }} onClick={() => onPaymentDialog(PAYMENT_TYPE.APP)} />
                </div>
            </Dialog>

            <Dialog visible={showConfirmPaymentDialog} style={{ width: '90vw' }} header="Pedir cuenta" modal footer={showConfirmPaymentDialogFooter} onHide={hideShowConfirmPaymentDialog}
                className='dialog-payment-confirm-container'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que quieres realizar el pago con {paymentType === PAYMENT_TYPE.CARD ? "tarjeta" : paymentType === PAYMENT_TYPE.CASH ? "efectivo" : "la aplicación"}?</span>
                </div>
            </Dialog>

            <Dialog visible={showAcountPaymentDialog} style={{ width: '90vw' }} header={`Cuenta mesa ${table?.number}`} modal onHide={hideShowAcountPaymentDialog}
                footer={showAcountPaymentDialogFooter} className='dialog-account-container'>
                <div className='product-add-order'>
                    <div className='product-add-info'>
                        <span className="font-bold">{`MESA: ${table?.number}`}</span>
                    </div>
                    <div>
                        <span><strong>FECHA:</strong> {moment(payment?.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                    </div>
                </div>

                <div className='table-orders-payment' style={{ marginTop: '1.5rem' }}>
                    <DataTable value={orders && groupOrdersStatus(orders)} >
                        <Column field="quantity" header="UNIDADES" bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="product.title" header="PRODUCTO" bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="product.price" header="IMPORTE" body={priceBodyTemplate} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </div>

                <div className='mt-3' style={{display: 'flex', alignItems: 'center'}}>
                    <span className="font-bold">MÉTODO DE PAGO:</span> <i className={"pi pi-credit-card ml-5"} style={{ fontSize: "1.5rem" }}></i>

                </div>
                <div className='mt-3'>
                    <span className="font-bold">TOTAL A PAGAR: </span>
                    <span className="font-bold ml-6">{totalPayment?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                </div>
            </Dialog>

            <Dialog visible={showStripePaymentDialog} style={{ width: '90vw' }} header={`Pago mesa ${table?.number}`} modal onHide={hideShowStripePaymentDialog}>
                <div className="mt-4">
                    <StripePayment />
                </div>
            </Dialog>
        </>
    )
}
